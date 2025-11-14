import { db } from '../core/firebase.js';

export function initRankings() {
  db().ref('roadmap').on('value', (snapshot) => {
    const el = document.getElementById('rankings-list');
    if (!el) return;

    const r = snapshot.val() || {};
    const stats = {};

    // Count wins from all rounds
    const rounds = [r.round1, r.round2, r.round3, r.quarterFinal, r.semiFinal];
    rounds.forEach(round => {
      if (!Array.isArray(round)) return;
      round.forEach(match => {
        if (match.winner) {
          stats[match.winner] = (stats[match.winner] || 0) + 1;
        }
      });
    });

    if (r.grandFinal && r.grandFinal.winner) {
      stats[r.grandFinal.winner] = (stats[r.grandFinal.winner] || 0) + 2; // Bonus for champion
    }

    const rankings = Object.entries(stats)
      .map(([team, wins]) => ({ team, wins }))
      .sort((a, b) => b.wins - a.wins);

    if (rankings.length === 0) {
      el.innerHTML = '<p class=\"empty-message\">Rankings will appear after matches begin</p>';
      return;
    }

    el.innerHTML = rankings.map((item, idx) => {
      const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
      return `
        <div class=\"registration-card\">
          <h3>${medal} ${item.team}</h3>
          <p style=\"color: #2ecc71; font-weight: 700;\">Wins: ${item.wins}</p>
        </div>
      `;
    }).join('');
  });
}