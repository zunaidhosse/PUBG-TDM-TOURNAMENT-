export function initTimerAdmin() {
  const root = document.getElementById('timer-admin-root');
  if (!root || !window.firebase) return;
  const db = () => window.firebase.database();
  const stages = [
    { key:'registration', label:'Registration Open' },
    { key:'round1', label:'Round 1' },
    { key:'round2', label:'Round 2' },
    { key:'round3', label:'Round 3' },
    { key:'quarterFinal', label:'Quarter-Finals' },
    { key:'semiFinal', label:'Semi-Finals' },
    { key:'grandFinal', label:'Grand Final' }
  ];

  root.innerHTML = `
    <div class="form-group">
      <label for="live-url">Live URL (YouTube/Facebook/Twitch)</label>
      <input type="text" id="live-url" placeholder="https://...">
      <button class="btn btn-success" id="save-live-btn" style="margin-top:8px;">Save Live Link</button>
    </div>
    <div class="form-group" style="margin-top:12px;">
      <label>Stage Timers</label>
      ${stages.map(s=>`
        <div class="registration-card" style="margin-top:8px;">
          <h3>${s.label}</h3>
          <div class="form-group"><label>Start</label><input type="datetime-local" id="${s.key}-start"></div>
          <div class="form-group"><label>End</label><input type="datetime-local" id="${s.key}-end"></div>
        </div>
      `).join('')}
      <button class="btn btn-primary" id="save-timers-btn" style="margin-top:10px;">Save Timers</button>
    </div>
  `;

  function toLocal(ts) { try { return ts ? new Date(ts).toISOString().slice(0,16) : ''; } catch { return ''; } }
  function toTs(v) { const t = Date.parse(v); return isNaN(t) ? null : t; }

  db().ref('timers').on('value', s => {
    const v = s.val() || {};
    stages.forEach(st => {
      const startEl = document.getElementById(`${st.key}-start`);
      const endEl = document.getElementById(`${st.key}-end`);
      if (startEl) startEl.value = toLocal(v?.[st.key]?.startTs || null);
      if (endEl) endEl.value = toLocal(v?.[st.key]?.endTs || null);
    });
  });

  const saveTimersBtn = document.getElementById('save-timers-btn');
  if (saveTimersBtn) {
    saveTimersBtn.addEventListener('click', async () => {
      const payload = {};
      stages.forEach(st => {
        const sVal = document.getElementById(`${st.key}-start`)?.value || '';
        const eVal = document.getElementById(`${st.key}-end`)?.value || '';
        const startTs = toTs(sVal), endTs = toTs(eVal);
        payload[st.key] = { startTs: startTs || null, endTs: endTs || null };
      });
      try { await db().ref('timers').set(payload); } catch {}
    });
  }

  const liveInput = document.getElementById('live-url');
  const liveSave = document.getElementById('save-live-btn');
  db().ref('live').on('value', s => { const v=s.val()||{}; if (liveInput) liveInput.value = v.url || ''; });
  if (liveSave) {
    liveSave.addEventListener('click', async () => {
      const url = (liveInput?.value || '').trim();
      try { await db().ref('live').set({ url, updatedAt: Date.now() }); } catch {}
    });
  }
}