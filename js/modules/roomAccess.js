import { db } from '../core/firebase.js';
import { openTdmWinnersModal } from './tdmWinners.js';

let countdownInterval = null;
let hideTimeout = null;

export function initRoomAccess() {
  db().ref('roomCode').on('value', (snapshot) => {
    const el = document.getElementById('room-access-container');
    if (!el) return;

    const room = snapshot.val();
    if (!room || !room.code) {
      el.innerHTML = `
        <div class="room-card">
          <p class="empty-message">Room code will be shared before matches</p>
        </div>
      `;
      return;
    }

    // Always show room details when available. Auto-hide removed.
    // Clear any existing countdown or hide timers for safety.
    if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null; }
    if (hideTimeout) { clearTimeout(hideTimeout); hideTimeout = null; }

    // If revealTime is set and is in the future, show countdown until reveal; otherwise show details immediately.
    const now = Date.now();
    const revealTime = room.revealTime || 0;
    if (revealTime && now < revealTime) {
      // Show countdown until reveal (no auto-hide afterwards)
      renderCountdown(el, room, revealTime);
    } else {
      renderRoomDetails(el, room);
      // Do not set revealedAt/displayDuration or auto-hide; admin can clear room manually.
    }
  });

  window.copyRoomCode = function() {
    try {
      const codeEl = document.getElementById('room-code-text');
      const code = codeEl?.textContent;
      if (!code) return;
      
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
          alert('Room ID copied to clipboard!');
        }).catch(() => {
          fallbackCopy(code);
        });
      } else {
        fallbackCopy(code);
      }
    } catch (e) {
      console.error('Copy error:', e);
    }
  };
  
  function fallbackCopy(text) {
    try {
      const input = document.createElement('input');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      alert('Room ID copied!');
    } catch (e) {
      alert('Failed to copy. Please copy manually: ' + text);
    }
  }

  window.shareRoom = function() {
    try {
      const codeEl = document.getElementById('room-code-text');
      const passEl = document.getElementById('room-pass-text');
      const code = codeEl?.textContent;
      const pass = passEl?.textContent;
      if (!code) return;
      
      const text = `🎮 PUBG TDM Tournament Room\n\n🆔 Room ID: ${code}${pass ? `\n🔑 Password: ${pass}` : ''}\n\nJoin now!`;
      
      if (navigator.share) {
        navigator.share({ text }).catch(() => {
          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        });
      } else {
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
      }
    } catch (e) {
      console.error('Share error:', e);
    }
  };
}

function renderCountdown(el, room, revealTime) {
  const updateCountdown = () => {
    const now = Date.now();
    const remaining = revealTime - now;
    
    if (remaining <= 0) {
      // Countdown finished, clear interval and immediately render room details.
      if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null; }
      try {
        // Re-fetch latest room data to ensure we display any updated password/fields
        const ref = window.firebase && window.firebase.database ? window.firebase.database().ref('roomCode') : null;
        if (ref) {
          ref.once('value').then(snap => {
            const latestRoom = snap.val() || room;
            renderRoomDetails(el, latestRoom);
          }).catch(() => {
            // Fallback to using the captured room if DB read fails
            renderRoomDetails(el, room);
          });
        } else {
          renderRoomDetails(el, room);
        }
      } catch (e) {
        renderRoomDetails(el, room);
      }
      return;
    }
    
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    
    el.innerHTML = `
      <div class="room-card">
        <div class="room-header">
          <h3>🎮 Daily TDM Room</h3>
          <span class="room-status inactive">🕐 LOCKED</span>
        </div>
        <button class="btn btn-primary" style="width:100%; margin-bottom:12px;" onclick="window.openTdmWinnersModal()">TDM Winner 🏆 3D</button>
        <div class="room-code-display">
          <div class="room-label">Room will be available in:</div>
          <div class="countdown-timer">
            ${days > 0 ? `<div class="countdown-unit"><span class="countdown-value">${String(days).padStart(2, '0')}</span><span class="countdown-label">Days</span></div>` : ''}
            <div class="countdown-unit"><span class="countdown-value">${String(hours).padStart(2, '0')}</span><span class="countdown-label">Hours</span></div>
            <div class="countdown-unit"><span class="countdown-value">${String(minutes).padStart(2, '0')}</span><span class="countdown-label">Min</span></div>
            <div class="countdown-unit"><span class="countdown-value">${String(seconds).padStart(2, '0')}</span><span class="countdown-label">Sec</span></div>
          </div>
        </div>
        ${room.note ? `<div class="room-note">📝 ${room.note}</div>` : ''}
        <p style="text-align: center; color: #95a5a6; margin-top: 15px; font-size: 0.9rem;">
          প্রতিদিন একই সময়ে ৩টি TDM রুম— যোগ দিন আর জিতুন MVP হলে ৩০ UC!
        </p>
      </div>
    `;
  };
  
  updateCountdown();
  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(updateCountdown, 1000);
}

function renderRoomDetails(el, room) {
  el.innerHTML = `
    <div class="room-card room-revealed">
      <div class="room-header">
        <h3>🎮 Daily TDM Room</h3>
        <span class="room-status ${room.active ? 'active' : 'inactive'}">
          ${room.active ? '🟢 ACTIVE' : '🔴 INACTIVE'}
        </span>
      </div>
      <button class="btn btn-primary" style="width:100%; margin-bottom:12px;" onclick="window.openTdmWinnersModal()">TDM Winner 🏆 3D</button>
      <div class="room-code-display">
        <div class="room-label">Room ID</div>
        <div class="room-code" id="room-code-text">${room.code}</div>
      </div>
      ${room.password ? `
        <div class="room-code-display">
          <div class="room-label">Password</div>
          <div class="room-code" id="room-pass-text">${room.password}</div>
        </div>
      ` : ''}
      ${room.map ? `<div class="room-info">🗺️ Map: ${room.map}</div>` : ''}
      ${room.mode ? `<div class="room-info">🎯 Mode: ${room.mode}</div>` : ''}
      <div class="room-actions">
        <button class="btn btn-primary" onclick="copyRoomCode()">📋 Copy Room ID</button>
        <button class="btn btn-success" onclick="shareRoom()">📤 Share</button>
      </div>
      ${room.note ? `<div class="room-note">📝 ${room.note}</div>` : ''}
    </div>
  `;
}