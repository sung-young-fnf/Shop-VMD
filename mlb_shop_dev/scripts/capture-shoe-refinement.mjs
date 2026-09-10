import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1200,height:900}});
 page.on("pageerror",e=>console.log("PAGEERROR",String(e)));page.on("console",m=>{if(m.type()==="error")console.log("CONSOLE",m.text())});
 const index=Number(process.argv[2]??3);
 await page.goto(`http://127.0.0.1:4175/footwear-preview.html?index=${index}`);
 await page.waitForFunction(()=>window.__FOOTWEAR_PREVIEW__?.ready,{},{timeout:45000});
 await mkdir('evidence/shoe-cad-refinement/review',{recursive:true});
 for(const angle of ['oblique','front','heel','rearOblique','top']){
  await page.click(`[data-angle="${angle}"]`);
  await page.screenshot({path:`evidence/shoe-cad-refinement/review/${index}-${angle}.png`});
 }
 console.log('Captured',index);
} finally {await browser.close();}
