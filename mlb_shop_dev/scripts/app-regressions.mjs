import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
const stage = process.env.MLB_APP_STAGE ?? 'after';
const dir = `evidence/app-regressions/${stage}`;
await mkdir(dir, {recursive:true});
const browser = await chromium.launch({channel:'chrome',ignoreDefaultArgs:['--disable-back-forward-cache']});
const page = await browser.newPage({viewport:{width:1280,height:900}});
const report = {checks:[],errors:[]};
page.on('pageerror', error => report.errors.push(error.message));
await page.addInitScript(() => {window.__appRepro = {id:Math.random(),restored:false};addEventListener('pageshow',event=>{if(event.persisted)window.__appRepro.restored=true;});});
try {
  // Given a fresh desktop, when its first actual frame renders, then its camera is already fitted.
  await page.goto('http://127.0.0.1:4175');
  await page.waitForFunction(()=>window.__MLB_DEBUG__?.sceneReady);
  report.firstReady = await page.evaluate(()=>({camera:window.__MLB_DEBUG__.camera,settled:window.__MLB_DEBUG__.cameraSettled,startup:window.__MLB_DEBUG__.startup}));
  report.checks.push({name:'initial-camera-fits-first-frame',pass:report.firstReady.camera.every((value,index)=>Math.abs(value-[-15.5,23,28.5][index])<.05)});
  await page.waitForFunction(()=>window.__MLB_DEBUG__.cameraSettled);
  const before = await page.evaluate(()=>window.__appRepro.id);
  // Given an actual BFCache restore, when Plan is selected, then the preserved renderer responds.
  await page.goto('http://localhost:4175/sources/plan.png');
  await page.goBack({waitUntil:'commit'});
  await page.waitForFunction(()=>window.__MLB_DEBUG__?.sceneReady);
  const restored = await page.evaluate(()=>window.__appRepro);
  report.checks.push({name:'actual-bfcache-restore',pass:restored.id===before&&restored.restored});
  await page.keyboard.press('4');
  try {await page.waitForFunction(()=>window.__MLB_DEBUG__.cameraSettled,undefined,{timeout:6000});report.checks.push({name:'bfcache-plan-camera-responds',pass:true});}
  catch(error){if(error instanceof Error)report.checks.push({name:'bfcache-plan-camera-responds',pass:false,detail:error.message});else throw error;}
  await page.screenshot({path:`${dir}/bfcache.png`});
  // Given a landscape viewport, when a visible zone is tapped, then the selection panel does not intercept it.
  await page.goto('http://127.0.0.1:4175');await page.setViewportSize({width:844,height:390});
  await page.waitForFunction(()=>window.__MLB_DEBUG__?.sceneReady&&window.__MLB_DEBUG__.cameraSettled);
  const target = page.locator('.zone-list button').nth(1);await target.scrollIntoViewIfNeeded();
  const reachable = await target.evaluate(button=>{const rect=button.getBoundingClientRect();return button.contains(document.elementFromPoint(rect.x+rect.width/2,rect.y+rect.height/2));});
  report.checks.push({name:'landscape-zone-reachable',pass:reachable});
  const overlap = await page.evaluate(()=>{const nav=document.querySelector('.destinations').getBoundingClientRect();const card=document.querySelector('.selection').getBoundingClientRect();return Math.max(0,Math.min(nav.right,card.right)-Math.max(nav.left,card.left))*Math.max(0,Math.min(nav.bottom,card.bottom)-Math.max(nav.top,card.top));});
  report.checks.push({name:'landscape-card-avoids-zone-panel',pass:overlap===0,overlap});
  await page.screenshot({path:`${dir}/landscape.png`});
} finally {
  await browser.close();await writeFile(`${dir}/report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}
assert.ok(report.checks.every(check=>check.pass),'Every app regression must pass');
assert.equal(report.errors.length,0);
