import { db } from '../../core/firebase.js';
import { patchPerformanceCloneError } from './perfPatch.js';
import { cleanName, fmtMatch, computeSubtexts, splitRound } from './utils.js';
import { renderSimpleFlow } from './views/simple.js';
import { renderDynamicGrid } from './views/dynamic.js';

let dynamicMode = false;
let zoomLevel = 0.9;

export function initRoadmap() {
  patchPerformanceCloneError();

  db().ref('roadmap').on('value', (snapshot) => {
    const display = document.getElementById('roadmap-display');
    if (!display) return;

    const r = snapshot.val() || {};
    const r1 = Array.isArray(r.round1) ? r.round1 : [];
    const r2 = Array.isArray(r.round2) ? r.round2 : [];
    const r3 = Array.isArray(r.round3) ? r.round3 : [];
    const qf = Array.isArray(r.quarterFinal) ? r.quarterFinal : [];
    const sf = Array.isArray(r.semiFinal) ? r.semiFinal : [];
    const gf = r.grandFinal || null;

    const itemsR1 = r1.filter(m => cleanName(m.team1) || cleanName(m.team2)).map(fmtMatch).join('') || '<div class=\"empty-message\">No Round 1 matches yet</div>';
    const itemsR2 = r2.filter(m => cleanName(m.team1) || cleanName(m.team2)).map(fmtMatch).join('') || '<div class=\"empty-message\">No Round 2 matches yet</div>';
    const itemsR3 = r3.filter(m => cleanName(m.team1) || cleanName(m.team2)).map(fmtMatch).join('') || '<div class=\"empty-message\">No Round 3 matches yet</div>';
    const itemsQF = qf.filter(m => cleanName(m.team1) || cleanName(m.team2)).map(fmtMatch).join('') || '<div class=\"empty-message\">No Quarter-Finals matches yet</div>';
    const itemsSF = sf.filter(m => cleanName(m.team1) || cleanName(m.team2)).map(fmtMatch).join('') || '<div class=\"empty-message\">No Semi-Finals matches yet</div>';
    const itemsGF = gf && (cleanName(gf.team1) || cleanName(gf.team2)) ? fmtMatch(gf) : '<div class=\"empty-message\">No Grand Final match yet</div>';

    const subs = computeSubtexts({ r1, r2, r3, qf, sf, gf });

    const split = {
      r1: splitRound(r1, 16),
      r2: splitRound(r2, 8),
      r3: splitRound(r3, 4),
      qf: splitRound(qf, 2),
      sf: splitRound(sf, 1),
    };

    if (dynamicMode) {
      renderDynamicGrid({ display, split, gf, zoomLevel }, (newZoom) => { zoomLevel = newZoom; });
    } else {
      renderSimpleFlow({
        display,
        items: { itemsR1, itemsR2, itemsR3, itemsQF, itemsSF, itemsGF },
        subs,
      });
    }

    const btn = document.getElementById('dynamic-roadmap-btn');
    if (btn) {
      btn.textContent = dynamicMode ? 'Simple View' : 'Dynamic Roadmap';
      btn.onclick = () => {
        dynamicMode = !dynamicMode;
        if (dynamicMode) {
          renderDynamicGrid({ display, split, gf, zoomLevel }, (newZoom) => { zoomLevel = newZoom; });
        } else {
          renderSimpleFlow({
            display,
            items: { itemsR1, itemsR2, itemsR3, itemsQF, itemsSF, itemsGF },
            subs,
          });
        }
        btn.textContent = dynamicMode ? 'Simple View' : 'Dynamic Roadmap';
      };
    }
  });
}