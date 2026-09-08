import * as THREE from 'three';
import { pairedClothesCatalog } from '../src/products/clothes/catalog.ts';
import { createGarment } from '../src/products/clothes/index.ts';
import { awaitProductTextures } from '../src/products/loading.ts';

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(512, 640); renderer.setPixelRatio(1);
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.append(renderer.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color('#e8e8e5');
scene.add(new THREE.HemisphereLight('#ffffff', '#a4a2a0', 2.6));
const light = new THREE.DirectionalLight('#ffffff', 3.4); light.position.set(-2, 4, 5); scene.add(light);
const camera = new THREE.PerspectiveCamera(32, 512 / 640, .001, 100);
let product;
window.__CATALOG_QA__ = {
  ids: pairedClothesCatalog.map(item => item.id),
  async render(id, side) {
    if (product?.userData.productId !== id) {
      if (product) {
        scene.remove(product);
        product.traverse(object => {
          if (!object.isMesh) return;
          object.geometry.dispose();
          for (const material of Array.isArray(object.material) ? object.material : [object.material]) { material.map?.dispose(); material.dispose(); }
        });
      }
      product = createGarment(id); scene.add(product); await awaitProductTextures();
    }
    const bounds = new THREE.Box3().setFromObject(product); const center = bounds.getCenter(new THREE.Vector3()); const size = bounds.getSize(new THREE.Vector3());
    const distance = Math.max(size.x / camera.aspect, size.y, size.z) / (2 * Math.tan(THREE.MathUtils.degToRad(16))) * 1.2;
    camera.position.copy(center).add(new THREE.Vector3(0, 0, side === 'rear' ? -distance : distance)); camera.lookAt(center);
    await renderer.compileAsync(scene, camera); renderer.render(scene, camera);
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); renderer.render(scene, camera);
    const meshes = [];
    product.traverse(object => {
      if (!object.isMesh) return;
      meshes.push({ name: object.name, vertices: object.geometry.attributes.position.count, materials: (Array.isArray(object.material) ? object.material : [object.material]).map(material => ({ metadata: material.userData, url: material.map?.image?.src ?? null, width: material.map?.image?.naturalWidth ?? 0, height: material.map?.image?.naturalHeight ?? 0, ready: Boolean(material.map?.image?.complete && material.map.image.naturalWidth) })) });
    });
    return { id, side, metadata: product.userData, size: size.toArray(), meshes, stats: { ...renderer.info.render }, png: renderer.domElement.toDataURL('image/png') };
  },
};
