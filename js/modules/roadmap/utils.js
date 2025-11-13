export function cleanName(n) {
  return !n || n.toUpperCase() === 'TBD' || /^B\\d+$/i.test(n) ? '' : n;
}

export function fmtMatch(m) {
  const t1 = cleanName(m.team1) || '—';
  const t2 = cleanName(m.team2) || '—';
  const win = m.winner ? `<div class=\"flow-win\">Winner: ${m.winner}</div>` : '';
  return `<div class=\"flow-match\"><div class=\"flow-vs\"><span>${t1}</span><span class=\"vs-pill\">VS</span><span>${t2}</span></div>${win}</div>`;
}

export function splitRound(arr, leftCount) {
  const left = arr.slice(0, leftCount);
  const right = arr.slice(leftCount);
  return { left, right };
}

export function computeSubtexts({ r1, r2, r3, qf, sf, gf }) {
  const calc = (list, total) => {
    const filtered = (list || []).filter(m => cleanName(m.team1) || cleanName(m.team2));
    const done = filtered.filter(m => m && m.winner).length;
    const tot = total ?? filtered.length;
    return tot ? `(${tot} • ${done}/${tot} done)` : `(${tot || 0})`;
  };
  const subR1 = calc(r1, 64);
  const subR2 = calc(r2, 32);
  const subR3 = calc(r3, 16);
  const subQF = calc(qf, 8);
  const subSF = calc(sf, 4);
  const subGF = gf && (cleanName(gf.team1) || cleanName(gf.team2)) ? calc([gf], 2) : '(2)';
  return { subR1, subR2, subR3, subQF, subSF, subGF };
}