import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
const stage=process.env.MLB_ENV_STAGE??'pmrem256';
const dir=`evidence/environment/${stage}`;
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome'});
const page=await browser.newPage({viewport:{width:1280,height:900}});
const report={stage,startup:[],captures:[],errors:[]};
page.on('pageerror',error=>report.errors.push(error.message));
try {
 for(let run=0;run<3;run++) {await page.goto('http://127.0.0.1:4175');await page.waitForFunction(()=>window.__MLB_DEBUG__?.sceneReady&&window.__MLB_DEBUG__.cameraSettled);report.startup.push(await page.evaluate(()=>({startup:window.__MLB_DEBUG__.startup,stats:window.__MLB_DEBUG__.stats})));}
 for(const item of [{name:'diorama',zone:null,night:false},{name:'central',zone:1,night:false},{name:'checkout',zone:5,night:false},{name:'checkout-night',zone:5,night:true}]) {
  if(item.zone!==null)await page.locator('.zone-list button').nth(item.zone).click();
  if(item.night)await page.locator('#night').click();
  await page.waitForFunction(()=>window.__MLB_DEBUG__.cameraSettled);
  await page.screenshot({path:`${dir}/${item.name}.png`});report.captures.push({name:item.name,state:await page.evaluate(()=>window.__MLB_DEBUG__)});
 }
 await page.locator('#reset').click();await page.locator('.view-list button').nth(2).click();await page.waitForFunction(()=>window.__MLB_DEBUG__.cameraSettled);await page.screenshot({path:`${dir}/interior-ceiling.png`});report.captures.push({name:'interior-ceiling',state:await page.evaluate(()=>window.__MLB_DEBUG__)});
}finally {await browser.close();await writeFile(`${dir}/report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({stage,startup:report.startup,calls:report.captures.map(item=>({name:item.name,calls:item.state.stats.calls})),errors:report.errors}));}
