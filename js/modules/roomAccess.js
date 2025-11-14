import { db } from '../core/firebase.js';

export function initRoomAccess() {
  db().ref('roomCode').on('value', (snapshot) => {
    const el = document.getElementById('room-display');
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

    el.innerHTML = `
      <div class="room-card">
        <div class="room-header">
          <h3>🎮 Current Room</h3>
          <span class="room-status ${room.active ? 'active' : 'inactive'}">
            ${room.active ? '🟢 ACTIVE' : '🔴 INACTIVE'}
          </span>
        </div>
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

