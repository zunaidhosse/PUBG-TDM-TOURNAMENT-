export function patchPerformanceCloneError() {
  try {
    if (!window.__perfPatched && window.performance) {
      const empty = () => [];
      performance.getEntries = empty;
      performance.getEntriesByType = empty;
      performance.getEntriesByName = empty;
      
      // Disable PerformanceObserver to prevent DataCloneError
      if (window.PerformanceObserver) {
        window.PerformanceObserver = class {
          observe() {}
          disconnect() {}
          takeRecords() { return []; }
        };
      }
      
      window.__perfPatched = true;
    }
  } catch {}
}