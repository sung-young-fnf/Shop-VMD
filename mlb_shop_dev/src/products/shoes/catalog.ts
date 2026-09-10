import { cadPhotoProfiles } from './cad-photo-profiles';

export type ShoeProduct = {
  readonly sku: string;
  readonly height: number;
  readonly fabric: string;
  readonly sole: string;
  readonly lace: string;
  readonly top: readonly number[];
  readonly seam: readonly number[];
  readonly name?: string;
  readonly family?: string;
  readonly cadUrl?: string;
  readonly referenceSource?: string;
  readonly reconstructionNotes?: string;
  readonly photoViews?: readonly { readonly role: string; readonly label: string; readonly url: string }[];
};

const legacyShoeProducts = [
  { sku: "M26N3ACVSP46N", height: .127, fabric: "#e4e2d5", sole: "#956c46", lace: "#ebe9e0",
    top: [.26,.41,.43,.49,.65,.84,.98,.78,.74,.9,.25],
    seam: [.15,.11,.1,.1,.1,.11,.14,.16,.17,.18,.2] },
  { sku: "M26N3ACVS026N", height: .134, fabric: "#286397", sole: "#705536", lace: "#2c6596",
    top: [.26,.43,.48,.52,.68,.9,.98,.69,.68,.87,.25],
    seam: [.15,.12,.1,.09,.09,.1,.11,.14,.16,.19,.25] },
  { sku: "M25N3ASXD015N", height: .143, fabric: "#e0ded2", sole: "#e0ded6", lace: "#ebe7db",
    top: [.35,.5,.5,.58,.76,.91,.97,.75,.68,.86,.4],
    seam: [.31,.29,.28,.29,.31,.33,.35,.36,.36,.38,.34] },
  { sku: "M25N3ASHVT35N", height: .143, fabric: "#a98d6d", sole: "#e7dac0", lace: "#e9deca",
    top: [.28,.52,.56,.61,.74,.88,.99,.8,.75,.92,.4],
    seam: [.26,.19,.17,.14,.22,.25,.29,.36,.42,.42,.22] },
] as const satisfies readonly ShoeProduct[];

const viewNames = { lateral: '바깥쪽 원본', medial: '안쪽 원본', top: '위쪽 원본', heel: '뒤축 원본', sole: '밑창 원본' };
export const shoeProducts: readonly ShoeProduct[] = cadPhotoProfiles.map(profile => ({
  ...(legacyShoeProducts.find(item => item.sku === profile.sku) ?? legacyShoeProducts[0]),
  sku: profile.sku, name: profile.name, family: profile.family,
  cadUrl: profile.cad, referenceSource: profile.source, reconstructionNotes: profile.notes,
  photoViews: [...Object.entries(profile.views).map(([role, view]) => ({ role, label: viewNames[role as keyof typeof viewNames], url: `products/${view.path}` })), { role: "front", label: "앞코 원본 확대", url: `products/${profile.endcaps.front.path}` }],
}));
