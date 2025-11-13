export function ensureFirebase() {
  if (!window.firebase) return;
  if (!ensureFirebase._initialized) {
    const firebaseConfig = {
      apiKey: "AIzaSyA_ZUyquXEaaIvWAfFrZEkk9kROmjL-B1A",
      authDomain: "pubg-tdm-832f3.firebaseapp.com",
      databaseURL: "https://pubg-tdm-832f3-default-rtdb.firebaseio.com",
      projectId: "pubg-tdm-832f3",
      storageBucket: "pubg-tdm-832f3.firebasestorage.app",
      messagingSenderId: "1047250611031",
      appId: "1:1047250611031:web:e31faaf68f613eb531ac12"
    };
    window.firebase.initializeApp(firebaseConfig);
    ensureFirebase._initialized = true;
  }
}

export function db() {
  return window.firebase.database();
}

