import sharp from 'sharp';import {copyFile,writeFile} from 'node:fs/promises';
const root='../mlb_shop_dev/reference/shoes-detail/M26N3ACVSP46N';
await copyFile(`${root}/gallery-0.png`,'public/assets/outer-photo.png');
await copyFile(`${root}/gallery-2.jpg`,'public/assets/inner-photo.jpg');
const {data,info}=await sharp(`${root}/gallery-5.jpg`).removeAlpha().raw().toBuffer({resolveWithObject:true});const w=1600,h=512,out=Buffer.alloc(w*h*3),bounds=[];
for(let i=0;i<w;i++){const px=200+i;let lo=1700,hi=900;for(let py=980;py<1650;py++){const n=(py*info.width+px)*3;if(data[n]>65&&data[n]<215&&data[n+1]<185&&data[n+2]<160&&data[n]>data[n+1]*1.15&&data[n+1]>data[n+2]*1.15){lo=Math.min(lo,py);hi=Math.max(hi,py);}}if(hi<=lo){lo=1200;hi=1350;}bounds.push([lo,hi]);for(let j=0;j<h;j++){const sy=Math.round(lo+(hi-lo)*j/(h-1)),from=(sy*info.width+px)*3,to=(j*w+i)*3;for(let c=0;c<3;c++)out[to+c]=data[from+c];}}
await sharp(out,{raw:{width:w,height:h,channels:3}}).png().toFile('public/assets/outsole-atlas.png');await writeFile('src/sole-bounds.json',JSON.stringify(bounds));
const rear=await sharp(`${root}/gallery-4.jpg`).removeAlpha().raw().toBuffer({resolveWithObject:true});const rearAtlas=Buffer.alloc(512*768*3);
for(let j=0;j<768;j++){const py=Math.round(880+j/767*800);let lo=1000,hi=400;for(let px=400;px<995;px++){const n=(py*rear.info.width+px)*3;if(Math.min(rear.data[n],rear.data[n+1],rear.data[n+2])<243){lo=Math.min(lo,px);hi=Math.max(hi,px);}}if(hi<=lo){lo=560;hi=850;}for(let i=0;i<512;i++){const px=Math.round(lo+(hi-lo)*i/511),n=(py*rear.info.width+px)*3,to=(j*512+i)*3;for(let c=0;c<3;c++)rearAtlas[to+c]=rear.data[n+c];}}
await sharp(rearAtlas,{raw:{width:512,height:768,channels:3}}).png().toFile('public/assets/rear-atlas.png');
