//
// js/modules/registration.js has been refactored into modular ES files.
// Tombstones for removed functions:
//
// removed function validateInput(input, minLength, maxLength, label, labelBn) {}
// removed function validateWhatsApp() {}
// removed setupValidationListeners inline code
// removed setupPreview inline code
// removed function showRegistrationMessage(message, type) {}
// removed function resetForm() {}
// removed async function submitRegistration() {}
// removed export function watchMyRegistration() {}
//
// Please see:
// - js/modules/registration/index.js (main orchestration)
// - js/modules/registration/validation.js (input validation)
// - js/modules/registration/preview.js (preview modal)
// - js/modules/registration/submit.js (registration submission)
// - js/modules/registration/status.js (registration status display)
//

export { initRegistration, watchMyRegistration } from './registration/index.js';