import { db } from '../core/firebase.js';

export function initTournamentProgress() {
  db().ref('roadmap').on('value', (snapshot) => {
    const el = document.getElementById('tournament-progress');
    if (!el) return;

    const r = snapshot.val() || {};

    // Calculate completion for each round
    const calcProgress = (round, total) => {
      if (!Array.isArray(round) || round.length === 0) return { completed: 0, total: 0, percent: 0 };
      const completed = round.filter(m => m.winner).length;
      return { completed, total: round.length, percent: Math.round((completed / round.length) * 100) };
    };

    const rounds = [
      { name: 'Round 1', data: r.round1, expected: 32 },
      { name: 'Round 2', data: r.round2, expected: 16 },
      { name: 'Round 3', data: r.round3, expected: 8 },
      { name: 'Quarter-Finals', data: r.quarterFinal, expected: 4 },
      { name: 'Semi-Finals', data: r.semiFinal, expected: 2 },
      { name: 'Grand Final', data: r.grandFinal ? [r.grandFinal] : [], expected: 1 }
    ];

    let totalMatches = 0;
    let completedMatches = 0;

    const html = rounds.map(round => {
      const progress = calcProgress(round.data, round.expected);
      totalMatches += progress.total;
      completedMatches += progress.completed;

      return `
        <div class="progress-round">
          <div class="progress-round-header">
            <span class="progress-round-name">${round.name}</span>
            <span class="progress-round-stats">${progress.completed}/${progress.total}</span>
          </div>
          <div class="progress-round-bar">
            <div class="progress-round-fill" style="width: ${progress.percent}%"></div>
          </div>
        </div>
      `;
    }).join('');

    const overallPercent = totalMatches > 0 ? Math.round((completedMatches / totalMatches) * 100) : 0;

    el.innerHTML = `
      <div class="progress-overall">
        <div class="progress-overall-header">
          <h3>Overall Tournament Progress</h3>
          <span class="progress-overall-percent">${overallPercent}%</span>
        </div>
        <div class="progress-overall-bar">
          <div class="progress-overall-fill" style="width: ${overallPercent}%"></div>
        </div>
        <p style="text-align: center; color: #95a5a6; margin-top: 8px;">
          ${completedMatches} of ${totalMatches} matches completed
        </p>
      </div>
      <div class="progress-rounds">
        ${html}
      </div>
    `;
  });
}