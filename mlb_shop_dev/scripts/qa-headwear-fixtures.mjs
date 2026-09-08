import { chromium } from 'playwright';
import { mkdir,writeFile,readFile,readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const directory='evidence/headwear-assortment-20260908/fixtures-final';
await mkdir(directory,{recursive:true});
const sourceHashes={};
for(const file of await readdir('src/products/caps'))if(file.endsWith('.ts'))sourceHashes[file]=createHash('sha256').update(await readFile(`src/products/caps/${file}`)).digest('hex');
const browser=await chromium.launch({channel:'chrome',headless:true});
const report={pass:false,sourceHashes,errors:[],contexts:[],captures:[]};
try{
  const page=await browser.newPage({viewport:{width:1100,height:900}});
  page.on('pageerror',error=>report.errors.push(String(error)));
  page.on('response',response=>{if(response.status()>=400)report.errors.push(`${response.status()} ${response.url()}`);});
  await page.addInitScript(()=>{window.__CONTEXTS__=[];for(const type of ['webglcontextlost','webglcontextrestored'])document.addEventListener(type,()=>window.__CONTEXTS__.push(type),true);});
  const cases=[
    ['cabinet-first','fixture=cabinet&id=ca-01'],
    ['black-beanie','fixture=cabinet&id=ca-01&detail=1&sku=M26F3ABNB1166'],
    ['cream-beanie','fixture=cabinet&id=ca-01&detail=1&sku=M26F3ABNB1866'],
    ['cabinet-second','fixture=cabinet&id=ca-02'],
    ['cabinet-middle','fixture=cabinet&id=ca-04'],
    ['cabinet-last','fixture=cabinet&id=ca-08'],
    ['pegboard','fixture=pegboard'],['island','fixture=island'],['showcase','fixture=showcase'],
  ];
  for(const [name,query] of cases){
    await page.goto(`http://localhost:5175/cap-store-preview.html?${query}`);
    await page.waitForFunction(()=>window.__CAP_STORE__?.ready,undefined,{timeout:45000});
    const path=`${directory}/${name}.png`;await page.screenshot({path});
    report.captures.push({path,state:await page.evaluate(()=>window.__CAP_STORE__)});
    report.contexts.push(...await page.evaluate(()=>window.__CONTEXTS__));
  }
  for(const [file,hash] of Object.entries(sourceHashes))if(createHash('sha256').update(await readFile(`src/products/caps/${file}`)).digest('hex')!==hash)throw new Error(`Source changed: ${file}`);
  report.pass=!report.errors.length&&!report.contexts.length;
}catch(error){report.errors.push(String(error));}
finally{await browser.close();await writeFile(`${directory}/report.json`,JSON.stringify(report,null,2));}
console.log(JSON.stringify({pass:report.pass,errors:report.errors,contexts:report.contexts,captures:report.captures.length}));
if(!report.pass)process.exitCode=1;
