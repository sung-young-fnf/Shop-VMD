import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';

assert.ok(process.cwd().replaceAll('\\','/').endsWith('/mlb_shop_dev'), 'Run in mlb_shop_dev');
const viewerOrigin = process.env.FOOTWEAR_VIEWER_URL ?? 'http://127.0.0.1:5175';
const storeOrigin = process.env.FOOTWEAR_STORE_URL ?? 'http://127.0.0.1:4175';
const stage=process.env.FOOTWEAR_QA_STAGE??'final';assert.match(stage,/^[a-z0-9-]+$/);
const dir = stage==='final'?'evidence/shoe-cad-refresh/browser':`evidence/shoe-cad-refresh/browser-${stage}`;
await mkdir(dir, { recursive:true });
const hash = async path => createHash('sha256').update(await readFile(path)).digest('hex');
async function fileHashes() {
  const paths=[];
  async function visit(path){for(const entry of await readdir(path,{withFileTypes:true})){const child=`${path}/${entry.name}`;if(entry.isDirectory())await visit(child);else paths.push(child);}}
  for(const path of ['src/products/shoes','public/products/shoes','dist'])await visit(path);
  paths.push('footwear-preview.html','src/wall-fixtures/cabinet-details.ts','src/wall-fixtures/cabinets.ts','src/products/evidence.ts','src/wall-fixtures/surfaces.ts','src/products/photo-material.ts','vite.config.ts','scripts/qa-footwear-cad.mjs');
  return Object.fromEntries(await Promise.all(paths.sort().map(async path=>[path,await hash(path)])));
}
const candidates=JSON.parse(await readFile('evidence/shoe-cad-refresh/photo/model-candidates.json','utf8'));
const angles=['oblique','lateral','medial','front','heel','top','sole','rearOblique'];
const report={startedAt:new Date().toISOString(),viewerOrigin,storeOrigin,browser:null,expectedSkus:candidates.map(item=>item.sku),expectedAngleCaptures:candidates.length*angles.length,sourceHashes:await fileHashes(),captures:[],checks:[],runtimeErrors:[],consoleErrors:[],requestFailures:[]};
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl']});
report.browser=browser.version();
const context=await browser.newContext({viewport:{width:960,height:720},deviceScaleFactor:1});
const page=await context.newPage();
page.on('pageerror',error=>report.runtimeErrors.push({url:page.url(),error:String(error)}));
page.on('console',message=>{if(message.type()==='error')report.consoleErrors.push({url:page.url(),error:message.text()});});
page.on('requestfailed',request=>report.requestFailures.push({url:request.url(),error:request.failure()}));
page.on('response',response=>{if(response.status()>=400)report.requestFailures.push({url:response.url(),status:response.status()});});
const state=()=>page.evaluate(()=>window.__FOOTWEAR_PREVIEW__);
const ready=()=>page.waitForFunction(()=>window.__FOOTWEAR_PREVIEW__?.ready,undefined,{timeout:90000});
async function check(name,task){try{await task();report.checks.push({name,pass:true});}catch(error){report.checks.push({name,pass:false,error:String(error)});console.error(name,String(error));}}
async function capture(name,snapshot,fullPage=false){
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const path=`${dir}/${name}.png`;await page.screenshot({path,fullPage});const bytes=await readFile(path);
  const dimensions={width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)};
  assert.equal(dimensions.width,page.viewportSize().width);
  report.captures.push({name,path,dimensions,sha256:await hash(path),capturedAt:new Date().toISOString(),state:snapshot});
}
async function imageReady(){await page.waitForFunction(()=>{const img=document.querySelector('.fw-source img');return img?.complete&&img.naturalWidth>0;},undefined,{timeout:15000});}
try{
  await page.goto(`${viewerOrigin}/footwear-preview.html`);await ready();
  const options=await page.locator('#fw-product option').allTextContents();
  assert.equal(options.length,candidates.length,'All admitted products selectable');
  if(stage!=='final'){for(const candidate of candidates){const index=options.findIndex(label=>label.includes(candidate.sku));await page.selectOption('#fw-product',String(index));await ready();await page.locator('[data-angle=oblique]').click();await capture(`overview-${candidate.sku}`,await state());}console.log('OVERVIEW_READY '+dir);}
  for(const candidate of candidates){
    const index=options.findIndex(label=>label.includes(candidate.sku));assert.ok(index>=0,`${candidate.sku} in selector`);
    await page.selectOption('#fw-product',String(index));await ready();await imageReady();
    await check(`${candidate.sku} shader and image textures loaded`,async()=>{const snapshot=await state();assert.equal(snapshot.sku,candidate.sku);assert.ok(snapshot.meshes.length>=5);const textures=snapshot.meshes.flatMap(mesh=>mesh.textures);assert.ok(textures.length>=5);for(const role of ['lateral','medial','top']){const mesh=snapshot.meshes.find(mesh=>mesh.name===`registered-${role}`);assert.ok(mesh,`${role} registered surface`);assert.ok(mesh.textures.some(texture=>texture.sampler==='registeredHeel'),`${role} compiled heel sampler`);}for(const texture of textures){assert.ok(texture.width>0&&texture.height>0,`${texture.sampler}: ${texture.url}`);assert.ok(texture.url.includes(candidate.sku),`Texture belongs to ${candidate.sku}: ${texture.url}`);}});
    for(const angle of angles){await page.locator(`[data-angle="${angle}"]`).click();const snapshot=await state();assert.ok(snapshot.camera.every(Number.isFinite));await capture(`${candidate.sku}-${angle}`,snapshot);}
  }
  for(const width of [1280,768,375]){
    await page.setViewportSize({width,height:width===375?812:900});
    await page.selectOption('#fw-product','0');await ready();
    await check(`${width} responsive layout`,async()=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false));
    const sourceOptions=await page.locator('#fw-source option').allTextContents();
    const cadIndex=sourceOptions.findIndex(label=>label.includes('CAD')&&!label.includes('없음'));
    assert.ok(cadIndex>=0,'Published CAD source available');
    for(const index of [0,cadIndex]){await page.selectOption('#fw-source',String(index));await imageReady();await capture(`${width}-${index===0?'source':'cad'}`,await state(),true);}
    await check(`${width} source and CAD prose remains together`,async()=>{const metrics=await page.locator('.fw-source figcaption').evaluate(element=>({width:element.clientWidth,text:element.textContent,wordBreak:getComputedStyle(element).wordBreak}));assert.ok(metrics.width>=230);assert.equal(metrics.wordBreak,'keep-all');});
    await check(`${width} geometry diagnostic toggle`,async()=>{await page.locator('#fw-material').click();assert.equal((await state()).shapeOnly,true);await capture(`${width}-geometry`,await state(),true);await page.locator('#fw-material').click();assert.equal((await state()).shapeOnly,false);});
    const assembled=(await state()).meshes.map(mesh=>mesh.position);
    await check(`${width} explode restores mesh positions`,async()=>{await page.locator('#fw-explode').click();assert.equal((await state()).exploded,true);assert.notDeepEqual((await state()).meshes.map(mesh=>mesh.position),assembled);await capture(`${width}-exploded`,await state(),true);await page.locator('#fw-explode').click();assert.deepEqual((await state()).meshes.map(mesh=>mesh.position),assembled);});
    await page.locator('.fw-stage canvas').scrollIntoViewIfNeeded();
    const canvas=await page.locator('.fw-stage canvas').boundingBox();assert.ok(canvas);
    await check(`${width} drag rotation`,async()=>{const before=(await state()).camera;await page.mouse.move(canvas.x+canvas.width*.4,canvas.y+canvas.height*.45);await page.mouse.down();await page.mouse.move(canvas.x+canvas.width*.65,canvas.y+canvas.height*.55,{steps:12});await page.mouse.up();assert.notDeepEqual((await state()).camera,before);});
    await check(`${width} wheel zoom`,async()=>{const before=(await state()).camera;await page.mouse.move(canvas.x+canvas.width*.5,canvas.y+canvas.height*.5);await page.mouse.wheel(0,-220);await page.waitForTimeout(200);assert.notDeepEqual((await state()).camera,before);});
    await page.locator('#fw-material').click();await page.locator('#fw-explode').click();await page.locator('#fw-reset').click();
    await check(`${width} reset restores full assembly`,async()=>{const snapshot=await state();assert.equal(snapshot.shapeOnly,false);assert.equal(snapshot.exploded,false);assert.deepEqual(snapshot.meshes.map(mesh=>mesh.position),assembled);});
    await capture(`${width}-reset`,await state(),true);
  }
  await page.setViewportSize({width:1280,height:900});
  await page.goto(storeOrigin);
  await page.waitForFunction(()=>window.__MLB_DEBUG__?.sceneReady&&window.__MLB_DEBUG__?.cameraSettled,undefined,{timeout:180000});
  await page.locator('.zone-list button').nth(3).click();
  await page.waitForFunction(()=>window.__MLB_DEBUG__?.cameraSettled,undefined,{timeout:30000});
  const store=await page.evaluate(()=>window.__MLB_DEBUG__);report.store=store;
  await check('Store footwear has all 12 admitted SKUs',async()=>{const actual=store.products.productIds.filter(sku=>report.expectedSkus.includes(sku));assert.equal(new Set(actual).size,candidates.length);});
  await check('Store footwear has 98 placements',async()=>{const summary=store.products.footwearSummary??store.products.shoeSummary;assert.ok(summary,'Store exposes footwear placement summary');assert.equal(summary.placements,98);assert.equal(summary.distinctSkus,12);});
  await capture('store-footwear-1280',store);
  for(const width of [768,375]){await page.setViewportSize({width,height:900});await page.waitForTimeout(300);await capture(`store-footwear-${width}`,await page.evaluate(()=>window.__MLB_DEBUG__));}
  await check('96 current product angle captures',async()=>assert.equal(report.captures.filter(capture=>report.expectedSkus.some(sku=>capture.name.startsWith(`${sku}-`))).length,report.expectedAngleCaptures));
  await check('No runtime errors',async()=>assert.deepEqual(report.runtimeErrors,[]));
  await check('No failed asset requests',async()=>assert.deepEqual(report.requestFailures,[]));
  await check('No console errors',async()=>assert.deepEqual(report.consoleErrors,[]));
}catch(error){report.failure=String(error);console.error(error);process.exitCode=1;}
finally{
  await browser.close();report.finalSourceHashes=await fileHashes();report.sourceStable=JSON.stringify(report.sourceHashes)===JSON.stringify(report.finalSourceHashes);report.finishedAt=new Date().toISOString();report.pass=!report.failure&&report.sourceStable&&report.checks.every(check=>check.pass);if(!report.pass)process.exitCode=1;
  await writeFile(`${dir}/report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({pass:report.pass,captures:report.captures.length,checks:report.checks.length,sourceStable:report.sourceStable,report:`${dir}/report.json`}));
}
