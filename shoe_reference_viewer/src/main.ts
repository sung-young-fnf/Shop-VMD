import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createShoe} from './shoe';
import {loadMaterials} from './materials';
import './style.css';
function element<T extends HTMLElement>(selector:string,ctor:{new():T}):T{const found=document.querySelector(selector);if(!(found instanceof ctor))throw new Error(`Missing ${selector}`);return found;}
const host=element('#canvas',HTMLDivElement);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0xf7f6f2);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.NoToneMapping;host.append(renderer.domElement);
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(32,1,.05,100);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=1.15;controls.maxDistance=9;controls.enablePan=false;
scene.add(new THREE.HemisphereLight(0xffffff,0xcad0d2,3.0));
const key=new THREE.DirectionalLight(0xffffff,1.2);key.position.set(3,5,4);scene.add(key);
const fill=new THREE.DirectionalLight(0xc9d8ee,.3);fill.position.set(3,2,-3);scene.add(fill);
const underside=new THREE.DirectionalLight(0xffffff,.5);underside.position.set(0,-4,1);scene.add(underside);
const positions:Record<string,readonly [number,number,number]>={three:[4.8,3.1,4.7],front:[6.5,1.4,0],side:[-6.5,1.4,0],rear:[0,1.65,-6],inside:[0,8.5,.05],sole:[0,-8.5,.05],detail:[2.5,1.2,.6]};
function view(name:string){const p=positions[name]??positions.three;camera.up.set(0,1,0);camera.position.set(...p);controls.target.set(0,name==='detail'?.65:.55,name==='detail'?-.1:0);controls.update();document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view===name)));}
view('three');
const observer=new ResizeObserver(()=>{const width=host.clientWidth,height=host.clientHeight;camera.aspect=width/height;camera.zoom=Math.min(1,camera.aspect/.95);camera.updateProjectionMatrix();renderer.setSize(width,height);});observer.observe(host);
document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(button=>button.addEventListener('click',()=>view(button.dataset.view??'three')));
element('#reset',HTMLButtonElement).addEventListener('click',()=>view('three'));
const labels:Record<string,string>={'0':'바깥 측면','1':'상품 사선','2':'안쪽 측면','3':'윗면','4':'뒤축','5':'밑창','6':'앞 사선','7':'소재 확대','8':'뒤축 확대'};
document.querySelectorAll<HTMLButtonElement>('[data-ref]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.ref??'0';const ref=element('#reference',HTMLImageElement);ref.src=`/assets/reference-${id}.jpg`;ref.alt=`원본 크림 LA 신발 ${labels[id]} 사진`;element('#reference-label',HTMLSpanElement).textContent=labels[id];document.querySelectorAll<HTMLButtonElement>('[data-ref]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
async function start(){const shoe=createShoe(await loadMaterials());scene.add(shoe);await renderer.compileAsync(scene,camera);renderer.setAnimationLoop(()=>{controls.update();renderer.render(scene,camera);});element('#status',HTMLSpanElement).textContent='3D 준비 완료';document.body.dataset.ready='true';}
start().catch((error:unknown)=>{element('#status',HTMLSpanElement).textContent='불러오기 실패';console.error(error);});
