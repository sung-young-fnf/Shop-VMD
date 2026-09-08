import * as THREE from 'three';
import { createHeadwear } from '../src/products/caps/assortment.ts';
import { headwearCatalog } from '../src/products/caps/assortment-catalog.ts';
import { awaitProductTextures } from '../src/products/loading.ts';

const params=new URLSearchParams(location.search),start=Number(params.get('start')??0);
const subset=headwearCatalog.slice(start,start+6),tileWidth=300,tileHeight=240;
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(1);renderer.setSize(tileWidth*4,tileHeight*subset.length);
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.domElement.style.position='absolute';renderer.domElement.style.left='200px';document.body.append(renderer.domElement);
const scenes=subset.map((spec,index)=>{
  const scene=new THREE.Scene();scene.background=new THREE.Color('#eceef0');
  const model=createHeadwear(start+index);scene.add(model,new THREE.HemisphereLight('#ffffff','#a4a2a0',2.6));
  const light=new THREE.DirectionalLight('#fff',3.4);light.position.set(-2,4,5);scene.add(light);
  const bounds=new THREE.Box3().setFromObject(model),size=bounds.getSize(new THREE.Vector3()),target=bounds.getCenter(new THREE.Vector3());
  const image=document.createElement('img');image.src=`/products/${spec.front.texture}`;image.style.cssText=`position:absolute;left:0;top:${index*tileHeight+20}px;width:196px;height:216px;object-fit:contain`;document.body.append(image);
  const label=document.createElement('div');label.textContent=`${start+index} · ${spec.id} · ${spec.kind}`;label.style.cssText=`position:absolute;left:4px;top:${index*tileHeight+4}px;z-index:2`;document.body.append(label);
  for(const [column,name] of ['정면','좌측 (+X)','후면','우측 (-X)'].entries()){
    const text=document.createElement('span');text.textContent=name;text.style.cssText=`position:absolute;left:${200+column*tileWidth+8}px;top:${index*tileHeight+4}px;z-index:2`;document.body.append(text);
  }
  return {scene,bounds,size,target,sku:spec.id};
});
await awaitProductTextures();await Promise.all([...document.images].map(image=>image.decode()));
renderer.setScissorTest(true);
const records=[];
for(const [row,item] of scenes.entries())for(const [column,direction] of [[0,.04,1],[1,.04,0],[0,.04,-1],[-1,.04,0]].entries()){
  const scale=Math.max(item.size.y,item.size.x/(tileWidth/tileHeight),item.size.z)*.64;
  const camera=new THREE.OrthographicCamera(-scale*tileWidth/tileHeight,scale*tileWidth/tileHeight,scale,-scale,.001,10);
  camera.position.copy(item.target).add(new THREE.Vector3(...direction).normalize());camera.lookAt(item.target);
  renderer.setViewport(column*tileWidth,(scenes.length-1-row)*tileHeight,tileWidth,tileHeight);
  renderer.setScissor(column*tileWidth,(scenes.length-1-row)*tileHeight,tileWidth,tileHeight);
  await renderer.compileAsync(item.scene,camera);renderer.render(item.scene,camera);
  records.push({sku:item.sku,view:column,size:item.size.toArray(),camera:camera.position.toArray(),target:item.target.toArray(),stats:{...renderer.info.render}});
}
window.__HEADWEAR_EVIDENCE__={ready:true,start,records};
