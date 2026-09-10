import * as THREE from 'three';
import type { CadPhotoProfile } from './cad-photo-types';

export type PhotoFace = keyof CadPhotoProfile['views'] | 'front';
const ROWS = 96;
const RINGS = 60;
const clamp = THREE.MathUtils.clamp;
const mix = THREE.MathUtils.lerp;
const smooth = THREE.MathUtils.smoothstep;

export function interpolate(values: readonly number[], u: number): number {
  const scaled = clamp(u, 0, 1) * (values.length - 1), i = Math.floor(scaled), t = scaled - i;
  const a = values[i] ?? 0, b = values[Math.min(i + 1, values.length - 1)] ?? a;
  const before = values[Math.max(0, i - 1)] ?? a, after = values[Math.min(values.length - 1, i + 2)] ?? b;
  const tangent = (l: number, r: number) => l * r <= 0 ? 0 : 2 * l * r / (l + r);
  return (2*t**3-3*t*t+1)*a+(t**3-2*t*t+t)*tangent(a-before,b-a)+(-2*t**3+3*t*t)*b+(t**3-t*t)*tangent(b-a,after-b);
}
function anchorValue(anchors: readonly (readonly number[])[], x: number, column = 1): number {
  let previous = anchors[0]!;
  for (const next of anchors.slice(1)) {
    if (next[0]! >= x) return mix(previous[column]!, next[column]!, clamp((x-previous[0]!)/(next[0]!-previous[0]!),0,1));
    previous = next;
  }
  return previous[column]!;
}
function topSourceU(profile: CadPhotoProfile, u: number): number {
  const end = profile.endcaps;
  const anchors = profile.topRegistration ?? [[0,0],[1,1]];
  if (!end) return anchorValue(anchors,u);
  const last = (end.topHeelBodyY-profile.views.top.start)/(profile.views.top.end-profile.views.top.start);
  const kept = anchors.filter(a=>a[0]<Math.min(.88,end.upperHeelU-.025));
  return anchorValue([...kept,[end.upperHeelU,last]],u);
}
function upperU(profile: CadPhotoProfile, u: number) {
  return u-(1-(profile.endcaps?.upperHeelU ?? 1))*smooth(u,.65,1);
}
export function registeredSection(profile: CadPhotoProfile, u: number) {
  const side=profile.views.lateral, top=profile.views.top, sole=profile.views.sole, end=profile.endcaps;
  const ground=end?.sideGroundY ?? Math.max(...side.high), ppm=Math.abs(side.end-side.start)/profile.length;
  const upper=upperU(profile,u);
  const base=(ground-interpolate(side.high,u))/ppm;
  let bodyLow=interpolate(side.low,upper);
  const upperX=mix(side.start,side.end,upper);
  if(end?.upperBodyRows && upperX>=end.upperBodyRows[0]![0] && upperX<=end.upperBodyRows[end.upperBodyRows.length-1]![0]) bodyLow=Math.max(bodyLow,anchorValue(end.upperBodyRows,upperX));
  let rim=(ground-bodyLow)/ppm;
  if(end) {
    const crestU=(end.sideCollarCrestPx[0]-side.start)/(side.end-side.start);
    if(upper>crestU) rim=(ground-anchorValue([end.sideCollarCrestPx,end.sideUpperBackPx],mix(side.start,side.end,upper)))/ppm;
  }
  const topU=topSourceU(profile,upper), topY=mix(top.start,top.end,topU);
  let left=interpolate(top.low,topU), right=interpolate(top.high,topU);
  if(end && topY<=end.topUpperHeelRows[end.topUpperHeelRows.length-1]![0]) {
    left=anchorValue(end.topUpperHeelRows,topY,1); right=anchorValue(end.topUpperHeelRows,topY,2);
  }
  // Upper and outsole have independent observed footprints and rear endpoints.
  const taper=Math.sqrt(clamp(u/.025,0,1)*clamp((1-u)/.025,0,1));
  const width=(right-left)/2/Math.abs(top.end-top.start)*profile.length*taper;
  const lowerWidth=(interpolate(sole.high,u)-interpolate(sole.low,u))/2/Math.abs(sole.end-sole.start)*profile.length*taper;
  const opening=smooth(upper,.62,.72)*(1-smooth(upper,.76,.86));
  const shoulder=width*.32*(1-smooth(upper,.42,.64));
  const crown=rim+.003*Math.sin(Math.PI*u)-opening*Math.min(.032,Math.max(0,rim-base)*.3);
  rim-=shoulder;
  return {base,rim,crown,width,lowerWidth,upper,topU,left,right};
}
// Rear closure is constrained by two observed silhouettes in native pixels.
// Intersect each linear lateral interval with low(u) <= imageY <= high(u).
function rearUAtY(profile: CadPhotoProfile, imageY: number): number {
  const side=profile.views.lateral, count=side.low.length-1;
  for(let i=count-1;i>=0;i--) {
    let lo=0,hi=1;
    for(const [a,b] of [[side.low[i]!-imageY,side.low[i+1]!-imageY],[imageY-side.high[i]!,imageY-side.high[i+1]!]]) {
      const slope=b!-a!;
      if(Math.abs(slope)<1e-8) { if(a!>0) { lo=1;hi=0; } }
      else if(slope>0) hi=Math.min(hi,-a!/slope);
      else lo=Math.max(lo,-a!/slope);
    }
    if(hi>=lo && hi>=0 && lo<=1) return (i+clamp(hi,0,1))/count;
  }
  return profile.endcaps!.upperHeelU;
}
function rearTopYAtX(rows: readonly (readonly [number,number,number])[], imageX:number):number {
  if(imageX>=rows[0]![1] && imageX<=rows[0]![2]) return rows[0]![0];
  for(let i=1;i<rows.length;i++) {
    const before=rows[i-1]!, next=rows[i]!;
    if(imageX>=next[1] && imageX<=next[2]) {
      const edge=imageX<before[1]?1:2;
      return mix(before[0],next[0],clamp((imageX-before[edge])/(next[edge]-before[edge] || 1),0,1));
    }
  }
  return rows[rows.length-1]![0];
}
function pointAt(profile: CadPhotoProfile,u:number,ring:number):THREE.Vector3 {
  const s=registeredSection(profile,u);
  let y=s.base,z=0,x=u;
  if(ring<=24) {
    const q=1-ring/12;
    z=s.width*q; y=s.rim+(s.crown-s.rim)*Math.max(0,1-q*q)**.65; x=s.upper;
  } else if(ring<=36) {
    const v=(ring-24)/12;
    y=mix(s.rim,s.base,v); z=-mix(s.width,s.lowerWidth,v); x=mix(s.upper,u,v);
  } else if(ring<=48) z=s.lowerWidth*((ring-36)/6-1);
  else {
    const v=(ring-48)/12;
    y=mix(s.base,s.rim,v); z=mix(s.lowerWidth,s.width,v); x=mix(u,s.upper,v);
  }
  const end=profile.endcaps;
  const upperFraction=ring<=24?1:ring<=36?1-(ring-24)/12:ring<=48?0:(ring-48)/12;
  if(end && u>.72 && upperFraction>0) {
    const rear=end.heel, rows=rear.outlineRows;
    const crestU=(end.sideCollarCrestPx[0]-profile.views.lateral.start)/(profile.views.lateral.end-profile.views.lateral.start);
    const capWeight=smooth(s.upper,crestU-.04,crestU+.025)*upperFraction;
    // The rear photo gives a rounded shoulder, not a full-width flat collar crest.
    const imageX=rear.centerX-z/profile.length*rear.pixelsPerShoeLengthX;
    const ceiling=(rear.groundY-rearTopYAtX(rows,imageX))/rear.pixelsPerShoeLengthY*profile.length;
    y=mix(y,Math.min(y,ceiling),capWeight);
    const imageY=rear.groundY-y/profile.length*rear.pixelsPerShoeLengthY;
    const left=anchorValue(rows,imageY,1), right=anchorValue(rows,imageY,2);
    const minZ=(rear.centerX-right)/rear.pixelsPerShoeLengthX*profile.length;
    const maxZ=(rear.centerX-left)/rear.pixelsPerShoeLengthX*profile.length;
    // Keep the medial/lateral footprint seam closed: only constrain existing points.
    z=mix(z,clamp(z,Math.min(0,minZ),Math.max(0,maxZ)),capWeight);
    const last=registeredSection(profile,1);
    const nativeY=end.sideGroundY-y/profile.length*Math.abs(profile.views.lateral.end-profile.views.lateral.start);
    const observedRear=rearUAtY(profile,nativeY);
    const endpointX=mix(end.upperHeelU,1,clamp((last.rim-y)/Math.max(1e-6,last.rim-last.base),0,1));
    x+=(observedRear-endpointX)*smooth(u,.875,1)*upperFraction;
  }
  return new THREE.Vector3((x-.5)*profile.length,y,z);
}
function sideUv(profile:CadPhotoProfile,role:'lateral'|'medial',p:THREE.Vector3):THREE.Vector2 {
  const v=profile.views[role], physicalU=p.x/profile.length+.5;
  // Trace endpoints occasionally include floor-only columns between outsole lugs.
  // Sample the first observed full body column for the small endcap transition.
  const first=v.low.findIndex((low,i)=>v.high[i]!-low>=24);
  const sourceStart=Math.max(0,first)/(v.low.length-1);
  const u=Math.max(physicalU,sourceStart>0?sourceStart+.004:0);
  // A fixed scale preserves the logo and panel proportions at the heel.
  const ground=role==='lateral' ? profile.endcaps?.sideGroundY ?? Math.max(...v.high) : Math.max(...v.high);
  let sourceY=ground-p.y*Math.abs(v.end-v.start)/profile.length;
  if(u<.18) sourceY=clamp(sourceY,interpolate(v.low,u)+3,interpolate(v.high,u)-3);
  const lower=profile.endcaps.sideLowerRows?.[role], sourceX=mix(v.start,v.end,u);
  if(lower && sourceX>=lower[0]![0] && sourceX<=lower[lower.length-1]![0]) sourceY=Math.min(sourceY,anchorValue(lower,sourceX)-4);
  return new THREE.Vector2(sourceX/v.width,1-sourceY/v.height);
}
function heelUv(profile:CadPhotoProfile,p:THREE.Vector3):THREE.Vector2 {
  const h=profile.endcaps!.heel;
  return new THREE.Vector2((h.centerX-p.z/profile.length*h.pixelsPerShoeLengthX)/h.width,1-(h.groundY-p.y/profile.length*h.pixelsPerShoeLengthY)/h.height);
}
function frontUv(profile:CadPhotoProfile,p:THREE.Vector3):THREE.Vector2 {
  const front=profile.endcaps!.front;
  const sections=[.025,.05,.075,.10,.125].map(u=>registeredSection(profile,u));
  const width=Math.max(...sections.map(s=>s.width));
  const low=Math.min(...sections.map(s=>s.base)), high=Math.max(...sections.map(s=>s.crown));
  // Oblique source camera: transverse displacement plus toe recession.
  // The visible foremost feature stays at x=0,z=0 rather than stretching
  // the short inner sliver across half of the shoe.
  const a=clamp(front.apexAcross+.55*p.z/Math.max(.001,width)+2*(p.x/profile.length+.5),0,1);
  const h=clamp((p.y-low)/Math.max(.001,high-low),0,1);
  const [tl,tr,br,bl]=front.quad;
  const x=mix(mix(bl![0],br![0],a),mix(tl![0],tr![0],a),h);
  const y=mix(mix(bl![1],br![1],a),mix(tl![1],tr![1],a),h);
  return new THREE.Vector2(x/front.width,1-y/front.height);
}
function photoUv(profile:CadPhotoProfile,role:PhotoFace,p:THREE.Vector3,u:number):THREE.Vector2 {
  if(role==='front') return frontUv(profile,p);
  if(role==='heel') return heelUv(profile,p);
  if(role==='lateral'||role==='medial') return sideUv(profile,role,p);
  const v=profile.views[role],s=registeredSection(profile,u);
  if(role==='top') return new THREE.Vector2(mix(s.left+1,s.right-1,s.width>1e-6?(1-clamp(p.z/s.width,-1,1))/2:.5)/v.width,1-mix(v.start,v.end,s.topU)/v.height);
  const soleU=clamp(u,.009,.991);
  const low=interpolate(v.low,soleU),high=interpolate(v.high,soleU),inset=Math.min(16,(high-low)*.2);
  return new THREE.Vector2(mix(v.start,v.end,soleU)/v.width,1-mix(low+inset,high-inset,s.lowerWidth>1e-6?(1-clamp(p.z/s.lowerWidth,-1,1))/2:.5)/v.height);
}
export function createRegisteredSurfaces(profile:CadPhotoProfile) {
  const positions:THREE.Vector3[]=[],indices:number[]=[];
  for(let row=0;row<=ROWS;row++) for(let ring=0;ring<RINGS;ring++) positions.push(pointAt(profile,row/ROWS,ring));
  for(let row=0;row<ROWS;row++) for(let ring=0;ring<RINGS;ring++) {
    const a=row*RINGS+ring,b=row*RINGS+(ring+1)%RINGS;
    indices.push(a,a+RINGS,b,b,a+RINGS,b+RINGS);
  }
  const shell=new THREE.BufferGeometry();
  shell.setAttribute('position',new THREE.Float32BufferAttribute(positions.flatMap(p=>p.toArray()),3));shell.setIndex(indices);shell.computeVertexNormals();
  const normals=shell.getAttribute('normal');
  type Bucket={position:number[];normal:number[];uv:number[];heelUv:number[];frontUv:number[];sideUv:number[];heelWeight:number[];frontWeight:number[];shoeSide:number[];sideWeight:number[]};
  const buckets=new Map<PhotoFace,Bucket>();
  for(const role of ['lateral','medial','top','heel','sole','front'] as const) buckets.set(role,{position:[],normal:[],uv:[],heelUv:[],frontUv:[],sideUv:[],heelWeight:[],frontWeight:[],shoeSide:[],sideWeight:[]});
  for(let t=0;t<indices.length;t+=3) {
    const cell=Math.floor(t/6),ring=cell%RINGS,row=Math.floor(cell/RINGS);
    const role:PhotoFace=ring>=36&&ring<48?'sole':ring<24?'top':row<6?'front':row>=84?'heel':ring<36?'medial':'lateral';
    const data=buckets.get(role)!;
    const a=positions[indices[t]!]!,b=positions[indices[t+1]!]!,c=positions[indices[t+2]!]!;
    const face=new THREE.Vector3().subVectors(b,a).cross(new THREE.Vector3().subVectors(c,a)).normalize();
    for(let j=0;j<3;j++) {
      const vertex=indices[t+j]!,p=positions[vertex]!,u=Math.floor(vertex/RINGS)/ROWS;
      data.position.push(...p.toArray());data.shoeSide.push(p.z<0?-1:1);
      const n=new THREE.Vector3(normals.getX(vertex),normals.getY(vertex),normals.getZ(vertex));if(n.dot(face)<0)n.copy(face);
      const sectionForBlend=registeredSection(profile,u);
      data.sideWeight.push(role==='top'?smooth(Math.abs(p.z)/Math.max(.000001,sectionForBlend.width),.72,1):0);
      data.normal.push(...n.toArray());data.uv.push(...photoUv(profile,role,p,u).toArray());
      data.heelUv.push(...heelUv(profile,p).toArray());data.frontUv.push(...frontUv(profile,p).toArray());
      data.sideUv.push(...sideUv(profile,p.z<0?'medial':'lateral',p).toArray());
      data.heelWeight.push(role==='sole'?0:smooth(u,.73,.86)*smooth(n.x,.05,.55));
      const toeWidth=Math.max(...[.025,.05,.075,.10,.125].map(t=>registeredSection(profile,t).width));
      const observed=profile.endcaps!.front.apexAcross+.55*p.z/Math.max(.001,toeWidth)+2*(p.x/profile.length+.5);
      const section=registeredSection(profile,u);
      const height=(p.y-section.base)/Math.max(.001,section.rim-section.base);
      data.frontWeight.push(role==='sole'||role==='top'?0:(1-smooth(u,.035,.13))*smooth(observed,0,.035)*(1-smooth(observed,.96,1))*(1-smooth(height,.82,1)));
    }
  }
  shell.dispose();
  return [...buckets].map(([role,data])=>{
    const geometry=new THREE.BufferGeometry();
    for(const [name,values] of Object.entries(data)) geometry.setAttribute(name,new THREE.Float32BufferAttribute(values,name==='position'||name==='normal'?3:name.endsWith('Weight')||name==='shoeSide'?1:2));
    geometry.setIndex(Array.from({length:data.position.length/3},(_,i)=>i));return {role,geometry};
  });
}
