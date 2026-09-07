import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const root='C:/Users/AC1143/.codex/skills/img2threejs';
export function forge(script,args=[],log){const r=spawnSync('python',[path.join(root,'forge',script),...args],{encoding:'utf8',env:{...process.env,PYTHONUTF8:'1'}});if(log)fs.writeFileSync(log,r.stdout+'\n'+r.stderr);return {code:r.status,stdout:r.stdout,stderr:r.stderr};}
const spec='object-sculpt-spec.json',state='.img2threejs/state.json';
if(process.argv[2]==='setup'){
 const st=JSON.parse(fs.readFileSync(state));st.artifacts.reference=path.resolve('public/reference/cap-rgba.png');fs.writeFileSync(state,JSON.stringify(st,null,2));
 const items=[['pre-spec-assessment','assessment.json'],['detail-inventory',spec],['projection-route','evidence/projection-route.md'],['spec-authoring',spec],['material-evidence','evidence/material-analysis.json'],['material-spec-wiring',spec],['strict-validation','evidence/generated-blockout.ts'],['build-current-pass','src/createCapModel.ts'],['render-capture','evidence/blockout/reference.png'],['review-contract-read',path.join(root,'grimoire/review/gates_reference.md')]];
 for(const [id,evidence] of items){const r=forge('state.py',['mark',id,'--state',state,'--evidence',evidence]);if(r.code){console.error(r.stderr);process.exit(r.code);}console.log(id);}
}
