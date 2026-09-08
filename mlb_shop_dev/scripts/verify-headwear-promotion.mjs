import assert from 'node:assert/strict';
import {readFile, writeFile, readdir} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {createHash} from 'node:crypto';

const record=resolve('evidence/headwear-promotion-20260909');
const manifest=JSON.parse(await readFile(join(record,'manifest.json'),'utf8'));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const expected=new Map(manifest.after.map(item=>[item.path,item.sha256]));
let checked=0;
async function inspect(prefix=''){
  for(const item of await readdir(join(manifest.root,prefix),{withFileTypes:true})){
    if(['node_modules','.git','.vite','.cache'].includes(item.name))continue;
    assert.ok(!item.isSymbolicLink(),item.name);
    const path=prefix?`${prefix}/${item.name}`:item.name;
    if(item.isDirectory())await inspect(path);
    else{
      assert.equal(sha(await readFile(join(manifest.root,path))),expected.get(path),`Operating drift: ${path}`);
      checked++;
    }
  }
}
await inspect();
assert.equal(checked,expected.size,'Missing operating files');
const targets=['dist/index.html',...manifest.runtime.map(item=>item.path),...manifest.assets];
const results=[];
for(let start=0;start<targets.length;start+=6){
  results.push(...await Promise.all(targets.slice(start,start+6).map(async path=>{
    const url='http://localhost:4174/'+(path==='dist/index.html'?'':path.replace(/^(dist|public)\//,''));
    const response=await fetch(url,{signal:AbortSignal.timeout(30000),cache:'no-store'});
    assert.equal(response.status,200,url);
    const bytes=Buffer.from(await response.arrayBuffer());
    const hash=sha(bytes);
    assert.equal(hash,expected.get(path),`HTTP mismatch: ${url}`);
    return {path,url,status:response.status,bytes:bytes.length,sha256:hash};
  })));
}
const report={pass:true,time:new Date().toISOString(),operatingFiles:checked,httpChecks:results.length,runtime:manifest.runtime,results};
await writeFile(join(record,'final-verification.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({pass:report.pass,operatingFiles:checked,httpChecks:results.length,runtime:report.runtime}));
