// ==========================================
// ROVER TRADING - MODULAR FIREBASE CLOUD SERVICE
// Connects to ai-studio-rovertrading-cc1c0431-720c-4558-ba48-42c1ff000818
// ==========================================

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

const firebaseConfig = {
  projectId: "axiomatic-analog-s3rp2",
  appId: "1:11530780213:web:8d3c3110a819b28f8afb7c",
  apiKey: "AIzaSyBD5wBVGbdQ5xhpedt6IEEFEd0Uw3PLgQk",
  authDomain: "axiomatic-analog-s3rp2.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-rovertrading-cc1c0431-720c-4558-ba48-42c1ff000818",
  storageBucket: "axiomatic-analog-s3rp2.firebasestorage.app",
  messagingSenderId: "11530780213",
  measurementId: "",
  oAuthClientId: "11530780213-n1lk49etk6fmva8siuacbq9khimq0eft.apps.googleusercontent.com",
  recaptchaSiteKey: ""
};

// Initialize App & Services with the specific provisioned database
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const firestoreDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);
const authInstance = getAuth(app);

// Seed Accounts for initial setup
const SEED_USERS = [
  {
    id: "usr_admin_1",
    accountNumber: "RT99999",
    firstName: "Admin",
    lastName: "Rover",
    email: "admin@rovertrading.com",
    cellNumber: "+27 82 000 0000",
    password: "password123",
    paymentStatus: "paid",
    role: "admin",
    createdAt: new Date("2025-01-01T08:00:00Z").toISOString()
  },
  {
    id: "usr_student_1",
    accountNumber: "RT10001",
    firstName: "Tshiamo",
    lastName: "Lesego",
    email: "tshiamo@rovertrading.com",
    cellNumber: "+27 81 234 5678",
    password: "password123",
    paymentStatus: "paid",
    role: "student",
    createdAt: new Date("2025-02-10T14:30:00Z").toISOString()
  },
  {
    id: "usr_student_2",
    accountNumber: "RT10002",
    firstName: "Naledi",
    lastName: "Khumalo",
    email: "naledi@example.com",
    cellNumber: "+27 72 345 6789",
    password: "password123",
    paymentStatus: "unpaid",
    role: "student",
    createdAt: new Date("2025-02-18T10:15:00Z").toISOString()
  },
  {
    id: "usr_student_3",
    accountNumber: "RT10003",
    firstName: "Sipho",
    lastName: "Dlamini",
    email: "sipho@example.com",
    cellNumber: "+27 83 456 7890",
    password: "password123",
    paymentStatus: "paid",
    role: "student",
    createdAt: new Date("2025-02-25T16:45:00Z").toISOString()
  }
];

const SEED_REVIEWS = [
  {
    id: "rev_1",
    name: "Tshiamo L.",
    course: "Premium Course",
    rating: 5,
    text: "This course completely changed my understanding of the markets. The structure is brilliant and Lethabo explains everything so clearly.",
    date: new Date("2025-02-15").toISOString(),
    hidden: false,
    status: "visible"
  },
  {
    id: "rev_2",
    name: "Naledi K.",
    course: "Standard Course",
    rating: 5,
    text: "The live practice sessions were a game-changer. I finally understand how to read candlestick patterns and develop my own strategy.",
    date: new Date("2025-02-18").toISOString(),
    hidden: false,
    status: "visible"
  },
  {
    id: "rev_3",
    name: "Sipho D.",
    course: "Advanced Course",
    rating: 4,
    text: "Very well structured course. The psychology chapter was eye-opening. Would recommend to anyone starting out in trading.",
    date: new Date("2025-02-20").toISOString(),
    hidden: false,
    status: "visible"
  },
  {
    id: "rev_4",
    name: "Lerato P.",
    course: "Premium Course",
    rating: 5,
    text: "Best investment I've ever made. The discipline and patience framework has helped me beyond just trading.",
    date: new Date("2025-02-22").toISOString(),
    hidden: false,
    status: "visible"
  },
  {
    id: "rev_5",
    name: "Kabelo R.",
    course: "Standard Course",
    rating: 5,
    text: "I came in knowing nothing about trading. Now I have a clear trading plan and understand how to manage risk properly.",
    date: new Date("2025-02-24").toISOString(),
    hidden: false,
    status: "visible"
  },
  {
    id: "rev_6",
    name: "Amahle V.",
    course: "Premium Course",
    rating: 4,
    text: "Great course content. The schedule was flexible and the Zoom sessions were interactive. Highly recommend Rover Trading!",
    date: new Date("2025-02-26").toISOString(),
    hidden: false,
    status: "visible"
  }
];

// Initialize local fallback cache
if (!localStorage.getItem('roverUsers')) {
  localStorage.setItem('roverUsers', JSON.stringify(SEED_USERS));
}
if (!localStorage.getItem('roverReviews')) {
  localStorage.setItem('roverReviews', JSON.stringify(SEED_REVIEWS));
}
if (!localStorage.getItem('roverEnquiries')) {
  localStorage.setItem('roverEnquiries', JSON.stringify([]));
}

// Global UI Toast Function
export function toast(type, title, msg, dur = 4000) {
  let c = document.getElementById('toastC');
  if (!c) {
    c = document.createElement('div');
    c.id = 'toastC';
    c.style.cssText = 'position:fixed;top:80px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:10px;pointer-events:none;max-width:380px;width:100%';
    document.body.appendChild(c);
  }
  const icons = { success: '#a3e635', error: '#ff7777', warning: '#f59e0b', info: '#a3e635' };
  const borderCol = icons[type] || '#a3e635';
  const t = document.createElement('div');
  t.style.cssText = `pointer-events:auto;background:#101917;border:1px solid #27342e;border-left:4px solid ${borderCol};border-radius:12px;padding:14px 16px;box-shadow:0 8px 30px rgba(0,0,0,0.7);display:flex;align-items:flex-start;gap:12px;font-family:'DM Sans',sans-serif;color:#fff;animation:fadeIn 0.2s ease`;
  t.innerHTML = `
    <div style="flex:1">
      <div style="font-size:13px;font-weight:700;margin-bottom:2px;color:#fff">${title}</div>
      <div style="font-size:12px;color:#94a69a;line-height:1.4">${msg}</div>
    </div>
    <button style="background:none;border:none;color:#94a69a;cursor:pointer;font-size:14px;padding:2px" onclick="this.parentElement.remove()">✕</button>
  `;
  c.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transition = 'opacity 0.3s';
    setTimeout(() => t.remove(), 300);
  }, dur);
}
window.toast = toast;

// Universal RoverStore with Cross-Device Cloud Sync
export const RoverStore = {
  getUsers: function() {
    try {
      return JSON.parse(localStorage.getItem('roverUsers')) || SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  },

  saveUsers: function(users) {
    localStorage.setItem('roverUsers', JSON.stringify(users));
  },

  getCurrentUser: function() {
    try {
      const u = JSON.parse(localStorage.getItem('roverCurrentUser'));
      if (!u) return null;
      const all = this.getUsers();
      const live = all.find(x => x.id === u.id || (x.email && x.email.toLowerCase() === (u.email || '').toLowerCase()));
      return live || u;
    } catch {
      return null;
    }
  },

  setCurrentUser: function(u) {
    if (u) {
      localStorage.setItem('roverCurrentUser', JSON.stringify(u));
    } else {
      localStorage.removeItem('roverCurrentUser');
    }
  },

  getNextAccountNumber: function() {
    const users = this.getUsers();
    let maxNum = 10000;
    users.forEach(u => {
      const match = u.accountNumber && u.accountNumber.match(/^RT(\d+)$/);
      if (match) {
        const n = parseInt(match[1]);
        if (n > maxNum && n < 90000) maxNum = n;
      }
    });
    return 'RT' + String(maxNum + 1).padStart(5, '0');
  },

  // -----------------------------------------------------------
  // USERS CLOUD SYNC & CROSS-DEVICE AUTHENTICATION
  // -----------------------------------------------------------
  syncUsersFromFirestore: async function() {
    try {
      const snap = await getDocs(collection(firestoreDb, 'users'));
      if (!snap.empty) {
        const cloudUsers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        const localUsers = this.getUsers();
        const map = new Map();
        localUsers.forEach(u => {
          const k = (u.email || u.id || '').toLowerCase();
          if (k) map.set(k, u);
        });
        cloudUsers.forEach(u => {
          const k = (u.email || u.id || '').toLowerCase();
          if (k) map.set(k, { ...(map.get(k) || {}), ...u });
        });
        const merged = Array.from(map.values());
        this.saveUsers(merged);
        return merged;
      }
    } catch (e) {
      console.warn("Firestore sync users notice:", e);
    }
    return this.getUsers();
  },

  syncUserToFirestore: async function(u) {
    if (!u || !u.id) return;
    try {
      const userRef = doc(firestoreDb, 'users', u.id);
      await setDoc(userRef, {
        accountNumber: u.accountNumber || 'RT10001',
        firstName: u.firstName || 'Student',
        lastName: u.lastName || '',
        email: (u.email || '').toLowerCase().trim(),
        cellNumber: u.cellNumber || '',
        password: u.password || 'password123',
        paymentStatus: u.paymentStatus || 'unpaid',
        role: u.role || 'student',
        createdAt: u.createdAt || new Date().toISOString()
      }, { merge: true });
      console.log("Firestore cloud: User saved successfully to named DB:", u.id);
    } catch (e) {
      console.warn("Firestore user sync error:", e);
    }
  },

  // -----------------------------------------------------------
  // REVIEWS & COMMENT CONTROL (Cloud Synced)
  // -----------------------------------------------------------
  getReviews: function() {
    try {
      const revs = JSON.parse(localStorage.getItem('roverReviews')) || SEED_REVIEWS;
      return revs.map(r => ({
        ...r,
        hidden: r.hidden === true || r.status === 'hidden',
        status: r.status || (r.hidden ? 'hidden' : 'visible')
      }));
    } catch {
      return SEED_REVIEWS;
    }
  },

  getVisibleReviews: function() {
    return this.getReviews().filter(r => !r.hidden && r.status !== 'hidden');
  },

  saveReviews: function(revs) {
    localStorage.setItem('roverReviews', JSON.stringify(revs));
  },

  addReview: async function(reviewData) {
    const revs = this.getReviews();
    const newRev = {
      id: reviewData.id || 'rev_' + Date.now(),
      name: reviewData.name,
      course: reviewData.course,
      rating: Number(reviewData.rating) || 5,
      text: reviewData.text,
      date: reviewData.date || new Date().toISOString(),
      hidden: false,
      status: 'visible'
    };

    revs.unshift(newRev);
    this.saveReviews(revs);

    try {
      await setDoc(doc(firestoreDb, 'reviews', newRev.id), {
        name: newRev.name,
        course: newRev.course,
        rating: newRev.rating,
        text: newRev.text,
        date: newRev.date,
        hidden: false,
        status: 'visible'
      });
      console.log('Firebase Cloud: Review synced', newRev.id);
    } catch (e) {
      console.warn('Firestore cloud review add error:', e);
    }

    return newRev;
  },

  toggleReviewVisibility: async function(reviewId) {
    const revs = this.getReviews();
    const idx = revs.findIndex(r => r.id === reviewId);
    if (idx === -1) return null;

    const item = revs[idx];
    item.hidden = !item.hidden;
    item.status = item.hidden ? 'hidden' : 'visible';
    if (!item.hidden) delete item.moderationReason;
    this.saveReviews(revs);

    try {
      await setDoc(doc(firestoreDb, 'reviews', reviewId), {
        name: item.name,
        course: item.course,
        rating: item.rating,
        text: item.text,
        date: item.date || new Date().toISOString(),
        hidden: item.hidden,
        status: item.status,
        ...(item.moderationReason ? { moderationReason: item.moderationReason } : {})
      }, { merge: true });
      console.log('Firebase Cloud: Review visibility updated', reviewId, item.status);
    } catch (e) {
      console.warn('Firestore cloud visibility error:', e);
    }

    return item;
  },

  deleteReview: async function(reviewId) {
    let revs = this.getReviews();
    revs = revs.filter(r => r.id !== reviewId);
    this.saveReviews(revs);

    try {
      await deleteDoc(doc(firestoreDb, 'reviews', reviewId));
      console.log('Firebase Cloud: Review deleted', reviewId);
    } catch (e) {
      console.warn('Firestore cloud deletion error:', e);
    }
    return true;
  },

  flagReview: async function(reviewId, reason = 'Inappropriate content') {
    const revs = this.getReviews();
    const idx = revs.findIndex(r => r.id === reviewId);
    if (idx === -1) return null;

    const item = revs[idx];
    item.hidden = true;
    item.status = 'flagged';
    item.moderationReason = reason;
    this.saveReviews(revs);

    try {
      await setDoc(doc(firestoreDb, 'reviews', reviewId), {
        name: item.name,
        course: item.course,
        rating: item.rating,
        text: item.text,
        date: item.date || new Date().toISOString(),
        hidden: true,
        status: 'flagged',
        moderationReason: reason
      }, { merge: true });
      console.log('Firebase Cloud: Review flagged', reviewId);
    } catch (e) {
      console.warn('Firestore cloud flag error:', e);
    }

    return item;
  }
};

window.RoverStore = RoverStore;

// Universal db wrapper for all HTML pages
window.db = {
  collection: (colName) => ({
    doc: (docId) => ({
      get: () => getDoc(doc(firestoreDb, colName, docId)),
      set: (data, opts) => setDoc(doc(firestoreDb, colName, docId), data, opts || {}),
      update: (data) => setDoc(doc(firestoreDb, colName, docId), data, { merge: true }),
      delete: () => deleteDoc(doc(firestoreDb, colName, docId)),
      onSnapshot: (onNext, onError) => onSnapshot(doc(firestoreDb, colName, docId), onNext, onError)
    }),
    add: async (data) => {
      const id = 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      await setDoc(doc(firestoreDb, colName, id), data);
      return { id };
    },
    get: () => getDocs(collection(firestoreDb, colName)),
    where: (field, op, val) => ({
      get: () => getDocs(query(collection(firestoreDb, colName), where(field, op, val))),
      onSnapshot: (onNext, onError) => onSnapshot(query(collection(firestoreDb, colName), where(field, op, val)), onNext, onError)
    }),
    limit: (n) => ({
      get: () => getDocs(collection(firestoreDb, colName))
    }),
    onSnapshot: (onNext, onError) => onSnapshot(collection(firestoreDb, colName), onNext, onError)
  })
};

authInstance.signInWithPopup = (prov) => signInWithPopup(authInstance, prov);
authInstance.signOut = () => signOut(authInstance);
authInstance.onAuthStateChanged = (cb) => onAuthStateChanged(authInstance, cb);

window.auth = authInstance;
window.GoogleAuthProvider = GoogleAuthProvider;
window.signInWithPopup = (prov) => signInWithPopup(authInstance, prov);
window.signOut = () => signOut(authInstance);

window.firebase = {
  app: () => app,
  auth: {
    GoogleAuthProvider: GoogleAuthProvider,
    signInWithPopup: (prov) => signInWithPopup(authInstance, prov),
    signOut: () => signOut(authInstance)
  },
  firestore: {
    FieldValue: {
      serverTimestamp: () => new Date().toISOString()
    }
  }
};

// -----------------------------------------------------------
// AUTOMATIC CLOUD SEEDING & REAL-TIME BACKGROUND LISTENERS
// -----------------------------------------------------------
(async function initCloudSync() {
  try {
    // 1. Seed default users to Firestore cloud if empty
    const usersSnap = await getDocs(collection(firestoreDb, 'users'));
    if (usersSnap.empty) {
      console.log("Firestore cloud: Seeding default accounts to database...");
      for (const u of SEED_USERS) {
        await setDoc(doc(firestoreDb, 'users', u.id), u);
      }
      console.log("Firestore cloud: Default accounts seeded.");
    } else {
      const cloudUsers = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      RoverStore.saveUsers(cloudUsers);
      console.log("Firestore cloud: " + cloudUsers.length + " users synchronized across devices.");
    }

    // 2. Seed default reviews to Firestore cloud if empty
    const revsSnap = await getDocs(collection(firestoreDb, 'reviews'));
    if (revsSnap.empty) {
      console.log("Firestore cloud: Seeding reviews...");
      for (const r of SEED_REVIEWS) {
        await setDoc(doc(firestoreDb, 'reviews', r.id), r);
      }
      console.log("Firestore cloud: Reviews seeded.");
    }

    // 3. Attach real-time listener for users
    onSnapshot(collection(firestoreDb, 'users'), (snap) => {
      if (!snap.empty) {
        const cloudUsers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        RoverStore.saveUsers(cloudUsers);
      }
    });

    // 4. Attach real-time listener for reviews
    onSnapshot(collection(firestoreDb, 'reviews'), (snap) => {
      if (!snap.empty) {
        const cloudRevs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        RoverStore.saveReviews(cloudRevs);
      }
    });

  } catch (err) {
    console.warn("Firestore cloud initialization note:", err);
  }
})();
