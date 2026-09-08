import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const bytes = await readFile('evidence/headwear-assortment-20260908/discovery.json');
if (createHash('sha256').update(bytes).digest('hex') !== 'd7b8ed4dd82f84d3ec7cbda5ffc57635894b9b368be032d9835b929f1487c088') throw new Error('Gallery ordering changed; manually classify new sheet before publishing');
const entries = JSON.parse(bytes).filter(row => row.assets.length);
// Root visually inspected all 13 CAD/gallery sheets. Each tuple is front, rear, observed side; -1 means unseen.
const roles = [
  [5,6,4],[6,7,5],[6,7,5],[5,6,4],[6,7,5],[6,7,5],
  [6,7,5],[5,6,4],[1,3,-1],[5,6,4],[2,3,1],[6,7,5],
  [1,3,-1],[2,3,1],[2,3,1],[6,7,5],[3,4,2],[5,6,4],
  [3,4,2],[3,4,2],[5,6,4],[3,4,2],[5,6,4],[2,3,1],
  [2,3,1],[5,6,4],[2,3,1],[3,4,2],[5,6,4],[2,3,1],
  [2,3,1],[5,6,4],[4,1,3],[1,3,2],[2,3,1],[2,3,1],
  [2,3,1],[5,6,4],[5,6,4],[5,6,4],[5,6,4],[2,3,1],
  [5,6,4],[5,6,4],[5,6,4],[2,3,1],[6,7,5],[2,3,1],
  [0,4,-1],[5,6,4],[5,6,4],[5,6,4],[5,6,4],[2,3,1],
  [7,0,6],[6,7,5],[5,6,4],[2,3,1],[0,2,-1],[2,3,1],
  [1,3,-1],[1,3,2],[4,6,5],[0,1,-1],[0,1,-1],[2,3,1],
  [2,3,1],[1,3,2],[1,3,2],[2,3,1],[2,3,1],[2,3,1],
  [1,2,-1],[2,3,1],[2,3,1],[2,3,1],
];
if (roles.length !== entries.length) throw new Error('Reference role coverage mismatch');
const styles = new Map([[8,'cat'],[12,'cat-ties'],[24,'visor'],[33,'bucket'],[48,'round'],[58,'cat'],[59,'visor'],[60,'cat'],[61,'bucket-ties'],[62,'bucket'],[63,'round'],[64,'round'],[67,'bucket-ties'],[68,'bucket-ties'],[72,'cat']]);
export const headwearSources = entries.map((entry,index) => ({
  ...entry, roles: roles[index], style: styles.get(index) ?? 'cap',
  fitted: [32,46,54,55].includes(index), flat: [13,46,54].includes(index),
  catEars: index === 19, meshRear: [16,65].includes(index), longEars: index === 74,
  evidence: `intake/sheet-${String(Math.floor(index/6)).padStart(2,'0')}.png`,
  rootSplit: [3,7,18,20,28,49].includes(index) ? .61 : .66,
  priority: index === 58 ? -3 : index === 64 ? -2 : index,
}));
