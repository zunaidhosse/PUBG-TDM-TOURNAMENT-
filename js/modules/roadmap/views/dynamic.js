import { cleanName } from '../utils.js';
import { setupDownload } from '../controls/download.js';

export function renderDynamicGrid({ display, split, gf, zoomLevel }, onZoomChange) {
  const matchBox = (m) => {
    const t1c = cleanName(m.team1), t2c = cleanName(m.team2);
    if (!t1c && !t2c) return '';
    const w = cleanName(m.winner);
    const t1Class = w && w === t1c ? 'winner' : (w ? 'loser' : '');
    const t2Class = w && w === t2c ? 'winner' : (w ? 'loser' : '');
    return `<div class="bracket-match inline">
      <span class="bracket-team ${t1Class}">${t1c || '—'}</span>
      <span class="vs-pill">VS</span>
      <span class="bracket-team ${t2Class}">${t2c || '—'}</span>
    </div>`;
  };

  const col = (title, list) => {
    const items = (list || []).map(matchBox).join('') || '<div class="empty-message">—</div>';
    return `<div class="bracket-column"><div class="bracket-round"><div class="registration-card" style="margin-bottom:8px;"><strong>${title}</strong></div>${items}</div></div>`;
  };

  const gfBox = gf && (cleanName(gf.team1) || cleanName(gf.team2)) ? matchBox(gf) : '<div class="empty-message">No Grand Final</div>';

  display.innerHTML = `
    <div class="zoom-controls" id="zoom-controls" style="display:flex;gap:8px;justify-content:flex-end;">
      <button class="zoom-btn" id="zoom-out-btn">−</button>
      <button class="zoom-btn" id="zoom-reset-btn">Reset</button>
      <button class="zoom-btn" id="zoom-in-btn">+</button>
      <button class="zoom-btn" id="download-bracket-btn">Download PNG</button>
    </div>
    <div class="bracket-container" id="bracket-capture">
      <div class="bracket-grid" id="bracket-grid" style="transform-origin: top center;"></div>
    </div>
  `;

  const grid = display.querySelector('#bracket-grid');
  grid.innerHTML = `
    ${col('Round 1 (64)', split.r1.left)}
    ${col('Round 2 (32)', split.r2.left)}
    ${col('Round 3 (16)', split.r3.left)}
    ${col('Quarter-Finals (8)', split.qf.left)}
    ${col('Semi-Finals (4)', split.sf.left)}
    <div class="bracket-column">
      <div class="bracket-round">
        <div class="registration-card" style="margin-bottom:8px;"><strong>Grand Final (2)</strong></div>
        ${gfBox}
      </div>
    </div>
    ${col('Semi-Finals (4)', split.sf.right)}
    ${col('Quarter-Finals (8)', split.qf.right)}
    ${col('Round 3 (16)', split.r3.right)}
    ${col('Round 2 (32)', split.r2.right)}
    ${col('Round 1 (64)', split.r1.right)}
  `;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  let currentZoom = zoomLevel;

  const container = display.querySelector('#bracket-capture');
  
  // Auto-fit calculation for small screens (Mobile/Narrow)
  // Only trigger if currentZoom is near default (0.9/1.0) and container is narrow.
  if (container && (Math.abs(currentZoom - 1) < 0.1 || Math.abs(currentZoom - 0.9) < 0.05)) {
    const GRID_BASE_WIDTH = 700; // Value from css/roadmap.css .bracket-grid min-width
    const containerWidth = container.clientWidth;
    
    if (containerWidth > 0 && containerWidth < GRID_BASE_WIDTH) {
      // Calculate required scale to fit horizontally (accounting for a small buffer)
      const requiredScale = (containerWidth - 20) / GRID_BASE_WIDTH; 
      
      if (requiredScale < 1) {
        currentZoom = clamp(requiredScale, 0.4, 1.0);
        onZoomChange(currentZoom); // Persist the new auto-fit zoom level back to index.js state
      }
    }
  }

  const applyZoom = () => { grid.style.transform = `scale(${currentZoom})`; };
  currentZoom = clamp(currentZoom, 0.4, 1.6);
  applyZoom();

  const zin = display.querySelector('#zoom-in-btn');
  const zout = display.querySelector('#zoom-out-btn');
  const zreset = display.querySelector('#zoom-reset-btn');

  if (zin) zin.onclick = () => { currentZoom = clamp(currentZoom + 0.1, 0.4, 1.6); applyZoom(); onZoomChange && onZoomChange(currentZoom); };
  if (zout) zout.onclick = () => { currentZoom = clamp(currentZoom - 0.1, 0.4, 1.6); applyZoom(); onZoomChange && onZoomChange(currentZoom); };
  if (zreset) zreset.onclick = () => { currentZoom = 1; applyZoom(); onZoomChange && onZoomChange(currentZoom); };

  setupDownload({ captureSelector: '#bracket-capture', grid, fileName: 'tournament-roadmap-mobile.png' });
}