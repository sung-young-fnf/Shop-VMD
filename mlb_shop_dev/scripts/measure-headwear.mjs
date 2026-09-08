import { readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { headwearSources } from './headwear-curation.mjs';

const output = 'evidence/headwear-assortment-20260908';
const sources = JSON.parse(await readFile(`${output}/delivery.json`, 'utf8'));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const catalog = [];
try {
  const page = await browser.newPage();
  await page.route('https://headwear.local/**', async route => route.fulfill({ body: await readFile(decodeURIComponent(new URL(route.request().url()).pathname.slice(1))), headers: {'access-control-allow-origin':'*'} }));
  await page.setContent('<body>Local headwear measurement</body>');
  for (const source of sources) {
    const views = {};
    for (const [role, photo] of Object.entries(source.photos)) {
      views[role] = await page.evaluate(async ({path,bodyFraction,bodyClip}) => {
        const image = new Image(); image.crossOrigin = 'anonymous'; image.src = path; await image.decode();
        const canvas = document.createElement('canvas'); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true }); ctx.drawImage(image, 0, 0);
        const { width, height } = canvas, { data } = ctx.getImageData(0, 0, width, height);
        const alpha = data[3] < 128;
        const foreground = (x,y) => { const i = (y * width + x) * 4; return data[i+3] > 180 && (alpha || Math.min(data[i], data[i+1], data[i+2]) < 239); };
        const scan = [];
        let left = width, right = 0, top = height, bottom = 0;
        const clip=bodyClip??[0,0,width-1,height-1];
        for (let y = clip[1]; y <= clip[3]; y++) {
          let lo = width, hi = 0, count = 0;
          for (let x = clip[0]; x <= clip[2]; x++) if (foreground(x,y)) { lo = Math.min(lo,x); hi = x; count++; }
          if (count > 4) { scan[y] = [lo,hi]; left = Math.min(left,lo); right = Math.max(right,hi); top = Math.min(top,y); bottom = y; }
        }
        if (right <= left || bottom <= top) throw new Error('Empty product silhouette');
        bottom=Math.round(top+(bottom-top)*bodyFraction);
        left=Math.min(...scan.slice(top,bottom+1).filter(Boolean).map(pair=>pair[0]));right=Math.max(...scan.slice(top,bottom+1).filter(Boolean).map(pair=>pair[1]));
        const rows = Array.from({length:65}, (_,i) => {
          const y = Math.round(top + (bottom-top)*i/64), pair = scan[y] ?? [left,right];
          return [pair[0]/width,pair[1]/width];
        });
        const candidates=[];
        for(const h of [.16,.24,.32,.40,.48])for(const xOffset of [-.28,-.20,-.10,.10,.20,.28]){
          const x=Math.round((left+right)/2+xOffset*(right-left)),y=Math.round(top+(bottom-top)*h);
          if(!foreground(x,y))continue;
          const rgb=[0,0,0],squares=[0,0,0];let n=0,invalid=0;
          const radiusX=Math.ceil(width*.035),radiusY=Math.ceil(height*.035);
          for(let dy=-radiusY;dy<=radiusY;dy+=2)for(let dx=-radiusX;dx<=radiusX;dx+=2){
            if(!foreground(x+dx,y+dy)){invalid++;continue;}
            const i=((y+dy)*width+x+dx)*4;for(let c=0;c<3;c++){rgb[c]+=data[i+c];squares[c]+=data[i+c]**2;}n++;
          }
          if(n)candidates.push({x,y,rgb:rgb.map(value=>value/n),variance:squares.reduce((sum,value,c)=>sum+value/n-(rgb[c]/n)**2,0),invalid:invalid/(n+invalid)});
        }
        if(!candidates.length)throw new Error('No logo-free cloth candidate');
        const median=[0,1,2].map(channel=>candidates.map(point=>point.rgb[channel]).sort((a,b)=>a-b)[Math.floor(candidates.length/2)]);
        const score=point=>point.rgb.reduce((sum,value,c)=>sum+(value-median[c])**2,0)+point.variance*3+point.invalid*100000;
        candidates.sort((a,b)=>score(a)-score(b));
        const {x:clothX,y:clothY,rgb}=candidates[0];
        const color='#'+rgb.map(value=>Math.round(value).toString(16).padStart(2,'0')).join('');
        const columns = Array.from({length:65},(_,i)=>{
          const x=Math.round(left+(right-left)*i/64);let y=top;
          while(y<bottom&&!foreground(x,y))y++;
          let end=bottom;while(end>y&&!foreground(x,end))end--;
          return [y/height,end/height];
        });
        const roof=columns.map(pair=>(bottom-pair[0]*height)/(bottom-top));
        const openingTopColumns=Array.from({length:65},(_,i)=>{
          const x=Math.round(left+(right-left)*i/64);let gap=0,edge=bottom;
          for(let y=Math.round(top+(bottom-top)*.50);y<bottom;y++){
            gap=foreground(x,y)?0:gap+1;if(gap>=4){edge=y-gap;break;}
          }
          return edge/height;
        });
        return { bounds:[left/width,top/height,right/width,bottom/height],rows,columns,openingTopColumns,clothUv:[clothX/width,clothY/height],color,roof,width,height,bodyFraction,bodyClip:bodyClip??null,maskMethod:alpha?'alpha>180':'opaque studio background minRGB<239; conservative silhouette, not segmentation truth' };
      }, {path:`https://headwear.local/${photo.delivery.path}`,bodyFraction:source.style==='cat-ties'?.325:source.style==='bucket-ties'?.52:1,bodyClip:source.id==='M26F3ACPB3266'?{front:[130,145,382,428],rear:[128,145,379,340]}[role]:null});
    }
    const front = views.front;
    const rootSplit = source.longEars?.60:headwearSources.find(entry=>entry.id===source.id).rootSplit;
    const common = { id:source.id, color:front.color, clothUv:front.clothUv, rearClothUv:views.rear.clothUv, cadSource:source.cadSource };
    for(const [role,view] of Object.entries(views)) {
      const crownTop = source.catEars ? view.bounds[1]+(view.bounds[3]-view.bounds[1])*.22 : view.bounds[1];
      common[role] = { texture:source.photos[role].delivery.texture,bounds:view.bounds,rows:view.rows,columns:view.columns,openingTopColumns:view.openingTopColumns,crownBottom:crownTop+(view.bounds[3]-crownTop)*(role==='front'?rootSplit:1),...(source.catEars?{crownTop}:{}),...(role==='side'?{hemisphere:'left',frontAt:'left'}:{}) };
    }
    const undersideColor={'M26N3ACPB296N':'#174f42','M26N3ACPV216N':'#174f42','M26N3ACPB906N':'#3299ce'}[source.id];
    if(source.style==='cap') catalog.push({...common,kind:'cap',bill:source.flat?'flat':'curved',rearConstruction:source.fitted?'fitted':'adjustable',catEars:source.catEars,meshRear:source.meshRear,longEars:source.longEars,...(undersideColor?{undersideColor}:{})});
    else {
      const kind=source.style.startsWith('bucket')?'bucket':source.style==='visor'?'visor':'beanie';
      const width=kind==='bucket'?.27:kind==='visor'?.22:.23;
      const height=kind==='beanie'?width*(front.bounds[3]-front.bounds[1])*front.height/((front.bounds[2]-front.bounds[0])*front.width):kind==='bucket'?.14:.085;
      catalog.push({...common,kind,style:source.style,width,height,depth:kind==='beanie'?.11:kind==='bucket'?.27:.25,crownFraction:source.style.includes('ties')?.51:kind==='bucket'?.73:1,roof:front.roof});
    }
    source.measurements=views;
  }
} finally { await browser.close(); }
const legacy=['M21N3ACP7701N','M22N3ACP0802N','M24N3ACPVL64N','M25N3ACP8805N','M26N3ACPB296N','M26N3ACPB336N'];
catalog.sort((a,b)=>(legacy.includes(a.id)?legacy.indexOf(a.id):legacy.length+sources.findIndex(x=>x.id===a.id))-(legacy.includes(b.id)?legacy.indexOf(b.id):legacy.length+sources.findIndex(x=>x.id===b.id)));
await writeFile(`${output}/measurements.json`,JSON.stringify(sources,null,2));
await writeFile('src/products/caps/assortment-catalog.ts',`import type { HeadwearDescriptor } from './assortment-types';\n\n// Generated from visually admitted same-SKU photographs; see scripts/measure-headwear.mjs.\nexport const headwearCatalog: readonly HeadwearDescriptor[] = [\n${catalog.map(row=>JSON.stringify(row)).join(',\n')}\n];\n`);
console.log(JSON.stringify({count:catalog.length,types:Object.fromEntries([...new Set(catalog.map(x=>x.kind))].map(kind=>[kind,catalog.filter(x=>x.kind===kind).length]))}));
