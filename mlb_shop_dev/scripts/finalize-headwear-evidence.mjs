import assert from 'node:assert/strict';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const directory='evidence/headwear-assortment-20260908';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const json=async path=>JSON.parse(await readFile(path,'utf8'));
const stages=['final-views','fixtures-final','store-final','controls-final','displays-final','mobile-final','tablet-final','built-final'];
const reports=[],images=[];
for(const stage of stages){
  const path=`${directory}/${stage}/report.json`,report=await json(path);
  assert.equal(report.pass,true,path);
  assert.equal(report.errors?.length??0,0,path);
  assert.equal((report.contexts??report.contextEvents??[]).length,0,path);
  for(const [file,hash]of Object.entries(report.sourceHashes)){
    const source=file.startsWith('src/')?file:`src/products/caps/${file}`;
    assert.equal(sha(await readFile(source)),hash,`${stage}: ${source}`);
  }
  const captures=report.captures??report.reports;
  for(const capture of captures){
    const bytes=await readFile(capture.path);
    assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a',capture.path);
    const width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20);
    assert.ok(width>0&&height>0,capture.path);
    images.push({path:capture.path,sha256:sha(bytes),width,height});
  }
  reports.push({path,sha256:sha(await readFile(path)),captures:captures.length});
}
const test=await json(`${directory}/test-final.json`);
assert.equal(test.pass,true);
const delivery=await json(`${directory}/delivery.json`);
let sourcePhotos=0,deliveryPhotos=0;
for(const sku of delivery)for(const photo of Object.values(sku.photos)){
  assert.equal(sha(await readFile(photo.path)),photo.sha256,photo.path);sourcePhotos++;
  assert.equal(sha(await readFile(photo.delivery.path)),photo.delivery.sha256,photo.delivery.path);deliveryPhotos++;
}
const assetName=(await readdir('dist/assets')).find(file=>/^runtime-.*\.js$/.test(file));
assert.ok(assetName);
const previousRuntimeHash=sha(await readFile(`dist/assets/${assetName}`));
const build=spawnSync('npm',['run','build'],{encoding:'utf8',shell:true,maxBuffer:5*1024*1024});
assert.equal(build.status,0,build.stderr);
const currentName=(await readdir('dist/assets')).find(file=>/^runtime-.*\.js$/.test(file));
const currentHash=sha(await readFile(`dist/assets/${currentName}`));
assert.equal(currentHash,previousRuntimeHash,'Built runtime drifted after captured build');
const output={pass:true,checkedAt:new Date().toISOString(),reports,images,sourcePhotos,deliveryPhotos,build:{command:'npm run build',status:build.status,stdout:build.stdout,stderr:build.stderr},runtime:{path:`dist/assets/${currentName}`,sha256:currentHash},scope:'DEV headwear assortment; no operating promotion; inferred hidden surfaces, not scan certification'};
await writeFile(`${directory}/frozen-verification.json`,JSON.stringify(output,null,2));
console.log(JSON.stringify({pass:true,reports:reports.length,images:images.length,sourcePhotos,deliveryPhotos,runtime:output.runtime}));
