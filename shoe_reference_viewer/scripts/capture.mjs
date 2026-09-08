import {chromium} from 'playwright';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
await page.goto('http://127.0.0.1:5188');await page.waitForSelector('body[data-ready="true"]');await page.waitForTimeout(800);
for(const view of ['three','front','side','rear','inside','sole','detail']){await page.locator(`[data-view="${view}"]`).click();await page.waitForTimeout(500);await page.screenshot({path:`evidence/${view}.png`,fullPage:true});}
await page.locator('#reset').click();await page.mouse.move(400,400);await page.mouse.down();await page.mouse.move(530,440,{steps:12});await page.mouse.up();await page.waitForTimeout(500);await page.screenshot({path:'evidence/drag.png'});
await page.mouse.wheel(0,-150);await page.waitForTimeout(500);await page.screenshot({path:'evidence/zoom.png'});
const refs=[];for(const ref of ['1','0','2','3','4','5','6','7','8']){await page.locator(`[data-ref="${ref}"]`).click();await page.waitForTimeout(150);refs.push(await page.locator('#reference').evaluate(img=>({src:img.src,loaded:img.complete&&img.naturalWidth>0})));}
const widths=[];for(const width of [375,768,1280]){await page.setViewportSize({width,height:900});await page.locator('#reset').click();await page.waitForTimeout(500);await page.screenshot({path:`evidence/responsive-${width}.png`,fullPage:true});widths.push(await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth})));}
await writeFile('evidence/browser-check.json',JSON.stringify({errors,refs,widths},null,2));await browser.close();
