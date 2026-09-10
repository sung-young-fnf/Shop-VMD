import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1200,height:900}});
 const index=Number(process.argv[2]??3);
 await page.goto(`http://127.0.0.1:5175/footwear-preview.html?index=${index}`);
 await page.waitForFunction(()=>window.__FOOTWEAR_PREVIEW__?.ready);
 await mkdir('evidence/shoe-cad-refresh/review',{recursive:true});
 for(const angle of ['oblique','lateral','medial','heel','top']){
  await page.click(`[data-angle="${angle}"]`);
  await page.screenshot({path:`evidence/shoe-cad-refresh/review/${index}-${angle}.png`});
 }
 console.log(JSON.stringify(await page.evaluate(()=>window.__FOOTWEAR_PREVIEW__)));
} finally {await browser.close();}
