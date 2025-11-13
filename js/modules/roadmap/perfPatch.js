export function patchPerformanceCloneError() {
  try {
    if (!window.__perfPatched && window.performance) {
      const empty = () => [];
      performance.getEntries = empty;
      performance.getEntriesByType = empty;
      performance.getEntriesByName = empty;
      window.__perfPatched = true;
    }
  } catch {}
}

