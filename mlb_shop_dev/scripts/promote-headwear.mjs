import assert from 'node:assert/strict';
import {readFile,writeFile,readdir,mkdir,copyFile,stat} from 'node:fs/promises';
import {resolve,dirname,relative,join} from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';

const dev=resolve('.'),operating=resolve('../mlb_shop');
const record=resolve('evidence/headwear-promotion-20260909');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const code=[
  ...['assortment','assortment-cap','assortment-catalog','assortment-material','assortment-types','soft-headwear','photo-cap','photo-blend','real-details','real-surfaces','placement'].map(name=>`src/products/caps/${name}.ts`),
  'src/products/photo-material.ts','src/central-fixtures/merchandise.ts','src/central-fixtures/furniture.ts',
  'src/wall-fixtures/merchandise.ts','src/wall-fixtures/apparel-details.ts','src/wall-fixtures/cabinet-details.ts',
];
const delivery=JSON.parse(await readFile('evidence/headwear-assortment-20260908/delivery.json','utf8'));
const assets=[...new Set(delivery.flatMap(sku=>Object.values(sku.photos).map(photo=>photo.delivery.path)))];
assets.push(...['front.jpg','rear.jpg','side.png','detail.jpg','interior.jpg'].map(suffix=>`public/products/caps/M21N3ACP7701N-${suffix}`));
const inside=(root,file)=>{const path=resolve(root,file);assert.ok(path.startsWith(`${root}\\`)||path.startsWith(`${root}/`),path);return path;};
async function inventory(root,prefix=''){
  const result=[];
  for(const item of await readdir(join(root,prefix),{withFileTypes:true})){
    if(['node_modules','.git','.vite','.cache'].includes(item.name))continue;
    assert.ok(!item.isSymbolicLink(),`Release must not traverse links: ${item.name}`);
    const path=prefix?`${prefix}/${item.name}`:item.name;
    if(item.isDirectory())result.push(...await inventory(root,path));
    else{const bytes=await readFile(join(root,path));result.push({path,bytes:bytes.length,sha256:sha(bytes)});}
  }
  return result.sort((a,b)=>a.path.localeCompare(b.path));
}
await mkdir(record,{recursive:false});
const before=await inventory(operating);
const plan={authorized:'User explicitly requested promotion of the preceding DEV headwear assortment.',root:operating,dev,code,assets,before,backup:join(record,'backup'),status:'prepared'};
const expected=new Map(before.map(item=>[item.path,item]));
const frozen=JSON.parse(await readFile('evidence/headwear-assortment-20260908/final-views/report.json','utf8'));
for(const path of code.filter(file=>file.startsWith('src/products/caps/'))){
  assert.equal(sha(await readFile(path)),frozen.sourceHashes[path.split('/').at(-1)],`Unreviewed DEV drift: ${path}`);
}
for(const sku of delivery)for(const photo of Object.values(sku.photos))assert.equal(sha(await readFile(photo.delivery.path)),photo.delivery.sha256,photo.delivery.path);
plan.sourceHashes=Object.fromEntries(await Promise.all([...code,...assets].map(async file=>[file,sha(await readFile(file))])));
await writeFile(join(record,'manifest.json'),JSON.stringify(plan,null,2));
for(const path of [...code,...assets,'dist/index.html'])if(expected.has(path)){
  const target=inside(plan.backup,path);await mkdir(dirname(target),{recursive:true});await copyFile(inside(operating,path),target);
}
for(const path of [...code,...assets]){
  const target=inside(operating,path);await mkdir(dirname(target),{recursive:true});await copyFile(inside(dev,path),target);
}
const runs=[];
for(const args of [[join(operating,'node_modules/typescript/bin/tsc'),'--noEmit'],[join(operating,'node_modules/vite/bin/vite.js'),'build','--outDir',join(record,'staged-dist')]]){
  const result=spawnSync(process.execPath,args,{cwd:operating,encoding:'utf8',maxBuffer:10*1024*1024});
  runs.push({args,status:result.status,stdout:result.stdout,stderr:result.stderr});
  await writeFile(join(record,'build.json'),JSON.stringify(runs,null,2));
  assert.equal(result.status,0,`${args[0]} failed; existing operating dist remains live`);
}
const staged=await inventory(join(record,'staged-dist'));
for(const item of staged.filter(item=>item.path!=='index.html')){
  const target=inside(operating,`dist/${item.path}`);await mkdir(dirname(target),{recursive:true});await copyFile(inside(join(record,'staged-dist'),item.path),target);
}
await copyFile(join(record,'staged-dist/index.html'),join(operating,'dist/index.html'));
const after=await inventory(operating),allow=new Set([...code,...assets]);
const differences=after.filter(item=>expected.get(item.path)?.sha256!==item.sha256);
for(const item of differences)assert.ok(allow.has(item.path)||item.path.startsWith('dist/'),`Unexpected release change ${item.path}`);
for(const item of before)assert.ok(after.some(current=>current.path===item.path),`Existing file removed ${item.path}`);
for(const path of [...code,...assets])assert.equal(after.find(item=>item.path===path)?.sha256,plan.sourceHashes[path],path);
plan.status='published-awaiting-browser-QA';plan.publishedAt=new Date().toISOString();plan.after=after;plan.differences=differences;
plan.runtime=after.filter(item=>item.path.startsWith('dist/assets/runtime-')&&staged.some(source=>`dist/${source.path}`===item.path));
await writeFile(join(record,'manifest.json'),JSON.stringify(plan,null,2));
console.log(JSON.stringify({status:plan.status,code:code.length,assets:assets.length,changed:differences.length,backup:plan.backup,runtime:plan.runtime}));
