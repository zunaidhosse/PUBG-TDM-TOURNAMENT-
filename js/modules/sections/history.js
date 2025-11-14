export function renderHistorySection() {
  const el = document.getElementById('history-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">📜 Tournament History</h2>
    <div class="winners-grid" id="history-grid">Loading...</div>
  `;
}

