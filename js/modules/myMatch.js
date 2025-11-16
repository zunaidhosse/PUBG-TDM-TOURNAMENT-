import { db } from '../core/firebase.js';

// Helper to find registration details by team name
async function getRegistrationByTeamName(teamName) {
  if (!teamName || teamName.toUpperCase() === 'TBD') return null;
  // Note: Firebase `orderByChild` requires an index, which is assumed to be set up on 'teamName'.
  const snap = await db().ref('registrations').orderByChild('teamName').equalTo(teamName).once('value');
  let data = null;
  snap.forEach(child => {
    // Assuming teamName is unique, pick the first one
    data = child.val();
    return true; // Stop iteration
  });
  return data;
}

export function initMyMatch() {
  const user = localStorage.getItem('username');
  if (!user) {
    const el = document.getElementById('my-match-display');
    if (el) el.innerHTML = '<p class=\"empty-message\">Register to see your matches</p>';
    return;
  }

  db().ref('registrations').orderByChild('createdBy').equalTo(user).on('value', async (regSnap) => {
    let myTeam = null;
    regSnap.forEach(child => {
      const v = child.val();
      if (!myTeam || (v.registeredAt || 0) > (myTeam.registeredAt || 0)) {
        myTeam = v;
      }
    });

    if (!myTeam) {
      const el = document.getElementById('my-match-display');
      if (el) el.innerHTML = '<p class=\"empty-message\">You have not registered yet</p>';
      return;
    }

    db().ref('roadmap').on('value', async (snapshot) => {
      const el = document.getElementById('my-match-display');
      if (!el) return;

      const r = snapshot.val() || {};
      const teamName = myTeam.teamName;
      let nextMatch = null;
      let roundName = '';

      // Search through all rounds
      const rounds = [
        { name: 'Round 1', data: r.round1 },
        { name: 'Round 2', data: r.round2 },
        { name: 'Round 3', data: r.round3 },
        { name: 'Quarter-Finals', data: r.quarterFinal },
        { name: 'Semi-Finals', data: r.semiFinal },
        { name: 'Grand Final', data: r.grandFinal ? [r.grandFinal] : [] }
      ];

      for (const round of rounds) {
        if (!Array.isArray(round.data)) continue;
        for (const match of round.data) {
          if ((match.team1 === teamName || match.team2 === teamName) && !match.winner) {
            nextMatch = match;
            roundName = round.name;
            break;
          }
        }
        if (nextMatch) break;
      }

      if (!nextMatch) {
        el.innerHTML = `
          <div class=\"my-match-card\">
            <div class=\"match-status completed\">No upcoming matches</div>
            <p style=\"text-align: center; color: #95a5a6; margin-top: 10px;\">
              ${myTeam.status === 'Approved' ? 'Wait for bracket updates' : 'Registration pending approval'}
            </p>
          </div>
        `;
        return;
      }

      const opponentName = nextMatch.team1 === teamName ? nextMatch.team2 : nextMatch.team1;
      
      // Fetch opponent details
      let opponentDetails = null;
      if (opponentName && opponentName.toUpperCase() !== 'TBD') {
          try {
             opponentDetails = await getRegistrationByTeamName(opponentName);
          } catch (e) {
             console.error("Failed to fetch opponent details:", e);
          }
      }
      
      const opponentWhatsapp = opponentDetails?.whatsapp?.trim() || null;
      const opponentDiscord = opponentDetails?.discord?.trim() || null;
      const opponentTelegram = opponentDetails?.telegram?.trim() || null;
      const opponentGameId = opponentDetails?.gameId || 'N/A';
      
      // Clean WhatsApp number for link
      const cleanedWhatsapp = opponentWhatsapp ? opponentWhatsapp.replace(/[^0-9+]/g, '') : null;
      
      const whatsappHtml = opponentWhatsapp ? 
          `<div class="team-contact-item contact-whatsapp">
             <span>WhatsApp:</span>
             <span class="contact-value">
                <a href="https://wa.me/${cleanedWhatsapp}?text=Hello, I am ${teamName}. We are matched in the ${roundName} of the tournament. Let's coordinate the match time." target="_blank" rel="noopener">${opponentWhatsapp} 💬</a>
             </span>
           </div>` :
          `<div class="team-contact-item unavailable"><span>WhatsApp:</span> <span class="contact-value">Not provided</span></div>`;

      const discordHtml = opponentDiscord ?
          `<div class="team-contact-item">
             <span>Discord:</span>
             <span class="contact-value" style="color:#5865F2;">${opponentDiscord} 💬</span>
           </div>` : '';

      const telegramHtml = opponentTelegram ?
          `<div class="team-contact-item">
             <span>Telegram:</span>
             <span class="contact-value">
                <a href="https://t.me/${opponentTelegram.replace('@', '')}" target="_blank" rel="noopener" style="color:#0088cc;">${opponentTelegram} 💬</a>
             </span>
           </div>` : '';

      const noContactsHtml = (!opponentWhatsapp && !opponentDiscord && !opponentTelegram) ?
          `<div class="team-contact-item unavailable">
             <span style="color:#e74c3c;">⚠️ No contact info provided</span>
             <span class="contact-value">Use tournament group to coordinate</span>
           </div>` : '';

      el.innerHTML = `
        <div class="my-match-card">
          <div class="match-status upcoming">⚡ Next Match</div>
          <h3 class="match-round">${roundName}</h3>
          <div class="match-versus">
            <div class="team-box me">
              <span class="team-label">YOU (${myTeam.gameId || 'ID N/A'})</span>
              <span class="team-name">${teamName}</span>
            </div>
            <div class="vs-divider">VS</div>
            <div class="team-box opponent">
              <span class="team-label">OPPONENT (${opponentGameId})</span>
              <span class="team-name">${opponentName || 'TBD'}</span>
            </div>
          </div>
          <div class="match-coordination">
              <h4 style="color:#3498db; margin-bottom:10px;">🌍 Contact Your Opponent:</h4>
              <div class="team-contact-group">
                <div class="team-contact-item">
                  <span>Opponent Team:</span>
                  <span class="contact-value">${opponentName || 'TBD'}</span>
                </div>
                <div class="team-contact-item">
                  <span>Game ID:</span>
                  <span class="contact-value game-id-value">${opponentGameId}</span>
                </div>
                ${whatsappHtml}
                ${discordHtml}
                ${telegramHtml}
                ${noContactsHtml}
              </div>
              <div style="background:rgba(52,152,219,0.15);border:1px solid #3498db;border-radius:8px;padding:12px;margin-top:12px;">
                <p style="color:#ecf0f1;margin:0;font-size:0.9rem;line-height:1.5;">
                  💡 <strong>International Players:</strong> Join our tournament Discord/Telegram groups below to coordinate matches easily!
                </p>
              </div>
          </div>
          <div style="text-align: center; margin-top: 15px;">
            <button class="btn btn-primary" onclick="navigateToSection('matches-section')">View Match Details</button>
          </div>
        </div>
      `;
    });
  });
}