import * as THREE from 'three';
import { createCapModel } from './createCapModel';
import { createStudio } from './studio';
import './style.css';

function element(id: string): HTMLElement {
  const node = document.getElementById(id);
  if (!node) throw new ReferenceError(`Missing UI element: ${id}`);
  return node;
}
const status = element('status');
try {
  const query = new URLSearchParams(location.search);
  const capture = query.get('capture') === '1';
  document.body.classList.toggle('capture', capture);
  const stages = ['blockout', 'structural-pass', 'form-refinement', 'material-pass', 'surface-pass', 'lighting-pass', 'interaction-pass', 'optimization-pass'];
  const requestedPass = query.get('pass') ?? 'blockout';
  const pass = stages.includes(requestedPass) ? requestedPass : 'blockout';
  const variant = query.get('variant') === 'image' ? 'image' : 'procedural';
  const model = createCapModel(pass, capture ? variant : 'procedural');
  const studio = createStudio(element('studio'), model, capture);
  const viewers = [{ model, ...studio }];
  if (!capture) {
    const imageModel = createCapModel(pass, 'image');
    viewers.push({ model: imageModel, ...createStudio(element('studio-image'), imageModel, false) });
  }
  let syncing = false;
  for (const source of viewers) source.controls.addEventListener('change', () => {
    if (syncing) return;
    syncing = true;
    for (const target of viewers) {
      if (target === source) continue;
      target.camera.position.copy(source.camera.position);
      target.camera.quaternion.copy(source.camera.quaternion);
      target.camera.zoom = source.camera.zoom;
      target.controls.target.copy(source.controls.target);
      target.camera.updateProjectionMatrix();
      target.controls.update();
      target.invalidate();
    }
    syncing = false;
  });
  const assemblies = viewers.flatMap(viewer => viewer.model.children.filter(child => child instanceof THREE.Group && child.userData['explodeWithParent'] !== true));
  const positions = new Map(assemblies.map(child => [child, child.position.clone()]));
  const materialDefaults = new Map<THREE.MeshStandardMaterial, { readonly bump: number; readonly normal: THREE.Vector2 }>();
  for (const viewer of viewers) viewer.model.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return;
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      if (material instanceof THREE.MeshStandardMaterial && !materialDefaults.has(material)) {
        materialDefaults.set(material, { bump: material.bumpScale, normal: material.normalScale.clone() });
      }
    }
  });
  const partSelect = element('part');
  for (const part of assemblies.filter(part => part.parent === model)) {
    const option = document.createElement('option');
    option.value = part.name;
    option.textContent = typeof part.userData['label'] === 'string' ? part.userData['label'] : part.name;
    partSelect.append(option);
  }
  const selections = new Map<THREE.Scene, THREE.BoxHelper>();
  function selectPart(name: string) {
    for (const [scene, selection] of selections) { scene.remove(selection); selection.geometry.dispose(); selection.material.dispose(); }
    selections.clear();
    const part = name ? model.getObjectByName(name) : undefined;
    for (const viewer of viewers) {
      const selected = name ? viewer.model.getObjectByName(name) : undefined;
      if (selected) { const helper = new THREE.BoxHelper(selected, 0x233b54); viewer.scene.add(helper); selections.set(viewer.scene, helper); }
    }
    if (partSelect instanceof HTMLSelectElement) partSelect.value = name;
    element('part-status').textContent = part ? `${String(part.userData['label'] ?? part.name)} 선택됨` : '전체 부품';
    viewers.forEach(viewer => viewer.invalidate());
  }
  function setExplode(amount: number) {
    const clamped = THREE.MathUtils.clamp(amount, 0, 1);
    for (const viewer of viewers) { const floor = viewer.scene.getObjectByName('studio-floor'); if (floor) floor.visible = !capture && clamped === 0; }
    assemblies.forEach((part, index) => {
      const origin = positions.get(part);
      if (!origin) return;
      const direction = part.userData['explodeDirection'];
      const offset = direction instanceof THREE.Vector3 ? direction : new THREE.Vector3(Math.sin(index * 2.4) * 0.5, 0.35 + index * 0.14, Math.cos(index * 2.4) * 0.5);
      part.position.copy(origin).addScaledVector(offset, clamped);
    });
    selections.forEach(selection => selection.update());
    viewers.forEach(viewer => viewer.invalidate());
  }
  function setTexture(strength: number) {
    for (const [material, original] of materialDefaults) {
      material.bumpScale = original.bump * strength;
      material.normalScale.copy(original.normal).multiplyScalar(strength);
    }
    viewers.forEach(viewer => viewer.invalidate());
  }
  function pressed(group: string, key: string, value: string) {
    for (const button of element(group).querySelectorAll('button')) button.setAttribute('aria-pressed', String(button.dataset[key] === value));
  }
  function setView(name: string) { viewers.forEach(viewer => viewer.setView(name)); pressed('views', 'view', name); }
  function setLight(name: string) { viewers.forEach(viewer => viewer.setLight(name)); pressed('lights', 'light', name); }
  for (const button of element('views').querySelectorAll('button')) button.addEventListener('click', () => setView(button.dataset['view'] ?? 'reference'));
  for (const button of element('lights').querySelectorAll('button')) button.addEventListener('click', () => setLight(button.dataset['light'] ?? 'neutral'));
  function range(id: string, outputId: string, suffix: string, change: (value: number) => void) {
    const control = element(id);
    control.addEventListener('input', () => {
      if (!(control instanceof HTMLInputElement)) return;
      element(outputId).textContent = `${control.value}${suffix}`;
      change(control.valueAsNumber);
    });
  }
  range('light-angle', 'angle-value', '°', value => viewers.forEach(viewer => viewer.setLightAngle(value)));
  range('texture', 'texture-value', '%', value => setTexture(value / 100));
  range('explode', 'explode-value', '%', value => setExplode(value / 100));
  partSelect.addEventListener('change', () => { if (partSelect instanceof HTMLSelectElement) selectPart(partSelect.value); });
  const rotate = element('rotate');
  rotate.addEventListener('change', () => { if (rotate instanceof HTMLInputElement) studio.setRotate(rotate.checked); });
  element('restore').addEventListener('click', () => {
    studio.setRotate(false);
    if (rotate instanceof HTMLInputElement) rotate.checked = false;
    setView('reference'); setLight('neutral'); setExplode(0); setTexture(1); selectPart('');
    for (const [id, value, output, text] of [['light-angle', '-35', 'angle-value', '−35°'], ['texture', '100', 'texture-value', '100%'], ['explode', '0', 'explode-value', '0%']]) {
      if (!id || !value || !output || !text) continue;
      const input = element(id);
      if (input instanceof HTMLInputElement) input.value = value;
      element(output).textContent = text;
    }
  });
  for (const viewer of viewers) {
    const canvas = viewer.renderer.domElement;
    const start = new THREE.Vector2();
    canvas.addEventListener('pointerdown', event => start.set(event.clientX, event.clientY));
    canvas.addEventListener('pointerup', event => {
      if (start.distanceTo(new THREE.Vector2(event.clientX, event.clientY)) > 5) return;
      const bounds = canvas.getBoundingClientRect();
      const pointer = new THREE.Vector2((event.clientX - bounds.left) / bounds.width * 2 - 1, 1 - (event.clientY - bounds.top) / bounds.height * 2);
      const ray = new THREE.Raycaster();
      ray.setFromCamera(pointer, viewer.camera);
      let hit = ray.intersectObject(viewer.model, true)[0]?.object;
      while (hit && hit.parent !== viewer.model) hit = hit.parent ?? undefined;
      selectPart(hit?.name ?? '');
    });
  }
  THREE.DefaultLoadingManager.onLoad = () => viewers.forEach(viewer => viewer.invalidate());
  Object.assign(window, { capStudy: { model, ...studio, viewers, setView, setLight, setExplode, setTexture, selectPart, ready: true, pass, variant: capture ? variant : 'comparison' } });
  status.textContent = '';
  THREE.DefaultLoadingManager.onLoad = () => { for (const viewer of viewers) viewer.invalidate(); };
  THREE.DefaultLoadingManager.onError = url => { status.textContent = `재질 파일을 불러오지 못했습니다: ${url}`; };
} catch (error) {
  status.textContent = error instanceof Error ? `3D 뷰어 오류: ${error.message}` : '3D 뷰어를 시작하지 못했습니다.';
  throw error;
}
