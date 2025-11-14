import { db } from '../core/firebase.js';

export function initTeamStats() {
  db().ref('roadmap').on('value', (snapshot) => {
    const el = document.getElementById('team-stats-list');
    if (!el) return;

    const r = snapshot.val() || {};
    const teamStats = {};

    // Collect all teams and their performance
    const processRound = (round) => {
      if (!Array.isArray(round)) return;
      round.forEach(match => {
        const t1 = match.team1;
        const t2 = match.team2;
        
        if (t1 && t1.toUpperCase() !== 'TBD') {
          if (!teamStats[t1]) teamStats[t1] = { wins: 0, losses: 0, matches: 0 };
          teamStats[t1].matches++;
          if (match.winner === t1) teamStats[t1].wins++;
          else if (match.winner) teamStats[t1].losses++;
        }
        
        if (t2 && t2.toUpperCase() !== 'TBD') {
          if (!teamStats[t2]) teamStats[t2] = { wins: 0, losses: 0, matches: 0 };
          teamStats[t2].matches++;
          if (match.winner === t2) teamStats[t2].wins++;
          else if (match.winner) teamStats[t2].losses++;
        }
      });
    };

    processRound(r.round1);
    processRound(r.round2);
    processRound(r.round3);
    processRound(r.quarterFinal);
    processRound(r.semiFinal);
    if (r.grandFinal) processRound([r.grandFinal]);

    const query = (document.getElementById('stats-search')?.value || '').toLowerCase();
    let teams = Object.entries(teamStats).map(([name, stats]) => ({ name, ...stats }));
    
    if (query) {
      teams = teams.filter(t => t.name.toLowerCase().includes(query));
    }

    teams.sort((a, b) => b.wins - a.wins || b.matches - a.matches);

    if (teams.length === 0) {
      el.innerHTML = '<p class=\"empty-message\">No team statistics available yet</p>';
      return;
    }

    el.innerHTML = teams.map((team, idx) => {
      const winRate = team.matches > 0 ? Math.round((team.wins / team.matches) * 100) : 0;
      const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '';
      
      return `
        <div class=\"stats-card\">
          <div class=\"stats-header\">
            <h3>${medal} ${team.name}</h3>
            <div class=\"win-rate\" style=\"color: ${winRate >= 70 ? '#2ecc71' : winRate >= 40 ? '#f39c12' : '#e74c3c'}\">
              ${winRate}% WR
            </div>
          </div>
          <div class=\"stats-grid\">
            <div class=\"stat-item\">
              <span class=\"stat-label\">Matches</span>
              <span class=\"stat-value\">${team.matches}</span>
            </div>
            <div class=\"stat-item\">
              <span class=\"stat-label\">Wins</span>
              <span class=\"stat-value\" style=\"color: #2ecc71\">${team.wins}</span>
            </div>
            <div class=\"stat-item\">
              <span class=\"stat-label\">Losses</span>
              <span class=\"stat-value\" style=\"color: #e74c3c\">${team.losses}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  });

  const searchInput = document.getElementById('stats-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      db().ref('roadmap').once('value');
    });
  }
}