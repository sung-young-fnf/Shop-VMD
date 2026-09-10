import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import * as THREE from 'three';
import { createRegisteredSurfaces, registeredSection } from '../src/products/shoes/cad-photo-geometry.ts';
import { cadPhotoProfiles } from '../src/products/shoes/cad-photo-profiles.ts';
const report={scope:'Independent current real-profile geometry, not photographic likeness approval',createdAt:new Date().toISOString(),profiles:[],errors:[]};
const sha=async path=>createHash('sha256').update(await readFile(path)).digest('hex');
report.sourceHashes=Object.fromEntries(await Promise.all(['src/products/shoes/cad-photo-geometry.ts','src/products/shoes/cad-photo-profiles.ts','scripts/check-footwear-cad-geometry.mjs'].map(async path=>[path,await sha(path)])));
assert.equal(cadPhotoProfiles.length,12);
for(const profile of cadPhotoProfiles){
 const result={sku:profile.sku,pass:false};report.profiles.push(result);
 try{
  assert.ok(profile.length>.2&&profile.length<.4,'Human footwear length in metres');
  for(const [role,view] of Object.entries(profile.views)){
   assert.ok(view.width>0&&view.height>0);assert.ok(Math.abs(view.end-view.start)>10);assert.equal(view.low.length,view.high.length);assert.ok(view.low.length>=3);
   const along=role==='top'?view.height:view.width;assert.ok(view.start>=0&&view.start<=along&&view.end>=0&&view.end<=along,`${role} longitudinal range`);
   const across=role==='top'?view.width:view.height;
   for(let i=0;i<view.low.length;i++){assert.ok(Number.isFinite(view.low[i])&&Number.isFinite(view.high[i]));assert.ok(view.low[i]<view.high[i],`${role} nonzero span ${i}`);assert.ok(view.low[i]>=0&&view.high[i]<=across,`${role} image bounds ${i}`);}
  }
  const widths=[];
  for(let i=0;i<=128;i++){const s=registeredSection(profile,i/128);assert.ok(Object.values(s).every(Number.isFinite));assert.ok(s.width>=0&&s.width<.1);assert.ok(s.rim>=s.base);widths.push(s.width*2);}
  assert.ok(Math.max(...widths)>.06&&Math.max(...widths)<.2,'Plausible shoe width');
  const surfaces=createRegisteredSurfaces(profile),edges=new Map(),bounds=new THREE.Box3();let triangles=0,soleTriangles=0,volume=0,normalDisagreements=0;
  assert.deepEqual(new Set(surfaces.map(s=>s.role)),new Set(['lateral','medial','top','heel','sole','front']));
  for(const {role,geometry} of surfaces){
   const p=geometry.getAttribute('position'),n=geometry.getAttribute('normal'),uv=geometry.getAttribute('uv'),idx=geometry.index;
   const ownership=geometry.getAttribute('shoeSide');assert.ok(ownership,'Stable local side ownership attribute required for fixture batching');const originalOwnership=Array.from(ownership.array);const transformed=geometry.clone().rotateY(Math.PI/2).translate(5,2,-7);assert.deepEqual(Array.from(transformed.getAttribute('shoeSide').array),originalOwnership,'Store transforms preserve source side ownership');transformed.dispose();
   const key=i=>[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e7)).join(',');
   for(let i=0;i<p.count;i++){const point=new THREE.Vector3().fromBufferAttribute(p,i);bounds.expandByPoint(point);assert.ok([...point.toArray(),n.getX(i),n.getY(i),n.getZ(i),uv.getX(i),uv.getY(i)].every(Number.isFinite));assert.ok(uv.getX(i)>=0&&uv.getX(i)<=1&&uv.getY(i)>=0&&uv.getY(i)<=1);}
   for(let i=0;i<idx.count;i+=3){
    const ids=[idx.getX(i),idx.getX(i+1),idx.getX(i+2)],keys=ids.map(key);if(new Set(keys).size<3)continue;
    triangles++;for(let j=0;j<3;j++){const edge=[keys[j],keys[(j+1)%3]].sort().join('|');edges.set(edge,(edges.get(edge)??0)+1);}
    const [a,b,c]=ids.map(id=>new THREE.Vector3().fromBufferAttribute(p,id));const face=b.clone().sub(a).cross(c.clone().sub(a));volume+=a.dot(b.clone().cross(c))/6;
    if(role==='sole'){assert.ok(face.y<=1e-12,'Sole triangles face down');soleTriangles++;}
    for(const id of ids)if(face.dot(new THREE.Vector3().fromBufferAttribute(n,id)) < -1e-8)normalDisagreements++;
   }
   geometry.dispose();
  }
  const nonManifold=[...edges.values()].filter(count=>count!==2).length;
  Object.assign(result,{triangles,soleTriangles,weldedEdges:edges.size,nonManifold,normalDisagreements,signedVolume:volume,bounds:{min:bounds.min.toArray(),max:bounds.max.toArray()},width:Math.max(...widths)});
  assert.equal(nonManifold,0,'Each nondegenerate edge belongs to two faces');assert.ok(volume>0,'Positive volume confirms consistent outer winding');assert.equal(normalDisagreements,0,'Vertex normals remain in incident face hemispheres');
  assert.ok(bounds.min.y>=-.002&&bounds.max.y<.25);assert.ok(Math.abs(bounds.max.x-bounds.min.x-profile.length)<1e-6);result.pass=true;
 }catch(error){result.error=String(error);report.errors.push({sku:profile.sku,error:String(error)});}
}
report.pass=report.errors.length===0;await mkdir('evidence/shoe-cad-refinement/qa',{recursive:true});await writeFile('evidence/shoe-cad-refinement/qa/geometry-qa.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));if(!report.pass)process.exitCode=1;
