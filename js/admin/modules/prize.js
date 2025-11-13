import { db } from '../../core/firebase.js';
import { toast } from './toast.js';

export function initPrizePoolAdmin() {
  const ppRef = db().ref('prizePool');
  const first = document.getElementById('prize-first');
  const second = document.getElementById('prize-second');
  const third = document.getElementById('prize-third');
  const preview = document.getElementById('prize-preview');
  const saveBtn = document.getElementById('save-prize-btn');

  function renderPreview(v) {
    const f = v?.first || 0, s = v?.second || 0, t = v?.third || 0;
    if (preview) {
      preview.innerHTML = `
        <div style="display:grid; grid-template-columns: repeat(3,1fr); gap:8px;">
          <div style="background:rgba(243,156,18,0.18); border:1px solid #f39c12; border-radius:8px; padding:10px; text-align:center;">
            <div style="font-size:1.4rem;">🥇</div>
            <div style="font-weight:700; color:#f39c12;">1st Place</div>
            <div style="margin-top:4px; font-weight:800; color:#ecf0f1;">${f} UC</div>
          </div>
          <div style="background:rgba(189,195,199,0.18); border:1px solid #bdc3c7; border-radius:8px; padding:10px; text-align:center;">
            <div style="font-size:1.4rem;">🥈</div>
            <div style="font-weight:700; color:#bdc3c7;">2nd Place</div>
            <div style="margin-top:4px; font-weight:800; color:#ecf0f1;">${s} UC</div>
          </div>
          <div style="background:rgba(205,127,50,0.18); border:1px solid #cd7f32; border-radius:8px; padding:10px; text-align:center;">
            <div style="font-size:1.4rem;">🥉</div>
            <div style="font-weight:700; color:#cd7f32;">3rd Place</div>
            <div style="margin-top:4px; font-weight:800; color:#ecf0f1;">${t} UC</div>
          </div>
        </div>`;
    }
  }

  ppRef.on('value', s => {
    const v = s.val() || {};
    if (first) first.value = v.first ?? '';
    if (second) second.value = v.second ?? '';
    if (third) third.value = v.third ?? '';
    renderPreview(v);
  });

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const payload = {
        first: Number(first?.value || 0),
        second: Number(second?.value || 0),
        third: Number(third?.value || 0),
        updatedAt: Date.now()
      };
      try {
        await ppRef.set(payload);
        toast('success','Prize pool saved');
      } catch {
        toast('danger','Failed to save prize pool');
      }
    });
  }
}

