import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
const dir='evidence/environment/shadow-cache-restoration';
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome'});
const page=await browser.newPage({viewport:{width:1280,height:900}});
const report={states:[],errors:[]};
page.on('pageerror',error=>report.errors.push(error.message));
async function capture(name){await page.waitForFunction(()=>window.__MLB_DEBUG__.cameraSettled);await page.waitForTimeout(200);await page.screenshot({path:`${dir}/${name}.png`});report.states.push({name,state:await page.evaluate(()=>window.__MLB_DEBUG__)});}
try {
 await page.goto('http://127.0.0.1:4174');await page.waitForFunction(()=>window.__MLB_DEBUG__?.sceneReady);await capture('initial-day');
 // Given cached shadows, when ceiling visibility changes, then real ceiling geometry is rendered and restored.
 await page.locator('#ceiling').click();await capture('ceiling-on');
 await page.locator('#ceiling').click();await capture('ceiling-off');
 await page.locator('.view-list button').nth(1).click();await capture('exterior-day');
 await page.locator('#night').click();await capture('exterior-night');
 await page.locator('#reset').click();await capture('reset-day');
 const bounds=JSON.stringify(report.states[0].state.fixtures.map(item=>item.worldBounds));
 assert.ok(report.states.every(item=>JSON.stringify(item.state.fixtures.map(fixture=>fixture.worldBounds))===bounds),'Visibility changes preserve fixture geometry');
 assert.equal(report.states.at(-1).state.night,false);assert.equal(report.states.at(-1).state.ceiling,false);assert.equal(report.errors.length,0);
}finally {await browser.close();await writeFile(`${dir}/report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({states:report.states.map(item=>({name:item.name,calls:item.state.stats.calls,triangles:item.state.stats.triangles})),errors:report.errors}));}
