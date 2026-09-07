import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createHouseModel } from './house/model';
import type { Room } from './house/plan';
import { roomFocusOffsets } from './house/plan';
import { createLandscape } from './landscape';

export type ViewMode = 'exterior' | 'interior' | 'plan';
export async function createScene(container: HTMLElement, onSelect: (room: Room) => void) {
  const scene=new THREE.Scene(); scene.background=new THREE.Color(0xd6e3da);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
  container.append(renderer.domElement);
  const camera=new THREE.PerspectiveCamera(35,1,.1,250);
  const controls=new OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true;controls.dampingFactor=.09;controls.minDistance=9;controls.maxDistance=100;
  controls.maxPolarAngle=Math.PI*.485;controls.autoRotateSpeed=.5;
  const sky=new THREE.HemisphereLight(0xf5f5e7,0x819581,2);scene.add(sky);
  const sun=new THREE.DirectionalLight(0xffefd7,2.8);sun.position.set(-18,30,16);sun.castShadow=true;
  sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-36;sun.shadow.camera.right=36;
  sun.shadow.camera.top=28;sun.shadow.camera.bottom=-28;sun.shadow.normalBias=.055;sun.shadow.bias=-.0002;
  scene.add(sun);
  const house=await createHouseModel();scene.add(house.root,createLandscape());
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(500,500),new THREE.MeshBasicMaterial({color:0xd6e3da,toneMapped:false}));
  ground.rotation.x=-Math.PI/2;ground.position.y=-.86;scene.add(ground);
  const groundShadow=new THREE.Mesh(new THREE.PlaneGeometry(120,120),new THREE.ShadowMaterial({opacity:.12}));
  groundShadow.rotation.x=-Math.PI/2;groundShadow.position.y=-.85;groundShadow.receiveShadow=true;scene.add(groundShadow);
  const targetPosition=new THREE.Vector3();const targetLook=new THREE.Vector3();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let view:ViewMode='exterior';let moving=false;let frames=2;let running=true;let night=false;let exploded=false;
  const move=(position:THREE.Vector3,look:THREE.Vector3):void=>{
    const offset=position.clone().sub(look);
    offset.setLength(THREE.MathUtils.clamp(offset.length(),controls.minDistance,controls.maxDistance));
    targetPosition.copy(look).add(offset);targetLook.copy(look);moving=true;frames=100;
    if(reduced.matches){camera.position.copy(targetPosition);controls.target.copy(look);moving=false;}
  };
  const setView=(mode:ViewMode):void=>{
    view=mode;exploded=false;house.setExploded(false);house.setCutaway(mode!=='exterior');
    const narrow=innerWidth<=760;
    const poses:Record<ViewMode,readonly [THREE.Vector3,THREE.Vector3]>={
      exterior:[new THREE.Vector3(-36,narrow?32:23,46),new THREE.Vector3(-1.5,0,0)],
      interior:[new THREE.Vector3(-25,37,32).multiplyScalar(narrow?1.25:1),new THREE.Vector3(-2,0,0)],
      plan:[new THREE.Vector3(-1.8,narrow?65:48,.01),new THREE.Vector3(-1.8,0,0)],
    };
    move(...poses[mode]);
  };
  const resize=():void=>{
    const {width,height}=container.getBoundingClientRect();renderer.setSize(width,height);
    camera.aspect=width/height;camera.zoom=width<=760?Math.min(.72,width/height*1.05):.88;camera.clearViewOffset();
    if(width>760)camera.setViewOffset(width,height,-100,0,width,height);
    else camera.setViewOffset(width,height,0,45,width,height);
    camera.updateProjectionMatrix();frames=20;
  };
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(container);
  setView('exterior');camera.position.copy(targetPosition);controls.target.copy(targetLook);moving=false;resize();
  const selection=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({color:0xc7a45b,transparent:true,opacity:.3,depthWrite:false,side:THREE.DoubleSide}));
  selection.rotation.x=-Math.PI/2;selection.visible=false;scene.add(selection);
  const selectRoom=(room:Room):void=>{
    view='interior';exploded=false;house.setCutaway(true);house.setExploded(false);
    const look=new THREE.Vector3(...room.center);const size=Math.max(...room.size);
    const offset=roomFocusOffsets[room.id]??[-size*.7,size*1.5,size*1.5];
    move(look.clone().add(new THREE.Vector3().fromArray(offset)),look);
    selection.position.set(room.center[0],room.center[1]+.035,room.center[2]);selection.scale.set(room.size[0]-.15,room.size[1]-.15,1);selection.visible=true;
  };
  const pointer=new THREE.Vector2();const start=new THREE.Vector2();const raycaster=new THREE.Raycaster();
  renderer.domElement.addEventListener('pointerdown',event=>{start.set(event.clientX,event.clientY);});
  renderer.domElement.addEventListener('pointerup',event=>{
    if(view==='exterior'||start.distanceTo(new THREE.Vector2(event.clientX,event.clientY))>6)return;
    const rect=renderer.domElement.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
    raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects([...house.selectable],false)[0];
    const room=house.rooms.find(item=>item.id===hit?.object.userData['roomId']);if(room)onSelect(room);
  });
  controls.addEventListener('start',()=>{moving=false;frames=120;});
  controls.addEventListener('change',()=>{frames=Math.max(frames,12);});
  const onVisibility=():void=>{frames=2;};document.addEventListener('visibilitychange',onVisibility);
  const clock=new THREE.Clock();
  let frameId=0;
  const render=():void=>{
    if(!running)return;frameId=requestAnimationFrame(render);const delta=Math.min(clock.getDelta(),.2);
    if(document.hidden)return;
    if(moving){const t=1-Math.exp(-6*delta);camera.position.lerp(targetPosition,t);controls.target.lerp(targetLook,t);if(camera.position.distanceTo(targetPosition)<.025){camera.position.copy(targetPosition);controls.target.copy(targetLook);moving=false;}}
    if(frames>0||moving||controls.autoRotate){controls.update(delta);renderer.render(scene,camera);frames--;
      const compass=document.getElementById('compass-arrow');if(compass)compass.style.transform=`rotate(${-controls.getAzimuthalAngle()}rad)`;
    }
  };
  await renderer.compileAsync(scene,camera);
  render();
  return {
    rooms:house.rooms,
    setView(mode:ViewMode){selection.visible=false;setView(mode);},selectRoom,
    zoom(direction:number){move(camera.position.clone().sub(controls.target).multiplyScalar(direction>0?.82:1.22).add(controls.target),controls.target.clone());},
    rotate(enabled:boolean){controls.autoRotate=enabled;frames=2;},
    explode(enabled:boolean){exploded=enabled;house.setCutaway(enabled);house.setExploded(enabled);move(new THREE.Vector3(-35,30,42),new THREE.Vector3(-2,3,0));frames=120;},
    night(enabled:boolean){night=enabled;house.setNight(enabled);scene.background=new THREE.Color(enabled?0x142c31:0xd6e3da);ground.material.color.set(enabled?0x142c31:0xd6e3da);sky.intensity=enabled?.6:2;sun.intensity=enabled?.8:2.8;sun.color.set(enabled?0xa8c8df:0xffefd7);renderer.toneMappingExposure=enabled?.85:1;frames=3;},
    reset(){controls.autoRotate=false;selection.visible=false;setView('exterior');},
    captureView(azimuth:number){const a=azimuth*Math.PI/180;move(new THREE.Vector3(Math.sin(a)*47,23,Math.cos(a)*47),new THREE.Vector3(-2,1,0));},
    roomScreenPoint(id:string){const room=house.rooms.find(item=>item.id===id);if(!room)return null;const point=new THREE.Vector3(...room.center).project(camera);const rect=renderer.domElement.getBoundingClientRect();return {x:rect.left+(point.x+1)*rect.width/2,y:rect.top+(1-point.y)*rect.height/2};},
    inspect(){
      const invalid:string[]=[];const assemblies:string[]=[];let vertices=0;
      house.root.traverse(object=>{if(object.name)assemblies.push(object.name);if(object instanceof THREE.Mesh){const p=object.geometry.getAttribute('position');for(let i=0;i<p.count;i++){vertices++;if(!Number.isFinite(p.getX(i)+p.getY(i)+p.getZ(i)))invalid.push(object.name);}}});
      const bounds=new THREE.Box3().setFromObject(house.root).getSize(new THREE.Vector3());
      return {view,night,exploded,moving,roofVisible:house.roof.visible,roofY:house.roof.position.y,roomIds:house.rooms.map(r=>r.id),assemblies,vertices,finiteGeometry:invalid.length===0,positiveBounds:bounds.toArray().every(n=>Number.isFinite(n)&&n>0),triangles:renderer.info.render.triangles,drawCalls:renderer.info.render.calls,camera:camera.position.toArray(),target:controls.target.toArray()};
    },
    dispose(){running=false;cancelAnimationFrame(frameId);resizeObserver.disconnect();document.removeEventListener('visibilitychange',onVisibility);controls.dispose();scene.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.dispose();const materials=Array.isArray(object.material)?object.material:[object.material];materials.forEach(material=>material.dispose());}});renderer.dispose();renderer.domElement.remove();},
  };
}
export type HouseScene=Awaited<ReturnType<typeof createScene>>;
