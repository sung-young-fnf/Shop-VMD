import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createShoe } from "./index";
import { shoeProducts } from "./catalog";
import { awaitProductTextures } from "../loading";
import "./preview.css";

const app = document.querySelector<HTMLDivElement>("#footwear-preview")!;
app.innerHTML = `<header class="fw-header"><div><div class="fw-eyebrow">MLB · DEVELOPMENT</div><h1>풋웨어 연구실</h1></div><a href="./">매장으로 돌아가기</a></header><main class="fw-layout"><section class="fw-stage" aria-label="신발 3D 뷰어"><div class="fw-status" role="status">신발을 불러오는 중…</div><div class="fw-hint">드래그로 회전 · 스크롤 또는 두 손가락으로 확대</div></section><aside class="fw-sidebar"><label class="fw-field"><span>레퍼런스 신발</span><select id="fw-product"></select></label><div class="fw-field"><span>관찰 방향</span><div class="fw-angles"></div></div><div class="fw-actions"><button id="fw-reset">초기화</button><button id="fw-material" aria-pressed="false">형상 보기</button><button id="fw-explode" aria-pressed="false">분리 보기</button></div><p class="fw-note" id="fw-scope"></p><label class="fw-field"><span>원본과 CAD</span><select id="fw-source"></select></label><figure class="fw-source"><img alt="선택한 신발의 원본 자료"><figcaption></figcaption></figure></aside></main>`;
const stage = app.querySelector<HTMLElement>(".fw-stage")!;
const status = app.querySelector<HTMLElement>(".fw-status")!;
const select = app.querySelector<HTMLSelectElement>("#fw-product")!;
const sourceSelect = app.querySelector<HTMLSelectElement>("#fw-source")!;
const sourceImage = app.querySelector<HTMLImageElement>(".fw-source img")!;
const sourceCaption = app.querySelector<HTMLElement>(".fw-source figcaption")!;
const scene = new THREE.Scene();
scene.background = new THREE.Color("#e8e8e2");
scene.add(new THREE.HemisphereLight(0xffffff, 0xa0a297, 2));
const light = new THREE.DirectionalLight(0xffffff, 2.4);
light.position.set(-1, 2, 3); scene.add(light);
const renderer = new THREE.WebGLRenderer({antialias:true, preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
stage.prepend(renderer.domElement);
const camera = new THREE.PerspectiveCamera(35, 1, .001, 20);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = false;
const shaderTextures = new WeakMap<THREE.Material, Record<string, THREE.Texture>>();
const wrappedMaterials = new WeakSet<THREE.Material>();
const diagnostic = new THREE.MeshStandardMaterial({color:"#b4bcb5",roughness:.88});
const angles: Record<string,{label:string;direction:[number,number,number]}> = {
  oblique:{label:"앞 사선",direction:[-1,.65,1]}, lateral:{label:"바깥쪽",direction:[0,.08,1]}, medial:{label:"안쪽",direction:[0,.08,-1]}, front:{label:"앞쪽",direction:[-1,.08,0]}, heel:{label:"뒤쪽",direction:[1,.08,0]}, top:{label:"위쪽",direction:[0,1,.001]}, sole:{label:"밑창",direction:[0,-1,.001]}, rearOblique:{label:"뒤 사선",direction:[1,.6,-1]},
};
let product:THREE.Group|null = null;
let productIndex = 0;
let ready = false;
let generation = 0;
let shapeOnly = false;
let exploded = false;
let distance = .7;
const center = new THREE.Vector3();
const modelSize = new THREE.Vector3(.314,.13,.11);
const fittedDistance = () => Math.max(modelSize.x / camera.aspect, modelSize.y, modelSize.z) * 2.25;
let parts:{mesh:THREE.Mesh;material:THREE.Material|THREE.Material[];position:THREE.Vector3;offset:THREE.Vector3}[]=[];
let sources:{label:string;url:string;note:string}[]=[];
const render = () => renderer.render(scene,camera);
function setAngle(name:string) {
  const angle = angles[name] ?? angles["oblique"]!;
  camera.up.set(0,1,0);
  camera.position.copy(center).addScaledVector(new THREE.Vector3(...angle.direction).normalize(),distance);
  controls.target.copy(center);controls.update();render();
  for(const button of app.querySelectorAll<HTMLButtonElement>("[data-angle]"))button.setAttribute("aria-pressed",String(button.dataset["angle"]===name));
}
for(const [name,angle] of Object.entries(angles)){
  const button=document.createElement("button");button.textContent=angle.label;button.dataset["angle"]=name;button.setAttribute("aria-pressed","false");button.onclick=()=>setAngle(name);app.querySelector(".fw-angles")!.append(button);
}
const localUrl=(path:string)=>/^https?:\/\//.test(path)?path:`${import.meta.env.BASE_URL}${path.replace(/^\/+/,"").replace(/^public\//,"")}`;
function showSource(){
  const source=sources[Number(sourceSelect.value)];if(!source)return;
  sourceImage.src=source.url;sourceImage.alt=source.label;sourceCaption.textContent=source.note;
}
sourceImage.addEventListener("error",()=>{sourceCaption.textContent="이 자료는 현재 미리보기 경로에서 열 수 없습니다. 원본 경로를 확인해 주세요.";});
sourceSelect.onchange=showSource;
async function loadProduct(index:number){
  const token=++generation;ready=false;status.textContent="신발과 원본을 불러오는 중…";
  if(product)scene.remove(product);
  productIndex=index;product=createShoe(index);scene.add(product);
  shapeOnly=false;exploded=false;
  for(const id of ["fw-material","fw-explode"])app.querySelector(`#${id}`)!.setAttribute("aria-pressed","false");
  parts=[];product.updateMatrixWorld(true);
  product.traverse(object=>{if(!(object instanceof THREE.Mesh))return;for(const material of (Array.isArray(object.material)?object.material:[object.material]) as THREE.Material[]){if(wrappedMaterials.has(material))continue;wrappedMaterials.add(material);const original=material.onBeforeCompile;material.onBeforeCompile=function(shader,renderer){original.call(this,shader,renderer);const textures:Record<string,THREE.Texture>={};for(const [name,uniform] of Object.entries(shader.uniforms))if(uniform.value instanceof THREE.Texture)textures[name]=uniform.value;shaderTextures.set(material,textures);};material.needsUpdate=true;}});
  const bounds=new THREE.Box3().setFromObject(product);bounds.getCenter(center);
  bounds.getSize(modelSize);distance=fittedDistance();
  controls.minDistance=distance*.35;controls.maxDistance=distance*3;
  product.traverse(object=>{if(object instanceof THREE.Mesh){const partCenter=new THREE.Box3().setFromObject(object).getCenter(new THREE.Vector3());const offset=partCenter.sub(center);if(offset.length()<.001)offset.set(0,1,0);offset.normalize().multiplyScalar(.045);parts.push({mesh:object,material:object.material,position:object.position.clone(),offset});}});
  const entry=shoeProducts[index]!;
  const metadata=entry as unknown as Record<string,unknown>;
  const cad=metadata["cadUrl"]??metadata["cadSource"]??product.userData["cadSource"];
  const source=metadata["referenceSource"]??product.userData["referenceSource"]??`reference/shoes/${entry.sku}.png`;
  sources=[{label:"상품 원본",url:localUrl(String(source)),note:`${entry.sku} · 개발 폴더 원본 사진`}];
  if(typeof cad==="string"&&cad)sources.push({label:"CAD 사양서",url:localUrl(cad),note:"CAD는 설계·소재 참고 자료입니다. 사진과 다른 사양 및 판독 한계는 제작 기록을 따릅니다."});
  else sources.push({label:"CAD · 연결된 자료 없음",url:localUrl(String(source)),note:"이 제품에 연결된 CAD가 아직 없습니다. 상품 원본을 표시합니다."});
  const views=metadata["photoViews"];
  if(Array.isArray(views))for(const view of views){if(typeof view==="object"&&view!==null&&typeof view.url==="string")sources.push({label:String(view.label??view.role??"추가 원본"),url:localUrl(view.url),note:"동일 제품 시점 자료 · 상세 근거는 제작 기록 참조"});}
  sourceSelect.replaceChildren(...sources.map((item,i)=>new Option(item.label,String(i))));showSource();
  const notes=metadata["reconstructionNotes"];app.querySelector("#fw-scope")!.textContent=typeof notes==="string"?notes:Array.isArray(notes)?notes.join(" "):"사진과 CAD를 참고한 3D 재구성입니다. 외형 치수·두께·숨은 면에는 추정이 포함되며, 실측 스캔이 아닙니다.";
  setAngle("oblique");
  try{await Promise.all([awaitProductTextures(),document.fonts.ready]);if(token!==generation)return;await renderer.compileAsync(scene,camera);if(token!==generation)return;render();await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));ready=true;status.textContent=`${entry.sku} · 회전하며 살펴보세요`;}catch(error){status.textContent="신발 자료를 불러오지 못했습니다.";console.error(error);}
}
for(const [index,entry] of shoeProducts.entries()){const metadata=entry as unknown as Record<string,unknown>;select.add(new Option(`${String(metadata["name"]??metadata["family"]??"신발")} · ${entry.sku}`,String(index)));}
select.onchange=()=>{void loadProduct(Number(select.value));};
app.querySelector<HTMLButtonElement>("#fw-reset")!.onclick=()=>{shapeOnly=false;exploded=false;for(const part of parts){part.mesh.material=part.material;part.mesh.position.copy(part.position);}for(const id of ["fw-material","fw-explode"])app.querySelector(`#${id}`)!.setAttribute("aria-pressed","false");setAngle("oblique");};
app.querySelector<HTMLButtonElement>("#fw-material")!.onclick=()=>{shapeOnly=!shapeOnly;for(const part of parts)part.mesh.material=shapeOnly?diagnostic:part.material;app.querySelector("#fw-material")!.setAttribute("aria-pressed",String(shapeOnly));render();};
app.querySelector<HTMLButtonElement>("#fw-explode")!.onclick=()=>{exploded=!exploded;for(const part of parts){part.mesh.position.copy(part.position);if(exploded)part.mesh.position.add(part.offset);}app.querySelector("#fw-explode")!.setAttribute("aria-pressed",String(exploded));render();};
controls.addEventListener("change",render);
function resizeViewport(){
  const width=stage.clientWidth,height=stage.clientHeight;if(!width||!height)return;
  const relativeZoom=camera.position.distanceTo(controls.target)/distance;
  const direction=camera.position.clone().sub(controls.target).normalize();
  renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();
  distance=fittedDistance();controls.minDistance=distance*.35;controls.maxDistance=distance*3;
  if(product){camera.position.copy(controls.target).addScaledVector(direction,distance*(Number.isFinite(relativeZoom)&&relativeZoom>0?relativeZoom:1));controls.update();}
  render();
}
const resize=new ResizeObserver(resizeViewport);resize.observe(stage);
camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();renderer.setSize(stage.clientWidth,stage.clientHeight);
Object.defineProperty(window,"__FOOTWEAR_PREVIEW__",{get:()=>({ready,sku:shoeProducts[productIndex]?.sku,productCount:shoeProducts.length,metadata:product?.userData,camera:camera.position.toArray(),target:controls.target.toArray(),shapeOnly,exploded,source:sources[Number(sourceSelect.value)],meshes:parts.map(({mesh,material})=>({name:mesh.name,vertices:mesh.geometry.getAttribute("position").count,position:mesh.position.toArray(),textures:(Array.isArray(material)?material:[material]).flatMap(item=>{const map=(item as THREE.MeshStandardMaterial).map;const textures={...(map?{map}:{}),...shaderTextures.get(item)};return Object.entries(textures).map(([sampler,texture])=>{const image=texture.image as HTMLImageElement|undefined;return {sampler,url:image?.currentSrc||image?.src,width:image?.naturalWidth,height:image?.naturalHeight};});})})),stats:{...renderer.info.render}})});
const params=new URLSearchParams(location.search);const requested=shoeProducts.findIndex(item=>item.sku===params.get("sku"));const initial=requested>=0?requested:Math.max(0,Math.min(shoeProducts.length-1,Number(params.get("index"))||0));select.value=String(initial);void loadProduct(initial);
window.addEventListener("pagehide",event=>{if(event.persisted)return;resize.disconnect();controls.dispose();renderer.dispose();diagnostic.dispose();});
window.addEventListener("pageshow",event=>{if(event.persisted)resizeViewport();});
