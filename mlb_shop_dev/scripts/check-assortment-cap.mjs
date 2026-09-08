import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createServer } from 'vite';
import {mkdir,writeFile} from 'node:fs/promises';

const server = await createServer({ server:{middlewareMode:true,hmr:false},appType:'custom' });
const originalLoad = THREE.TextureLoader.prototype.load;
const rows = Array.from({length:65},()=>[.2,.8]);
const photo = { texture:'headwear/test/front.png',bounds:[.2,.25,.8,.75],crownBottom:.6,rows };
const descriptor = {kind:'cap',id:'test-cap',color:'#234567',front:photo,rear:{...photo,texture:'headwear/test/rear.png'},side:{...photo,texture:'headwear/test/side.png',hemisphere:'right',frontAt:'left'},clothUv:[.43,.34],cadSource:null,bill:'curved',rearConstruction:'adjustable'};
const results=[];
function orderedSnapshot(group){
  group.updateMatrixWorld(true);
  const result=new Map();
  group.traverse(mesh=>{
    if(!(mesh instanceof THREE.Mesh))return;
    const geometry=mesh.geometry.index?mesh.geometry.toNonIndexed():mesh.geometry;
    const entry=result.get(mesh.material.uuid)??{positions:[],attributes:{}};
    const p=geometry.getAttribute('position'),point=new THREE.Vector3();
    for(let i=0;i<p.count;i++)entry.positions.push(...point.fromBufferAttribute(p,i).applyMatrix4(mesh.matrixWorld).toArray());
    for(const name of ['capSourcePosition','capFrontUv','capRearUv','capSideUv','capFabricUv']){
      const attribute=geometry.getAttribute(name);
      if(attribute){const values=entry.attributes[name]??[];for(const value of attribute.array)values.push(value);entry.attributes[name]=values;}
    }
    result.set(mesh.material.uuid,entry);
  });
  return result;
}
try {
  THREE.TextureLoader.prototype.load = function (url) { const texture=new THREE.Texture();texture.name=url;return texture; };
  const {createAssortmentCap} = await server.ssrLoadModule('/src/products/caps/assortment-cap.ts');
  const cap = createAssortmentCap(descriptor);
  const size = new THREE.Box3().setFromObject(cap).getSize(new THREE.Vector3());
  assert.ok(size.x>.18 && size.y>.14 && size.z>.25,'Given a curved SKU, when its factory runs, then the cap has real three-axis volume');
  assert.equal(cap.children.filter(mesh=>mesh.name.startsWith('assortment-crown-')).length,6,'Given a curved SKU, when built, then all six crown panels exist');
  assert.ok(cap.getObjectByName('assortment-adjustment-strap'),'Given adjustable rear construction, when built, then an actual strap spans the opening');
  const fitted = createAssortmentCap({...descriptor,rearConstruction:'fitted',bill:'flat'});
  assert.equal(fitted.getObjectByName('assortment-adjustment-strap'),undefined,'Given fitted rear construction, when built, then no invented closure strap is added');
  for(const source of [cap,fitted]) source.traverse(mesh=>{
    if(!(mesh instanceof THREE.Mesh)) return;
    for(const value of mesh.geometry.getAttribute('position').array) assert.ok(Number.isFinite(value));
    assert.ok(mesh.material instanceof THREE.MeshBasicMaterial,'Given photo appearance mode, when built, then captured source pixels use unlit photo materials');
    assert.equal(mesh.material.toneMapped,false);
  });
  const cat = createAssortmentCap({...descriptor,catEars:true});
  assert.equal(cat.children.filter(mesh=>mesh.name.startsWith('assortment-ear-')).length,2,'Given photographed cat ears, when built, then both padded ear volumes exist');
  const long = createAssortmentCap({...descriptor,longEars:true});
  assert.equal(long.children.filter(mesh=>mesh.name.startsWith('assortment-long-ear-')).length,2,'Given long plush ears, when built, then both attached curved ear volumes exist');
  const {capPhotoUv}=await server.ssrLoadModule('/src/products/caps/assortment-material.ts');
  for(const x of [-1,0,1])for(const y of [.25,.40,.60,.74]){
    const uv=capPhotoUv(photo,[x,y]);
    assert.ok(uv.x>=.2&&uv.x<=.8&&Math.abs(uv.y-(1-y))<1e-12,'Given top-left source row bounds, when mapped, then UV remains within foreground and flips only vertical image origin');
  }
  const crown=cap.children.find(mesh=>mesh.name==='assortment-crown-0');
  const fabricUv=crown.geometry.getAttribute('capFabricUv');
  assert.ok(fabricUv,'Given inferred cloth, when built, then independent two-dimensional fabric coordinates exist');
  assert.ok(Math.abs(fabricUv.getY(13)-fabricUv.getY(13*17))>.5,'Given a fixed crown longitude, when height changes, then fabric sampling changes instead of stretching one vertical stripe');
  const shader={uniforms:{},vertexShader:THREE.ShaderLib.basic.vertexShader,fragmentShader:THREE.ShaderLib.basic.fragmentShader};
  crown.material.onBeforeCompile(shader,{});
  assert.equal(shader.uniforms.sideSign.value,-1,'Given one right-side photograph, when projected, then the photograph owns only model -X');
  assert.ok(shader.uniforms.assortmentFront.value.name.endsWith('/headwear/test/front.png'));
  assert.ok(shader.uniforms.assortmentRear.value.name.endsWith('/headwear/test/rear.png'));
  const unknownSide=createAssortmentCap({...descriptor,side:undefined});
  const unknownShader={uniforms:{},vertexShader:THREE.ShaderLib.basic.vertexShader,fragmentShader:THREE.ShaderLib.basic.fragmentShader};
  unknownSide.children.find(mesh=>mesh.name==='assortment-crown-0').material.onBeforeCompile(unknownShader,{});
  assert.equal(unknownShader.uniforms.sideSign.value,0,'Given no observed side, when projected, then no front logo is assigned as a side photograph');
  const twoTone=createAssortmentCap({...descriptor,rearClothUv:[.42,.32],undersideColor:'#174f42'});
  const twoToneShader={uniforms:{},vertexShader:THREE.ShaderLib.basic.vertexShader,fragmentShader:THREE.ShaderLib.basic.fragmentShader};
  twoTone.children.find(mesh=>mesh.name==='assortment-crown-0').material.onBeforeCompile(twoToneShader,{});
  assert.equal(twoToneShader.uniforms.rearFabricEnabled?.value,1,'Given rear cloth evidence, when projected, then opposite-side fallback uses that rear photo');
  assert.equal(twoTone.getObjectByName('assortment-bill-underside').material.color.getHexString(),'174f42','Given observed green underside, when built, then only the bill underside uses the sampled color');
  assert.ok(twoTone.getObjectByName('assortment-lining-0').material.map,'Given a sampled bill underside color, when built, then the crown lining retains cloth instead of becoming green');
  const columnPhoto={...photo,columns:Array.from({length:65},()=>[.25,.64])};
  const columnCap=createAssortmentCap({...descriptor,front:columnPhoto});
  const columnUvs=columnCap.getObjectByName('assortment-bill').geometry.getAttribute('uv');
  const centerTip=16*41+20;
  assert.ok(columnUvs.getY(centerTip)>1-.64,'Given a raised center free edge in source columns, when mapped, then bill tip samples inside cap rather than global-bottom white floor');
  const frontalPhoto={...photo,crownBottom:.58,columns:Array.from({length:65},()=>[.25,.75])};
  const frontalCap=createAssortmentCap({...descriptor,front:frontalPhoto,rear:{...descriptor.rear,openingTopColumns:Array(65).fill(.50)}});
  assert.ok(frontalCap.getObjectByName('assortment-bill').geometry.getAttribute('uv').getY(centerTip)>=1-.667,'Given frontal photography includes curved bill underside, when mapped, then semantic top-cloth envelope excludes that underside');
  const rearUv=frontalCap.getObjectByName('assortment-crown-3').geometry.getAttribute('capRearUv');
  assert.ok(rearUv.getY(18*13)>1-.50,'Given source rear opening boundary, when the crown lower edge maps, then samples stay above the photographed white opening');
  const asymRear={...descriptor.rear,rows:rows.map((row,index)=>index>60?[.7,.8]:row),openingTopColumns:Array.from({length:65},(_,index)=>index>23&&index<41?.50:.75)};
  const asymCap=createAssortmentCap({...descriptor,rear:asymRear});
  const asymUv=asymCap.getObjectByName('assortment-crown-3').geometry.getAttribute('capRearUv');
  assert.ok(asymUv.getY(18*13)>1-.50,'Given asymmetric buckle-only bottom rows, when rear edge maps, then center remains anchored to the actual central opening rather than tail foreground');
  const {headwearCatalog}=await server.ssrLoadModule('/src/products/caps/assortment-catalog.ts');
  for(const id of ['M26N3ACPB296N','M26N3ACPV016N']){
    const actual=headwearCatalog.find(item=>item.id===id);assert.ok(actual);
    createAssortmentCap(actual).traverse(mesh=>{
      if(!mesh.name.startsWith('assortment-crown-'))return;
      const source=mesh.geometry.getAttribute('capSourcePosition'),uv=mesh.geometry.getAttribute('capRearUv');
      for(let i=0;i<source.count;i++){
        if(source.getZ(i)>-.7)continue;
        const column=THREE.MathUtils.clamp((uv.getX(i)-actual.rear.bounds[0])/(actual.rear.bounds[2]-actual.rear.bounds[0]),0,1)*64;
        const edge=THREE.MathUtils.lerp(actual.rear.openingTopColumns[Math.floor(column)],actual.rear.openingTopColumns[Math.ceil(column)],column%1);
        assert.ok(1-uv.getY(i)<=edge,`${id}: final rear UV at its actual X remains above the photographed opening`);
      }
    });
  }
  for(const [id,limit] of [['M22N3ACP0802N',.620],['M26F3ACPB2766',436/682],['M25N3ACPB915N',418/682],['M26F3ACPB3266',405/682]]){
    const actual=headwearCatalog.find(item=>item.id===id);assert.ok(actual);
    const rebuilt=createAssortmentCap(actual),uv=rebuilt.getObjectByName('assortment-bill').geometry.getAttribute('uv');
    assert.ok(1-uv.getY(centerTip)<=limit,`${id}: actual source center bill tip stays above visually measured upper-cloth boundary`);
  }
  const {batchFixture}=await server.ssrLoadModule('/src/wall-fixtures/surfaces.ts');
  const {mergeFixture}=await server.ssrLoadModule('/src/central-fixtures/parts.ts');
  for(const batch of [batchFixture,mergeFixture]){
    const group=new THREE.Group();
    for(const [i,source]of[cap,fitted,cat,long].entries()){
      const clone=source.clone(true);clone.position.set(i*.4,.7,-.3);clone.rotation.y=.8;group.add(clone);
    }
    const before=orderedSnapshot(group);batch(group);const after=orderedSnapshot(group);
    assert.equal(after.size,before.size,`${batch.name}: all actual cap materials survive`);
    let maximumDelta=0;
    for(const[material,entry]of before){
      const baked=after.get(material);assert.ok(baked);assert.equal(baked.positions.length,entry.positions.length);
      assert.deepEqual(baked.attributes,entry.attributes,`${batch.name}: all directional photo UV/source vertex associations survive`);
      for(let i=0;i<entry.positions.length;i++)maximumDelta=Math.max(maximumDelta,Math.abs(entry.positions[i]-baked.positions[i]));
    }
    assert.ok(maximumDelta<3e-7,`${batch.name}: actual cap geometry survives Float32 baking`);
    results.push({batch:batch.name,maximumDelta,materials:before.size});
  }
  const report={pass:true,size:size.toArray(),curvedMeshes:cap.children.length,fittedMeshes:fitted.children.length,batching:results};
  await mkdir('evidence/headwear-assortment-20260908/cap-builder',{recursive:true});
  await writeFile('evidence/headwear-assortment-20260908/cap-builder/regression.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report));
}finally{THREE.TextureLoader.prototype.load=originalLoad;await server.close();}
