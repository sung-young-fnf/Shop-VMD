import {chromium} from 'playwright';import fs from 'node:fs/promises';import sharp from 'sharp';
const pass=process.argv[2]??'material-pass',base=`evidence/${pass}/materials`;await fs.mkdir(base,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
for(const variant of ['procedural','image']){const page=await browser.newPage({viewport:{width:899,height:1200}});await page.goto(`http://127.0.0.1:5186/?capture=1&pass=${pass}&variant=${variant}`,{waitUntil:'networkidle'});await page.waitForFunction(()=>window.capStudy?.ready);await page.evaluate(async()=>{const s=window.capStudy;await s.renderer.compileAsync(s.scene,s.camera);});
 for(const light of ['neutral','grazing','reference'])for(const view of ['reference','material-closeup']){await page.evaluate(async({light,view})=>{const s=window.capStudy;s.setView(view);s.setLight(light);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));},{light,view});const file=`${base}/${variant}-${light}-${view}.png`;await page.locator('canvas').screenshot({path:file});}
 await page.close();}
await browser.close();
for(const variant of ['procedural','image'])await sharp(`${base}/${variant}-reference-reference.png`).extract({left:540,top:490,width:153,height:156}).png().toFile(`${base}/${variant}-twill-crop.png`);
console.log(base);
