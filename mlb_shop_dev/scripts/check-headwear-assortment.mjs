import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { createServer } from 'vite';

const checkRoot=process.env.HEADWEAR_CHECK_ROOT;
const THREE=await import(checkRoot?pathToFileURL(resolve(checkRoot,'node_modules/three/build/three.module.js')).href:'three');
const directory=process.env.HEADWEAR_CHECK_EVIDENCE ?? 'evidence/headwear-assortment-20260908';
const stage=process.argv[2]??'current';
await mkdir(directory,{recursive:true});
const server=await createServer({...(checkRoot?{root:resolve(checkRoot)}:{}),server:{middlewareMode:true,hmr:false},appType:'custom'});
const originalLoad=THREE.TextureLoader.prototype.load;
const checks=[];
function test(name,run){try{run();checks.push({name,pass:true});}catch(error){checks.push({name,pass:false,error:String(error)});}}
try{
  THREE.TextureLoader.prototype.load=function(){return new THREE.Texture();};
  const {createHeadwear}=await server.ssrLoadModule('/src/products/caps/assortment.ts');
  const models=Array.from({length:76},(_,index)=>createHeadwear(index));
  test('Given 76 admitted SKUs, when constructing all catalog slots, then each SKU is unique',()=>assert.equal(new Set(models.map(model=>model.userData.productId)).size,76));
  for(const id of ['M26F3ABNB1166','M26F3ABNB1866']) test(`Given requested ${id}, when catalog builds, then its volumetric photographic beanie is present`,()=>{
    const model=models.find(model=>model.userData.productId===id);assert.ok(model);
    const size=new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());assert.ok(size.z>.08&&size.y>.14&&size.x>.18);
    const parts=[];model.traverse(mesh=>{if(mesh instanceof THREE.Mesh)parts.push(mesh);});
    assert.ok(parts.some(mesh=>mesh.material.map));assert.ok(parts.some(mesh=>mesh.name.includes('rear')));
  });
  test('Given any SKU, when building geometry, then positions and bounds remain finite',()=>{
    for(const model of models)model.traverse(mesh=>{if(mesh instanceof THREE.Mesh)for(const attribute of Object.values(mesh.geometry.attributes))assert.ok(Array.from(attribute.array).every(Number.isFinite));});
  });
  const {createCabinetWalls}=await server.ssrLoadModule('/src/wall-fixtures/cabinets.ts');
  const wall=createCabinetWalls(),placements=[];
  wall.traverse(group=>{if(group.name.startsWith('reference-cap-'))placements.push(group);});
  test('Given 144 wall positions, when allocating the assortment, then all admitted SKUs appear before repeating',()=>{
    assert.equal(placements.length,144);assert.equal(new Set(placements.slice(0,76).map(group=>group.userData.productId)).size,76);
  });
  const report={stage,pass:checks.every(check=>check.pass),checks,skus:models.map(model=>model.userData.productId),wallSkus:placements.map(model=>model.userData.productId)};
  await writeFile(`${directory}/test-${stage}.json`,JSON.stringify(report,null,2));
  console.log(JSON.stringify({pass:report.pass,checks}));if(!report.pass)process.exitCode=1;
}finally{THREE.TextureLoader.prototype.load=originalLoad;await server.close();}
