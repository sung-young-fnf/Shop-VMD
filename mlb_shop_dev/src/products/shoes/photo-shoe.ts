import * as THREE from "three";
import { productPhoto } from "../photo-material";
import type { ShoeProduct } from "./catalog";
import { createShoeSurfaces } from "./photo-shoe-geometry";
import { blendShoePanels } from "./photo-shoe-blend";
import { createShoeTongue } from "./photo-shoe-tongue";

export function createPhotoShoe(product: ShoeProduct): THREE.Group {
  const group = new THREE.Group();
  group.name = `shoe-${product.sku}`;
  group.userData["productId"] = product.sku;
  group.userData["productSku"] = product.sku;
  group.userData["representation"] = "Photo-textured continuous shoe surface; original lateral, medial, top, heel and sole photographs";
  group.userData["inferredSurfaces"] = "Cross-section width and curvature, central tongue and shallow photographed collar cavity; captured lighting, not a scan";
  const materials = {
    lateral: productPhoto(`shoes/${product.sku}-lateral.png`, product.sku), medial: productPhoto(`shoes/${product.sku}-medial.jpg`, product.sku),
    top: productPhoto(`shoes/${product.sku}-top.jpg`, product.sku), heel: productPhoto(`shoes/${product.sku}-heel.jpg`, product.sku), sole: productPhoto(`shoes/${product.sku}-sole.jpg`, product.sku),
  };
  blendShoePanels(materials);
  for (const { role, geometry } of createShoeSurfaces()) {
    const mesh = new THREE.Mesh(geometry, materials[role]);
    mesh.name = `photo-${role}-continuous-surface`;
    mesh.castShadow = true;
    group.add(mesh);
  }
  const tongue = createShoeTongue();
  for (const [role, geometry] of Object.entries(tongue)) {
    const mesh = new THREE.Mesh(geometry, materials.top);
    mesh.name = `photo-thin-tongue-${role}`;
    mesh.castShadow = true;
    group.add(mesh);
  }
  return group;
}
