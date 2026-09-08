import * as THREE from 'three';
export function crown(theta:number,t:number,inset=0):THREE.Vector3{
 const radial=Math.sin(t)**.6;
 const x=Math.sin(theta)*radial*(1-inset),z=Math.cos(theta)*radial*(1.05-inset);
 const base=.02+(-.12*Math.sin(theta)**2+.24*Math.max(0,Math.cos(theta))**2)*Math.sin(t)**2;
 const y=base+1.18*Math.max(0,Math.cos(t))**.88;
 return new THREE.Vector3(x,y,z);
}
export function lowerAngle(theta:number):number{
 const rear=Math.cos(theta)<0;const x=Math.sin(theta);
 const opening=rear&&Math.abs(x)<.43?.43*Math.sqrt(1-(x/.43)**2):0;
 return Math.acos(Math.pow(opening/1.18,1/.88));
}
export function bill(u:number,q:number):THREE.Vector3{
 const arc=Math.sqrt(Math.max(0,1-u*u));
 return new THREE.Vector3(u*(1+.045*q*arc),.26-.36*u*u-(.17+.50*u*u)*q*arc+.025*q*q*arc,1.05*arc+.86*arc*q);
}
export function patch(nu:number,nv:number,fn:(u:number,v:number)=>THREE.Vector3,uvScale:[number,number]=[1,1]):THREE.BufferGeometry{
 const positions:number[]=[],uvs:number[]=[],indices:number[]=[];
 for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++){positions.push(...fn(i/nu,j/nv).toArray());uvs.push(i/nu*uvScale[0],j/nv*uvScale[1]);}
 for(let j=0;j<nv;j++)for(let i=0;i<nu;i++){const a=j*(nu+1)+i,b=a+1,c=a+nu+1,d=c+1;indices.push(a,c,b,b,c,d);}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
}
export function curve(points:THREE.Vector3[],radius:number,material:THREE.Material):THREE.Mesh{
 return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),Math.max(32,points.length*2),radius,5,false),material);
}
export function frontSurface(x:number,y:number,lift=.008,rear=false):THREE.Vector3{
 let low=.001,high=Math.PI/2;
 for(let i=0;i<24;i++){const t=(low+high)/2,r=Math.sin(t)**.6;const a=Math.asin(THREE.MathUtils.clamp(x/r,-1,1));if(crown(rear?Math.PI-a:a,t).y>y)low=t;else high=t;}
 const r=Math.sin((low+high)/2)**.6;
 return new THREE.Vector3(x,y,(1.05*Math.sqrt(Math.max(.001,r*r-x*x))+lift)*(rear?-1:1));
}
