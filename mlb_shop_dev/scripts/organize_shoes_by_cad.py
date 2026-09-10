#!/usr/bin/env python3
"""reference/shoes/*.png (+ shoes-detail/{PRDT_CD}/gallery-*) 를 CAD 형태별로 분류해
reference/shoes_by_cad/{FORM_ID}__{형태명}/ 에 복사한다.

- 원본(shoes/, shoes-detail/)은 건드리지 않는다 (복사만).
- 폴더 구성:
    {FORM}/cad/            ← 도면 JPG(PO_IMG) + SKILL.md (CAD/by_form 에서 복사)
    {FORM}/{PRDT_CD}.png   ← 사진이 1장인 스타일
    {FORM}/{PRDT_CD}/      ← 사진이 2장 이상인 스타일 (대표컷 + gallery 앞뒤/디테일)
- 매핑 근거: CAD/form_index.csv (PART_CD → FORM_ID). PRDT_CD 의 뒤 9자리 = PART_CD.
재실행하면 shoes_by_cad/ 를 지우고 다시 만든다.
"""
import csv, os, re, shutil, glob, collections, json

HERE = os.path.dirname(os.path.abspath(__file__))
DEV = os.path.dirname(HERE)                       # mlb_shop_dev
ROOT = os.path.dirname(DEV)                       # Shop-VMD
CAD = os.path.join(ROOT, 'CAD')
SRC = os.path.join(DEV, 'reference', 'shoes')
DETAIL = os.path.join(DEV, 'reference', 'shoes-detail')
OUT = os.path.join(DEV, 'reference', 'shoes_by_cad')

form_of = {}
form_name = {}
form_rows = collections.defaultdict(list)
for r in csv.DictReader(open(os.path.join(CAD, 'form_index.csv'), encoding='utf-8-sig')):
    form_of[r['PART_CD']] = r['FORM_ID']
    form_name[r['FORM_ID']] = r['FORM_NAME']
    form_rows[r['FORM_ID']].append(r)
cad_idx = {r['PART_CD']: r for r in csv.DictReader(open(os.path.join(CAD, 'cad_index.csv'), encoding='utf-8-sig'))}
sty = {r['PART_CD']: r for r in csv.DictReader(open(os.path.join(CAD, 'styles_91.csv'), encoding='utf-8-sig'))}

def safe(s):
    s = re.sub(r'[\\/:*?"<>|]', '', s)
    s = re.sub(r'\s*[·/]\s*', '-', s)
    s = re.sub(r'\s+', '', s)
    return s.strip('-')

def folder_name(fid):
    base = fid.replace('/', '__')                 # _NEW_미채번/M25… → _NEW_미채번__M25…
    nm = safe(form_name.get(fid, ''))
    return f'{base}__{nm}' if nm else base

# 사진 수집: PRDT_CD → [파일 경로...]
photos = collections.defaultdict(list)
for p in sorted(glob.glob(os.path.join(SRC, '*.png')) + glob.glob(os.path.join(SRC, '*.jpg'))):
    prdt = os.path.splitext(os.path.basename(p))[0]
    photos[prdt].append(p)
for d in sorted(glob.glob(os.path.join(DETAIL, '*'))):
    if os.path.isdir(d):
        prdt = os.path.basename(d)
        for p in sorted(glob.glob(os.path.join(d, '*'))):
            if p.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                photos[prdt].append(p)

if os.path.isdir(OUT):
    shutil.rmtree(OUT)
os.makedirs(OUT)

index_rows, unmatched = [], []
per_form = collections.defaultdict(list)
for prdt, files in sorted(photos.items()):
    part = prdt[-9:]
    fid = form_of.get(part)
    if not fid:
        unmatched.append(prdt)
        continue
    fdir = os.path.join(OUT, folder_name(fid))
    os.makedirs(os.path.join(fdir, 'cad'), exist_ok=True)
    if len(files) == 1:
        dst = os.path.join(fdir, os.path.basename(files[0]))
        shutil.copy2(files[0], dst)
        rel = [os.path.relpath(dst, OUT)]
    else:
        sub = os.path.join(fdir, prdt)
        os.makedirs(sub, exist_ok=True)
        rel = []
        for p in files:
            # 대표컷은 원래 이름, 갤러리는 gallery-N 유지
            name = os.path.basename(p)
            dst = os.path.join(sub, name)
            shutil.copy2(p, dst)
            rel.append(os.path.relpath(dst, OUT))
    per_form[fid].append((prdt, part, len(files)))
    index_rows.append(dict(PRDT_CD=prdt, PART_CD=part, FORM_ID=fid, FORM_DIR=folder_name(fid),
                           PRDT_NM=sty.get(part, {}).get('PRDT_NM', ''), PHOTOS=len(files),
                           LAYOUT='folder' if len(files) > 1 else 'file', FILES=';'.join(rel)))

# CAD 도면 + SKILL.md 복사 (형태별). 사진이 없는 스타일의 도면도 함께 넣는다.
for fid, rows in form_rows.items():
    fdir = os.path.join(OUT, folder_name(fid))
    cdir = os.path.join(fdir, 'cad')
    os.makedirs(cdir, exist_ok=True)
    skill = os.path.join(CAD, 'by_form', fid, 'SKILL.md')
    if os.path.exists(skill):
        shutil.copy2(skill, os.path.join(cdir, 'SKILL.md'))
    for r in rows:
        f = cad_idx[r['PART_CD']]['FILE']
        src = os.path.join(CAD, f)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(cdir, os.path.basename(src)))

# 형태별 README
for fid, rows in form_rows.items():
    fdir = os.path.join(OUT, folder_name(fid))
    L = [f'# {form_name.get(fid, fid)} — `{fid}`', '',
         '| PRDT_CD | PART_CD | 상품명 | 사진 | 위치 |', '|---|---|---|---:|---|']
    have = {p: (n) for p, _, n in per_form.get(fid, [])}
    for r in sorted(rows, key=lambda r: r['PART_CD']):
        part = r['PART_CD']; prdt = sty[part]['PRDT_CD']
        n = have.get(prdt, 0)
        loc = f'`{prdt}/`' if n > 1 else (f'`{prdt}.png`' if n == 1 else '사진 없음')
        L.append(f'| `{prdt}` | `{part}` | {sty[part]["PRDT_NM"].strip()} | {n} | {loc} |')
    L += ['', f'도면·SKILL.md: `cad/` (원본 `CAD/by_form/{fid}/`, 고해상도는 원본 폴더 `hires/`)', '']
    with open(os.path.join(fdir, 'README.md'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(L))

with open(os.path.join(OUT, 'index.csv'), 'w', newline='', encoding='utf-8') as f:
    w = csv.DictWriter(f, fieldnames=list(index_rows[0].keys())); w.writeheader(); w.writerows(index_rows)

R = ['# shoes_by_cad — 매장 신발 사진을 CAD 형태별로 분류', '',
     f'원본 `reference/shoes/`({sum(1 for v in photos.values())} 스타일) + `reference/shoes-detail/`(다각도 갤러리) 를 복사해 CAD 형태 {len(form_rows)}개 폴더로 나눴다. 원본은 그대로 있다.',
     '매핑: `CAD/form_index.csv` (PART_CD → 라스트_아웃솔 형태). 생성: `python3 scripts/organize_shoes_by_cad.py`', '',
     '```', '{형태ID}__{형태명}/', '  README.md          스타일 목록', '  cad/               도면 JPG + SKILL.md',
     '  {PRDT_CD}.png      사진 1장인 스타일', '  {PRDT_CD}/         사진 2장 이상 (대표컷 + gallery-N 앞뒤·디테일)', '```', '',
     '| 폴더 | 형태명 | 스타일 | 사진 | 다각도 폴더 |', '|---|---|---:|---:|---|']
for fid in sorted(form_rows, key=lambda x: (x.startswith('_'), x)):
    lst = per_form.get(fid, [])
    multi = [p for p, _, n in lst if n > 1]
    R.append(f'| [`{folder_name(fid)}`]({folder_name(fid)}/README.md) | {form_name.get(fid, "")} | {len(form_rows[fid])} | {sum(n for _, _, n in lst)} | {", ".join(multi) or ""} |')
if unmatched:
    R += ['', '## 형태 매핑 실패 (form_index 에 없는 코드)', ''] + [f'- `{u}`' for u in unmatched]
with open(os.path.join(OUT, 'README.md'), 'w', encoding='utf-8') as f:
    f.write('\n'.join(R) + '\n')

print(f'forms={len(form_rows)} styles_with_photo={len(index_rows)} multi={[r["PRDT_CD"] for r in index_rows if r["PHOTOS"]>1]} unmatched={unmatched}')
