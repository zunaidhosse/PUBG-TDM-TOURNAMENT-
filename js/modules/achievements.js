import { db } from '../core/firebase.js';

export function initAchievements() {
  const user = localStorage.getItem('username');
  if (!user) {
    const el = document.getElementById('achievements-grid');
    if (el) el.innerHTML = '<p class=\"empty-message\">Register to earn achievements</p>';
    return;
  }

  db().ref('registrations').orderByChild('createdBy').equalTo(user).on('value', (regSnap) => {
    let myTeam = null;
    regSnap.forEach(child => {
      const v = child.val();
      if (!myTeam || (v.registeredAt || 0) > (myTeam.registeredAt || 0)) {
        myTeam = v;
      }
    });

    if (!myTeam) {
      const el = document.getElementById('achievements-grid');
      if (el) el.innerHTML = '<p class=\"empty-message\">Register to earn achievements</p>';
      return;
    }

    db().ref('roadmap').on('value', (snapshot) => {
      const el = document.getElementById('achievements-grid');
      if (!el) return;

      const r = snapshot.val() || {};
      const teamName = myTeam.teamName;
      const achievements = [];

      // Participation badge
      achievements.push({
        icon: '🎮',
        name: 'Tournament Participant',
        desc: 'Registered for the tournament',
        unlocked: true
      });

      // Approved badge
      if (myTeam.status === 'Approved') {
        achievements.push({
          icon: '✅',
          name: 'Verified Player',
          desc: 'Registration approved',
          unlocked: true
        });
      }

      // Count wins
      let wins = 0;
      const rounds = [r.round1, r.round2, r.round3, r.quarterFinal, r.semiFinal];
      rounds.forEach(round => {
        if (!Array.isArray(round)) return;
        round.forEach(match => {
          if (match.winner === teamName) wins++;
        });
      });

      if (r.grandFinal && r.grandFinal.winner === teamName) wins += 2;

      // Win-based achievements
      if (wins >= 1) {
        achievements.push({
          icon: '🔥',
          name: 'First Blood',
          desc: 'Won your first match',
          unlocked: true
        });
      }

      if (wins >= 3) {
        achievements.push({
          icon: '⚡',
          name: 'Winning Streak',
          desc: 'Won 3 or more matches',
          unlocked: true
        });
      }

      if (wins >= 5) {
        achievements.push({
          icon: '💎',
          name: 'Elite Champion',
          desc: 'Won 5 or more matches',
          unlocked: true
        });
      }

      // Finalist badge
      if (r.grandFinal && (r.grandFinal.team1 === teamName || r.grandFinal.team2 === teamName)) {
        achievements.push({
          icon: '🏆',
          name: 'Grand Finalist',
          desc: 'Reached the Grand Final',
          unlocked: true
        });
      }

      // Champion badge
      if (r.grandFinal && r.grandFinal.winner === teamName) {
        achievements.push({
          icon: '👑',
          name: 'Tournament Champion',
          desc: 'Won the Grand Final',
          unlocked: true
        });
      }

      el.innerHTML = achievements.map(a => `
        <div class=\"achievement-card ${a.unlocked ? 'unlocked' : 'locked'}\">
          <div class=\"achievement-icon\">${a.icon}</div>
          <h4 class=\"achievement-name\">${a.name}</h4>
          <p class=\"achievement-desc\">${a.desc}</p>
        </div>
      `).join('');
    });
  });
}