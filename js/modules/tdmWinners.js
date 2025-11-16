import { db } from '../core/firebase.js';

let tdmWinnersModal = null;

function renderWinnerList(winners) {
  if (winners.length === 0) {
    return '<p class=\"empty-message\">No TDM Winners announced yet.</p>';
  }

  // Newest first sorting is handled in Firebase listener
  return winners.map((w, idx) => {
    const statusBtn = w.prizePaid
      ? `<button class="btn" style="width:100%;margin-top:8px;background:linear-gradient(135deg, rgba(46,204,113,0.25), rgba(46,204,113,0.12));border:1px solid #2ecc71;color:#2ecc71;font-weight:900;" onclick="alert('প্রাইজ মানি দেওয়া হয়েছে ✅')">Prize: Paid ✅</button>`
      : `<button class="btn" style="width:100%;margin-top:8px;background:linear-gradient(135deg, rgba(243,156,18,0.25), rgba(243,156,18,0.12));border:1px solid #f39c12;color:#f39c12;font-weight:900;" onclick="alert('প্রাইজ মানি এখনও দেওয়া হয়নি ⏳')">Prize: Pending ⏳</button>`;
    return `
    <div class=\"winner-card tdm-winner-card\">
      ${w.imageUrl ? `<img src=\"${w.imageUrl}\" alt=\"${w.title}\" style=\"width:100%; height:200px; object-fit:cover;\">` : ''}
      <h3 style=\"color:#f39c12;\">${idx + 1}. 🏆 ${w.title}</h3>
      <p style=\"color:#95a5a6; font-size:0.85rem;\">${new Date(w.timestamp).toLocaleDateString()}</p>
      ${statusBtn}
    </div>
  `;
  }).join('');
}

export function openTdmWinnersModal() {
  if (!tdmWinnersModal) return;
  tdmWinnersModal.style.display = 'flex';
}

function closeTdmWinnersModal() {
  if (!tdmWinnersModal) return;
  tdmWinnersModal.style.display = 'none';
}

export function initTdmWinners() {
  // 1. Setup Modal DOM
  tdmWinnersModal = document.createElement('div');
  tdmWinnersModal.id = 'tdm-winners-modal';
  tdmWinnersModal.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 3500;
    display: none; align-items: center; justify-content: center;
    backdrop-filter: blur(5px);
  `;

  tdmWinnersModal.innerHTML = `
    <div style=\"background: rgba(26,26,46,0.95); border:1px solid #f39c12; border-radius:12px; padding:20px; width:95%; max-width:500px; max-height: 90vh; display: flex; flex-direction: column;\">
      <h2 style=\"color:#f39c12; margin-bottom: 15px;\">TDM Winner 🏆 3D</h2>
      <div id=\"tdm-winner-list-content\" style=\"overflow-y: auto; flex-grow: 1;\">Loading Winners...</div>
      <button class=\"btn btn-primary\" id=\"tdm-winners-close-btn\" style=\"margin-top: 20px;\">Close</button>
    </div>
  `;
  document.body.appendChild(tdmWinnersModal);

  document.getElementById('tdm-winners-close-btn')?.addEventListener('click', closeTdmWinnersModal);
  tdmWinnersModal.addEventListener('click', (e) => {
    if (e.target === tdmWinnersModal) {
      closeTdmWinnersModal();
    }
  });

  // 2. Setup Database Listener
  db().ref('tdmWinners').on('value', snap => {
    const listEl = document.getElementById('tdm-winner-list-content');
    if (!listEl) return;

    const items = [];
    snap.forEach(c => {
      const data = c.val();
      if (data) {
        items.push({ id: c.key, ...data });
      }
    });
    items.sort((a,b)=> (b.timestamp||0)-(a.timestamp||0)); // Newest first

    listEl.innerHTML = `<div class=\"winners-grid\" style=\"grid-template-columns: 1fr; max-height: none;\">${renderWinnerList(items)}</div>`;
  });
}