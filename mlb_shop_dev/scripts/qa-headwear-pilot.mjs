import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const stage=process.argv[2]??'pilot';
const dir=`evidence/headwear-assortment-20260908/${stage}`;
await mkdir(dir,{recursive:true});
const skus=process.argv.slice(3);
if(!skus.length)skus.push('M26F3ABNB1166','M26F3ABNB1866','M25N3ACPB245N','M25N3AHTB035N');
const browser=await chromium.launch({channel:'chrome',headless:true});
const reports=[];
try{
  const page=await browser.newPage({viewport:{width:650,height:750},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',error=>errors.push(String(error)));
  page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
  for(const sku of skus)for(const angle of ['front','rear','left','right','offaxis']){
    await page.goto(`http://localhost:5175/scripts/products-preview.html?category=caps&sku=${sku}&angle=${angle}`);
    await page.waitForFunction(()=>window.__PRODUCT_EVIDENCE__?.ready,{},{timeout:30000});
    const evidence=await page.evaluate(()=>window.__PRODUCT_EVIDENCE__);
    const path=`${dir}/${sku}-${angle}.png`;await page.screenshot({path});reports.push({sku,angle,path,evidence});
  }
  await writeFile(`${dir}/report.json`,JSON.stringify({pass:!errors.length,errors,reports},null,2));
  console.log(JSON.stringify({pass:!errors.length,errors,captures:reports.length}));
}finally{await browser.close();}
