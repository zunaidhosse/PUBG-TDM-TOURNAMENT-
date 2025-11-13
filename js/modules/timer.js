export function initTimer() {
  const el = document.getElementById('stage-timer');
  if (!el || !window.firebase) return;
  const db = () => window.firebase.database();
  const stages = ['registration','round1','round2','round3','quarterFinal','semiFinal','grandFinal'];
  const labels = {
    registration: 'Registration Open',
    round1: 'Round 1',
    round2: 'Round 2',
    round3: 'Round 3',
    quarterFinal: 'Quarter-Finals',
    semiFinal: 'Semi-Finals',
    grandFinal: 'Grand Final'
  };
  let current = null, endTs = null, timer = null;

  function fmt(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return { d, h, m, sec };
  }
  function render() {
    if (!current || !endTs) { el.innerHTML = ''; return; }
    const left = endTs - Date.now();
    const t = fmt(left);
    el.innerHTML = `<div class="cd"><span style="color:#95a5a6; font-weight:800;">${labels[current]}</span></div>
      <div class="cd">${t.d}d</div><div class="cd">${String(t.h).padStart(2,'0')}h</div>
      <div class="cd">${String(t.m).padStart(2,'0')}m</div><div class="cd">${String(t.sec).padStart(2,'0')}s</div>`;
    if (left <= 0) pickStageAndStart();
  }
  function startTick() {
    if (timer) clearInterval(timer);
    timer = setInterval(render, 1000);
    render();
  }
  function pickStageAndStart() {
    db().ref('timers').once('value').then(snap => {
      const v = snap.val() || {};
      const now = Date.now();
      let active = null, activeEnd = null;
      for (const k of stages) {
        const st = Number(v?.[k]?.startTs || 0);
        const en = Number(v?.[k]?.endTs || 0);
        if (st && en && now >= st && now < en) { active = k; activeEnd = en; break; }
      }
      current = active;
      endTs = activeEnd;
      startTick();
    });
  }

  db().ref('timers').on('value', () => { pickStageAndStart(); });
  pickStageAndStart();
}