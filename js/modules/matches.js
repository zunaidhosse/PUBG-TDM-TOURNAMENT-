import { db } from '../core/firebase.js';

export function initMatches() {
  db().ref('roadmap').on('value', (snapshot) => {
    const r = snapshot.val() || {};
    const rounds = {
      round1: r.round1 || [],
      round2: r.round2 || [],
      round3: r.round3 || (Array.isArray(r.preFinal) ? r.preFinal : []), // legacy preFinal support
      quarterFinal: r.quarterFinal || [],
      semiFinal: r.semiFinal || [],
      grandFinal: r.grandFinal ? [r.grandFinal] : []
    };
    const isDone = (m)=>Array.isArray(m)?m.every(x=>x.winner):m.every?.(x=>x.winner);
    const order = ['round1','round2','round3','quarterFinal','semiFinal','grandFinal'];
    let showKey = order.find((k)=>!isDone(rounds[k]) ) || 'grandFinal';

    const clean = (n)=> !n || n.toUpperCase()==='TBD' || /^B\d+$/i.test(n) ? '' : n;
    const render = (key) => {
      document.querySelectorAll('.round-btn').forEach(b=>b.classList.remove('active'));
      ({
        round1:'round1-btn',
        round2:'round2-btn',
        round3:'round3-btn',
        quarterFinal:'quarter-btn',
        semiFinal:'semi-btn',
        grandFinal:'grand-btn'
      })[key] && document.getElementById(({
        round1:'round1-btn',
        round2:'round2-btn',
        round3:'round3-btn',
        quarterFinal:'quarter-btn',
        semiFinal:'semi-btn',
        grandFinal:'grand-btn'
      })[key]).classList.add('active');
      const list = document.getElementById('matches-list'); if (!list) return;
      list.innerHTML = '';
      const matches = (rounds[key]||[]).filter(m => clean(m.team1) || clean(m.team2));
      const total = matches.length, done = matches.filter(m=>m.winner).length;
      const labels = {
        round1:'Round 1 (Round of 64)',
        round2:'Round 2 (Round of 32)',
        round3:'Round 3 (Round of 16)',
        quarterFinal:'Quarter-Finals (8)',
        semiFinal:'Semi-Finals (4)',
        grandFinal:'Final (Grand Final)'
      };
      list.insertAdjacentHTML('beforeend', `<div class="progress-wrap"><div class="progress-head">${labels[key]} • ${done}/${total} complete</div><div class="progress-bar"><span style="width:${total?Math.round(done*100/total):0}%"></span></div></div>`);
      if (matches.length===0){ list.innerHTML='<p class="empty-message">No matches scheduled</p>'; return; }
      matches.forEach(m=>{
        const ct1 = clean(m.team1) || 'TBD', ct2 = clean(m.team2) || 'TBD';
        const isComplete = !!m.winner;
        
        const t1Class = isComplete && m.winner === m.team1 ? 'winner-team' : '';
        const t2Class = isComplete && m.winner === m.team2 ? 'winner-team' : '';

        const statusHtml = isComplete 
          ? `<div class="match-status-badge complete">MATCH COMPLETE</div>
             <div class="winner-announce">Winner: <span>${m.winner}</span> (Win Point: 1)</div>`
          : `<div class="match-status-badge pending">Match Pending</div>`;
        
        list.insertAdjacentHTML('beforeend', `
          <div class="match-card ${isComplete ? 'completed' : ''}">
            <div class="match-header">${labels[key]}</div>
            <div class="match-versus-area">
              <div class="match-team-box ${t1Class}">${ct1}</div>
              <div class="match-vs-divider">VS</div>
              <div class="match-team-box ${t2Class}">${ct2}</div>
            </div>
            ${statusHtml}
          </div>
        `);
      });
      const adv = matches.filter(m=>m.winner).map(m=>m.winner);
      if (adv.length) list.insertAdjacentHTML('beforeend', `<div class="registration-card"><h3>Advancing Teams</h3><p>${adv.join(', ')}</p></div>`);
    };

    render(showKey);
    const r1 = document.getElementById('round1-btn');
    const r2 = document.getElementById('round2-btn');
    const r3 = document.getElementById('round3-btn');
    const qf = document.getElementById('quarter-btn');
    const sf = document.getElementById('semi-btn');
    const gf = document.getElementById('grand-btn');
    if (r1) r1.onclick=()=>render('round1');
    if (r2) r2.onclick=()=>render('round2');
    if (r3) r3.onclick=()=>render('round3');
    if (qf) qf.onclick=()=>render('quarterFinal');
    if (sf) sf.onclick=()=>render('semiFinal');
    if (gf) gf.onclick=()=>render('grandFinal');
  });
}