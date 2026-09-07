import sharp from 'sharp';
import fs from 'node:fs/promises';
const source = 'public/reference/cap-rgba.png';
const crop = await sharp(source).extract({left:296,top:433,width:125,height:151}).ensureAlpha().raw().toBuffer();
const mask = new Uint8Array(125*151);
for(let i=0;i<mask.length;i++) {
 const r=crop[i*4],g=crop[i*4+1],b=crop[i*4+2];
 mask[i]=r>137&&g>132&&b>117 ? 1:0;
 crop[i*4+3]=mask[i]*255;
}
await sharp(crop,{raw:{width:125,height:151,channels:4}}).png().toFile('evidence/crops/embroidery-isolated.png');
await fs.writeFile('src/logo-mask.json',JSON.stringify({width:125,height:151,rows:Array.from({length:151},(_,y)=>Array.from(mask.slice(y*125,(y+1)*125)).join('')),source:'M25N3ACPB135N.png crop 296,433,125,151; visible ivory threshold; contour evidence only, not a photo billboard'}));
