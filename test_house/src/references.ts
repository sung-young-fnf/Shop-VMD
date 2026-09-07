import planImage from '../test_house_reference/test_house.jpg';
import outdoorImage from '../test_house_reference/test_house_outdoor.jpg';
import frontImage from '../test_house_reference/test_house_front.jpg';
import backImage from '../test_house_reference/test_house_back.jpg';
import leftImage from '../test_house_reference/test_house_left.jpg';
import rightImage from '../test_house_reference/test_house_right.jpg';

export const referenceImages=[
  {name:'평면도',url:planImage,note:'방 위치와 표기 치수의 기준입니다. 실내 가구와 보이지 않는 구조는 시각화를 위한 추정입니다.'},
  {name:'외관',url:outdoorImage,note:'흰색 수직 외장, 금속 박공지붕, 목재 기둥과 벽돌 굴뚝의 재료·형태 참고입니다.'},
  {name:'정면',url:frontImage,note:'120 × 80px 입면도입니다. 낮은 해상도로 세부 치수를 확인할 수 없습니다.'},
  {name:'후면',url:backImage,note:'120 × 80px 입면도입니다. 후면 창과 지붕의 개략적인 배치를 참고했습니다.'},
  {name:'좌측',url:leftImage,note:'120 × 80px 입면도입니다. 파일의 방향 이름은 원본 이름을 유지했습니다.'},
  {name:'우측',url:rightImage,note:'120 × 80px 입면도입니다. 세부 디테일은 큰 외관 이미지를 우선했습니다.'},
] as const;

export function setupReferences():void{
  const dialog=document.querySelector<HTMLDialogElement>('#reference-dialog');
  const image=document.querySelector<HTMLImageElement>('#reference-image');
  const note=document.getElementById('reference-note');
  const original=document.querySelector<HTMLAnchorElement>('#reference-original');
  const tabs=document.getElementById('reference-tabs');
  if(!dialog||!image||!note||!original||!tabs)return;
  const select=(index:number):void=>{
    const ref=referenceImages[index];if(!ref)return;
    image.src=ref.url;image.alt=`집의 원본 ${ref.name}`;note.textContent=ref.note;original.href=ref.url;
    tabs.querySelectorAll('button').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
  };
  referenceImages.forEach((ref,index)=>{
    const button=document.createElement('button');button.className='action';button.textContent=ref.name;
    button.addEventListener('click',()=>select(index));tabs.append(button);
  });
  document.getElementById('reference')?.addEventListener('click',()=>{select(0);dialog.showModal();});
  document.getElementById('close-dialog')?.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
}
