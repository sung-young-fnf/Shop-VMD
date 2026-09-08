import * as THREE from "three";

const loader = new THREE.TextureLoader();

export function productPhoto(path: string, productId: string): THREE.MeshBasicMaterial {
  const texture = loader.load(`${import.meta.env.BASE_URL}products/${path}`);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  const material = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
  material.userData["referenceProduct"] = true;
  material.userData["productId"] = productId;
  material.userData["photoAppearance"] = true;
  material.userData["representation"] = "Original photograph; captured lighting, not relightable PBR";
  return material;
}
