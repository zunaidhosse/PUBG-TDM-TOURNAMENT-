import { db } from '../core/firebase.js';

export function initUCShop() {
  db().ref('uc').on('value', (s) => {
    const v = s.val() || {};
    const marquee = document.getElementById('uc-marquee');
    const list = document.getElementById('uc-packages');
    const notice = document.getElementById('uc-notice');
    const gallery = document.getElementById('uc-gallery');

    if (marquee) {
      const text = Array.isArray(v.offers) && v.offers.length ? v.offers.join('  •  ') : 'No current offers';
      marquee.innerHTML = `<span>${text}</span>`;
    }
    if (notice) notice.textContent = (v.notice || '').trim();

    setupGameIdProfile(); // Setup Game ID profile management

    if (list) {
      list.innerHTML = '';
      const pkgs = Array.isArray(v.packages) ? v.packages : [];
      if (!pkgs.length) {
        list.innerHTML = '<p class="empty-message">No UC packages available</p>';
        return;
      }

      pkgs.forEach((p, idx) => {
        const uc = Number(p.uc || 0);
        const bonus = Number(p.bonus || 0);
        const bdt = Number(p.bdt || 0);
        const sar = Number(p.sar || 0);
        const id = `uc-${idx}`;

        const card = document.createElement('div');
        card.className = 'uc-card premium';
        card.innerHTML = `
          <div class="uc-top">
            <div class="uc-amount">
              <span class="uc-num">${uc}</span>
              <span class="uc-label"><img src="UC.png" alt="" class="uc-mini-icon">UC</span>
            </div>
            ${bonus ? `<div class="uc-badge">+${bonus} Bonus</div>` : ''}
          </div>

          <div class="uc-prices">
            <button class="price-chip active" data-cur="BDT">BDT ${bdt}</button>
            <button class="price-chip" data-cur="SAR">SAR ${sar}</button>
          </div>

          <button class="btn btn-order">Order Now</button>
        `;

        // Chip click selects currency
        card.querySelectorAll('.price-chip').forEach(chip => {
          chip.addEventListener('click', () => {
            const cur = chip.getAttribute('data-cur');
            const radio = card.querySelector(`input[name="${id}-cur"][value="${cur}"]`);
            if (radio) radio.checked = true;
            // Visual active state
            card.querySelectorAll('.price-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
          });
        });

        const btn = card.querySelector('.btn-order');
        btn.addEventListener('click', () => {
          const gameId = localStorage.getItem('uc_game_id');
          if (!gameId || gameId.length < 5) {
             alert('Please enter and save your Game ID above before placing an order.');
             document.getElementById('uc-game-id-input')?.focus();
             return;
          }

          const activeChip = card.querySelector('.price-chip.active');
          const cur = activeChip ? activeChip.getAttribute('data-cur') : 'BDT';
          const price = cur === 'SAR' ? sar : bdt;
          const bonusText = bonus ? ` + ${bonus} Bonus UC` : '';
          
          // Include Game ID in the message
          const msg = encodeURIComponent(`Hello, I want to buy ${uc} UC${bonusText} (${cur} ${price}).
My PUBG Mobile Game ID is: ${gameId}`);
          
          window.open(`https://wa.me/+966553371096?text=${msg}`, '_blank');
        });

        list.appendChild(card);
      });
    }
    if (gallery) {
      gallery.innerHTML = '';
      const imgs = Array.isArray(v.images) ? v.images.slice().sort((a,b)=>(b.ts||0)-(a.ts||0)) : [];
      if (!imgs.length) { gallery.innerHTML = '<p class="empty-message">No images yet</p>'; }
      imgs.forEach(it => {
        const card = document.createElement('div');
        card.className = 'winner-card';
        card.innerHTML = `<img src="${it.url}" alt="${it.title||'Image'}"><h3>${it.title||'Untitled'}</h3>`;
        gallery.appendChild(card);
      });
    }
  });
}

/**
 * Handles the display and saving of the user's PUBG Mobile Game ID required for UC purchase.
 */
function setupGameIdProfile() {
  const container = document.getElementById('game-id-profile');
  if (!container) return;
  
  const savedGameId = localStorage.getItem('uc_game_id') || '';
  
  container.innerHTML = `
    <div class="registration-card" style="border-color:#f39c12;">
      <h3 style="color: #f39c12; margin-bottom: 8px;">My Game ID (Required for UC Order)</h3>
      <div style="display:flex; gap:8px; align-items:center;">
        <input type="text" id="uc-game-id-input" placeholder="Enter PUBG Mobile Game ID" value="${savedGameId}" maxlength="15" inputmode="numeric" style="flex:1; padding:10px; border-radius:6px; border:1px solid #f39c12; background: rgba(255,255,255,0.08); color:#fff;">
        <button class="btn btn-primary" id="save-uc-game-id-btn" style="padding:10px 14px; font-weight:700;">Save</button>
      </div>
      <p id="uc-game-id-status" style="margin-top:8px; font-size:0.9rem; color: ${savedGameId ? '#2ecc71' : '#e74c3c'}; font-weight:700;">
        ${savedGameId ? `Saved ID: ${savedGameId}` : '⚠️ Please enter and save your Game ID before ordering.'}
      </p>
    </div>
  `;
  
  const input = document.getElementById('uc-game-id-input');
  const saveBtn = document.getElementById('save-uc-game-id-btn');
  const statusEl = document.getElementById('uc-game-id-status');

  saveBtn.addEventListener('click', () => {
    const id = input.value.trim();
    if (id.length < 5) {
      statusEl.textContent = 'Game ID must be at least 5 digits.';
      statusEl.style.color = '#e74c3c';
      input.style.borderColor = '#e74c3c';
      return;
    }
    localStorage.setItem('uc_game_id', id);
    statusEl.textContent = `Saved ID: ${id}`;
    statusEl.style.color = '#2ecc71';
    input.style.borderColor = '#f39c12';
    alert(`Game ID ${id} saved locally.`);
  });
}