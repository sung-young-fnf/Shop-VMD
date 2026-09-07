import fs from 'node:fs/promises';
const source=JSON.parse(await fs.readFile('src/logo-mask.json','utf8'));const {width:w,height:h,rows}=source;
const edges=new Map();const key=(x,y)=>`${x},${y}`;
function solid(x,y){return x>=0&&x<w&&y>=0&&y<h&&rows[y][x]==='1';}
function edge(a,b){const k=key(...a);if(!edges.has(k))edges.set(k,[]);edges.get(k).push(b);}
for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(solid(x,y)){if(!solid(x,y-1))edge([x,y],[x+1,y]);if(!solid(x+1,y))edge([x+1,y],[x+1,y+1]);if(!solid(x,y+1))edge([x+1,y+1],[x,y+1]);if(!solid(x-1,y))edge([x,y+1],[x,y]);}
const contours=[];
while(edges.size){const start=edges.keys().next().value;let p=start.split(',').map(Number);const loop=[];for(let safe=0;safe<10000;safe++){loop.push(p);const k=key(...p),out=edges.get(k);if(!out?.length)break;p=out.pop();if(!out.length)edges.delete(k);if(key(...p)===start)break;}
 const simple=loop.filter((p,i)=>{const a=loop[(i+loop.length-1)%loop.length],b=loop[(i+1)%loop.length];return(p[0]-a[0])*(b[1]-p[1])!==(p[1]-a[1])*(b[0]-p[0]);});let area=0;for(let i=0;i<simple.length;i++){const a=simple[i],b=simple[(i+1)%simple.length];area+=a[0]*b[1]-b[0]*a[1];}if(Math.abs(area)>8)contours.push({area:area/2,points:simple});
}
await fs.writeFile('src/logo-contours.json',JSON.stringify({width:w,height:h,source:source.source,contours}));console.log(contours.map(c=>({area:c.area,points:c.points.length})));
