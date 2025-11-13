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
          const activeChip = card.querySelector('.price-chip.active');
          const cur = activeChip ? activeChip.getAttribute('data-cur') : 'BDT';
          const price = cur === 'SAR' ? sar : bdt;
          const bonusText = bonus ? ` + ${bonus} Bonus UC` : '';
          const msg = encodeURIComponent(`Hello, I want to buy ${uc} UC${bonusText} (${cur} ${price}).`);
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