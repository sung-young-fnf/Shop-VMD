import { chromium } from 'playwright';
import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const stage=process.argv[2]??'all-views',dir=`evidence/headwear-assortment-20260908/${stage}`;
await mkdir(dir,{recursive:true});
const sourceHashes={};
for(const filename of await readdir('src/products/caps'))if(filename.endsWith('.ts'))sourceHashes[filename]=createHash('sha256').update(await readFile(`src/products/caps/${filename}`)).digest('hex');
const browser=await chromium.launch({channel:'chrome',headless:true});
const reports=[],errors=[],contexts=[];
try{
  const page=await browser.newPage({viewport:{width:1400,height:1440},deviceScaleFactor:1});
  page.on('pageerror',error=>errors.push(String(error)));
  page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
  await page.addInitScript(()=>{window.__CONTEXT_EVENTS__=[];for(const name of ['webglcontextlost','webglcontextrestored'])document.addEventListener(name,()=>window.__CONTEXT_EVENTS__.push(name),true);});
  for(let start=0;start<76;start+=6){
    await page.goto(`http://localhost:5175/scripts/headwear-multiview.html?start=${start}`);
    await page.waitForFunction(()=>window.__HEADWEAR_EVIDENCE__?.ready,{},{timeout:45000});
    const evidence=await page.evaluate(()=>window.__HEADWEAR_EVIDENCE__);
    contexts.push(...await page.evaluate(()=>window.__CONTEXT_EVENTS__));
    const path=`${dir}/sheet-${String(start/6).padStart(2,'0')}.png`;await page.screenshot({path});reports.push({path,evidence});
  }
}catch(error){errors.push(String(error));process.exitCode=1;}
finally{await browser.close();}
for(const [filename,hash] of Object.entries(sourceHashes))if(createHash('sha256').update(await readFile(`src/products/caps/${filename}`)).digest('hex')!==hash)errors.push(`Source changed during capture: ${filename}`);
const pass=!errors.length&&!contexts.length&&reports.length===13;
await writeFile(`${dir}/report.json`,JSON.stringify({pass,sourceHashes,errors,contexts,reports},null,2));
console.log(JSON.stringify({pass,errors,contexts,sheets:reports.length}));if(!pass)process.exitCode=1;
