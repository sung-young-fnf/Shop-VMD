export type CapPhotoView = {
  readonly texture: string;
  readonly bounds: readonly [number, number, number, number];
  readonly crownBottom: number;
  readonly crownTop?: number;
  readonly rows: readonly (readonly [number, number])[];
  readonly columns?: readonly (readonly [number, number])[];
  readonly openingTopColumns?: readonly number[];
};

export type HeadwearPhotos = {
  readonly id: string;
  readonly color: string;
  readonly front: CapPhotoView;
  readonly rear: CapPhotoView;
  readonly side?: CapPhotoView & { readonly hemisphere: 'left' | 'right'; readonly frontAt: 'left' | 'right' };
  readonly clothUv: readonly [number, number];
  readonly rearClothUv?: readonly [number, number];
  readonly cadSource: string | null;
};

export type AssortmentCapDescriptor = HeadwearPhotos & {
  readonly kind: 'cap';
  readonly bill: 'curved' | 'flat';
  readonly rearConstruction: 'adjustable' | 'fitted';
  readonly catEars?: boolean;
  readonly meshRear?: boolean;
  readonly longEars?: boolean;
  readonly undersideColor?: string;
};

export type SoftHeadwearDescriptor = HeadwearPhotos & {
  readonly kind: 'beanie' | 'bucket' | 'visor';
  readonly style: 'round' | 'cat' | 'cat-ties' | 'bucket' | 'bucket-ties' | 'visor';
  readonly width: number;
  readonly height: number;
  readonly depth: number;
  readonly crownFraction: number;
  readonly roof: readonly number[];
};

export type HeadwearDescriptor = AssortmentCapDescriptor | SoftHeadwearDescriptor;
