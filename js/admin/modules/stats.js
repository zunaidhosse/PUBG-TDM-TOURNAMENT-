import { db } from '../../core/firebase.js';
import { toast } from './toast.js';

export function initStatsAdmin() {
  // Matches count from roadmap
  db().ref('roadmap').on('value', s => {
    const r = s.val() || {};
    const count =
      (Array.isArray(r.round1) ? r.round1.length : 0) +
      (Array.isArray(r.round2) ? r.round2.length : 0) +
      (Array.isArray(r.round3) ? r.round3.length : (Array.isArray(r.preFinal) ? r.preFinal.length : 0)) +
      (Array.isArray(r.quarterFinal) ? r.quarterFinal.length : 0) +
      (Array.isArray(r.semiFinal) ? r.semiFinal.length : 0) +
      ((r.grandFinal && (r.grandFinal.team1 || r.grandFinal.team2)) ? 1 : 0);
    const el = document.getElementById('total-matches'); if (el) el.textContent = count;
  });

  // Users count
  db().ref('users').on('value', s => {
    let count = 0; s.forEach(()=> count++);
    const el = document.getElementById('total-users');
    if (el) el.textContent = count;
  });

  // Room code management
  const saveBtn = document.getElementById('save-room-btn');
  const clearBtn = document.getElementById('clear-room-btn');
  
  db().ref('roomCode').on('value', s => {
    const room = s.val() || {};
    const codeInput = document.getElementById('room-code-input');
    const passInput = document.getElementById('room-pass-input');
    const mapInput = document.getElementById('room-map-input');
    const modeInput = document.getElementById('room-mode-input');
    const noteInput = document.getElementById('room-note-input');
    const activeSelect = document.getElementById('room-active-select');
    
    if (codeInput) codeInput.value = room.code || '';
    if (passInput) passInput.value = room.password || '';
    if (mapInput) mapInput.value = room.map || '';
    if (modeInput) modeInput.value = room.mode || '';
    if (noteInput) noteInput.value = room.note || '';
    if (activeSelect) activeSelect.value = String(!!room.active);
  });

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const code = document.getElementById('room-code-input')?.value.trim();
      const password = document.getElementById('room-pass-input')?.value.trim();
      const map = document.getElementById('room-map-input')?.value.trim();
      const mode = document.getElementById('room-mode-input')?.value.trim();
      const note = document.getElementById('room-note-input')?.value.trim();
      const active = document.getElementById('room-active-select')?.value === 'true';
      
      if (!code) return toast('danger', 'Enter room ID');
      
      try {
        await db().ref('roomCode').set({
          code,
          password: password || null,
          map: map || null,
          mode: mode || null,
          note: note || null,
          active,
          updatedAt: Date.now()
        });
        toast('success', 'Room code saved');
      } catch {
        toast('danger', 'Failed to save room code');
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', async () => {
      if (!confirm('Clear room code?')) return;
      try {
        await db().ref('roomCode').remove();
        toast('success', 'Room code cleared');
      } catch {
        toast('danger', 'Failed to clear room code');
      }
    });
  }
}

