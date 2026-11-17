"""Read-only tool/capability inventory; it does not start a render."""
import json,pathlib,platform,shutil,subprocess,sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
def capture(args):
    p=subprocess.run(args,capture_output=True,text=True);return (p.stdout+p.stderr).strip()
report={'python':sys.version.split()[0],'platform':platform.platform(),'project_root':str(ROOT),'blender':shutil.which('blender'),'ffmpeg':shutil.which('ffmpeg'),'ffprobe':shutil.which('ffprobe'),'graphics_device_directory_present':pathlib.Path('/dev/dri').exists(),'render_test_performed':False}
if report['blender']:report['blender_version']=capture([report['blender'],'--version']).splitlines()[0]
if report['ffmpeg']:
    filters=capture([report['ffmpeg'],'-hide_banner','-filters']);encoders=capture([report['ffmpeg'],'-hide_banner','-encoders'])
    report['filters']={x:x in filters for x in ['subtitles','overlay','zoompan','loudnorm']};report['encoders']={x:x in encoders for x in ['libx264','aac','qtrle']}
print(json.dumps(report,indent=2))
