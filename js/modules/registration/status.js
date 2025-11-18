import { db } from '../../core/firebase.js';
import { showRegistrationMessage } from './preview.js';

export function watchMyRegistration() {
  const u = localStorage.getItem('username');
  const box = document.getElementById('registration-status-inline');
  if (!box || !u) { if (box) box.textContent = ''; return; }

  db().ref('registrations').orderByChild('createdBy').equalTo(u).on('value', (snap) => {
    let latest = null;
    let queuePosition = 0;
    let totalPending = 0;

    snap.forEach(c => { 
      const v = { ...c.val(), id: c.key };
      if (!latest || (v.registeredAt||0) > (latest.registeredAt||0)) latest = v;
    });

    if (!latest || !latest.id) { box.innerHTML = ''; return; }

    // Calculate queue position for pending registrations
    if (latest.status !== 'Approved') {
      db().ref('registrations').orderByChild('status').equalTo('Pending').once('value').then(pendingSnap => {
        const pending = [];
        pendingSnap.forEach(c => pending.push({ ...c.val(), id: c.key }));
        pending.sort((a, b) => (a.registeredAt || 0) - (b.registeredAt || 0));
        totalPending = pending.length;
        queuePosition = pending.findIndex(p => p.id === latest.id) + 1;
        updateStatusDisplay();
      });
    } else {
      updateStatusDisplay();
    }

    function updateStatusDisplay() {
      const regId = latest.id;
      const teamName = latest.teamName || u;
      const approved = latest.status === 'Approved';
      const isPending = !approved;
      const timeText = latest.registeredAt ? new Date(latest.registeredAt).toLocaleString('bn-BD', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'এইমাত্র / Just now';

      const editButton = isPending ? 
        `<button class=\"btn\" id=\"edit-my-reg-btn\" style=\"margin-top: 10px; padding: 8px 14px; font-size: 0.85rem; background:#34495e;\">✏️ তথ্য সম্পাদনা / Edit Info</button>` : '';

      const deleteButton = isPending ? 
        `<button class=\"btn btn-danger\" id=\"delete-my-reg-btn\" data-cut=\"true\" style=\"margin-top: 10px; padding: 8px 14px; font-size: 0.85rem;\">🗑️ রেজিস্ট্রেশন মুছুন / Delete</button>` : '';

      const queueInfo = isPending && queuePosition > 0 ? 
        `<div style=\"margin-top:10px;padding:8px;background:rgba(243,156,18,0.15);border:1px solid #f39c12;border-radius:6px;text-align:center;\">\n          <div style=\"color:#f39c12;font-weight:700;font-size:0.9rem;\">\n            📊 সারিতে আপনার অবস্থান: ${queuePosition}/${totalPending}<br>\n            <span style=\"font-size:0.8rem;\">Queue Position: ${queuePosition} of ${totalPending} pending</span>\n          </div>\n        </div>` : '';

      const approvedInfo = approved ? 
        `<div style=\"margin-top:10px;padding:10px;background:rgba(46,204,113,0.15);border:1px solid #2ecc71;border-radius:6px;text-align:center;\">\n          <div style=\"color:#2ecc71;font-weight:700;\">\n            ✅ অনুমোদিত! ম্যাচ ব্র্যাকেটে আপনার নাম দেখুন<br>\n            <span style=\"font-size:0.85rem;\">Approved! Check the match bracket</span>\n          </div>\n          <button class=\"btn btn-primary\" onclick=\"navigateToSection('matches-section')\" style=\"margin-top:8px;width:100%;\">\n            ⚔️ ম্যাচ দেখুন / View Matches\n          </button>\n        </div>` : '';

      box.style.borderColor = approved ? '#2ecc71' : '#f39c12';
      box.style.background = approved ? 'rgba(46,204,113,0.15)' : 'rgba(243,156,18,0.15)';
      box.innerHTML = `\n        <div class=\"reg-status-card\">\n          <div class=\"reg-status-header\">\n            <span class=\"reg-status-title\">📝 আপনার রেজিস্ট্রেশন / Your Registration</span>\n            <span class=\"reg-status-badge ${approved ? 'approved' : 'pending'}\">\n              ${approved ? '✅ কনফার্ম / Confirmed' : '⏳ অপেক্ষমান / Pending'}\n            </span>\n          </div>\n          <div class=\"reg-status-body\">\n            <div class=\"team-chip\">👤 ${teamName}</div>\n            <div class=\"team-chip\" style=\"border-left-color:#f39c12;\">🆔 ${latest.gameId || 'N/A'}</div>\n          </div>\n          <div style=\"margin-top:8px;color:#95a5a6;font-size:0.85rem;text-align:center;\">\n            ⏰ ${timeText}\n          </div>\n          ${queueInfo}\n          ${approvedInfo}\n          ${latest.whatsapp ? `<div class=\"meta\" style=\"margin-top:8px;text-align:center;\">📱 ${latest.whatsapp}</div>` : ''}\n          <div style=\"display:flex;gap:8px;margin-top:10px;\">\n            ${editButton}\n            ${deleteButton}\n          </div>\n        </div>\n      `;

      // Edit button handler
      const editBtnEl = document.getElementById('edit-my-reg-btn');
      if (editBtnEl) {
        editBtnEl.addEventListener('click', () => {
          // Populate form with existing data
          const usernameInput = document.getElementById('game-username');
          const gameIdInput = document.getElementById('game-id');
          const whatsappInput = document.getElementById('whatsapp-number');
          const discordInput = document.getElementById('discord-contact');
          const telegramInput = document.getElementById('telegram-contact');

          if (usernameInput) usernameInput.value = latest.teamName || '';
          if (gameIdInput) gameIdInput.value = latest.gameId || '';
          if (whatsappInput) whatsappInput.value = latest.whatsapp || '';
          if (discordInput) discordInput.value = latest.discord || '';
          if (telegramInput) telegramInput.value = latest.telegram || '';

          // Delete old registration and let user re-submit
          db().ref('registrations/' + regId).remove().then(() => {
            showRegistrationMessage('✏️ তথ্য সম্পাদনা করুন এবং পুনরায় জমা দিন / Edit information and submit again', 'success');
          });
        });
      }

      // Delete button handler  
      const deleteBtnEl = document.getElementById('delete-my-reg-btn');
      if (deleteBtnEl) {
        deleteBtnEl.addEventListener('click', async (e) => {
          if (e.target.dataset.guardBypass === '1') {
            e.preventDefault(); 
            e.stopPropagation();

            const originalText = deleteBtnEl.textContent;
            deleteBtnEl.textContent = 'মুছছি... / Deleting...';
            deleteBtnEl.disabled = true;

            try {
              await db().ref('registrations/' + regId).remove();
              showRegistrationMessage(`✅ রেজিস্ট্রেশন মুছে ফেলা হয়েছে / Registration for ${teamName} deleted.`, 'success');
            } catch (error) {
              showRegistrationMessage('❌ মুছতে ব্যর্থ / Failed to delete registration. Try again.', 'error');
            } finally {
              deleteBtnEl.textContent = originalText;
              deleteBtnEl.disabled = false;
            }
          }
        });
      }
    }
  });
}
