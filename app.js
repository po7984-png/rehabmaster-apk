
// --- Data (부위별 표준 문진) ---
const DB = {
  regions: [
    { id: 'shoulder', name: '어깨' },
    { id: 'knee', name: '무릎' },
    { id: 'lumbar', name: '허리(요부)' },
    { id: 'wrist', name: '손목' },
    { id: 'ankle', name: '발목' },
  ],
  // 공통 레드플래그
  redFlags: [
    "최근 심한 외상 또는 낙상",
    "설명되지 않는 체중감소/발열",
    "암/감염 병력",
    "야간통·휴식 시 악화",
    "점진적 신경학적 결손(근력저하, 감각저하)",
  ],
  questions: {
    common: [
      { id:"onset", title: "발생 시기/경과", options: ["급성(0-6주)", "아급성(6-12주)", "만성(12주+)"] },
      { id:"painType", title: "통증 양상", options: ["찌름/예리", "둔통", "타는듯", "방사통"] },
      { id:"aggravating", title: "악화/완화 요인", options: ["활동 시 악화", "휴식 시 악화", "아침 강직", "특정 동작"] },
      { id:"severity", title: "통증 강도(NRS)", options: ["0-3", "4-6", "7-10"] },
      { id:"redflag", title: "레드 플래그(해당 시 즉시 의학적 평가 권고)", options: [] }
    ],
    shoulder: [
      { id:"pattern", title: "주요 패턴", options: ["위팔 들기 제한", "야간통", "등뒤 손 올리기 제한", "클릭/잠김"] },
      { id:"provocation", title: "유발 검사 느낌", options: ["임핀지먼트 유사", "이두장건 압통", "견봉쇄골 통증", "불안정감"] }
    ],
    knee: [
      { id:"pattern", title: "주요 패턴", options: ["계단/쪼그려 앉기 통증", "잠김/불안정", "부기/열감", "활동 후 통증"] },
      { id:"provocation", title: "유발 검사 느낌", options: ["반월상 연관", "십자인대 연관", "슬개대퇴 연관", "건/점액낭"] }
    ],
    lumbar: [
      { id:"pattern", title: "주요 패턴", options: ["굽힘 시 통증", "폄 시 통증", "엉치/다리 방사", "기침/재채기 악화"] },
      { id:"neuro", title: "신경학적 징후", options: ["하지 저림", "근력저하", "감각저하", "양성 SLR 유사"] }
    ],
    wrist: [
      { id:"pattern", title: "주요 패턴", options: ["손목 등쪽 통증", "엄지쪽 통증", "저림/야간통", "붙잡기 약화"] },
      { id:"provocation", title: "유발 검사 느낌", options: ["TFCC 유사", "드꿴베르뎅 유사", "수근관 증상", "삼각섬유연골 압통"] }
    ],
    ankle: [
      { id:"pattern", title: "주요 패턴", options: ["내측/외측 불안정", "부기/멍", "뻣뻣함", "반복 염좌력"] },
      { id:"provocation", title: "유발 검사 느낌", options: ["전거비 인대 의심", "비골건 의심", "충돌/충돌증후", "아킬레스 연관"] }
    ]
  },
  evidence: {
    shoulder: [
      "만성 어깨통증에 대해 운동치료는 중등~높은 근거로 기능 개선.",
      "야간통 + 위팔거상 제한 → 회전근개 관련 가능성 ↑ (진단 아님)."
    ],
    knee: [
      "반월상 잠김/클릭은 민감도 낮음, 복합 평가 권장.",
      "슬개대퇴 통증은 활동량 조절+점진적 근력 강화 권고."
    ],
    lumbar: [
      "경보 신호 부재 시 1차 선택은 보존적 관리.",
      "급성 요통은 조기 활동 유지가 회복에 유리."
    ],
    wrist: [
      "수근관 증상 야간악화 → 신장/신경가동술 및 보조기 고려.",
      "드꿴베르뎅 양상 → 엄지 외전근/신근건 관리 권고."
    ],
    ankle: [
      "반복 염좌력 → 고유수용감각 훈련이 재손상 감소에 유익.",
      "아킬레스 통증 → 등척성/점진적 부하 훈련 권고."
    ]
  }
};

// --- State ---
let state = {
  region: null,
  answers: {} // {questionId: value}
};

// --- UI ---
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

function renderRegions(){
  const wrap = $('#regions'); wrap.innerHTML = '';
  DB.regions.forEach(r => {
    const btn = document.createElement('button');
    btn.className = 'opt';
    btn.textContent = r.name;
    btn.onclick = () => startQA(r.id);
    wrap.appendChild(btn);
  });
}

function startQA(regionId){
  state.region = regionId;
  state.answers = {};
  $('#region-section').classList.add('hidden');
  $('#result-section').classList.add('hidden');
  $('#qa-section').classList.remove('hidden');
  renderQuestions();
}

function tagOption(el, groupId, value){
  el.classList.toggle('selected');
  if(!state.answers[groupId]) state.answers[groupId] = new Set();
  if(el.classList.contains('selected')) state.answers[groupId].add(value);
  else state.answers[groupId].delete(value);
}

function renderQuestionBlock(container, q){
  const box = document.createElement('div');
  box.className = 'q';
  box.innerHTML = `<h3>${q.title}</h3>`;
  const row = document.createElement('div'); row.className='optrow';
  (q.options && q.options.length ? q.options : DB.redFlags).forEach(opt => {
    const b = document.createElement('button');
    b.className = 'opt';
    b.textContent = opt;
    b.onclick = () => tagOption(b, q.id, opt);
    row.appendChild(b);
  });
  box.appendChild(row);
  container.appendChild(box);
}

function renderQuestions(){
  const container = $('#questions'); container.innerHTML = '';
  const list = [...DB.questions.common, ...(DB.questions[state.region] || [])];
  list.forEach(q => renderQuestionBlock(container, q));
}

function analyze(){
  // Simple scoring & advice (초기 버전)
  const a = state.answers;
  let red = (a.redflag && a.redflag.size>0);
  let severity = [...(a.severity||[])][0] || '0-3';
  let risk = 0;
  if(severity==='7-10') risk += 2;
  if(severity==='4-6') risk += 1;
  if(red) risk = 999;

  // region-specific heuristics (교육용)
  let notes = [];
  if(state.region==='lumbar' && a.pattern && a.pattern.has('엉치/다리 방사')){
    notes.push('신경근 자극 징후 의심 → 신경학적 스크리닝 권고.');
    risk += 1;
  }
  if(state.region==='shoulder' && a.pattern && a.pattern.has('야간통')){
    notes.push('야간통 존재 → 회전근개 관련 증후 가능성 언급.');
  }
  if(state.region==='knee' && a.pattern && a.pattern.has('잠김/불안정')){
    notes.push('기계적 잠김 보고 → 반월상/인대 평가 필요.');
  }

  // advice
  let scoreText = red ? "레드플래그 양성 (즉시 의학적 평가 권고)" :
                 risk>=2 ? "중등-고 위험군 (의사 상담 고려, 보존적 개입 동반)" :
                 "저-중 위험군 (보존적 관리 중심)";
  $('#scoreBox').textContent = `위험 분류: ${scoreText}`;

  let plan = [];
  if(red){
    plan.push("⚠️ 레드플래그 양성: 즉시 의학적 평가(응급/의원) 권고.");
  }else{
    plan.push("🧭 초기 계획: 부하 조절 + 교육 + 점진적 운동.");
    if(state.region==='shoulder') plan.push("- 어깨: 견갑/회전근개 활성화, 통증범위 내 가동범위.");
    if(state.region==='knee') plan.push("- 무릎: 대퇴사두/엉덩이 근력 + 활동 조절.");
    if(state.region==='lumbar') plan.push("- 허리: 조기 활동, 통증유발 회피 대신 변형 동작 전략.");
    if(state.region==='wrist') plan.push("- 손목: 증상 패턴에 따른 보조기/신경가동술 고려.");
    if(state.region==='ankle') plan.push("- 발목: 고유수용감각 + 균형 재훈련.");
  }
  plan = plan.concat(notes);
  $('#adviceBox').textContent = plan.join("\n");

  // evidence
  const ev = DB.evidence[state.region] || [];
  $('#evidenceBox').innerHTML = ev.map(x=>`<div>• ${x}</div>`).join("");

  $('#qa-section').classList.add('hidden');
  $('#result-section').classList.remove('hidden');

  // Save to local
  localStorage.setItem('rehabmaster:last', JSON.stringify({time:Date.now(), region:state.region, answers:objFromSets(a)}));
}

function objFromSets(obj){
  const out={}; for(const k in obj){ out[k] = Array.from(obj[k]); } return out;
}

function toPDF(){
  // simple print() -> PDF
  window.print();
}

// --- Events ---
document.addEventListener('DOMContentLoaded', ()=>{
  renderRegions();
  $('#btn-analyze').onclick = analyze;
  $('#btn-reset').onclick = ()=>{ state.answers={}; renderQuestions(); };
  $('#btn-back').onclick = ()=>{ $('#qa-section').classList.add('hidden'); $('#region-section').classList.remove('hidden'); };
  $('#btn-edit').onclick = ()=>{ $('#result-section').classList.add('hidden'); $('#qa-section').classList.remove('hidden'); };
  $('#btn-pdf').onclick = toPDF;

  // memo
  const memo = document.getElementById('memo');
  memo.value = localStorage.getItem('rehabmaster:memo')||'';
  memo.addEventListener('input', ()=>localStorage.setItem('rehabmaster:memo', memo.value));

  // PWA install
  if('serviceWorker' in navigator){ navigator.serviceWorker.register('./sw.js'); }
});
