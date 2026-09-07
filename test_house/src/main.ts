import './style.css';
import {setupReferences,referenceImages} from './references';
import {setupInterface} from './interface';
import type {HouseScene} from './scene';
import {icon} from './icons';

declare global{interface Window{houseScene?:HouseScene;}}
setupReferences();
const brandMark=document.getElementById('brand-mark');
if(brandMark)brandMark.innerHTML=icon('house');
const container=document.getElementById('scene');
const loading=document.getElementById('loading');
const showFailure=(message:string,detail?:string):void=>{
  document.body.classList.add('scene-unavailable');
  if(!loading)return;loading.hidden=false;loading.replaceChildren();
  const title=document.createElement('h2');title.textContent='3D 화면을 열 수 없어요';
  const text=document.createElement('p');text.textContent=message;
  const image=document.createElement('img');image.src=referenceImages[0].url;image.alt='3D 대신 확인할 수 있는 집 원본 평면도';
  const retry=document.createElement('button');retry.className='action primary';retry.textContent='다시 열기';retry.addEventListener('click',()=>location.reload());
  loading.append(title,text);
  if(detail){const note=document.createElement('p');note.className='failure-detail';note.textContent=detail;loading.append(note);}
  loading.append(image,retry);
};
const webglMissing=():boolean=>{try{const probe=document.createElement('canvas');return !(probe.getContext('webgl2')??probe.getContext('webgl'));}catch{return true;}};
if(container&&loading){
  try{
    const {createScene}=await import('./scene');
    let ui:ReturnType<typeof setupInterface>|undefined;
    const scene=await createScene(container,room=>ui?.selectRoom(room));
    ui=setupInterface(scene);window.houseScene=scene;loading.hidden=true;
    container.querySelector('canvas')?.addEventListener('webglcontextlost',event=>{event.preventDefault();scene.dispose();showFailure('그래픽 연결이 끊겼습니다. 원본 도면을 확인하거나 다시 열어 주세요.');});
    window.addEventListener('pagehide',()=>scene.dispose(),{once:true});
    document.documentElement.dataset['sceneReady']='true';
  }catch(error){
    if(!(error instanceof Error))throw error;
    document.documentElement.dataset['sceneError']=error.message;
    if(webglMissing())showFailure('브라우저의 그래픽 가속을 켜고 다시 시도해 주세요. 원본 도면은 아래에서 볼 수 있습니다.');
    else showFailure('3D 화면을 준비하다 문제가 생겼습니다. 원본 도면은 아래에서 볼 수 있습니다.',error.message);
  }
}
