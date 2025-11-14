export function renderMatchesSection() {
  const el = document.getElementById('matches-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">⚔️ Tournament Matches</h2>
    <div class="round-tabs">
        <button class="round-btn active" id="round1-btn">Round 1</button>
        <button class="round-btn" id="round2-btn">Round 2</button>
        <button class="round-btn" id="round3-btn">Round 3</button>
        <button class="round-btn" id="quarter-btn">Quarter-Finals</button>
        <button class="round-btn" id="semi-btn">Semi-Finals</button>
        <button class="round-btn" id="grand-btn">Grand Final</button>
    </div>
    <div id="matches-list"></div>
  `;
}

