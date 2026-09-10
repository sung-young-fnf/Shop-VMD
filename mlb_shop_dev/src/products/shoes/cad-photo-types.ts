export type RegisteredView = {
  readonly path: string;
  readonly width: number;
  readonly height: number;
  readonly start: number;
  readonly end: number;
  readonly low: readonly number[];
  readonly high: readonly number[];
};

export type CadPhotoProfile = {
  readonly sku: string;
  readonly name: string;
  readonly family: string;
  readonly length: number;
  readonly cad: string;
  readonly source: string;
  readonly topRegistration?: readonly (readonly [number, number])[];
  readonly views: Readonly<Record<'lateral' | 'medial' | 'top' | 'sole' | 'heel', RegisteredView>>;
  readonly notes: string;
  readonly endcaps: {
    readonly upperHeelU: number;
    readonly upperBodyRows?: readonly (readonly [number, number])[];
    readonly sideLowerRows?: Readonly<Record<'lateral' | 'medial', readonly (readonly [number, number])[]>>;
    readonly topHeelBodyY: number;
    readonly topUpperHeelRows: readonly (readonly [number, number, number])[];
    readonly sideGroundY: number;
    readonly sideCollarCrestPx: readonly [number, number];
    readonly sideUpperBackPx: readonly [number, number];
    readonly front: {
      readonly path: string;
      readonly width: number;
      readonly height: number;
      readonly quad: readonly (readonly [number, number])[];
      readonly apexAcross: number;
    };
    readonly heel: {
      readonly path: string;
      readonly width: number;
      readonly height: number;
      readonly centerX: number;
      readonly groundY: number;
      readonly bodyTopY: number;
      readonly outlineRows: readonly (readonly [number, number, number])[];
      readonly pixelsPerShoeLengthX: number;
      readonly pixelsPerShoeLengthY: number;
    };
  };
};
