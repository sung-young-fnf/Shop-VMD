import * as THREE from "three";

export type ShoePhotoRole = "lateral" | "medial" | "top" | "heel" | "sole";
type Sample = readonly [number, number];

function sample(points: readonly Sample[], u: number): number {
  let previous: Sample = points[0] ?? [0, 0];
  for (const point of points) {
    if (point[0] > u) return THREE.MathUtils.lerp(previous[1], point[1], (u - previous[0]) / (point[0] - previous[0]));
    previous = point;
  }
  return previous[1];
}

// Metres inferred from the lateral silhouette; the tongue is a separate thin shell.
const sideHeights = [[0, .028], [.06, .044], [.15, .047], [.25, .056], [.36, .071], [.46, .089], [.55, .100], [.63, .098], [.72, .092], [.8, .094], [.87, .105], [.93, .109], [1, .103]] as const;
const centreHeights = [[0, .028], [.06, .049], [.15, .056], [.25, .067], [.36, .083], [.43, .096], [.5, .088], [.58, .078], [.65, .074], [.69, .070], [.78, .060], [.86, .067], [.93, .093], [1, .103]] as const;
const baseHeights = [[0, .014], [.1, .006], [.25, .001], [.65, 0], [.9, .001], [1, .004]] as const;
// Left shoe in gallery-3, measured in its original 1368 x 1824 coordinate system.
const topCentres = [[0, 505], [.15, 505], [.4, 506], [.7, 518], [1, 541]] as const;
const topSpans = [[0, 13], [.06, 90], [.15, 147], [.25, 166], [.4, 148], [.6, 133], [.72, 137], [.84, 129], [.93, 93], [1, 8]] as const;
const topRows = [[0, 1434], [.15, 1300], [.3, 1115], [.46, 915], [.55, 785], [.6, 715], [.64, 692], [.65, 680], [.66, 640], [.69, 620], [.78, 530], [.86, 445], [.93, 400], [1, 377]] as const;

export function shoeSection(u: number): { readonly base: number; readonly side: number; readonly centre: number; readonly width: number } {
  const toe = Math.sqrt(Math.max(0, 1 - (1 - Math.min(1, u / .16)) ** 2));
  const heel = Math.sqrt(Math.max(0, 1 - (Math.max(0, (u - .82) / .18)) ** 2));
  return {
    base: sample(baseHeights, u), side: sample(sideHeights, u), centre: sample(centreHeights, u),
    width: sample([[0, .046], [.25, .050], [.55, .043], [.8, .039], [1, .039]], u) * toe * heel,
  };
}

export function shoePhotoUv(role: ShoePhotoRole, position: THREE.Vector3, u = THREE.MathUtils.clamp(position.x / .314 + .5, 0, 1)): THREE.Vector2 {
  const projectedU = THREE.MathUtils.clamp(position.x / .314 + .5, 0, 1);
  const section = shoeSection(u);
  const across = section.width > .000001 ? position.z / section.width : 0;
  switch (role) {
    case "lateral": return new THREE.Vector2(Math.max(106, 92 + projectedU * 717) / 899, 1 - (734 - position.y / .314 * 720) / 1200);
    case "medial": return new THREE.Vector2((1220 - projectedU * 1074) / 1368, 1 - (1110 - position.y / .314 * 1080) / 1824);
    case "top": {
      const row = sample(topRows, u), sourceU = (1434 - row) / 1057;
      return new THREE.Vector2((sample(topCentres, sourceU) - THREE.MathUtils.clamp(across / .86, -1, 1) * sample(topSpans, sourceU)) / 1368, 1 - row / 1824);
    }
    case "heel": {
      const top = 655 + 65 * Math.min(1, Math.abs(position.z) / .039) ** 1.4;
      return new THREE.Vector2((482 - position.z / .039 * 185) / 1368, 1 - (1136 - position.y / section.side * (1136 - top)) / 1824);
    }
    case "sole": {
      const top = 760 + 65 * u + 115 * (1 - u) ** 8;
      const bottom = 1050 + 20 * u - 100 * Math.exp(-(((u - .5) / .17) ** 2)) - 50 * (1 - u) ** 8;
      return new THREE.Vector2((180 + u * 1010) / 1368, 1 - ((top + bottom) / 2 - across / .94 * (bottom - top) / 2) / 1824);
    }
    default: return role satisfies never;
  }
}
