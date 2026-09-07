import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createStudio(host: HTMLElement, model: THREE.Group, capture: boolean) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(capture ? '#ffffff' : '#eeede9');
  scene.add(model);
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: capture });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute('aria-label', '드래그로 회전하는 네이비 볼캡 3D 모델');
  host.append(renderer.domElement);
  const camera = new THREE.OrthographicCamera(-2, 2, 2, -2, 0.05, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = false;
  controls.minZoom = 0.6;
  controls.maxZoom = 5;
  controls.autoRotateSpeed = 1.2;
  const ambient = new THREE.HemisphereLight(0xffffff, 0x79756f, 2.0);
  const key = new THREE.DirectionalLight(0xffffff, 3.2);
  key.position.set(-3, 5, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 0.1, far: 20 });
  key.shadow.normalBias = 0.012;
  const fill = new THREE.DirectionalLight(0xe6eeff, 1.0);
  fill.position.set(4, 2, -3);
  scene.add(ambient, key, fill);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 0.12 }));
  floor.rotation.x = -Math.PI / 2;
  floor.name = 'studio-floor';
  floor.position.y = new THREE.Box3().setFromObject(model).min.y - 0.002;
  floor.receiveShadow = true;
  floor.visible = !capture;
  scene.add(floor);
  let queued = false;
  let rotating = false;
  const frameTimes: number[] = [];
  function render() {
    queued = false;
    const start = performance.now();
    if (rotating) controls.update();
    renderer.render(scene, camera);
    frameTimes.push(performance.now() - start);
    if (frameTimes.length > 240) frameTimes.shift();
    if (rotating) invalidate();
  }
  function invalidate() {
    if (!queued) { queued = true; requestAnimationFrame(render); }
  }
  function resize() {
    const width = host.clientWidth;
    const height = host.clientHeight;
    const aspect = width / height;
    const halfHeight = capture ? 2.05 : Math.max(1.65, 1.7 / aspect);
    camera.left = -halfHeight * aspect;
    camera.right = halfHeight * aspect;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    invalidate();
  }
  function setView(name: string) {
    controls.target.set(-0.037, 0.432, 0.406);
    camera.zoom = 1;
    switch (name) {
      case 'front': camera.position.set(0, 1.2, 6); break;
      case 'rear': camera.position.set(0, 1.2, -6); break;
      case 'right': camera.position.set(6, 1.2, 0.3); break;
      case 'left': camera.position.set(-6, 1.2, 0.3); break;
      case 'closeup': case 'material-closeup':
        camera.position.set(2.3, 1.9, 4.5); controls.target.set(0.25, 0.85, 0.85); camera.zoom = 2.6; break;
      default: camera.position.set(2.95, 1.782, 5.241152); camera.zoom = 0.935;
    }
    camera.updateProjectionMatrix();
    controls.update();
    invalidate();
  }
  const litMaterials = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>();
  function setUnlit(enabled: boolean) {
    if (enabled && litMaterials.size === 0) model.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return;
      litMaterials.set(object, object.material);
      const originals = Array.isArray(object.material) ? object.material : [object.material];
      const materials = originals.map(material => material instanceof THREE.MeshStandardMaterial ? new THREE.MeshBasicMaterial({ color: material.color, map: material.map, side: material.side }) : material);
      object.material = Array.isArray(object.material) ? materials : materials[0] ?? object.material;
    });
    if (!enabled) { for (const [mesh, original] of litMaterials) { const current = Array.isArray(mesh.material) ? mesh.material : [mesh.material]; for (const material of current) if (material instanceof THREE.MeshBasicMaterial) material.dispose(); mesh.material = original; } litMaterials.clear(); }
    invalidate();
  }
  function setLight(name: string) {
    setUnlit(name === 'albedo');
    if (name === 'albedo') return;
    switch (name) {
      case 'grazing': key.position.set(-5, 1.1, 2.5); key.intensity = 4; ambient.intensity = 1.0; fill.intensity = 0.45; break;
      case 'reference': key.position.set(-3, 5, 5); key.intensity = 3.5; ambient.intensity = 2.1; fill.intensity = 0.7; break;
      default: key.position.set(-3, 5, 4); key.intensity = 3.2; ambient.intensity = 2; fill.intensity = 1;
    }
    invalidate();
  }
  function setLightAngle(degrees: number) {
    const radians = THREE.MathUtils.degToRad(degrees);
    key.position.x = Math.sin(radians) * 5;
    key.position.z = Math.cos(radians) * 5;
    invalidate();
  }
  function setRotate(enabled: boolean) { rotating = enabled; controls.autoRotate = enabled; invalidate(); }
  controls.addEventListener('change', invalidate);
  new ResizeObserver(resize).observe(host);
  THREE.DefaultLoadingManager.onLoad = invalidate;
  setView('reference');
  resize();
  return { scene, camera, renderer, controls, setView, setLight, setLightAngle, setRotate, invalidate, frameTimes };
}
