import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createCap} from './cap';
import {materials} from './materials';
import './style.css';
function element<T extends HTMLElement>(selector:string,ctor:{new():T}):T{const found=document.querySelector(selector);if(!(found instanceof ctor))throw new Error(`Missing ${selector}`);return found;}
const host=element('#canvas',HTMLDivElement);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0xf7f6f2);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.NoToneMapping;host.append(renderer.domElement);
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(32,1,.05,100);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=1.15;controls.maxDistance=9;controls.enablePan=false;
scene.add(new THREE.HemisphereLight(0xffffff,0x808793,2.1));
const key=new THREE.DirectionalLight(0xffffff,2.0);key.position.set(-3,5,4);scene.add(key);
const fill=new THREE.DirectionalLight(0xc9d8ee,.45);fill.position.set(3,2,-3);scene.add(fill);
const underside=new THREE.DirectionalLight(0xffffff,1.2);underside.position.set(0,-4,1);scene.add(underside);
const positions:Record<string,readonly [number,number,number]>={three:[3.4,2.45,5.45],front:[0,.7,6.2],side:[6,1.1,.1],rear:[0,1.25,-6.2],inside:[1,-7,2.5],detail:[.6,1.0,2.35]};
function view(name:string){const p=positions[name]??positions.three;camera.position.set(...p);controls.target.set(0,name==='detail'?.65:.55,name==='detail'?.65:.32);controls.update();document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view===name)));}
view('three');
const observer=new ResizeObserver(()=>{const width=host.clientWidth,height=host.clientHeight;camera.aspect=width/height;camera.zoom=Math.min(1,camera.aspect/.95);camera.updateProjectionMatrix();renderer.setSize(width,height);});observer.observe(host);
document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(button=>button.addEventListener('click',()=>view(button.dataset.view??'three')));
element('#reset',HTMLButtonElement).addEventListener('click',()=>view('three'));
const labels:Record<string,string>={'0':'상품 사선','4':'상품 측면','5':'상품 정면','6':'상품 뒷면','7':'원단 확대','8':'모자 안쪽'};
document.querySelectorAll<HTMLButtonElement>('[data-ref]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.ref??'0';const ref=element('#reference',HTMLImageElement);ref.src=`/assets/reference-${id}.jpg`;ref.alt=`원본 네이비 NY 모자 ${labels[id]} 사진`;element('#reference-label',HTMLSpanElement).textContent=labels[id];document.querySelectorAll<HTMLButtonElement>('[data-ref]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
async function start(){const cap=createCap(await materials());scene.add(cap);await renderer.compileAsync(scene,camera);renderer.setAnimationLoop(()=>{controls.update();renderer.render(scene,camera);});element('#status',HTMLSpanElement).textContent='3D 준비 완료';document.body.dataset.ready='true';}
start().catch((error:unknown)=>{element('#status',HTMLSpanElement).textContent='불러오기 실패';console.error(error);});
