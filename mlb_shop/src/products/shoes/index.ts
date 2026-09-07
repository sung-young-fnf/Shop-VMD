import * as THREE from "three";
import { shoeProducts, type ShoeProduct } from "./catalog";
import { cavityGeometry, collarGeometry, laceGeometry, shoeLoft } from "./geometry";

const prototypes = new Map<string, THREE.Group>();
const loader = new THREE.TextureLoader();

function material(color: string, roughness: number, map?: THREE.Texture): THREE.MeshStandardMaterial {
  const result = new THREE.MeshStandardMaterial({ color: map ? "#ffffff" : color, roughness, metalness: 0, ...(map ? { map } : {}) });
  if (map) {
    result.onBeforeCompile = (shader) => {
      shader.uniforms["shoeUndercoat"] = { value: new THREE.Color(color) };
      shader.fragmentShader = `uniform vec3 shoeUndercoat;\n${shader.fragmentShader}`.replace(
        "#include <map_fragment>",
        "vec4 shoePhoto = texture2D(map, vMapUv); diffuseColor.rgb *= mix(shoeUndercoat, shoePhoto.rgb, shoePhoto.a);",
      );
    };
    result.customProgramCacheKey = () => "shoe-opaque-reference-undercoat-v1";
    result.userData["referenceAlphaMode"] = "photo coverage over opaque physical undercoat";
  }
  result.userData["referenceProduct"] = true;
  result.userData["merchandiseFabric"] = true;
  return result;
}

function buildShoe(product: ShoeProduct): THREE.Group {
  const group = new THREE.Group();
  group.name = `shoe-${product.sku}`;
  group.userData["productSku"] = product.sku;
  group.userData["productId"] = product.sku;
  group.userData["referenceSource"] = `reference/shoes/${product.sku}.png`;
  group.userData["inferredSurfaces"] = "medial side, width, top, interior and underside";
  const texture = loader.load(`${import.meta.env.BASE_URL}products/shoes/${product.sku}.png`);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  const reference = material(product.fabric, .83, texture);
  const soleReference = material(product.sole, .89, texture);
  const fabric = material(product.fabric, .83);
  const rubber = material(product.sole, .89);
  const lace = material(product.lace, .92);
  for (const surface of [reference, soleReference, fabric, rubber, lace]) surface.userData["productId"] = product.sku;
  const upper = new THREE.Mesh(shoeLoft(product, false), [reference, fabric]);
  upper.name = "upper-reference-lateral-inferred-medial";
  const outsole = new THREE.Mesh(shoeLoft(product, true), [soleReference, rubber]);
  outsole.name = "rubber-outsole";
  group.add(upper, outsole);
  for (let i = 0; i < 6; i++) {
    const crossing = new THREE.Mesh(laceGeometry(product, i), lace);
    crossing.name = `lace-crossing-${i}`;
    crossing.userData["explodeWithParent"] = true;
    upper.add(crossing);
  }
  const lining = material("#47443e", .98);
  lining.side = THREE.DoubleSide;
  lining.userData["productId"] = product.sku;
  const insole = new THREE.Mesh(cavityGeometry(product), lining);
  insole.name = "continuous-collar-lining-and-sealed-floor";
  group.add(insole);
  const collar = new THREE.Mesh(collarGeometry(product), lace);
  collar.name = "padded-collar-rim";
  group.add(collar);
  group.traverse((part) => { if (part instanceof THREE.Mesh) { part.castShadow = true; part.receiveShadow = true; } });
  return group;
}

export function createShoe(index: number): THREE.Group {
  const product = shoeProducts[((Math.trunc(index) % shoeProducts.length) + shoeProducts.length) % shoeProducts.length] ?? shoeProducts[0];
  let prototype = prototypes.get(product.sku);
  if (!prototype) {
    prototype = buildShoe(product);
    prototypes.set(product.sku, prototype);
  }
  return prototype.clone(true);
}
