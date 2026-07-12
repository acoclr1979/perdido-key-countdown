import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const app = initializeApp({
    apiKey: "AIzaSyBG7y9CXKe7f3aMFGFvOOPS47G-rmDQsnk",
    authDomain: "perdido-key-2026.firebaseapp.com",
    projectId: "perdido-key-2026",
    storageBucket: "perdido-key-2026.firebasestorage.app",
    messagingSenderId: "363728185503",
    appId: "1:363728185503:web:4d54bc49557b16c549daaa"
});

export const db = getFirestore(app);
