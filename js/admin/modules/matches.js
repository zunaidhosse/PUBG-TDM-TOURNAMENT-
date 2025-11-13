import { db } from '../../core/firebase.js';

export function initAdminMatches() {
  const el = document.getElementById('admin-matches-list'); if (!el) return;
  const btn = document.getElementById('generate-round-btn');
  const delBtn = document.getElementById('delete-all-matches-btn');

  const clean = (n)=>!n||n.toUpperCase()==='TBD'||/^B\d+$/i.test(n)?'':n;
  const pairUp = (arr)=>{ const pairs=[]; for(let i=0;i<arr.length;i+=2){ const a=arr[i],b=arr[i+1]; if (b) pairs.push({team1:a,team2:b}); else pairs.push({team1:a,team2:'',winner:a}); } return pairs; };
  const isComplete = (list)=> Array.isArray(list) && list.length>0 && list.every(m=>clean(m.team1)||clean(m.team2) ? !!m.winner : true);

  // Read approved simulated teams from localStorage
  function getApprovedSimulatedTeams() {
    try {
      const raw = localStorage.getItem('simulatedTeams');
      if (!raw) return [];
      const data = JSON.parse(raw) || [];
      return data
        .filter(t => t && t.teamName && t.status === 'Approved')
        .map(t => ({ name: t.teamName.trim(), ts: Number(t.registeredAt || 0) }))
        .sort((a,b)=> a.ts - b.ts)
        .slice(0, 64)
        .map(t => t.name);
    } catch {
      return [];
    }
  }

  async function getApprovedRealTeams() {
    const reg = await db().ref('registrations').orderByChild('status').equalTo('Approved').once('value');
    const teams = [];
    reg.forEach(c=>{
      const v = c.val()||{};
      const n=(v.teamName||'').trim();
      const ts = Number(v.registeredAt||0);
      if (n) teams.push({name:n, ts});
    });
    teams.sort((a,b)=> a.ts - b.ts);
    return teams.slice(0,64).map(t=>t.name);
  }

  async function getApprovedTeamsWithFallback() {
    const real = await getApprovedRealTeams();
    if (real.length >= 2) return real;
    const sim = getApprovedSimulatedTeams();
    return sim;
  }

  async function generateCurrentRound() {
    const snap = await db().ref('roadmap').once('value'); const r = snap.val()||{};
    const round3List = r.round3 || (Array.isArray(r.preFinal) ? r.preFinal : null); // legacy support
    let key =
      !r.round1 ? 'round1' :
      (isComplete(r.round1) && !r.round2) ? 'round2' :
      (isComplete(r.round2) && !round3List) ? 'round3' :
      (isComplete(r.round3 || round3List) && !r.quarterFinal) ? 'quarterFinal' :
      (isComplete(r.quarterFinal) && !r.semiFinal) ? 'semiFinal' :
      (isComplete(r.semiFinal) && !r.grandFinal) ? 'grandFinal' :
      null;

    if (!key) return;

    let source = [];
    if (key==='round1') {
      source = await getApprovedTeamsWithFallback();
    } else if (key==='round2') {
      (r.round1||[]).forEach(m=>{ if (m.winner) source.push(m.winner); });
    } else if (key==='round3') {
      (r.round2||[]).forEach(m=>{ if (m.winner) source.push(m.winner); });
    } else if (key==='quarterFinal') {
      ((r.round3 || round3List)||[]).forEach(m=>{ if (m.winner) source.push(m.winner); });
    } else if (key==='semiFinal') {
      (r.quarterFinal||[]).forEach(m=>{ if (m.winner) source.push(m.winner); });
    } else if (key==='grandFinal') {
      (r.semiFinal||[]).forEach(m=>{ if (m.winner) source.push(m.winner); });
    }
    source = source.filter(Boolean);
    if (source.length<1) return;

    if (key==='grandFinal') {
      const [a,b] = [source[0]||'', source[1]||''];
      await db().ref('roadmap/grandFinal').set({ team1:a, team2:b, winner: (b?'':a)||null });
    } else {
      await db().ref('roadmap/'+key).set(pairUp(source));
    }
  }

  function maybeAutoAdvance(v) {
    const r = v||{};
    if (!r.round1) return;
    const round3List = r.round3 || (Array.isArray(r.preFinal) ? r.preFinal : null);
    if (isComplete(r.round1) && !r.round2) return generateCurrentRound();
    if (isComplete(r.round2) && !round3List) return generateCurrentRound();
    if (isComplete(r.round3 || round3List) && !r.quarterFinal) return generateCurrentRound();
    if (isComplete(r.quarterFinal) && !r.semiFinal) return generateCurrentRound();
    if (isComplete(r.semiFinal) && !r.grandFinal) return generateCurrentRound();
    const grand = r.grandFinal;
    if (grand && grand.winner && r.winner!==grand.winner) return db().ref('roadmap/winner').set(grand.winner);
  }

  function render(v) {
    el.innerHTML = '';
    const rounds = [
      { key:'round1', label:'Round 1', list:v.round1||[] },
      { key:'round2', label:'Round 2', list:v.round2||[] },
      { key:'round3', label:'Round 3', list:(v.round3 || (Array.isArray(v.preFinal)?v.preFinal:[])) },
      { key:'quarterFinal', label:'Quarter-Finals', list:v.quarterFinal||[] },
      { key:'semiFinal', label:'Semi-Finals', list:v.semiFinal||[] },
      { key:'grandFinal', label:'Grand Final', list: (v.grandFinal ? [v.grandFinal] : []) }
    ];
    rounds.forEach(rd=>{
      const wrap=document.createElement('div'); wrap.className='registration-card';
      const items = (rd.list||[]).filter(m=>clean(m.team1)||clean(m.team2));
      const body = items.map((m,idx)=>{
        const t1=clean(m.team1)||'', t2=clean(m.team2)||'';
        const win = m.winner?`<div style="margin-top:6px;color:#2ecc71;font-weight:700;">Winner: ${m.winner}</div>`:'';
        const actions = !m.winner && t1 && t2 ? `
          <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn btn-success" data-setwin="${rd.key}:${idx}:1">Set ${t1}</button>
            <button class="btn btn-success" data-setwin="${rd.key}:${idx}:2">Set ${t2}</button>
          </div>` : '';
        return `<div style="padding:8px;border:1px solid #3498db;border-radius:6px;margin-bottom:8px;">
          <div><strong>${t1||'—'}</strong> vs <strong>${t2||'—'}</strong></div>${win}${actions}
        </div>`;
      }).join('') || '<span class="empty-message">No matches</span>';
      wrap.innerHTML = `<h3>${rd.label}</h3><div style="margin-top:6px;">${body}</div>`;
      el.appendChild(wrap);
    });

    // Winner set handlers
    el.querySelectorAll('[data-setwin]').forEach(btn=>{
      btn.addEventListener('click', async ()=>{
        const [key, idx, who]=btn.getAttribute('data-setwin').split(':');
        if (key === 'grandFinal') {
          const gfSnap = await db().ref('roadmap/grandFinal').once('value');
          const gf = gfSnap.val() || {};
          const pick = who==='1'? gf.team1 : gf.team2;
          if (!clean(pick)) return;
          gf.winner = pick; await db().ref('roadmap/grandFinal').set(gf);
          return;
        }
        const listSnap = await db().ref('roadmap/'+key).once('value');
        let arr = listSnap.val()||[];
        const m = arr[Number(idx)];
        if (!m) return;
        const t = who==='1'? m.team1 : m.team2;
        if (!clean(t)) return;
        m.winner = t;
        arr[Number(idx)] = m;
        await db().ref('roadmap/'+key).set(arr);
      });
    });
  }

  if (btn) btn.addEventListener('click', generateCurrentRound);
  if (delBtn) {
    delBtn.addEventListener('click', async () => {
      if (!confirm('Delete ALL matches and bracket? This cannot be undone.')) return;
      try {
        await db().ref('roadmap').remove();
      } catch (e) {}
    });
  }

  // Auto seed Round 1 from approved real or simulated teams if empty
  async function autoSeedRound1IfNeeded() {
    const snap = await db().ref('roadmap').once('value'); const r = snap.val()||{};
    if (r.round1 && r.round1.length) return;
    const names = await getApprovedTeamsWithFallback();
    if (names.length < 2) return;
    await db().ref('roadmap/round1').set(pairUp(names));
  }

  db().ref('registrations').on('value', () => { autoSeedRound1IfNeeded().catch(()=>{}); });
  db().ref('roadmap').on('value', s=>{ const v=s.val()||{}; render(v); maybeAutoAdvance(v); });

  // Also attempt auto seed once on load to catch simulated-only scenarios (no registrations event)
  autoSeedRound1IfNeeded().catch(()=>{});
}