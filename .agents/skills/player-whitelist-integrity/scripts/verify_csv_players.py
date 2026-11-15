#!/usr/bin/env python3
"""Check player IDs in one derived CSV against official mapping CSV from the pack.
Usage: python verify_csv_players.py path/to/mapping.csv path/to/export.csv [id_col]
"""
import csv,sys
from pathlib import Path
if len(sys.argv)<3:raise SystemExit('Usage: verify_csv_players.py <mapping.csv> <export.csv> [id_col]')
master,export=Path(sys.argv[1]),Path(sys.argv[2]); idcol=sys.argv[3] if len(sys.argv)>3 else 'player_id'
with master.open(encoding='utf-8-sig',newline='') as f:
    src=list(csv.DictReader(f))
allowed={row['player_id'].strip() for row in src if row.get('player_id')}
with export.open(encoding='utf-8-sig',newline='') as f:
    rows=list(csv.DictReader(f))
if not rows or idcol not in rows[0]:raise SystemExit(f'Missing {idcol} in export or empty export')
unknown=[(idx,row.get(idcol)) for idx,row in enumerate(rows,2) if str(row.get(idcol,'' )).strip() not in allowed]
print(f'Allowed unique IDs: {len(allowed)}; export rows: {len(rows)}; unknown IDs: {len(unknown)}')
if unknown:raise SystemExit(f'REJECT — external player IDs: {unknown[:25]}')
print('PASS — exported player IDs are whitelisted')
