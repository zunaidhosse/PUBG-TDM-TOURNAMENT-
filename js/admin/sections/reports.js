export function renderReports() {
  const el = document.getElementById('reports-admin-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">⚠️ Reports Management</h2>
    <div id="reports-admin-list"></div>
  `;
}

