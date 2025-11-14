import { db } from '../core/firebase.js';

export function initReport() {
  const btn = document.getElementById('submit-report-btn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const type = document.getElementById('report-type')?.value || 'other';
    const desc = (document.getElementById('report-desc')?.value || '').trim();
    const user = localStorage.getItem('username') || 'Anonymous';

    if (!desc) {
      alert('Please describe your issue');
      return;
    }

    try {
      await db().ref('reports').push({
        type,
        description: desc,
        reportedBy: user,
        timestamp: Date.now(),
        status: 'pending'
      });
      alert('Report submitted successfully!');
      document.getElementById('report-desc').value = '';
    } catch (e) {
      alert('Failed to submit report');
    }
  });

  // Show user's reports
  const user = localStorage.getItem('username');
  if (user) {
    db().ref('reports').orderByChild('reportedBy').equalTo(user).on('value', (snapshot) => {
      const el = document.getElementById('reports-list');
      if (!el) return;
      
      const reports = [];
      snapshot.forEach(child => reports.push(child.val()));
      reports.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      if (reports.length === 0) {
        el.innerHTML = '<p class="empty-message">No reports yet</p>';
        return;
      }

      el.innerHTML = reports.map(r => `
        <div class="registration-card" style="margin-bottom: 10px;">
          <h4 style="color: #f39c12;">${r.type}</h4>
          <p style="margin: 6px 0; color: #ecf0f1;">${r.description}</p>
          <p style="font-size: 0.85rem; color: ${r.status === 'resolved' ? '#2ecc71' : '#f39c12'};">
            Status: ${r.status === 'resolved' ? '✅ Resolved' : '⏳ Pending'}
          </p>
        </div>
      `).join('');
    });
  }
}

