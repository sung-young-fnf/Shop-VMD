import fs from 'node:fs';import {forge} from './pipeline.mjs';
const pass=process.argv[2],dir=`evidence/${pass}`,review=JSON.parse(fs.readFileSync(`${dir}/vision-review.json`,'utf8'));
const args=['object-sculpt-spec.json','--pass-id',pass,'--fidelity',String(review.score),'--action',review.action,'--summary',review.summary,'--render-screenshot',`${dir}/reference.png`,'--reference-screenshot','public/reference/cap-rgba.png','--comparison-image',`${dir}/comparison.png`,'--ai-vision-score',String(review.score),'--layer-scores-json',JSON.stringify(review.layers),'--feature-reviews-json',JSON.stringify(review.features),'--review-viewpoints-json',JSON.stringify(['front','three-quarter','side','thickness-axis','long-axis']),'--require-screenshot-files','--in-place'];if(pass==='blockout')args.push('--map-stripped-render',`${dir}/reference.png`);
let r=forge('stage4_review/append_review.py',args,`${dir}/review-command.txt`);console.log(r.stdout,r.stderr);if(r.code)process.exit(r.code);
r=forge('state.py',['mark','ai-review-recorded','--state','.img2threejs/state.json','--evidence',`${dir}/vision-review.json`]);if(r.code)throw new Error(r.stderr);
r=forge('stage3_build/orchestrate_passes.py',['sync','object-sculpt-spec.json','--in-place']);console.log(r.stdout);
r=forge('state.py',['mark','pipeline-sync','--state','.img2threejs/state.json','--evidence','object-sculpt-spec.json']);console.log(r.stdout,r.stderr);
r=forge('next.py',['--state','.img2threejs/state.json','object-sculpt-spec.json']);console.log(r.stdout,r.stderr);
