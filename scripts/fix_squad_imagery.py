import json
import os

with open('khiladi/data/rr_squad_2026.json', 'r', encoding='utf-8') as f:
    squad = json.load(f)

cutout_dir = 'khiladi/frontend/public/assets/cutouts'
cutout_files = os.listdir(cutout_dir)

print(f'Total cutout files: {len(cutout_files)}')

file_by_id = {}
for f_name in cutout_files:
    parts = f_name.split('_')
    if len(parts) >= 2 and parts[0].isdigit():
        pid = int(parts[0])
        file_by_id[pid] = f_name

matched = 0
unmatched = []
for p in squad:
    pid = p['player_id']
    if pid in file_by_id:
        p['cutout_url'] = f'/assets/cutouts/{file_by_id[pid]}'
        p['portrait_url'] = f'/assets/portraits/{file_by_id[pid].replace("_cutout", "")}'
        matched += 1
    else:
        slug = p['player_name'].lower().replace(' ', '-')
        found = next((cf for cf in cutout_files if slug in cf), None)
        if found:
            p['cutout_url'] = f'/assets/cutouts/{found}'
            p['portrait_url'] = f'/assets/portraits/{found.replace("_cutout", "")}'
            matched += 1
        else:
            unmatched.append(p)

print(f'Successfully matched cutouts: {matched} / {len(squad)}')
for u in unmatched:
    print(f'  Unmatched: {u["player_name"]} (ID: {u["player_id"]})')

with open('khiladi/data/rr_squad_2026.json', 'w', encoding='utf-8') as f:
    json.dump(squad, f, indent=2)

with open('khiladi/frontend/public/data/rr_squad_2026.json', 'w', encoding='utf-8') as f:
    json.dump(squad, f, indent=2)

# Also update player_database.json
with open('khiladi/data/player_database.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

for p in db:
    pid = p['player_id']
    if pid in file_by_id:
        p['cutout_url'] = f'/assets/cutouts/{file_by_id[pid]}'
        p['portrait_url'] = f'/assets/portraits/{file_by_id[pid].replace("_cutout", "")}'

with open('khiladi/data/player_database.json', 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2)

with open('khiladi/frontend/public/data/player_database.json', 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2)

# Also update top_10_batters and top_10_bowlers
for fname in ['top_10_batters.json', 'top_10_bowlers.json']:
    path = f'khiladi/data/{fname}'
    with open(path, 'r', encoding='utf-8') as f:
        t_data = json.load(f)
    for p in t_data:
        pid = p['player_id']
        if pid in file_by_id:
            p['cutout_url'] = f'/assets/cutouts/{file_by_id[pid]}'
            p['portrait_url'] = f'/assets/portraits/{file_by_id[pid].replace("_cutout", "")}'
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(t_data, f, indent=2)
    with open(f'khiladi/frontend/public/data/{fname}', 'w', encoding='utf-8') as f:
        json.dump(t_data, f, indent=2)

print('All data files updated successfully!')
