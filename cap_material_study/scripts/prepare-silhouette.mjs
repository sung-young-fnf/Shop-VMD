import sharp from 'sharp';
import fs from 'node:fs/promises';
const {data,info}=await sharp('public/reference/cap-rgba.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const {width:w,height:h}=info;
const solid=new Uint8Array(w*h),outside=new Uint8Array(w*h);const queue=[];
for(let i=0;i<solid.length;i++)solid[i]=data[4*i+3]>128&&Math.max(data[4*i],data[4*i+1],data[4*i+2])<175?1:0;
for(let x=0;x<w;x++){queue.push(x,(h-1)*w+x);}for(let y=0;y<h;y++){queue.push(y*w,y*w+w-1);}
for(let q=0;q<queue.length;q++){const i=queue[q];if(outside[i]||solid[i])continue;outside[i]=1;const x=i%w,y=Math.floor(i/w);if(x>0)queue.push(i-1);if(x<w-1)queue.push(i+1);if(y>0)queue.push(i-w);if(y<h-1)queue.push(i+w);}
for(let i=0;i<solid.length;i++)data[4*i+3]=outside[i]?0:255;
await sharp(data,{raw:{width:w,height:h,channels:4}}).png().toFile('public/reference/cap-object.png');
await fs.writeFile('evidence/silhouette-provenance.json',JSON.stringify({source:'public/reference/cap-rgba.png',output:'public/reference/cap-object.png',method:'retain opaque dark cloth connected silhouette, flood-fill external background; enclosed ivory mark retained',reason:'Exclude white product-floor shadow from geometry silhouette target. Original still beauty/material reference.'},null,2));
