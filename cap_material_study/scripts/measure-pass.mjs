import {spawn} from 'node:child_process';import fs from 'node:fs';import {forge} from './pipeline.mjs';
const pass=process.argv[2];if(!pass)throw new Error('Pass required');const dir=`evidence/${pass}`,spec='object-sculpt-spec.json',state='.img2threejs/state.json';fs.mkdirSync(dir,{recursive:true});
function mark(id,evidence){const r=forge('state.py',['mark',id,'--state',state,'--evidence',evidence]);if(r.code)throw new Error(r.stderr);}
function asyncForge(name,args,out){return new Promise((resolve,reject)=>{const child=spawn('python',[`C:/Users/AC1143/.codex/skills/img2threejs/forge/${name}`,...args],{env:{...process.env,PYTHONUTF8:'1'}});let stdout='',stderr='';child.stdout.on('data',d=>stdout+=d);child.stderr.on('data',d=>stderr+=d);child.on('error',reject);child.on('close',code=>{fs.writeFileSync(out,stdout);if(stderr)fs.writeFileSync(out+'.log',stderr);resolve({name,code,stdout});});});}
const st=JSON.parse(fs.readFileSync(state));if(st.currentStep==='build-current-pass'){mark('build-current-pass','src/createCapModel.ts');mark('render-capture',`${dir}/reference.png`);mark('review-contract-read','C:/Users/AC1143/.codex/skills/img2threejs/grimoire/review/gates_reference.md');}
const diag=['--reference','public/reference/cap-object.png','--render',`${dir}/reference.png`,'--spec',spec,'--pass-id',pass,'--in-place','--json'];if(pass==='blockout')diag.push('--map-stripped-render',`${dir}/reference.png`);
const jobs=await Promise.all([
 asyncForge('stage4_review/diagnose_render.py',diag,`${dir}/tier1.json`),
 asyncForge('stage4_review/diagnose_render_multi_angle.py',['--reference',`${dir}/reference.png`,'--orbit',`${dir}/right.png`,'--orbit',`${dir}/rear.png`,'--json'],`${dir}/multi-angle.json`),
 asyncForge('stage4_review/turntable_gate.py',['--capture',`0=${dir}/front.png`,'--capture',`90=${dir}/right.png`,'--capture',`180=${dir}/rear.png`,'--capture',`270=${dir}/left.png`,'--json'],`${dir}/turntable.json`),
 asyncForge('stage4_review/interior_difference.py',['public/reference/cap-rgba.png',`${dir}/reference.png`,'--json'],`${dir}/interior.json`),
]);for(const job of jobs)console.log(job.name,job.code);
if(!JSON.parse(jobs[0].stdout).passed)throw new Error('Tier1 blocked');
if(JSON.parse(jobs[1].stdout).degenerate)throw new Error('Degenerate orbit');
mark('tier1-diagnostics',`${dir}/tier1.json`);mark('multi-angle-review',`${dir}/multi-angle.json`);
const check=forge('stage3_build/orchestrate_passes.py',['check',spec,'--pass-id',pass],`${dir}/pass-check.txt`);if(check.code)throw new Error(check.stdout+check.stderr);mark('pass-gate-check',`${dir}/pass-check.txt`);
const comparison=forge('stage4_review/make_comparison_sheet.py',['--reference','public/reference/cap-rgba.png','--render',`${dir}/reference.png`,'--out',`${dir}/comparison.png`,'--json']);if(comparison.code)throw new Error(comparison.stderr);console.log('Ready for agent visual review',pass);
