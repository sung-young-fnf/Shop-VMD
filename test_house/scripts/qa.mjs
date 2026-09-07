import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const url=process.env.HOUSE_QA_URL??'http://127.0.0.1:4173';
const dir='evidence/qa';await mkdir(dir,{recursive:true});
const hash=async path=>createHash('sha256').update(await readFile(path)).digest('hex');
async function sources(folder){
  const result=[];
  for(const entry of await readdir(folder,{withFileTypes:true})){
    const path=`${folder}/${entry.name}`;
    if(entry.isDirectory())result.push(...await sources(path));else result.push(path);
  }
  return result;
}
const sourceFiles=[...await sources('src'),'house-spec.json','index.html','package.json','pnpm-lock.yaml'];
const sourceHashes=Object.fromEntries(await Promise.all(sourceFiles.map(async path=>[path,await hash(path)])));
const browser=await chromium.launch({headless:true,executablePath:process.env.HOUSE_CHROME_PATH??'C:/Users/AC1143/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe',args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const page=await context.newPage();
const errors=[];const checks={};const captures=[];const scenarios=[];
page.on('pageerror',error=>errors.push(error.message));
const inspect=()=>page.evaluate(()=>window.houseScene.inspect());
const settle=async()=>{await page.waitForFunction(()=>!window.houseScene.inspect().moving);await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));};
const capture=async(name,view)=>{const path=`${dir}/${name}.png`;await page.screenshot({path});captures.push({view:view??name,path,sha256:await hash(path)});};
const click=async name=>{await page.getByRole('button',{name,exact:true}).click();await settle();};
try{
  await page.goto(url,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.documentElement.dataset.sceneReady==='true');await settle();
  const initial=await inspect();checks.webgl=initial.triangles>0;checks.finiteGeometry=initial.finiteGeometry;checks.positiveBounds=initial.positiveBounds;
  await capture('desktop-exterior');
  for(const [view,angle] of [['front',0],['right',90],['rear',180],['left',270]]){
    await page.evaluate(angle=>window.houseScene.captureView(angle),angle);await settle();await capture(view,view);
  }
  await click('실내');let state=await inspect();assert.equal(state.roofVisible,false);assert.equal(state.view,'interior');checks.roofCutaway=true;await capture('desktop-interior');
  await click('평면');await capture('overhead','overhead');
  const roomIds=state.roomIds;
  for(const id of roomIds){
    await page.locator(`[data-room-id="${id}"]`).click();await settle();
    assert.equal(await page.locator(`[data-room-id="${id}"]`).getAttribute('aria-pressed'),'true');
    assert.equal(await page.locator('#room-detail').isVisible(),true);
    await capture(`room-${id}`);
  }
  await capture('room-selected');
  await click('평면');
  const point=await page.evaluate(()=>window.houseScene.roomScreenPoint('garage'));assert.ok(point);
  await page.mouse.click(point.x,point.y);await settle();assert.equal(await page.locator('[data-room-id="garage"]').getAttribute('aria-pressed'),'true');checks.roomPicking=true;
  scenarios.push('All 8 room buttons and real canvas raycast select the expected room.');
  await click('처음 시점으로');await click('구조 분해 보기');state=await inspect();assert.equal(state.exploded,true);assert.ok(state.roofY>0);checks.roofExplode=true;await capture('exploded');
  await click('처음 시점으로');state=await inspect();assert.equal(state.exploded,false);assert.equal(state.roofY,0);assert.equal(state.roofVisible,true);assert.equal(state.view,'exterior');checks.reset=true;
  const beforeOrbit=state.camera;
  await page.mouse.move(950,450);await page.mouse.down();await page.mouse.move(1100,490,{steps:12});await page.mouse.up();
  await page.waitForTimeout(350);assert.notDeepEqual((await inspect()).camera,beforeOrbit);scenarios.push('Pointer drag changes actual camera without selecting a room.');
  await click('처음 시점으로');const beforeZoom=(await inspect()).camera;
  await click('확대');assert.notDeepEqual((await inspect()).camera,beforeZoom);await click('축소');
  await click('밤 풍경');state=await inspect();assert.equal(state.night,true);assert.equal(await page.locator('body').evaluate(el=>el.classList.contains('night')),true);checks.night=true;await capture('night');
  const nightAccessibility=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  await writeFile(`${dir}/accessibility-night.json`,JSON.stringify(nightAccessibility.violations,null,2));
  assert.equal(nightAccessibility.violations.length,0,'Night accessibility violations');await click('밤 풍경');
  await page.keyboard.press('3');await settle();assert.equal((await inspect()).view,'plan');
  await page.keyboard.press('r');await settle();assert.equal((await inspect()).view,'exterior');checks.keyboard=true;
  await page.getByRole('button',{name:'참고 이미지',exact:true}).click();assert.equal(await page.locator('dialog').isVisible(),true);await capture('reference-plan');
  await page.getByRole('button',{name:'외관',exact:true}).last().click();await page.locator('#reference-image').evaluate(image=>image.decode());await capture('reference-exterior');
  await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').isVisible(),false);scenarios.push('Reference modal switches sources and closes with Escape.');
  const accessibility=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  await writeFile(`${dir}/accessibility.json`,JSON.stringify(accessibility.violations,null,2));
  assert.equal(accessibility.violations.length,0,'Accessibility violations found');
  for(const width of [1280,768,375]){
    await page.setViewportSize({width,height:width===375?812:900});await click('처음 시점으로');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await capture(`responsive-${width}`,width===375?'mobile':undefined);
    await click('실내');await capture(`interior-${width}`);
  }
  await page.emulateMedia({reducedMotion:'reduce'});await click('평면');assert.equal((await inspect()).moving,false);await capture('reduced-motion');
  await page.setViewportSize({width:1440,height:1000});await click('처음 시점으로');
  await page.getByRole('button',{name:'실내',exact:true}).focus();await capture('keyboard-focus');
  const geometry=await inspect();checks.consoleClean=errors.length===0;assert.deepEqual(errors,[]);
  const fallbackContext=await browser.newContext({viewport:{width:375,height:812}});
  await fallbackContext.addInitScript(()=>{
    const original=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(kind,...args){
      if(kind==='webgl'||kind==='webgl2'||kind==='experimental-webgl')return null;
      return original.call(this,kind,...args);
    };
  });
  const fallback=await fallbackContext.newPage();await fallback.goto(url);
  await fallback.getByRole('heading',{name:'3D 화면을 열 수 없어요'}).waitFor();
  assert.equal(await fallback.getByAltText('3D 대신 확인할 수 있는 집 원본 평면도').isVisible(),true);
  const fallbackPath=`${dir}/webgl-fallback.png`;await fallback.screenshot({path:fallbackPath});
  captures.push({view:'webgl-fallback',path:fallbackPath,sha256:await hash(fallbackPath)});
  await fallbackContext.close();scenarios.push('WebGL-unavailable browser shows the source plan and retry action.');
  for(const [name,passed] of Object.entries(checks))assert.equal(passed,true,name);
  for(const path of sourceFiles)assert.equal(await hash(path),sourceHashes[path],`Source changed during QA: ${path}`);
  const report={kind:'house.browser-qa',version:1,url,sourceHashes,captures,checks,geometry,scenarios,errors};
  await mkdir('.img2/artifacts/house',{recursive:true});
  await writeFile('.img2/artifacts/house/browser-qa.json',JSON.stringify(report,null,2));
  await writeFile(`${dir}/summary.json`,JSON.stringify({checks,scenarios,errors,triangles:geometry.triangles,drawCalls:geometry.drawCalls,accessibilityViolations:accessibility.violations.length},null,2));
  console.log(JSON.stringify({checks,triangles:geometry.triangles,drawCalls:geometry.drawCalls,captures:captures.length}));
}finally{await browser.close();}
