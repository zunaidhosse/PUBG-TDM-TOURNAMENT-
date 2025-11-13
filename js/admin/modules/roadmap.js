import { db } from '../../core/firebase.js';

export function initAdminRoadmap() {
  const el = document.getElementById('admin-roadmap-display'); if (!el) return;
  db().ref('roadmap').on('value', s => {
    const v = s.val();
    const clean = (n)=> !n || n.toUpperCase()==='TBD' || /^B\d+$/i.test(n) ? '' : n;
    const fmt = (m)=> {
      const t1 = clean(m.team1), t2 = clean(m.team2);
      if (!t1 && !t2) return null;
      return `${t1} vs ${t2}${m.winner ? ` → ${m.winner}` : ''}`;
    };
    const r1 = (v.round1 || []).map(fmt).filter(Boolean).join('\n');
    const r2 = (v.round2 || []).map(fmt).filter(Boolean).join('\n');
    const r3 = (v.round3 || (Array.isArray(v.preFinal)? v.preFinal: [])).map(fmt).filter(Boolean).join('\n');
    const qf = (v.quarterFinal || []).map(fmt).filter(Boolean).join('\n');
    const sf = (v.semiFinal || []).map(fmt).filter(Boolean).join('\n');
    const gf = v.grandFinal && fmt(v.grandFinal);

    el.innerHTML = `
      <div class="registration-card"><h3>Round 1 (Round of 64)</h3><pre style="white-space:pre-wrap;margin-top:6px;">${r1 || '—'}</pre></div>
      <div class="registration-card"><h3>Round 2 (Round of 32)</h3><pre style="white-space:pre-wrap;margin-top:6px;">${r2 || '—'}</pre></div>
      <div class="registration-card"><h3>Round 3 (Round of 16)</h3><pre style="white-space:pre-wrap;margin-top:6px;">${r3 || '—'}</pre></div>
      <div class="registration-card"><h3>Quarter-Finals (8)</h3><pre style="white-space:pre-wrap;margin-top:6px;">${qf || '—'}</pre></div>
      <div class="registration-card"><h3>Semi-Finals (4)</h3><pre style="white-space:pre-wrap;margin-top:6px;">${sf || '—'}</pre></div>
      ${gf ? `<div class="registration-card"><h3>Final (Grand Final)</h3><pre style="white-space:pre-wrap;margin-top:6px;">${gf}</pre></div>` : ''}
      ${v.winner || v.grandFinal?.winner ? `<div class="registration-card"><h3>Champion</h3><p style="margin-top:6px;">🏆 ${v.winner || v.grandFinal.winner}</p></div>` : ''}
    `;
  });
}