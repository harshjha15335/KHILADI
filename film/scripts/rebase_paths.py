"""Rebase copied Windows metadata; default is read-only. This never renders."""
import argparse,json,pathlib,shutil
ROOT=pathlib.Path(__file__).resolve().parents[1]
OLD='C:/Users/ranja/Documents/Codex/2026-11-16/master-character-style-lock-khiladi-animated'
FILES=['work/timing.json','work/reel/plates.json','work/reel/actors.json']
def transform(value,root):
    if isinstance(value,str):
        normalized=value.replace('\\','/')
        if normalized.lower().startswith(OLD.lower()+'/'):
            return (root/pathlib.PurePosixPath(normalized[len(OLD)+1:])).as_posix(),1
        return value,0
    if isinstance(value,list):
        results=[transform(v,root) for v in value]
        return [v for v,n in results],sum(n for v,n in results)
    if isinstance(value,dict):
        result={};count=0
        for k,v in value.items():result[k],n=transform(v,root);count+=n
        return result,count
    return value,0
def main():
    p=argparse.ArgumentParser(description=__doc__);g=p.add_mutually_exclusive_group();g.add_argument('--apply',action='store_true');g.add_argument('--dry-run',action='store_true');args=p.parse_args()
    report=[]
    for rel in FILES:
        path=ROOT/rel;data=json.loads(path.read_text(encoding='utf-8-sig'));changed,count=transform(data,ROOT)
        if args.apply and count:
            backup=ROOT/'work/cloud_metadata_backup'/rel;backup.parent.mkdir(parents=True,exist_ok=True)
            if not backup.exists():shutil.copy2(path,backup)
            path.write_text(json.dumps(changed,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
        report.append({'file':rel,'paths_to_rebase':count,'applied':bool(args.apply and count)})
    print(json.dumps({'files':report,'warning':'actors.json still has obsolete actors_raw entries; rebasing is NOT readiness for compositing.'},indent=2))
if __name__=='__main__':main()
