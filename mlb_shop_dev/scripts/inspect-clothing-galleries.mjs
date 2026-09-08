import { readFile, readdir, mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
const dir = 'evidence/unique-clothing-20260908';
await mkdir(dir, { recursive: true });
const entries = [];
for (const id of await readdir('reference/clothes-detail')) {
  try { entries.push(JSON.parse(await readFile(`reference/clothes-detail/${id}/gallery-provenance.json`, 'utf8'))); } catch {}
}
entries.sort((a,b) => a.id.localeCompare(b.id));
const browser = await chromium.launch({channel:'chrome',headless:true,args:['--disable-gpu']});
for(let start=Number(process.argv[2] ?? 0)*8;start<entries.length;start+=8){
  const page = await browser.newPage({viewport:{width:1440,height:1800}, deviceScaleFactor:1});
  await page.route('https://clothes.local/**', async route => {
    const path = new URL(route.request().url()).pathname.slice(1);
    await route.fulfill({body:await readFile(path),contentType:path.endsWith('png')?'image/png':'image/jpeg'});
  });
  let html='<body style="margin:0;background:#ddd;font:14px sans-serif">';
  for(const entry of entries.slice(start,start+8)){
    html+=`<div style="height:220px;display:flex;border-bottom:2px solid black"><div style="width:160px;flex-shrink:0">${entry.id}<br>${entry.group}<br>${entry.colorCode}</div>`;
    for(let index=0;index<entry.assets.length;index++){
      const asset=entry.assets[index];
      html+=`<div style="width:200px;text-align:center">${index}<br><img style="width:190px;height:195px;object-fit:contain" src="https://clothes.local/${asset.path}"></div>`;
    }
    html+='</div>';
  }
  await page.setContent(html+'</body>');await page.locator('img').evaluateAll(images=>Promise.all(images.map(img=>img.decode())));
  const path=`${dir}/gallery-sheet-${String(start/8).padStart(2,'0')}.png`;
  await page.screenshot({path,fullPage:true});console.log(path);
  await page.close();
}
await browser.close();
