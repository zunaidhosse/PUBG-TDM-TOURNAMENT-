import { db } from '../core/firebase.js';

export function initNotice() {
  let noticeText = '';
  let prizeAmounts = { first: 500, second: 300, third: 100 };
  let winners = null;

  function render() {
    const el = document.getElementById('notice-board');
    if (!el) return;
    const box = winners ? `
      <div style="background:rgba(243,156,18,0.18); border:1px solid #f39c12; border-radius:10px; padding:12px; margin-bottom:12px;">
        <div style="text-align:center; font-weight:800; color:#f39c12; margin-bottom:8px;">🏆 TOURNAMENT WINNERS 🏆</div>
        <div style="line-height:1.6;">
          <div>🥇 1st Winner: <strong>${winners.first || 'TBD'}</strong> – ${prizeAmounts.first} UC</div>
          <div>🥈 2nd Winner: <strong>${winners.second || 'TBD'}</strong> – ${prizeAmounts.second} UC</div>
          <div>🥉 3rd Winner: <strong>${winners.third || 'TBD'}</strong> – ${prizeAmounts.third} UC</div>
        </div>
      </div>` : '';
    el.innerHTML = box + (noticeText || "No announcements");
  }

  db().ref('notice').on('value', (snapshot) => {
    noticeText = snapshot.val() || "";
    render();
  });

  // Prize Pool render
  db().ref('prizePool').on('value', (snapshot) => {
    const el = document.getElementById('prize-pool');
    if (!el) return;
    const v = snapshot.val();
    if (!v) {
      el.innerHTML = '<p class="empty-message">Prize pool will be announced soon</p>';
      return;
    }
    const f = Number(v.first || 0), s = Number(v.second || 0), t = Number(v.third || 0);
    prizeAmounts = {
      first: f || 500,
      second: s || 300,
      third: t || 100
    };
    el.innerHTML = `
      <div class="prize-area">
        <div class="prize-head">🏆 Tournament Prize Pool</div>
        <div class="prize-grid">
          <div class="prize-item prize-gold">
            <div class="prize-badge">🥇 1st Place</div>
            <div class="prize-amount"><span>${f}</span> UC</div>
          </div>
          <div class="prize-item prize-silver">
            <div class="prize-badge">🥈 2nd Place</div>
            <div class="prize-amount"><span>${s}</span> UC</div>
          </div>
          <div class="prize-item prize-bronze">
            <div class="prize-badge">🥉 3rd Place</div>
            <div class="prize-amount"><span>${t}</span> UC</div>
          </div>
        </div>
      </div>
    `;
    render();
  });

  db().ref('roadmap').on('value', (snapshot) => {
    const r = snapshot.val() || {};
    const clean = (n)=> !n || n.toUpperCase()==='TBD' || /^B\d+$/i.test(n) ? '' : n;

    if (r) {
      const grand = r.grandFinal;
      let first = '', second = '', third = '';
      if (grand && (clean(grand.team1) || clean(grand.team2))) {
        const t1 = clean(grand.team1)||'', t2 = clean(grand.team2)||'';
        const win = clean(grand.winner)||'';
        if (win && (t1 || t2)) { first = win; second = win === t1 ? t2 : t1; }
      }

      if (!third) {
        const sf = Array.isArray(r.semiFinal) ? r.semiFinal : [];
        const losers = sf.map(m => {
          const t1 = clean(m.team1)||'', t2 = clean(m.team2)||'';
          const w = clean(m.winner)||'';
          if (!t1 && !t2) return '';
          if (!w) return '';
          return w === t1 ? t2 : t1;
        }).filter(Boolean);
        if (r.thirdPlace && clean(r.thirdPlace.winner)) {
          third = clean(r.thirdPlace.winner);
        } else if (losers.length) {
          losers.sort((a,b)=> a.localeCompare(b));
          third = losers[0];
        }
      }

      winners = first && second && third ? { first, second, third } : null;
      render();
    }
  });
}