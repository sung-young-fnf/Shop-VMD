import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const directory='evidence/unique-clothing-20260908';
const sources=JSON.parse(await readFile(`${directory}/sources.json`,'utf8'));
const hashes=new Set();
let deliveryBytes=0;
for(const source of sources){
  if(!source.verification.humanFree || !source.verification.frontRearConfirmed) throw new Error(`Unverified ${source.id}`);
  for(const role of ['front','rear']){
    const original=source[role];
    for(const asset of [original,original.delivery]){
      const bytes=await readFile(asset.path);
      if(createHash('sha256').update(bytes).digest('hex')!==asset.sha256) throw new Error(`Hash mismatch ${asset.path}`);
    }
    if(hashes.has(original.sha256)) throw new Error(`Repeated photograph ${source.id}/${role}`);
    hashes.add(original.sha256);
    if(original.delivery.width!==512) throw new Error(`Wrong delivery size ${source.id}`);
    deliveryBytes+=original.delivery.bytes;
  }
}
if(new Set(sources.map(source=>source.id)).size!==sources.length) throw new Error('Repeated SKU');
const report={status:'pass',checkedAt:new Date().toISOString(),uniqueSkus:sources.length,uniqueOriginalPhotographs:hashes.size,allOriginalAndDeliveryHashesMatch:true,allDeliveryWidths:512,deliveryBytes,deliveryMiB:deliveryBytes/1048576,visualEvidence:'gallery-sheet-00.png through gallery-sheet-19.png; manually inspected by clothing-sources agent',scope:'Source verification only; geometry and store rendering require separate integration QA.'};
await writeFile(`${directory}/source-check.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
