import sharp from 'sharp';
import {readFile,writeFile,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root='../mlb_shop_dev/reference/shoes-detail/M26N3ACVSP46N';const hashes=[];
for(let i=0;i<9;i++){const path=`${root}/gallery-${i}.${i<2?'png':'jpg'}`;hashes.push({path,sha256:createHash('sha256').update(await readFile(path)).digest('hex')});await sharp(path).flatten({background:'#f7f6f2'}).resize(1000).jpeg({quality:95}).toFile(`public/assets/reference-${i}.jpg`);}
await writeFile('evidence/source-hashes.json',JSON.stringify(hashes,null,2));await copyFile(`${root}/provenance.json`,'evidence/source-provenance.json');
await sharp(`${root}/gallery-7.jpg`).extract({left:760,top:2040,width:220,height:220}).png().toFile('public/assets/canvas.png');
await sharp(`${root}/gallery-7.jpg`).extract({left:660,top:150,width:220,height:200}).png().toFile('public/assets/suede.png');
const logo=await sharp(`${root}/gallery-0.png`).extract({left:955,top:1220,width:280,height:330}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
for(let i=0;i<logo.data.length;i+=4){const value=Math.max(logo.data[i],logo.data[i+1],logo.data[i+2]);logo.data[i+3]=Math.round(Math.max(0,Math.min(1,(175-value)/65))*255);}
await sharp(logo.data,{raw:{width:280,height:330,channels:4}}).png().toFile('public/assets/la.png');
async function tile(file,rect,out){
 const {data,info}=await sharp(file).extract(rect).resize(256,256).removeAlpha().raw().toBuffer({resolveWithObject:true});const result=Buffer.alloc(data.length);
 for(let y=0;y<256;y++)for(let x=0;x<256;x++)for(let c=0;c<3;c++){
 const wx=Math.sin(Math.PI*x/256)**2,wy=Math.sin(Math.PI*y/256)**2;const sample=(a,b)=>data[(b*256+a)*3+c];result[(y*256+x)*3+c]=sample(x,y)*wx*wy+sample((x+128)%256,y)*(1-wx)*wy+sample(x,(y+128)%256)*wx*(1-wy)+sample((x+128)%256,(y+128)%256)*(1-wx)*(1-wy);
 }
 await sharp(result,{raw:{width:256,height:256,channels:3}}).png().toFile(out);
}
await tile(`${root}/gallery-7.jpg`,{left:620,top:1990,width:180,height:180},'public/assets/canvas-tile.png');
await tile(`${root}/gallery-7.jpg`,{left:660,top:150,width:220,height:200},'public/assets/suede-tile.png');
const heel=await sharp(`${root}/gallery-4.jpg`).extract({left:530,top:1000,width:345,height:120}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
for(let i=0;i<heel.data.length;i+=4){const v=Math.max(heel.data[i],heel.data[i+1],heel.data[i+2]);heel.data[i+3]=Math.round(Math.max(0,Math.min(1,(170-v)/65))*255);}
await sharp(heel.data,{raw:{width:345,height:120,channels:4}}).png().toFile('public/assets/heel.png');
for(const [name,contrast,target] of [['canvas',.40,[235,234,226]],['suede',.50,[212,208,197]]]){
 const {data,info}=await sharp(`public/assets/${name}-tile.png`).raw().toBuffer({resolveWithObject:true});const avg=[0,0,0];for(let i=0;i<data.length;i++)avg[i%3]+=data[i]/(info.width*info.height);for(let i=0;i<data.length;i++)data[i]=target[i%3]+(data[i]-avg[i%3])*contrast;await sharp(data,{raw:info}).png().toFile(`public/assets/${name}-refined.png`);
}
const clean=await sharp('public/assets/la.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});for(let i=0;i<clean.data.length;i+=4){const v=Math.max(clean.data[i],clean.data[i+1],clean.data[i+2]);clean.data[i+3]=Math.round(Math.max(0,Math.min(1,(125-v)/45))*255);}await sharp(clean.data,{raw:{width:280,height:330,channels:4}}).png().toFile('public/assets/la-clean.png');
