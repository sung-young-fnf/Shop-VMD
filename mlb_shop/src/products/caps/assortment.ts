import type * as THREE from 'three';
import { headwearCatalog } from './assortment-catalog';
import { createAssortmentCap } from './assortment-cap';
import { createSoftHeadwear } from './soft-headwear';
import { createPhotoCap } from './photo-cap';

const cache=new Map<number,THREE.Group>();

class HeadwearSelectionError extends Error {
  constructor(readonly index: number) { super(`Unknown headwear slot ${index}`); this.name='HeadwearSelectionError'; }
}

export function createHeadwear(index: number): THREE.Group {
  const slot=((Math.trunc(index)%headwearCatalog.length)+headwearCatalog.length)%headwearCatalog.length;
  const existing=cache.get(slot);if(existing)return existing.clone(true);
  const spec=headwearCatalog[slot];if(!spec)throw new HeadwearSelectionError(index);
  const group=(()=>{
    if(spec.id==='M21N3ACP7701N')return createPhotoCap();
    switch(spec.kind){
      case 'cap':return createAssortmentCap(spec);
      case 'beanie':case 'bucket':case 'visor':return createSoftHeadwear(spec);
      default:{const exhaustive:never=spec;throw new HeadwearSelectionError(exhaustive);}
    }
  })();
  cache.set(slot,group);return group.clone(true);
}
