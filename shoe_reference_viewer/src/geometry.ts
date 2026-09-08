import * as THREE from 'three';
export const profile:readonly (readonly [number,number,number])[]=[[-1.7,.008,1.12],[-1.58,.28,1.12],[-1.38,.405,1.19],[-1.08,.435,1.04],[-.72,.425,.95],[-.40,.445,1.18],[0,.48,1.00],[.45,.54,.79],[.85,.555,.58],[1.20,.50,.47],[1.46,.35,.39],[1.65,.13,.29],[1.7,.005,.245]];
export function section(z:number):{width:number;height:number}{
 let i=0;while(i<profile.length-2&&z>profile[i+1][0])i++;
 const a=profile[i],b=profile[i+1],q=THREE.MathUtils.clamp((z-a[0])/(b[0]-a[0]),0,1);const s=q;
 return {width:z< -1.1?.435*Math.sqrt(Math.max(.0001,1-((z+1.1)/.57)**2)):z>1.2?.50*Math.sqrt(Math.max(.0001,1-((z-1.2)/.5)**2)):THREE.MathUtils.lerp(a[1],b[1],s),height:THREE.MathUtils.lerp(a[2],b[2],s)};
}
export function base(z:number):number{return .18+.11*Math.exp(-((z+1.0)**2)/.16)+.075*Math.max(0,(z-1.05)/.65)**2;}
export function upper(z:number,a:number,lift=0):THREE.Vector3{const s=section(z);return new THREE.Vector3((s.width+lift)*Math.cos(a),base(z)+(s.height-base(z))*Math.max(0,Math.sin(a))**.65+lift,z);}
export function opening(z:number):number{
 if(z>=.88)return 0;
 if(z>=.60)return .205*Math.sqrt(Math.max(0,1-((z-.60)/.28)**2));
 if(z>=-.47)return .205+.035*(.78-z)/1.25;
 return Math.min(section(z).width*.74,.32*Math.sqrt(Math.max(0,1-((z+1.00)/.69)**2)));
}
export function edgeAngle(z:number):number{return Math.acos(THREE.MathUtils.clamp(opening(z)/section(z).width,0,1));}
export function sidePoint(z:number,y:number,sign=1,lift=.005):THREE.Vector3{const s=section(z);const a=Math.asin(Math.pow(THREE.MathUtils.clamp((y-base(z))/(s.height-base(z)),0,1),1/.65));const p=upper(z,a,lift);p.x*=sign;return p;}
export function grid(nu:number,nv:number,point:(u:number,v:number)=>THREE.Vector3,scale:readonly [number,number]=[1,1]):THREE.BufferGeometry{
 const p:number[]=[],uv:number[]=[],indices:number[]=[];
 for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++){p.push(...point(i/nu,j/nv).toArray());uv.push(i/nu*scale[0],j/nv*scale[1]);}
 for(let j=0;j<nv;j++)for(let i=0;i<nu;i++){const a=j*(nu+1)+i,b=a+1,c=a+nu+1,d=c+1;indices.push(a,b,c,b,d,c);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;
}
export function tube(points:THREE.Vector3[],r:number,material:THREE.Material):THREE.Mesh{return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),Math.max(32,points.length*2),r,7,false),material);}
export function outsoleContour(t:number):THREE.Vector3{const z=1.7*Math.cos(t);return new THREE.Vector3(Math.sign(Math.sin(t))*section(z).width,0,z);}

export function heelSurface(a:number,v:number,lift=0):THREE.Vector3{return new THREE.Vector3((.435-.115*v+lift)*Math.sin(a),.18+v*(.70+.12*Math.cos(a)),-1.1-(.57-.23*v+lift)*Math.cos(a));}
export function rearUV(g:THREE.BufferGeometry):THREE.BufferGeometry{const p=g.getAttribute('position'),uv=g.getAttribute('uv');for(let i=0;i<p.count;i++){const y=p.getY(i),w=.435-.115*Math.max(0,(y-.18)/.82);uv.setXY(i,1-THREE.MathUtils.clamp(p.getX(i)/(2*w)+.5,0,1),THREE.MathUtils.clamp(y,0,1));}return g;}
