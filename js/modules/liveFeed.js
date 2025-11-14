import { db } from '../core/firebase.js';

export function initLiveFeed() {
  db().ref('roadmap').on('value', (snapshot) => {
    const el = document.getElementById('live-feed-list');
    if (!el) return;

    const r = snapshot.val() || {};
    const feed = [];

    // Collect recent completed matches
    const addMatches = (round, roundName) => {
      if (!Array.isArray(round)) return;
      round.forEach(match => {
        if (match.winner && match.team1 && match.team2) {
          feed.push({
            round: roundName,
            team1: match.team1,
            team2: match.team2,
            winner: match.winner,
            timestamp: Date.now() // In real app, would use actual match completion time
          });
        }
      });
    };

    addMatches(r.round1, 'Round 1');
    addMatches(r.round2, 'Round 2');
    addMatches(r.round3, 'Round 3');
    addMatches(r.quarterFinal, 'Quarter-Finals');
    addMatches(r.semiFinal, 'Semi-Finals');
    if (r.grandFinal) addMatches([r.grandFinal], 'Grand Final');

    // Get upcoming matches
    const upcomingMatches = [];
    const addUpcoming = (round, roundName) => {
      if (!Array.isArray(round)) return;
      round.forEach(match => {
        if (!match.winner && match.team1 && match.team2) {
          upcomingMatches.push({
            round: roundName,
            team1: match.team1,
            team2: match.team2
          });
        }
      });
    };

    addUpcoming(r.round1, 'Round 1');
    addUpcoming(r.round2, 'Round 2');
    addUpcoming(r.round3, 'Round 3');
    addUpcoming(r.quarterFinal, 'Quarter-Finals');
    addUpcoming(r.semiFinal, 'Semi-Finals');
    if (r.grandFinal) addUpcoming([r.grandFinal], 'Grand Final');

    let html = '<h3 style="color: #2ecc71; margin-bottom: 12px;"> Recent Results</h3>';

    if (feed.length === 0) {
      html += '<p class="empty-message">No completed matches yet</p>';
    } else {
      html += feed.slice(-5).reverse().map(m => `
        <div class="feed-card">
          <div class="feed-header">
            <span class="feed-round">${m.round}</span>
            <span class="feed-winner"> ${m.winner}</span>
          </div>
          <div class="feed-match">${m.team1} vs ${m.team2}</div>
        </div>
      `).join('');
    }

    html += '<h3 style="color: #f39c12; margin: 20px 0 12px;"> Upcoming Matches</h3>';

    if (upcomingMatches.length === 0) {
      html += '<p class="empty-message">No upcoming matches scheduled</p>';
    } else {
      html += upcomingMatches.slice(0, 5).map(m => `
        <div class="feed-card upcoming">
          <div class="feed-header">
            <span class="feed-round">${m.round}</span>
            <span class="feed-badge">VS</span>
          </div>
          <div class="feed-match">${m.team1} vs ${m.team2}</div>
        </div>
      `).join('');
    }

    el.innerHTML = html;
  });
}