import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import * as THREE from 'three';
const root='evidence/shoe-cad-refinement/qa';await mkdir(root,{recursive:true});
const sha=async path=>createHash('sha256').update(await readFile(path)).digest('hex');
const stage=process.env.SHOE_REFINEMENT_STAGE??'metrics';assert.match(stage,/^[a-z0-9-]+$/);
const moduleAt=path=>import(pathToFileURL(resolve(path)).href);
const current=await moduleAt('src/products/shoes/cad-photo-geometry.ts');
const {cadPhotoProfiles:profiles}=await moduleAt('src/products/shoes/cad-photo-profiles.ts');
const before=await moduleAt(`${root}/before/sources/cad-photo-geometry.ts`);
const {cadPhotoProfiles:beforeProfiles}=await moduleAt(`${root}/before/sources/cad-photo-profiles.ts`);
let frontRegistrations=[];try{frontRegistrations=JSON.parse(await readFile('evidence/shoe-cad-refinement/front/front-registrations.json','utf8'));}catch{}
const percentile=(numbers,p)=>{if(!numbers.length)return null;const sorted=[...numbers].sort((a,b)=>a-b);return sorted[Math.floor((sorted.length-1)*p)];};
function distortion(factory,profile,dominant=false){
 const regions=Object.fromEntries(['all','front','heel'].map(name=>[name,{triangles:0,area:0,zeroUvTriangles:0,zeroUvArea:0,conditions:[],roles:{}}]));
 const roleCoverage={};
 for(const {role,geometry:g}of factory.createRegisteredSurfaces(profile)){
  const p=g.getAttribute('position'),uv=g.getAttribute('uv'),idx=g.index;const view=profile.views[role]??(role==='front'?profile.endcaps?.front??frontRegistrations.find(item=>item.sku===profile.sku):null)??profile.views.lateral;const dimensions=[view.width,view.height];
  const nTriangles=(idx?.count??p.count)/3;roleCoverage[role]=nTriangles;
  for(let i=0;i<nTriangles;i++){
   const ids=[0,1,2].map(j=>idx?idx.getX(i*3+j):i*3+j);const [a,b,c]=ids.map(id=>new THREE.Vector3().fromBufferAttribute(p,id));const e1=b.clone().sub(a),e2=c.clone().sub(a);const face=e1.clone().cross(e2);const twiceArea=face.length();if(twiceArea<1e-12)continue;face.divideScalar(twiceArea);
   const longitudinal=(a.x+b.x+c.x)/3/profile.length+.5;
   const bands=['all',...(longitudinal<.2&&face.x<-.25?['front']:[]),...(longitudinal>.8&&face.x>.25?['heel']:[])];
   let sampledUv=uv,sourceDimensions=dimensions;
   if(dominant){const average=name=>{const attr=g.getAttribute(name);return attr?ids.reduce((sum,id)=>sum+attr.getX(id),0)/3:0;};const side=ids.reduce((sum,id)=>sum+p.getZ(id),0)>=0?'lateral':'medial';
    if(profile.endcaps&&(role==='front'||role==='heel')||average('sideWeight')>=.5){sampledUv=g.getAttribute('sideUv')??uv;sourceDimensions=[profile.views[side].width,profile.views[side].height];}
    if(average('heelWeight')>=.5){sampledUv=g.getAttribute('heelUv')??uv;const v=profile.endcaps?.heel??profile.views.heel;sourceDimensions=[v.width,v.height];}
    if(average('frontWeight')>=.5){sampledUv=g.getAttribute('frontUv')??uv;const v=profile.endcaps?.front??frontRegistrations.find(item=>item.sku===profile.sku);if(v)sourceDimensions=[v.width,v.height];}
   }
   const [ta,tb,tc]=ids.map(id=>new THREE.Vector2(sampledUv.getX(id)*sourceDimensions[0],sampledUv.getY(id)*sourceDimensions[1]));const d1=tb.sub(ta),d2=tc.sub(ta);const uvArea=Math.abs(d1.x*d2.y-d1.y*d2.x)/2;
   const l1=e1.length(),parallel=e1.dot(e2)/l1,perpendicular=twiceArea/l1;
   const j00=d1.x/l1,j10=d1.y/l1,j01=(d2.x-d1.x*parallel/l1)/perpendicular,j11=(d2.y-d1.y*parallel/l1)/perpendicular;
   const aa=j00*j00+j10*j10,bb=j01*j01+j11*j11,ab=j00*j01+j10*j11;const disc=Math.sqrt((aa-bb)**2+4*ab*ab);const high=(aa+bb+disc)/2,low=(aa+bb-disc)/2;const condition=low>1e-12?Math.sqrt(high/low):Infinity;
   for(const band of bands){const target=regions[band];target.triangles++;target.area+=twiceArea/2;target.roles[role]=(target.roles[role]??0)+1;if(uvArea<1e-5){target.zeroUvTriangles++;target.zeroUvArea+=twiceArea/2;}if(Number.isFinite(condition))target.conditions.push(condition);}
  }
  g.dispose();
 }
 const pole=[0,1].map(u=>{const s=factory.registeredSection(profile,u);return {u,width:s.width*2,height:s.rim-s.base};});
 return {sku:profile.sku,roleCoverage,frontPhoto:profile.endcaps?.front?.path??profile.views.front?.path??null,poles:pole,widthProfile:[0,.015625,.03125,.0625,.125,.875,.9375,.96875,.984375,1].map(u=>({u,width:factory.registeredSection(profile,u).width*2})),regions:Object.fromEntries(Object.entries(regions).map(([name,r])=>[name,{triangles:r.triangles,geometryArea:r.area,zeroUvTriangles:r.zeroUvTriangles,zeroUvAreaFraction:r.area?r.zeroUvArea/r.area:0,uvAnisotropyMedian:percentile(r.conditions,.5),uvAnisotropy95:percentile(r.conditions,.95),roles:r.roles}]))};
}
function insideQuad(point,quad,tolerance=2){
  const signs=quad.map((a,i)=>{const b=quad[(i+1)%quad.length];const edge=[b[0]-a[0],b[1]-a[1]];return (edge[0]*(point[1]-a[1])-edge[1]*(point[0]-a[0]))/Math.hypot(...edge);});
  return signs.every(sign=>sign>=-tolerance)||signs.every(sign=>sign<=tolerance);
}
async function frontProof(factory,profile){
  const registration=frontRegistrations.find(item=>item.sku===profile.sku);if(!registration)return {sku:profile.sku,verifiedRegistration:false};
  const published=`public/${registration.source}`;const currentSha=await sha(published);const geometries=factory.createRegisteredSurfaces(profile);const front=geometries.find(item=>item.role==='front');
  const result={sku:profile.sku,registrationPath:'evidence/shoe-cad-refinement/front/front-registrations.json',published,expectedSha256:registration.publishedSha256,sha256:currentSha,hashMatches:currentSha===registration.publishedSha256,dedicatedFront:!!front,engineSource:profile.endcaps?.front?.path??null,engineSourceMatches:typeof profile.endcaps?.front?.path==='string'&&profile.endcaps.front.path.replace(/^products\//,'')===registration.source.replace(/^products\//,''),conservativeSourcePolygon:registration.quad,vertices:0,outsideVertices:0,triangles:0,outsideBarycenters:0,coverageMeaning:'Conservative verified toe/bumper source polygon; tests source provenance and avoidance of known outside region, not photographic likeness.'};
  if(front){const uv=front.geometry.getAttribute('uv'),index=front.geometry.index;result.vertices=uv.count;const at=i=>[uv.getX(i)*registration.width,(1-uv.getY(i))*registration.height];for(let i=0;i<uv.count;i++)if(!insideQuad(at(i),registration.quad))result.outsideVertices++;const count=index?.count??uv.count;for(let i=0;i<count;i+=3){const points=[0,1,2].map(c=>at(index?index.getX(i+c):i+c));const center=[0,1].map(axis=>points.reduce((sum,p)=>sum+p[axis],0)/3);result.triangles++;if(!insideQuad(center,registration.quad))result.outsideBarycenters++;}}
  for(const {geometry}of geometries)geometry.dispose();return result;
}
function insidePolygon(point,polygon,tolerance){
 let inside=false;
 for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
  const a=polygon[j],b=polygon[i],dx=b[0]-a[0],dy=b[1]-a[1],length=dx*dx+dy*dy,t=Math.max(0,Math.min(1,((point[0]-a[0])*dx+(point[1]-a[1])*dy)/(length||1)));
  if(Math.hypot(point[0]-a[0]-t*dx,point[1]-a[1]-t*dy)<=tolerance)return true;
  if((a[1]>point[1])!==(b[1]>point[1])&&point[0]<(b[0]-a[0])*(point[1]-a[1])/(b[1]-a[1])+a[0])inside=!inside;
 }
 return inside;
}
async function rearProof(factory,profile,registration){
 if(!profile.endcaps?.heel||!registration)return {sku:profile.sku,verifiedRegistration:false};
 const asset=registration.rear.asset,h=profile.endcaps.heel,geometrySurfaces=factory.createRegisteredSurfaces(profile);let requestedArea=0,outsideArea=0,triangles=0,outside=0;
 for(const {geometry:g} of geometrySurfaces){const p=g.getAttribute('position'),uv=g.getAttribute('heelUv'),w=g.getAttribute('heelWeight'),idx=g.index;if(!uv||!w){g.dispose();continue;}const count=idx?.count??p.count;
  for(let i=0;i<count;i+=3){const ids=[0,1,2].map(c=>idx?idx.getX(i+c):i+c),weight=ids.reduce((sum,id)=>sum+w.getX(id),0)/3;if(weight<.5)continue;const points=ids.map(id=>new THREE.Vector3().fromBufferAttribute(p,id)),area=points[1].clone().sub(points[0]).cross(points[2].clone().sub(points[0])).length()/2;if(area<1e-12)continue;const point=[ids.reduce((sum,id)=>sum+uv.getX(id)*h.width,0)/3,ids.reduce((sum,id)=>sum+(1-uv.getY(id))*h.height,0)/3];requestedArea+=area;triangles++;if(!insidePolygon(point,registration.rear.polygon,registration.uncertaintyPx??20)){outsideArea+=area;outside++;}}
  g.dispose();
 }
 const actualSha=await sha(`public/${asset.path}`);
 return {sku:profile.sku,coordinateTransform:asset.coordinateTransform,assetHashMatches:actualSha===asset.sha256,engineSourceMatches:h.path.replace(/^products\//,'')===asset.path.replace(/^products\//,''),requestedHeelTriangles:triangles,outsideMaskTriangles:outside,outsideRequestedAreaFraction:requestedArea?outsideArea/requestedArea:0,meaning:'Rear sampler requested at weight>=0.5 outside manually observed body polygon plus stated20pxuncertainty. Alpha suppresses these samples and reveals side fallback; this is missing intended rear coverage, not direct proof of white contamination.'};
}
let heelRegistrations=[];try{heelRegistrations=JSON.parse(await readFile('evidence/shoe-cad-refinement/heel/heel-registrations.json','utf8'));}catch{}
const metrics={createdAt:new Date().toISOString(),scope:'Primary photo-UV Jacobian only; shader mixtures require actual screen/source comparison. UV metrics cannot certify visual likeness.',before:beforeProfiles.map(p=>distortion(before,p)),after:profiles.map(p=>distortion(current,p)),dominantProjectionNote:'Diagnostic UV selected when average frontWeight or heelWeight >=0.5, after sideWeight. Ignores per-pixel rear alpha and mixed-photo transitions; visual comparison still required.',beforeDominant:beforeProfiles.map(p=>distortion(before,p,true)),afterDominant:profiles.map(p=>distortion(current,p,true)),frontSourceProof:await Promise.all(profiles.map(p=>frontProof(current,p))),rearSourceProof:await Promise.all(profiles.map(p=>rearProof(current,p,heelRegistrations.find(r=>r.sku===p.sku)))),sourceHashes:Object.fromEntries(await Promise.all(['src/products/shoes/cad-photo-geometry.ts','src/products/shoes/cad-photo-profiles.ts','scripts/qa-shoe-refinement.mjs'].map(async p=>[p,await sha(p)])))};
await writeFile(`${root}/${stage}-geometry-metrics.json`,JSON.stringify(metrics,null,2));
if(process.env.SHOE_REFINEMENT_BROWSER!=='1'){console.log(JSON.stringify({metrics:`${root}/${stage}-geometry-metrics.json`,summary:metrics.after.map(p=>({sku:p.sku,front:p.regions.front,heel:p.regions.heel,poles:p.poles}))}));process.exit(0);}
const {chromium}=await import('playwright');
const base=process.env.SHOE_REFINEMENT_URL??'http://127.0.0.1:4175';const dir=`${root}/${stage}`;await mkdir(dir,{recursive:true});
async function hashCurrent(){const paths=[];async function visit(dir){for(const e of await readdir(dir,{withFileTypes:true})){const p=`${dir}/${e.name}`;if(e.isDirectory())await visit(p);else paths.push(p);}}for(const p of ['src/products/shoes','public/products/shoes','dist'])await visit(p);return Object.fromEntries(await Promise.all(paths.sort().map(async p=>[p,await sha(p)])));}
const beforeReport=JSON.parse(await readFile(`${root}/before/captures/report.json`,'utf8'));
const report={createdAt:new Date().toISOString(),url:base,sourceHashes:await hashCurrent(),captures:[],checks:[],errors:[],requests:[],skus:profiles.map(p=>p.sku),visualApproval:'pending independent screenshot/source review'};
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl']});report.browser=browser.version();const page=await browser.newPage({viewport:{width:960,height:720},deviceScaleFactor:1});
let signalPageError;const pageFailure=new Promise(resolve=>{signalPageError=resolve;});page.on('pageerror',error=>{report.errors.push(String(error));console.error('PAGE_ERROR',error.stack??String(error));signalPageError(String(error));});page.on('console',message=>{if(message.type()==='error')report.errors.push(message.text());});page.on('requestfailed',request=>report.requests.push({url:request.url(),error:request.failure()}));page.on('response',response=>{if(response.status()>=400)report.requests.push({url:response.url(),status:response.status()});});
const state=()=>page.evaluate(()=>window.__FOOTWEAR_PREVIEW__);const ready=()=>Promise.race([page.waitForFunction(()=>window.__FOOTWEAR_PREVIEW__?.ready,undefined,{timeout:90000}),pageFailure.then(error=>{throw new Error(error);})]);
async function capture(name,snapshot,fullPage=false){await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));const path=`${dir}/${name}.png`;await page.screenshot({path,fullPage});const bytes=await readFile(path);const baseline=beforeReport.captures.find(c=>c.name===name);const baselineCamera=baseline?.state?.camera;const cameraDelta=baselineCamera&&snapshot.camera?Math.hypot(...snapshot.camera.map((value,i)=>value-baselineCamera[i])):null;report.captures.push({name,path,before:baseline?{name:baseline.name,sha256:baseline.sha256,camera:baselineCamera}:null,cameraDelta,sha256:await sha(path),width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20),state:snapshot,capturedAt:new Date().toISOString()});}
async function check(name,task){try{await task();report.checks.push({name,pass:true});}catch(error){report.checks.push({name,pass:false,error:String(error)});}}
try{
 await page.goto(`${base}/footwear-preview.html`);await ready();const options=await page.locator('#fw-product option').allTextContents();assert.equal(options.length,12);
 // Prioritise the four known problem views before collecting every full-state angle.
 for(const angle of ['front','heel','oblique','rearOblique','lateral','medial','top','sole'])for(const profile of profiles){const index=options.findIndex(label=>label.includes(profile.sku));assert.ok(index>=0);await page.selectOption('#fw-product',String(index));await ready();await page.locator(`[data-angle=${angle}]`).click();const snapshot=await state();assert.equal(snapshot.sku,profile.sku);
  if(angle==='front')await check(`${profile.sku} six surfaces and live source samplers`,async()=>{for(const role of ['front','heel','lateral','medial','top','sole'])assert.ok(snapshot.meshes.some(mesh=>mesh.name===`registered-${role}`),`${role} geometry present`);const textures=snapshot.meshes.flatMap(mesh=>mesh.textures);for(const texture of textures)assert.ok(texture.width>0&&texture.height>0,`${texture.sampler} loaded: ${texture.url}`);assert.ok(textures.some(texture=>/front/i.test(texture.sampler)&&texture.sampler!=='map'),'Compiled front sampler');assert.ok(textures.some(texture=>/heel/i.test(texture.sampler)&&texture.sampler!=='map'),'Compiled heel sampler');const front=snapshot.meshes.find(mesh=>mesh.name==='registered-front');assert.ok(front.textures.some(texture=>texture.url?.includes(profile.endcaps.front.path)),'Front material uses actual registered source crop');});
  await capture(`${profile.sku}-${angle}`,snapshot);}
 console.log('REFINEMENT_96_CAPTURES_READY '+dir);
 // Actual browser zoom provides newly rendered detail; image upscaling is not a closeup test.
 for(const profile of profiles)for(const angle of ['front','heel','oblique','rearOblique']){const index=options.findIndex(label=>label.includes(profile.sku));await page.selectOption('#fw-product',String(index));await ready();await page.locator(`[data-angle=${angle}]`).click();const box=await page.locator('.fw-stage canvas').boundingBox();assert.ok(box);await page.mouse.move(box.x+box.width*.5,box.y+box.height*.5);await page.mouse.wheel(0,-650);await page.waitForTimeout(120);await capture(`${profile.sku}-${angle}-closeup`,await state(),true);}
 console.log('REFINEMENT_48_CLOSEUPS_READY '+dir);
 for(const width of [375,768,1280]){await page.setViewportSize({width,height:900});await page.selectOption('#fw-product','0');await ready();await check(`${width} no horizontal overflow`,async()=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false));if(width>=768)await check(`${width} desktop canvas fits viewport`,async()=>{const bounds=await page.locator('.fw-stage canvas').boundingBox();assert.ok(bounds);assert.ok(bounds.y>=-1&&bounds.y+bounds.height<=900+1,`Canvas extends beyond viewport: ${JSON.stringify(bounds)}`);});const sourceOptions=await page.locator('#fw-source option').allTextContents();const cad=sourceOptions.findIndex(s=>s.includes('CAD')&&!s.includes('없음'));assert.ok(cad>=0);await page.selectOption('#fw-source',String(cad));await page.waitForFunction(()=>{const img=document.querySelector('.fw-source img');return img.complete&&img.naturalWidth>0;});await capture(`${width}-cad`,await state(),true);await page.locator('#fw-material').click();await page.locator('#fw-explode').click();await check(`${width} diagnostic modes active`,async()=>{const s=await state();assert.equal(s.shapeOnly,true);assert.equal(s.exploded,true);});await page.locator('#fw-reset').click();await check(`${width} reset restores assembly`,async()=>{const s=await state();assert.equal(s.shapeOnly,false);assert.equal(s.exploded,false);});await capture(`${width}-reset`,await state(),true);}
 await page.goto(base);await page.waitForFunction(()=>window.__MLB_DEBUG__?.sceneReady&&window.__MLB_DEBUG__.cameraSettled,undefined,{timeout:180000});await page.locator('.zone-list button').nth(3).click();await page.waitForFunction(()=>window.__MLB_DEBUG__.cameraSettled);const store=await page.evaluate(()=>window.__MLB_DEBUG__);await check('Store 98 placements/12SKUs',async()=>{assert.equal(store.products.footwearSummary.placements,98);assert.equal(store.products.footwearSummary.distinctSkus,12);});await capture('store-footwear',store);await check('No loading/runtime errors',async()=>{assert.deepEqual(report.errors,[]);assert.deepEqual(report.requests,[]);});
}catch(error){report.failure=String(error);process.exitCode=1;}finally{await browser.close();report.finalSourceHashes=await hashCurrent();report.sourceStable=JSON.stringify(report.sourceHashes)===JSON.stringify(report.finalSourceHashes);report.pass=!report.failure&&report.sourceStable&&report.checks.every(c=>c.pass);report.finishedAt=new Date().toISOString();await writeFile(`${dir}/report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({pass:report.pass,captures:report.captures.length,dir}));if(!report.pass)process.exitCode=1;}
