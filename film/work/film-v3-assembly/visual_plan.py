"""Source-qualified sixteen-scene physical-evidence plan; no audio generation."""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[2];WORK=ROOT/'work/film-v3-assembly';OUT=ROOT/'outputs/film-v3-assembly'
SCENES=[
('01_notebook','classroom','secret-writing','Concentrate → teacher context → sparse maths → XI reveal → concealment → wry return.','Opening uses separately rendered hero/notebook clips when supplied.',['Schoolbook XI is imaginary, not final report.']),
('02_hackathon','desk','opportunity','Old notebook → challenge card arrives → snap attention → paper investigation.','Rajasthan Royals challenge is an opportunity, not employment.',['No claim of official team membership.']),
('03_clean','lab','sorting','Messy event cards → reject incorrect wicket attribution → sort → eligible evidence stack.','200,999 raw → 194,509 eligible events.',['Wides/no-balls retained in bowling exposure.','Run-outs are not bowler-credited wickets.']),
('04_preball','stadium','freeze','Ball about to be delivered → freeze hand → inspect state → release without showing future outcome.','Pressure uses only BEFORE-ball state.',['Illustrative 28 from12, required rate14.','No current ball outcome in its pressure label.']),
('05_pressure','stadium','leverage','Impossible chase looks frightening → consequential last ball reverses interpretation → skeptical reaction.','Difficulty and consequence differ.',['39 RPO and2 off1 are illustrative states, not player evidence.']),
('06_hybrid','lab','balance','A pan loaded → B pan loaded → combined percentile disc → select primary pressure set.','Difficulty + WP leverage, context-relative percentile combination.',['Top20% within innings, not each phase.']),
('07_expected','lab','expectation','Celebrate raw performance → contextual expectation card arrives → compare → amend claim.','Positive residual means better than contextual expectation.',['Runs/survival and runs prevented/credited wickets distinct.','Any bars are illustrative, not player estimates.']),
('08_adjust','desk','assumptions','Pick15 chip → pause → compare10/20 alternatives → leave assumption visible.','15 runs per wicket is a declared assumption.',['Era/opposition adjustment','Sensitivity10 and20, no universal wicket value claim.']),
('09_shrink','lab','shrinkage','Huge trophy on25-event stack → 400-event evidence arrives → suspicious glance → estimate shrinks toward mean.','Empirical Bayes corrects weakly supported estimates.',['25/400 are unnamed illustrative exposures.','No invented fitted shrinkage values.']),
('10_delta','desk','folders','Quality folder seems convincing → delta folder differs → failed bowling repeatability stamp → qualified claim.','Pressure quality ≠ pressure-related improvement.',['No validated repeatable bowling delta.','Batting delta CV gains only about0.03–0.11%.']),
('11_holdout','lab','validation','Confident report → sealed2026 envelope → actual weak results emerge → crestfallen → study evidence.','Held-out test challenges the hypothesis.',['Batting Spearman-0.043, no positive forward signal.','Bowling+0.304 suggestive; advantage over ordinary economy not established.','First-innings WP Brier0.2559 vs0.2524 baseline, worse.']),
('12_uncertainty','lab','resample','Pick whole match cards → resample stack → uncertainty paper → caution rather than prophecy.','750 match-level resamples.',['Conditional historical stability, not future success probability.','Illustrative distribution has no invented player CI.']),
('13_sensitivity','desk','sensitivity','D20 stack → D10/D25 cards → shortlist tips → best-season removal reveals fragility.','Model choices and influential seasons move the answer.',['D10 retains5/10 batting,4/10 bowling.','D25 retains6/10 batting,7/10 bowling.','Removing best season drops9 names in each top10.']),
('14_shortlist','warroom','report','Report folio opens → full batting page → full bowling page → restrained qualified reaction.','Full accepted primary top20, exposure, stability and format mix.',['No new IDs/intervals.','T20I evidence not automatically IPL evidence.']),
('15_replay','desk','replay','Replay papers →20/20 ranking check →41 checks → limitations remain attached.','Reproducibility is not predictive validation.',['Report-supplied claim; analytics not rerun here.']),
('16_end','classroom','bookend','Old notebook beside qualified report → reflect → small satisfied settle → evidence question.','What does the evidence support, and how sure should you be?',['Corrected classroom reverse geography.','Real website only if supplied/captured; no fake screen.'])]

def build():
 story=json.loads((ROOT/'work/story.json').read_text())
 output=dict(version=3,width=1080,height=1920,fps=30,source='User-supplied methodology and retained V3/V4 geometry; no raw competition data.',timing_status='Inject new Michael timing; legacy timing is provisional only.',voice_owned_by='root',website=dict(status='Requires actual website footage',seconds=4,allow_fake_interface=False),scenes=[])
 for sid,location,action,beats,purpose,caveats in SCENES:
  orig=next(s for s in story['scenes'] if s['id']==sid)
  output['scenes'].append(dict(id=sid,location=location,action=action,beats=beats,purpose=purpose,caveats=caveats,plates=[str(ROOT/'work/reel/plates'/f'{sid}_{i}.png') for i in [1,2,3]],cut_fractions=[.28,.36,.36],safe_captions_y=[1720,1840],hero_source='Retained V3/V4 head/torso sprites; no redesign',narration_reference=orig['narration']))
 return output
if __name__=='__main__':
 WORK.mkdir(exist_ok=True);OUT.mkdir(exist_ok=True);p=WORK/'visual-plan.json';p.write_text(json.dumps(build(),indent=2));print(p)
