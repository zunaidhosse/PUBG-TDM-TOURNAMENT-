import { db } from '../core/firebase.js';

export function initNotice() {
  let prizeAmounts = { first: 500, second: 300, third: 100 };
  let winners = null;
  let currentNotices = [];

  function formatNotice(text) {
    const lines = String(text || '').split('\n').map(l => l.trim()).filter(l => l.length || l === '');
    const items = [];
    let bufferList = [];
    const flushList = () => {
      if (bufferList.length) {
        items.push(`<ul>${bufferList.map(it=>`<li>${it}</li>`).join('')}</ul>`);
        bufferList = [];
      }
    };
    lines.forEach(line => {
      if (!line) { flushList(); items.push('<div class="nb-gap"></div>'); return; }
      if (/^(\-|\*|•)\s+/.test(line)) {
        bufferList.push(line.replace(/^(\-|\*|•)\s+/, ''));
      } else {
        flushList();
        items.push(`<p>${line}</p>`);
      }
    });
    flushList();
    return items.join('');
  }

  function renderCompleteNoticeBoard() {
    const el = document.getElementById('notice-board');
    if (!el) return;
    
    let html = '';
    
    // Add winner announcement if exists
    if (winners) {
      html += `
        <div class="notice-card winner-announcement">
          <div style="text-align:center; font-weight:900; font-size:1.1rem; color:#f39c12; margin-bottom:12px; text-shadow: 0 0 16px rgba(243,156,18,0.6);">🏆 TOURNAMENT WINNERS 🏆</div>
          <div style="line-height:1.8;">
            <div style="padding:10px 0; border-bottom:1px solid rgba(243,156,18,0.2); font-weight:700;">🥇 1st Winner: <strong style="color:#f1c40f;">${winners.first || 'TBD'}</strong> – ${prizeAmounts.first} UC</div>
            <div style="padding:10px 0; border-bottom:1px solid rgba(243,156,18,0.2); font-weight:700;">🥈 2nd Winner: <strong style="color:#bdc3c7;">${winners.second || 'TBD'}</strong> – ${prizeAmounts.second} UC</div>
            <div style="padding:10px 0; font-weight:700;">🥉 3rd Winner: <strong style="color:#cd7f32;">${winners.third || 'TBD'}</strong> – ${prizeAmounts.third} UC</div>
          </div>
        </div>`;
    }
    
    // Add all notices
    if (currentNotices.length === 0 && !winners) {
      html += '<p class="empty-message">No announcements at this time</p>';
    } else {
      currentNotices.forEach(notice => {
        const priorityClass = notice.priority === 'pinned' ? 'notice-pinned' : 
                             notice.priority === 'important' ? 'notice-important' : '';
        const priorityIcon = notice.priority === 'pinned' ? '📌 ' : 
                            notice.priority === 'important' ? '⚠️ ' : '';
        
        const imageAbove = notice.image && (!notice.imagePosition || notice.imagePosition === 'above') ? 
          `<img src="${notice.image}" style="width:100%; max-height:300px; object-fit:cover; border-radius:8px; margin-bottom:12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">` : '';
        const imageBelow = notice.image && notice.imagePosition === 'below' ? 
          `<img src="${notice.image}" style="width:100%; max-height:300px; object-fit:cover; border-radius:8px; margin-top:12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">` : '';
        
        html += `
          <div class="notice-card ${priorityClass}">
            <h3 style="color:#3498db; margin-bottom:10px; font-size:1.1rem;">
              ${priorityIcon}${notice.title}
            </h3>
            ${imageAbove}
            <div class="notice-content">
              ${formatNotice(notice.content)}
            </div>
            ${imageBelow}
            <div style="margin-top:10px; font-size:0.85rem; color:#95a5a6; font-weight:600;">
              📅 ${new Date(notice.timestamp).toLocaleDateString()}
            </div>
          </div>`;
      });
    }
    
    el.innerHTML = html;
  }

  // Listen to notices collection
  db().ref('notices').on('value', (snapshot) => {
    currentNotices = [];
    snapshot.forEach(child => {
      const notice = { id: child.key, ...child.val() };
      // Filter out expired notices
      if (notice.expiresAt && notice.expiresAt < Date.now()) return;
      currentNotices.push(notice);
    });
    
    // Sort: pinned first, then by timestamp (newest first)
    currentNotices.sort((a, b) => {
      if (a.priority === 'pinned' && b.priority !== 'pinned') return -1;
      if (b.priority === 'pinned' && a.priority !== 'pinned') return 1;
      return (b.timestamp || 0) - (a.timestamp || 0);
    });
    
    renderCompleteNoticeBoard();
  });

  // Prize Pool render
  db().ref('prizePool').on('value', (snapshot) => {
    const el = document.getElementById('prize-pool');
    if (!el) return;
    const v = snapshot.val();
    if (!v) {
      el.innerHTML = '<p class="empty-message">Prize pool will be announced soon</p>';
      return;
    }
    const f = Number(v.first || 0), s = Number(v.second || 0), t = Number(v.third || 0);
    prizeAmounts = {
      first: f || 500,
      second: s || 300,
      third: t || 100
    };
    el.innerHTML = `
      <div class="prize-area">
        <div class="prize-head">🏆 Tournament Prize Pool 🏆</div>
        <div class="prize-grid">
          <div class="prize-item prize-gold">
            <div class="prize-badge">🥇 1st Place</div>
            <div class="prize-amount"><span>${f}</span>UC</div>
          </div>
          <div class="prize-item prize-silver">
            <div class="prize-badge">🥈 2nd Place</div>
            <div class="prize-amount"><span>${s}</span>UC</div>
          </div>
          <div class="prize-item prize-bronze">
            <div class="prize-badge">🥉 3rd Place</div>
            <div class="prize-amount"><span>${t}</span>UC</div>
          </div>
        </div>
      </div>
    `;
    renderCompleteNoticeBoard();
  });

  db().ref('roadmap').on('value', (snapshot) => {
    const r = snapshot.val() || {};
    const clean = (n)=> !n || n.toUpperCase()==='TBD' || /^B\d+$/i.test(n) ? '' : n;

    if (r) {
      const grand = r.grandFinal;
      let first = '', second = '', third = '';
      if (grand && (clean(grand.team1) || clean(grand.team2))) {
        const t1 = clean(grand.team1)||'', t2 = clean(grand.team2)||'';
        const win = clean(grand.winner)||'';
        if (win && (t1 || t2)) { first = win; second = win === t1 ? t2 : t1; }
      }

      if (!third) {
        const sf = Array.isArray(r.semiFinal) ? r.semiFinal : [];
        const losers = sf.map(m => {
          const t1 = clean(m.team1)||'', t2 = clean(m.team2)||'';
          const w = clean(m.winner)||'';
          if (!t1 && !t2) return '';
          if (!w) return '';
          return w === t1 ? t2 : t1;
        }).filter(Boolean);
        if (r.thirdPlace && clean(r.thirdPlace.winner)) {
          third = clean(r.thirdPlace.winner);
        } else if (losers.length) {
          losers.sort((a,b)=> a.localeCompare(b));
          third = losers[0];
        }
      }

      winners = first && second && third ? { first, second, third } : null;
      renderCompleteNoticeBoard();
    }
  });
}