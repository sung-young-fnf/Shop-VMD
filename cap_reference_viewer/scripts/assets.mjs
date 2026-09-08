import sharp from 'sharp';
import {readFile,writeFile,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const source='../mlb_shop_dev/reference/caps-detail/M21N3ACP7701N';
const records=[];
for(const n of [0,4,5,6,7,8]){
 const ext=n===0||n===4?'png':'jpg'; const file=`${source}/gallery-${n}.${ext}`;
 records.push({file,sha256:createHash('sha256').update(await readFile(file)).digest('hex')});
 await sharp(file).flatten({background:'#f5f4f1'}).resize(900).jpeg({quality:94}).toFile(`public/assets/reference-${n}.jpg`);
}
await copyFile(`${source}/provenance.json`,'evidence/source-provenance.json');
await writeFile('evidence/source-hashes.json',JSON.stringify(records,null,2));
const {data,info}=await sharp(`${source}/gallery-7.jpg`).extract({left:1200,top:470,width:320,height:320}).removeAlpha().raw().toBuffer({resolveWithObject:true});
// Crossfade wrap boundaries in a derived color patch; source photos remain untouched.
const tile=Buffer.alloc(320*320*3);
for(let y=0;y<320;y++)for(let x=0;x<320;x++)for(let c=0;c<3;c++){
 const wx=Math.pow(Math.sin(Math.PI*x/320),2),wy=Math.pow(Math.sin(Math.PI*y/320),2);
 const sample=(a,b)=>data[(b*320+a)*info.channels+c];
 tile[(y*320+x)*3+c]=sample(x,y)*wx*wy+sample((x+160)%320,y)*(1-wx)*wy+sample(x,(y+160)%320)*wx*(1-wy)+sample((x+160)%320,(y+160)%320)*(1-wx)*(1-wy);
}
await sharp(tile,{raw:{width:320,height:320,channels:3}}).png().toFile('public/assets/twill.png');
const logo=await sharp(`${source}/gallery-5.jpg`).extract({left:882,top:1000,width:235,height:265}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
for(let i=0;i<logo.data.length;i+=4){const v=Math.min(logo.data[i],logo.data[i+1],logo.data[i+2]);logo.data[i+3]=Math.round(Math.max(0,Math.min(1,(v-98)/62))*255);}
await sharp(logo.data,{raw:{width:235,height:265,channels:4}}).png().toFile('public/assets/ny.png');
await sharp(`${source}/gallery-6.jpg`).extract({left:845,top:1110,width:325,height:235}).png().toFile('public/assets/rear.png');
const refined=Buffer.from(tile);const average=[0,0,0];
for(let i=0;i<refined.length;i++)average[i%3]+=refined[i]/(320*320);
for(let i=0;i<refined.length;i++)refined[i]=average[i%3]+(refined[i]-average[i%3])*.65;
await sharp(refined,{raw:{width:320,height:320,channels:3}}).png().toFile('public/assets/twill-refined.png');
