import sharp from 'sharp';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const dir='public/materials/procedural';await fs.mkdir(dir,{recursive:true});
const size=1024,TAU=Math.PI*2;
function hash(x,y){let n=Math.imul(x+53,374761393)^Math.imul(y+97,668265263);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967295;}
function wave(v){return Math.pow(Math.max(0,Math.sin(Math.PI*(v-Math.floor(v)))),.7);}
function twill(x,y){const xx=x/size*60,yy=y/size*60;const ix=Math.floor(xx),iy=Math.floor(yy);const warp=(ix+iy)%3<2;const a=wave(xx),b=wave(yy);const rib=.5+.5*Math.cos(TAU*(xx-.5*yy));return .58*rib+.32*(warp?.68*a+.13*b:.68*b+.13*a)+.035*Math.sin(TAU*(x*181+y*163)/size);}
function satin(x,y){const u=x/size,v=y/size;let a=0;if(u>.6&&v>.5)a=.75;else if(u>.34&&u<.7)a=-.55;return .5+.22*Math.cos((u*Math.cos(a)+v*Math.sin(a))*TAU*190)+.025*Math.sin(TAU*(x*211+y*193)/size);}
async function writeSet(name,heightFn,base){const h=new Float32Array(size*size);for(let y=0;y<size;y++)for(let x=0;x<size;x++)h[y*size+x]=heightFn(x,y);const maps=Object.fromEntries(['albedo','normal','roughness','ao'].map(k=>[k,Buffer.alloc(size*size*4)]));
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){const i=y*size+x,j=i*4,ht=h[i],grain=hash(x,y);const yarn=hash(Math.floor(x/size*60),Math.floor(y/size*60));const macro=Math.sin(TAU*x/size*3)*Math.sin(TAU*y/size*2);const shade=.82+ht*.32+(grain-.5)*.05+(yarn-.5)*.05+macro*.015;
  for(let k=0;k<3;k++)maps.albedo[j+k]=Math.max(0,Math.min(255,Math.round(base[k]*shade)));
  const dx=h[y*size+(x+1)%size]-h[y*size+(x+size-1)%size],dy=h[((y+1)%size)*size+x]-h[((y+size-1)%size)*size+x];const strength=name==='twill'?1.7:.8;const nx=-dx*strength,ny=-dy*strength,nz=1,inv=1/Math.hypot(nx,ny,nz);maps.normal[j]=Math.round((nx*inv*.5+.5)*255);maps.normal[j+1]=Math.round((ny*inv*.5+.5)*255);maps.normal[j+2]=Math.round((nz*inv*.5+.5)*255);
  const rough=name==='twill'?Math.round(232+(grain-.5)*9+(1-ht)*5):Math.round(211+(grain-.5)*9);const ao=Math.round(241+14*Math.min(1,ht*1.2));for(let k=0;k<3;k++){maps.roughness[j+k]=rough;maps.ao[j+k]=ao;}for(const map of Object.values(maps))map[j+3]=255;
 }
 const outputs=[];for(const[channel,data]of Object.entries(maps)){const file=`${dir}/${name}-${channel}.png`;await sharp(data,{raw:{width:size,height:size,channels:4}}).png().toFile(file);outputs.push({channel,file,sha256:crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex')});}return outputs;
}
const cloth=await writeSet('twill',twill,[45,48,62]);const embroidery=await writeSet('embroidery',satin,[231,224,211]);await fs.writeFile('evidence/procedural-material-design.json',JSON.stringify({route:'A: code-generated 2-over-1 diagonal interlace, no source image pixel sampling',reference:'evidence/crops/twill.png',tileWorldUnits:.6,yarnsPerTile:60,pitchWorldUnits:.01,roughness:'independent high roughness field',height:'analytic over-under weave, independent of base color',ao:'bounded yarn cavity field',metalness:0,sheen:0,clearcoat:0,seed:'integer hash deterministic',microLimit:'single-photo yarn dimensions inferred, physical fibre composition unmeasured',maps:[...cloth,...embroidery]},null,2));
console.log('Generated 8 independent procedural material maps.');
