import {icon} from './icons';
import type {Icon} from './icons';
import type {HouseScene,ViewMode} from './scene';
import type {Room} from './house/plan';

const viewOptions=[{id:'exterior',name:'외관',icon:'house',caption:'한 걸음 떨어져, 집 전체를 바라보세요.',number:'01 — EXTERIOR'},{id:'interior',name:'실내',icon:'roof',caption:'지붕을 열고, 방마다 다른 이야기를 만나세요.',number:'02 — INSIDE THE HOUSE'},{id:'plan',name:'평면',icon:'plan',caption:'도면 속 공간이 하나의 집으로 이어집니다.',number:'03 — FLOOR PLAN'}] as const;
const el=(id:string):HTMLElement=>{const element=document.getElementById(id);if(!element)throw new ReferenceError(`Missing UI element: ${id}`);return element;};

export function setupInterface(scene:HouseScene){
  let mode:ViewMode='exterior';let night=false;let rotating=false;let exploded=false;
  const roomButtons=new Map<string,HTMLButtonElement>();
  const tabButtons=new Map<ViewMode,HTMLButtonElement>();
  const updateMode=(next:ViewMode):void=>{
    mode=next;tabButtons.forEach((button,id)=>button.setAttribute('aria-pressed',String(id===next)));
    const option=viewOptions.find(item=>item.id===next);if(option){el('view-number').textContent=option.number;el('view-caption').textContent=option.caption;}
    exploded=false;el('explode').setAttribute('aria-pressed','false');
  };
  const clearSelection=():void=>{roomButtons.forEach(button=>button.setAttribute('aria-pressed','false'));el('room-detail').hidden=true;document.body.classList.remove('has-selection');};
  const changeView=(next:ViewMode):void=>{updateMode(next);clearSelection();scene.setView(next);};
  const selectRoom=(room:Room):void=>{
    updateMode('interior');scene.selectRoom(room);roomButtons.forEach((button,id)=>button.setAttribute('aria-pressed',String(id===room.id)));
    el('room-english').textContent=room.english;el('room-name').textContent=room.name;el('room-description').textContent=room.description;
    el('room-area').textContent=`${room.area.toLocaleString('ko-KR')} m²`;el('room-detail').hidden=false;document.body.classList.add('has-selection');
  };
  viewOptions.forEach(option=>{const button=document.createElement('button');button.className='view-tab';button.innerHTML=icon(option.icon)+`<span>${option.name}</span>`;button.setAttribute('aria-pressed',String(mode===option.id));button.addEventListener('click',()=>changeView(option.id));tabButtons.set(option.id,button);el('view-tabs').append(button);});
  const roomIcons:Record<string,Icon>={living:'living',kitchen:'kitchen',garage:'garage',porch:'tree'};
  scene.rooms.forEach(room=>{const button=document.createElement('button');button.className='room-button';button.dataset['roomId']=room.id;button.setAttribute('aria-pressed','false');button.innerHTML=icon(roomIcons[room.id]??'bed')+`<span>${room.name}<small>${room.area} m²</small></span>`;button.addEventListener('click',()=>selectRoom(room));roomButtons.set(room.id,button);el('room-list').append(button);});
  const buttonIcons:Record<string,Icon>={'brand-mark':'house',night:'moon',rotate:'rotate','zoom-in':'plus','zoom-out':'minus',explode:'layers',reset:'reset'};
  for(const [id,name] of Object.entries(buttonIcons))el(id).innerHTML=icon(name);
  const toggleNight=():void=>{night=!night;scene.night(night);document.body.classList.toggle('night',night);el('night').setAttribute('aria-pressed',String(night));el('night').innerHTML=icon(night?'sun':'moon');el('weather-label').textContent=night?'불빛이 머무는 저녁':'햇살 좋은 오후';};
  el('night').addEventListener('click',toggleNight);
  el('rotate').addEventListener('click',()=>{rotating=!rotating;scene.rotate(rotating);el('rotate').setAttribute('aria-pressed',String(rotating));});
  el('zoom-in').addEventListener('click',()=>scene.zoom(1));el('zoom-out').addEventListener('click',()=>scene.zoom(-1));
  el('explode').addEventListener('click',()=>{exploded=!exploded;clearSelection();scene.explode(exploded);el('explode').setAttribute('aria-pressed',String(exploded));el('view-number').textContent=exploded?'04 — ASSEMBLY':viewOptions.find(option=>option.id===mode)?.number??'';if(!exploded)scene.setView(mode);});
  const reset=():void=>{rotating=false;el('rotate').setAttribute('aria-pressed','false');clearSelection();updateMode('exterior');scene.reset();};
  el('reset').addEventListener('click',reset);el('explore').addEventListener('click',()=>changeView('interior'));
  document.addEventListener('keydown',event=>{
    if(document.querySelector('dialog[open]')||event.target instanceof HTMLInputElement||event.ctrlKey||event.metaKey||event.altKey)return;
    const shortcuts:Record<string,()=>void>={'1':()=>changeView('exterior'),'2':()=>changeView('interior'),'3':()=>changeView('plan'),r:reset,n:toggleNight};shortcuts[event.key.toLowerCase()]?.();
  });
  return {selectRoom};
}
