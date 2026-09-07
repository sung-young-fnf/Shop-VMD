import {chromium} from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs/promises';
const W=225,H=300;
function mask(data){const out=new Uint8Array(W*H);for(let i=0;i<out.length;i++)out[i]=(data[4*i+3]>128&&Math.max(data[4*i],data[4*i+1],data[4*i+2])<180)?1:0;return out;}
function bounds(m){let x0=W,y0=H,x1=0,y1=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(m[y*W+x]){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}return{x0,y0,x1,y1,w:x1-x0,h:y1-y0};}
const ref=mask(await sharp('public/reference/cap-rgba.png').resize(W,H).ensureAlpha().raw().toBuffer());
const rb=bounds(ref);
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:899,height:1200}});
await page.goto('http://127.0.0.1:5186/?capture=1&pass=blockout',{waitUntil:'networkidle'});
await page.waitForFunction(()=>window.capStudy?.ready);
const trials=[];
for(const height of [.78,.84,.9])for(const yaw of [34,42,50])for(const brim of [1.1,1.3,1.5]){
 await page.evaluate(({height,yaw,brim})=>{
 const s=window.capStudy;const c=s.model.getObjectByName('crown');c.scale.y=height;s.model.getObjectByName('top-button').position.y=1.43*height;
 const m=s.model.getObjectByName('brim-surface'),p=m.geometry.attributes.position;
 if(!m.userData.original)m.userData.original=Array.from(p.array);
 for(let i=0;i<p.count;i++){const x=m.userData.original[i*3],z=m.userData.original[i*3+2];const root=1.08*Math.sqrt(Math.max(0,1-Math.min(.999,x*x)))-.025;p.setZ(i,root+(z-root)*brim);}p.needsUpdate=true;m.geometry.computeVertexNormals();
 const a=yaw*Math.PI/180;s.controls.target.set(0,.61,.36);s.camera.position.set(Math.sin(a)*6,1.96,Math.cos(a)*6);s.camera.zoom=1;s.controls.update();s.renderer.render(s.scene,s.camera);
 },{height,yaw,brim});
 let buf=await page.locator('canvas').screenshot();let b=bounds(mask(await sharp(buf).resize(W,H).ensureAlpha().raw().toBuffer()));
 await page.evaluate(({rb,b})=>{const s=window.capStudy;const zoom=rb.w/b.w;s.camera.zoom=zoom;s.camera.updateProjectionMatrix();s.renderer.render(s.scene,s.camera);},{rb,b});
 buf=await page.locator('canvas').screenshot();b=bounds(mask(await sharp(buf).resize(W,H).ensureAlpha().raw().toBuffer()));
 await page.evaluate(({rb,b})=>{const s=window.capStudy;const shiftX=((rb.x0+rb.x1)-(b.x0+b.x1))/2/225;const shiftY=((rb.y0+rb.y1)-(b.y0+b.y1))/2/300;const vx=s.camera.matrix.elements;const horizontal=(s.camera.right-s.camera.left)/s.camera.zoom;const vertical=(s.camera.top-s.camera.bottom)/s.camera.zoom;const dx=-shiftX*horizontal,dy=shiftY*vertical;for(const vec of [s.camera.position,s.controls.target]){vec.x+=vx[0]*dx+vx[4]*dy;vec.y+=vx[1]*dx+vx[5]*dy;vec.z+=vx[2]*dx+vx[6]*dy;}s.controls.update();s.renderer.render(s.scene,s.camera);},{rb,b});
 buf=await page.locator('canvas').screenshot();const m=mask(await sharp(buf).resize(W,H).ensureAlpha().raw().toBuffer());let inter=0,union=0;for(let i=0;i<m.length;i++){inter+=Boolean(ref[i]&&m[i]);union+=Boolean(ref[i]||m[i]);}
 const camera=await page.evaluate(()=>({position:window.capStudy.camera.position.toArray(),target:window.capStudy.controls.target.toArray(),zoom:window.capStudy.camera.zoom}));
 trials.push({height,yaw,brim,iou:inter/union,camera});
 if(trials.every(t=>t.iou<=inter/union))await fs.writeFile('evidence/blockout/fitted.png',buf);
}
trials.sort((a,b)=>b.iou-a.iou);await fs.writeFile('evidence/blockout/fit-trials.json',JSON.stringify({method:'bounded geometry-camera fit; material scores not optimized',trials},null,2));console.log(trials.slice(0,3));await browser.close();
