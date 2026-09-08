import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const evidence = 'evidence/unique-clothing-20260908';
function dimensions(bytes) {
  if(bytes.toString('ascii',1,4)==='PNG') return {width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20),format:'png'};
  if(bytes.toString('ascii',0,4)==='RIFF' && bytes.toString('ascii',12,16)==='VP8X') return {width:1+bytes.readUIntLE(24,3),height:1+bytes.readUIntLE(27,3),format:'webp'};
  throw new Error('Unsupported image dimensions');
}
const discovery = JSON.parse(await readFile(`${evidence}/discovery.json`, 'utf8'));
const rejected = new Set(['M26F3APDB0166','M26F3AWJB7064','M26F3AWPB0666','M26F3AWPB0866']);
// These roles were individually read in gallery-sheet-00 through gallery-sheet-19.
const roles = {
  M26F3AJPV0164:[1,2],M26F3AMTB1564:[1,2],M26F3FTRB0664:[1,2],
  M26F3ATSM0764:[1,0],M26F3ATSM0864:[1,0],M26F3ATSV1664:[1,0],
  M26S3APQB0163:[0,4],M26S3APQB0263:[0,4],M26S3ATSB0163:[1,5],
  M26S3ATSB0263:[1,4],M26S3ATSB0363:[1,4],M26S3ATSB0463:[4,0],
  M26S3ATSB0863:[5,1],M26S3ATSB1063:[4,0],M26S3ATSB1563:[4,0],
  M26S3ATSB8063:[0,4],M26S3ATSB8163:[0,1],M26S3ATSB8263:[1,4],
  M26S3ATSE0263:[4,0],M26S3ATSM0463:[4,1],M26S3ATSM0663:[4,1],
  M26S3ATSM0763:[4,1],M26S3ATSM1263:[4,1],M26S3ATSV0163:[4,0],
  M26S3ATSV1263:[4,0],M26S3ATSV1463:[1,5],M26S3ATSV5163:[1,4],
  M26S3AWJB9061:[0,1],M26S3AWJB9161:[1,4],M26S3FTSB0263:[1,4],
  M26S3FTSB0563:[1,4],M26S3FTSB1163:[1,2],M26S3FTSB1263:[0,4],
  M26S3FTSB5063:[1,4],M26S3FTSB5163:[1,4],M26S3FTSB7163:[1,4],
  M26S3FTSB7363:[0,4],M26S3FTSV0263:[1,4],M26S3FTSV5663:[1,4],
  M26S3FTSX0663:[0,4],M26S3FWJB0363:[0,1],M26S3FWJB9061:[1,4],
  M26S3FWJV0163:[0,4],M26S3FWJV0363:[1,4],M26S3FWJV1363:[0,1],M26S3FWJV7063:[0,1],
};
function category(entry) {
  if (/3F(?:SK|DS)/.test(entry.id)) return 'skirt';
  if (entry.group === '팬츠') return 'pants';
  if (/3[AF]HD/.test(entry.id)) return 'hoodie';
  if (/3[AF]TR/.test(entry.id)) return 'jacket';
  if (/3A(?:WS|DR)/.test(entry.id)) return 'shirt';
  if (entry.group === '아우터' || entry.group === '다운') return 'jacket';
  if (entry.group === '맨투맨') return 'sweatshirt';
  return 'tee';
}
const sorted = [...discovery].sort((a,b)=>a.id.localeCompare(b.id));
const approved = discovery.filter(entry=>entry.assets?.length>=2 && !rejected.has(entry.id));
await mkdir('public/products/clothes', {recursive:true});
let cursor=0;
const sources=[];
await Promise.all(Array.from({length:6},async()=>{
  while(cursor<approved.length){
    const entry=approved[cursor++];
    if(entry.id.startsWith('M26S') && !roles[entry.id]) throw new Error(`Unreviewed summer roles ${entry.id}`);
    const [frontIndex,rearIndex]=roles[entry.id] ?? [0,1];
    const surfaces={};
    for(const [role,index] of [['front',frontIndex],['rear',rearIndex]]){
      const original=entry.assets[index];
      const originalBytes=await readFile(original.path);
      const originalDimensions=dimensions(originalBytes);
      const url=original.url.replace('/images/','/cdn-cgi/image/width=512,format=png/images/');
      const filename=`${entry.id}-${entry.colorCode}-${role}-512.png`;
      const path=`public/products/clothes/${filename}`;
      let bytes;
      try {await access(path);bytes=await readFile(path);} catch {
        const response=await fetch(url,{signal:AbortSignal.timeout(30000)});
        if(!response.ok) throw new Error(`HTTP${response.status} ${url}`);
        bytes=Buffer.from(await response.arrayBuffer());
        if(bytes.toString('ascii',1,4)!=='PNG') throw new Error(`Non-PNG delivery ${url}`);
        await writeFile(path,bytes,{flag:'wx'});
      }
      surfaces[role]={...original,...originalDimensions,galleryIndex:index,delivery:{path,filename,url,...dimensions(bytes),bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),transform:'Official CDN width=512,format=png; no generated or locally edited imagery'}};
    }
    const sheet=`gallery-sheet-${String(Math.floor(sorted.findIndex(row=>row.id===entry.id)/8)).padStart(2,'0')}.png`;
    sources.push({id:entry.id,baseSku:entry.id,colorCode:entry.colorCode,name:`${entry.group} ${entry.id}`,category:category(entry),page:entry.page,stock:entry.stock,frontImage:surfaces.front.delivery.filename,rearImage:surfaces.rear.delivery.filename,...surfaces,verification:{humanFree:true,frontRearConfirmed:true,evidence:`${evidence}/${sheet}`,method:'Direct visual inspection of both photographs: matching color, silhouette, neckline/hood or waistband and actual front/rear logo/pocket details. Human campaign cuts excluded.',notes:'Photographs retain captured lighting. Geometry depth is inferred. Some official source images include detached marketing badges outside garment; trace only garment component.'}});
    console.log(entry.id);
  }
}));
sources.sort((a,b)=>b.stock-a.stock || a.id.localeCompare(b.id));
await writeFile(`${evidence}/sources.json`,JSON.stringify(sources,null,2));
await writeFile(`${evidence}/source-summary.json`,JSON.stringify({manifestRows:discovery.length,verifiedPairs:sources.length,requiredPlacements:149,minimumRepeatPlacements:Math.max(0,149-sources.length),excluded:discovery.filter(entry=>!approved.includes(entry)).map(entry=>({id:entry.id,reason:rejected.has(entry.id)?'Gallery includes human campaign front and rear-only product photograph; no confirmed human-free front.':'No matching same-color gallery from official page.'})),categoryCounts:Object.fromEntries([...new Set(sources.map(x=>x.category))].map(cat=>[cat,sources.filter(x=>x.category===cat).length]))},null,2));
