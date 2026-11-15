"""Export existing backend quiz responses for static Pages; never duplicate/recalculate the model."""
import json,sys
from pathlib import Path
root=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(root/'khiladi/backend'))
from main import QuizQuery,quiz_recommendation
output={}
for role in ['Batting','Bowling','All-Rounder']:
 for phase in ['Powerplay','Death Overs','Chase Master']:
  query=QuizQuery(role_priority=role,match_phase=phase,risk_profile='Consistent Reliability')
  output[json.dumps([role,phase,query.risk_profile],separators=(',',':'))]=quiz_recommendation(query)
path=root/'khiladi/frontend/public/data/quiz_recommendations.json'
path.write_text(json.dumps(output,separators=(',',':'))+'\n')
print('Exported',len(output),'unchanged backend responses for Pages')
