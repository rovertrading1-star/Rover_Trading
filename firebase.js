// ==========================================
// ROVER TRADING - FIREBASE CONFIGURATION & SHARED SERVICE
// ==========================================

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

// Initialize Firebase App
let app, auth, db;
try {
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
      app = firebase.initializeApp(firebaseConfig);
    } else {
      app = firebase.app();
    }
    auth = firebase.auth();
    // Connect to specific database instance if provided
    db = firebase.firestore();
  }
} catch (e) {
  console.warn("Firebase initialization warning (using resilient storage):", e);
}

// Initial mock data seed
const SEED_USERS = [
  {
    id: "usr_admin_1",
    accountNumber: "RT99999",
    firstName: "Admin",
    lastName: "Rover",
    email: "admin@rovertrading.com",
    cellNumber: "+27 82 000 0000",
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

// Seed local storage if empty or migrate existing reviews
if (!localStorage.getItem('roverUsers')) {
  localStorage.setItem('roverUsers', JSON.stringify(SEED_USERS));
}
if (!localStorage.getItem('roverReviews')) {
  localStorage.setItem('roverReviews', JSON.stringify(SEED_REVIEWS));
} else {
  // Normalize existing reviews with moderation flags
  try {
    const existing = JSON.parse(localStorage.getItem('roverReviews'));
    const normalized = existing.map(r => ({
      ...r,
      hidden: r.hidden === true || r.status === 'hidden',
      status: r.status || (r.hidden ? 'hidden' : 'visible')
    }));
    localStorage.setItem('roverReviews', JSON.stringify(normalized));
  } catch (e) {}
}
if (!localStorage.getItem('roverEnquiries')) {
  localStorage.setItem('roverEnquiries', JSON.stringify([]));
}

// Global UI Toast Function
function toast(type, title, msg, dur = 4000) {
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

// Shared Rover Store Helper
window.RoverStore = {
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
      const live = all.find(x => x.id === u.id || x.email === u.email);
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

  // -------------------------------------------------------------
  // REVIEWS & COMMENTS CONTROL METHODS (with Firebase Cloud Sync)
  // -------------------------------------------------------------
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
    const revs = this.getReviews();
    return revs.filter(r => !r.hidden && r.status !== 'hidden');
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

    // Sync to Firebase Firestore cloud
    if (typeof db !== 'undefined' && db.collection) {
      try {
        await db.collection('reviews').doc(newRev.id).set({
          name: newRev.name,
          course: newRev.course,
          rating: newRev.rating,
          text: newRev.text,
          date: newRev.date,
          hidden: false,
          status: 'visible'
        });
        console.log('Firebase Cloud: Review synced', newRev.id);
      } catch (err) {
        console.warn('Firebase Cloud sync warning (stored locally):', err);
      }
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
    if (!item.hidden) {
      delete item.moderationReason;
    }
    this.saveReviews(revs);

    // Cloud update in Firestore
    if (typeof db !== 'undefined' && db.collection) {
      try {
        await db.collection('reviews').doc(reviewId).set({
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
      } catch (err) {
        console.warn('Firebase Cloud visibility update note:', err);
      }
    }

    return item;
  },

  deleteReview: async function(reviewId) {
    let revs = this.getReviews();
    revs = revs.filter(r => r.id !== reviewId);
    this.saveReviews(revs);

    // Cloud deletion in Firestore
    if (typeof db !== 'undefined' && db.collection) {
      try {
        await db.collection('reviews').doc(reviewId).delete();
        console.log('Firebase Cloud: Review deleted', reviewId);
      } catch (err) {
        console.warn('Firebase Cloud deletion note:', err);
      }
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

    // Cloud update in Firestore
    if (typeof db !== 'undefined' && db.collection) {
      try {
        await db.collection('reviews').doc(reviewId).set({
          name: item.name,
          course: item.course,
          rating: item.rating,
          text: item.text,
          date: item.date || new Date().toISOString(),
          hidden: true,
          status: 'flagged',
          moderationReason: reason
        }, { merge: true });
        console.log('Firebase Cloud: Review flagged for inappropriate content', reviewId);
      } catch (err) {
        console.warn('Firebase Cloud flag note:', err);
      }
    }
    return item;
  }
};

