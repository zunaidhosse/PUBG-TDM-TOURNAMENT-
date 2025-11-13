// Refactored: this file now proxies to modular roadmap implementation.
// Tombstones for removed inline logic:
//
// removed function initRoadmap() heavy inline implementation
// removed performance patch IIFE
// removed html building for simple flow and dynamic grid
// removed zoom controls and download handler wiring
// removed toggle handlers for collapsible stages
//
// Please see:
// - js/modules/roadmap/index.js (bootstrap + render routing)
// - js/modules/roadmap/perfPatch.js (Performance API patch)
// - js/modules/roadmap/utils.js (helpers: clean, fmtMatch, split, subtexts)
// - js/modules/roadmap/views/simple.js (simple vertical flow view)
// - js/modules/roadmap/views/dynamic.js (dynamic bracket grid view)
// - js/modules/roadmap/controls/download.js (PNG download)
// - js/modules/roadmap/state.js (local state: dynamicMode, zoomLevel)

export { initRoadmap } from './roadmap/index.js';