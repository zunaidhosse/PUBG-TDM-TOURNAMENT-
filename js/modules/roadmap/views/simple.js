export function renderSimpleFlow({ display, items, subs }) {
  const html = `
    <div class="roadmap-flow">
      <div class="flow-stack">
        <button class="flow-stage flow-toggle" id="flow-r1-toggle" aria-expanded="false">
          <span class="round-title"><strong>Round 1</strong></span>
          <span class="round-sub">${subs.subR1}</span>
          <span class="chev" aria-hidden="true">▾</span>
        </button>
        <div id="flow-r1-details" class="flow-details" hidden>${items.itemsR1}</div>

        <div class="flow-connector"><div class="flow-line"></div><div class="flow-arrow"></div></div>
        <button class="flow-stage flow-toggle" id="flow-r2-toggle" aria-expanded="false">
          <span class="round-title"><strong>Round 2</strong></span>
          <span class="round-sub">${subs.subR2}</span>
          <span class="chev" aria-hidden="true">▾</span>
        </button>
        <div id="flow-r2-details" class="flow-details" hidden>${items.itemsR2}</div>

        <div class="flow-connector"><div class="flow-line"></div><div class="flow-arrow"></div></div>
        <button class="flow-stage flow-toggle" id="flow-r3-toggle" aria-expanded="false">
          <span class="round-title"><strong>Round 3</strong></span>
          <span class="round-sub">${subs.subR3}</span>
          <span class="chev" aria-hidden="true">▾</span>
        </button>
        <div id="flow-r3-details" class="flow-details" hidden>${items.itemsR3}</div>

        <div class="flow-connector"><div class="flow-line"></div><div class="flow-arrow"></div></div>
        <button class="flow-stage flow-toggle" id="flow-qf-toggle" aria-expanded="false">
          <span class="round-title"><strong>Quarter-Finals</strong></span>
          <span class="round-sub">${subs.subQF}</span>
          <span class="chev" aria-hidden="true">▾</span>
        </button>
        <div id="flow-qf-details" class="flow-details" hidden>${items.itemsQF}</div>

        <div class="flow-connector"><div class="flow-line"></div><div class="flow-arrow"></div></div>
        <button class="flow-stage flow-toggle" id="flow-sf-toggle" aria-expanded="false">
          <span class="round-title"><strong>Semi-Finals</strong></span>
          <span class="round-sub">${subs.subSF}</span>
          <span class="chev" aria-hidden="true">▾</span>
        </button>
        <div id="flow-sf-details" class="flow-details" hidden>${items.itemsSF}</div>

        <div class="flow-connector"><div class="flow-line"></div><div class="flow-arrow"></div></div>
        <button class="flow-stage flow-toggle" id="flow-gf-toggle" aria-expanded="false">
          <span class="round-title"><strong>Grand Final</strong></span>
          <span class="round-sub">${subs.subGF}</span>
          <span class="chev" aria-hidden="true">▾</span>
        </button>
        <div id="flow-gf-details" class="flow-details" hidden>${items.itemsGF}</div>
      </div>
    </div>
  `;
  display.innerHTML = html;

  const bindToggle = (tid, did) => {
    const t = document.getElementById(tid);
    const d = document.getElementById(did);
    if (!t || !d) return;
    t.addEventListener('click', () => {
      const open = !d.hasAttribute('hidden');
      if (open) {
        d.setAttribute('hidden', '');
        d.classList.remove('open');
        t.setAttribute('aria-expanded', 'false');
        t.classList.remove('open');
      } else {
        d.removeAttribute('hidden');
        requestAnimationFrame(() => {
          d.classList.add('open');
          t.setAttribute('aria-expanded', 'true');
          t.classList.add('open');
        });
      }
    });
  };

  bindToggle('flow-r1-toggle', 'flow-r1-details');
  bindToggle('flow-r2-toggle', 'flow-r2-details');
  bindToggle('flow-r3-toggle', 'flow-r3-details');
  bindToggle('flow-qf-toggle', 'flow-qf-details');
  bindToggle('flow-sf-toggle', 'flow-sf-details');
  bindToggle('flow-gf-toggle', 'flow-gf-details');
}

