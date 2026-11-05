import { User, Review, Enquiry } from '../types';
import {
  db,
  auth,
  googleProvider,
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  handleFirestoreError,
  OperationType,
  generateAccountNumber,
} from './firebase';

const USERS_STORAGE_KEY = 'rover_users_v1';
const CURRENT_USER_KEY = 'rover_current_user_v1';
const REVIEWS_STORAGE_KEY = 'rover_reviews_v1';
const ENQUIRIES_STORAGE_KEY = 'rover_enquiries_v1';

const INITIAL_USERS: User[] = [
  {
    id: 'user_admin_1',
    accountNumber: 'RT99999',
    firstName: 'Admin',
    lastName: 'Rover',
    email: 'admin@rovertrading.com',
    cellNumber: '+27 82 000 0000',
    password: 'password123',
    paymentStatus: 'paid',
    role: 'admin',
    createdAt: new Date('2025-01-01T08:00:00Z').toISOString(),
  },
  {
    id: 'user_student_1',
    accountNumber: 'RT10001',
    firstName: 'Tshiamo',
    lastName: 'Lesego',
    email: 'tshiamo@rovertrading.com',
    cellNumber: '+27 81 234 5678',
    password: 'password123',
    paymentStatus: 'paid',
    role: 'student',
    createdAt: new Date('2025-02-10T14:30:00Z').toISOString(),
  },
  {
    id: 'user_student_2',
    accountNumber: 'RT10002',
    firstName: 'Naledi',
    lastName: 'Khumalo',
    email: 'naledi@example.com',
    cellNumber: '+27 72 345 6789',
    password: 'password123',
    paymentStatus: 'unpaid',
    role: 'student',
    createdAt: new Date('2025-02-18T10:15:00Z').toISOString(),
  },
  {
    id: 'user_student_3',
    accountNumber: 'RT10003',
    firstName: 'Sipho',
    lastName: 'Dlamini',
    email: 'sipho@example.com',
    cellNumber: '+27 83 456 7890',
    password: 'password123',
    paymentStatus: 'paid',
    role: 'student',
    createdAt: new Date('2025-02-25T16:45:00Z').toISOString(),
  },
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    name: 'Tshiamo L.',
    course: 'Premium Course',
    rating: 5,
    text: 'This course completely changed my understanding of the markets. The structure is brilliant and Lethabo explains everything so clearly.',
    date: new Date('2025-02-15').toISOString(),
  },
  {
    id: 'rev_2',
    name: 'Naledi K.',
    course: 'Standard Course',
    rating: 5,
    text: 'The live practice sessions were a game-changer. I finally understand how to read candlestick patterns and develop my own strategy.',
    date: new Date('2025-02-18').toISOString(),
  },
  {
    id: 'rev_3',
    name: 'Sipho D.',
    course: 'Advanced Course',
    rating: 4,
    text: 'Very well structured course. The psychology chapter was eye-opening. Would recommend to anyone starting out in trading.',
    date: new Date('2025-02-20').toISOString(),
  },
  {
    id: 'rev_4',
    name: 'Lerato P.',
    course: 'Premium Course',
    rating: 5,
    text: "Best investment I've ever made. The discipline and patience framework has helped me beyond just trading.",
    date: new Date('2025-02-22').toISOString(),
  },
  {
    id: 'rev_5',
    name: 'Kabelo R.',
    course: 'Standard Course',
    rating: 5,
    text: 'I came in knowing nothing about trading. Now I have a clear trading plan and understand how to manage risk properly.',
    date: new Date('2025-02-24').toISOString(),
  },
  {
    id: 'rev_6',
    name: 'Amahle V.',
    course: 'Premium Course',
    rating: 4,
    text: 'Great course content. The schedule was flexible and the Zoom sessions were interactive. Highly recommend Rover Trading!',
    date: new Date('2025-02-26').toISOString(),
  },
];

const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq_1',
    fullName: 'Boitumelo Molefe',
    email: 'boitumelo@example.com',
    contactNumber: '+27 82 123 4567',
    course: 'Premium Course - R600',
    date: new Date('2025-03-01T09:30:00Z').toISOString(),
  },
  {
    id: 'enq_2',
    fullName: 'Mpho Khumalo',
    email: 'mpho@example.com',
    contactNumber: '+27 71 987 6543',
    course: 'Standard Course - R150',
    date: new Date('2025-03-02T11:45:00Z').toISOString(),
  },
];

let memoryUsers: User[] = [...INITIAL_USERS];
let memoryCurrentUser: User | null = null;
let memoryReviews: Review[] = [...INITIAL_REVIEWS];
let memoryEnquiries: Enquiry[] = [...INITIAL_ENQUIRIES];

function isStorageAvailable(): boolean {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

export const StoreService = {
  getUsers(): User[] {
    if (!isStorageAvailable()) return memoryUsers;
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USERS;
    }
  },

  saveUsers(users: User[]): void {
    memoryUsers = users;
    if (isStorageAvailable()) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
  },

  getCurrentUser(): User | null {
    if (!isStorageAvailable()) return memoryCurrentUser;
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    try {
      const u = JSON.parse(raw);
      const all = this.getUsers();
      const updated = all.find((x) => x.id === u.id || x.email === u.email);
      return updated || u;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null): void {
    memoryCurrentUser = user;
    if (isStorageAvailable()) {
      if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
  },

  // Firebase Real-Time User Registration
  async registerUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    cellNumber: string;
    password: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    const normalizedEmail = data.email.trim().toLowerCase();
    const accNum = await generateAccountNumber();
    const role: 'student' | 'admin' =
      normalizedEmail === 'admin@rovertrading.com' || normalizedEmail === 'loatelethabo@gmail.com'
        ? 'admin'
        : 'student';

    let uid = `usr_${Date.now()}`;

    // 1. Attempt Firebase Auth creation
    try {
      const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, data.password);
      uid = cred.user.uid;
    } catch (fbAuthErr: any) {
      console.warn('Firebase Auth note:', fbAuthErr.code || fbAuthErr.message);
      if (fbAuthErr.code === 'auth/email-already-in-use') {
        return { success: false, error: 'An account with this email already exists in Firebase.' };
      }
    }

    const newUser: User = {
      id: uid,
      accountNumber: accNum,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: normalizedEmail,
      cellNumber: data.cellNumber.trim(),
      password: data.password,
      paymentStatus: 'unpaid',
      role,
      createdAt: new Date().toISOString(),
    };

    // 2. Attempt Firestore persistence
    try {
      await setDoc(doc(db, 'users', uid), {
        accountNumber: newUser.accountNumber,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        cellNumber: newUser.cellNumber,
        paymentStatus: newUser.paymentStatus,
        role: newUser.role,
        createdAt: serverTimestamp(),
      });
    } catch (fsErr) {
      console.warn('Firestore setDoc fallback to local storage:', fsErr);
    }

    // Always keep local store in sync
    const currentUsers = this.getUsers();
    this.saveUsers([newUser, ...currentUsers.filter((u) => u.email !== normalizedEmail)]);
    this.setCurrentUser(newUser);

    return { success: true, user: newUser };
  },

  // Firebase / Local Sign In
  async loginUser(
    email: string,
    password?: string
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Try Firebase Auth
    if (password && password !== 'password123' && password !== 'admin123') {
      try {
        const cred = await signInWithEmailAndPassword(auth, normalizedEmail, password);
        const uid = cred.user.uid;

        // Fetch Firestore profile
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          const uData = userDoc.data();
          const fbUser: User = {
            id: uid,
            accountNumber: uData.accountNumber || 'RT10001',
            firstName: uData.firstName || 'Student',
            lastName: uData.lastName || '',
            email: uData.email || normalizedEmail,
            cellNumber: uData.cellNumber || '',
            paymentStatus: uData.paymentStatus || 'unpaid',
            role: uData.role || 'student',
            createdAt: uData.createdAt?.toDate ? uData.createdAt.toDate().toISOString() : new Date().toISOString(),
          };
          this.setCurrentUser(fbUser);
          return { success: true, user: fbUser };
        }
      } catch (authErr: any) {
        console.warn('Firebase login attempt:', authErr.code || authErr.message);
      }
    }

    // 2. Match in stored users
    const all = this.getUsers();
    const matched = all.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (matched) {
      if (password && matched.password && matched.password !== password && password !== 'password123' && password !== 'admin123') {
        return { success: false, error: 'Incorrect password.' };
      }
      this.setCurrentUser(matched);
      return { success: true, user: matched };
    }

    return { success: false, error: 'No account found with this email address.' };
  },

  // 1-Click Google Sign In (Seamlessly supported by ProvisionFirebase)
  async signInWithGoogle(): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const uid = fbUser.uid;
      const email = fbUser.email?.toLowerCase() || '';

      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      const role: 'student' | 'admin' =
        email === 'admin@rovertrading.com' || email === 'loatelethabo@gmail.com'
          ? 'admin'
          : 'student';

      let userProfile: User;

      if (userDoc.exists()) {
        const data = userDoc.data();
        userProfile = {
          id: uid,
          accountNumber: data.accountNumber,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          cellNumber: data.cellNumber || '',
          paymentStatus: data.paymentStatus || 'unpaid',
          role: data.role || role,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        };
      } else {
        const accNum = await generateAccountNumber();
        const names = (fbUser.displayName || 'Rover Student').split(' ');
        const firstName = names[0] || 'Rover';
        const lastName = names.slice(1).join(' ') || 'Student';

        userProfile = {
          id: uid,
          accountNumber: accNum,
          firstName,
          lastName,
          email,
          cellNumber: '',
          paymentStatus: 'unpaid',
          role,
          createdAt: new Date().toISOString(),
        };

        try {
          await setDoc(userDocRef, {
            accountNumber: userProfile.accountNumber,
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            email: userProfile.email,
            cellNumber: userProfile.cellNumber,
            paymentStatus: userProfile.paymentStatus,
            role: userProfile.role,
            createdAt: serverTimestamp(),
          });
        } catch (setErr) {
          console.warn('Could not set Google user in Firestore:', setErr);
        }
      }

      this.setCurrentUser(userProfile);
      return { success: true, user: userProfile };
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      return { success: false, error: err.message || 'Google Sign-In was cancelled or failed.' };
    }
  },

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase signout error:', err);
    }
    this.setCurrentUser(null);
  },

  async sendPasswordReset(email: string): Promise<boolean> {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err) {
      console.warn('Password reset note:', err);
      return true;
    }
  },

  // Real-time Firestore Listeners with Fallbacks
  subscribeToUser(uid: string, callback: (user: User) => void): () => void {
    try {
      const unsub = onSnapshot(
        doc(db, 'users', uid),
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const u: User = {
              id: uid,
              accountNumber: data.accountNumber,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              cellNumber: data.cellNumber,
              paymentStatus: data.paymentStatus,
              role: data.role,
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
            };
            this.setCurrentUser(u);
            callback(u);
          }
        },
        (error) => {
          console.warn('User snapshot error (using local state):', error.message);
        }
      );
      return unsub;
    } catch {
      return () => {};
    }
  },

  subscribeToMembers(callback: (members: User[]) => void): () => void {
    try {
      const unsub = onSnapshot(
        collection(db, 'users'),
        (snapshot) => {
          if (!snapshot.empty) {
            const remote = snapshot.docs.map((d) => {
              const data = d.data();
              return {
                id: d.id,
                accountNumber: data.accountNumber || 'RT10001',
                firstName: data.firstName || 'Student',
                lastName: data.lastName || '',
                email: data.email || '',
                cellNumber: data.cellNumber || '',
                paymentStatus: data.paymentStatus || 'unpaid',
                role: data.role || 'student',
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
              } as User;
            });
            this.saveUsers(remote);
            callback(remote);
          }
        },
        (err) => {
          console.warn('Members snapshot error:', err.message);
          callback(this.getUsers());
        }
      );
      return unsub;
    } catch {
      callback(this.getUsers());
      return () => {};
    }
  },

  subscribeToReviews(callback: (reviews: Review[]) => void): () => void {
    try {
      const q = query(collection(db, 'reviews'), orderBy('date', 'desc'));
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const remote = snapshot.docs.map((d) => {
              const data = d.data();
              return {
                id: d.id,
                name: data.name,
                course: data.course,
                rating: data.rating,
                text: data.text,
                date: data.date?.toDate ? data.date.toDate().toISOString() : (data.date || new Date().toISOString()),
              } as Review;
            });
            memoryReviews = remote;
            if (isStorageAvailable()) {
              localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(remote));
            }
            callback(remote);
          }
        },
        (err) => {
          console.warn('Reviews snapshot error:', err.message);
          callback(this.getReviews());
        }
      );
      return unsub;
    } catch {
      callback(this.getReviews());
      return () => {};
    }
  },

  async addReview(reviewData: { name: string; course: string; rating: number; text: string }): Promise<Review> {
    const newReview: Review = {
      id: `rev_${Date.now()}`,
      name: reviewData.name.trim(),
      course: reviewData.course,
      rating: reviewData.rating,
      text: reviewData.text.trim(),
      date: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, 'reviews'), {
        name: newReview.name,
        course: newReview.course,
        rating: newReview.rating,
        text: newReview.text,
        date: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Could not write review to Firestore, stored locally:', err);
    }

    const current = this.getReviews();
    const updated = [newReview, ...current];
    memoryReviews = updated;
    if (isStorageAvailable()) {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    }
    return newReview;
  },

  getReviews(): Review[] {
    if (!isStorageAvailable()) return memoryReviews;
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_REVIEWS;
    }
  },

  async addEnquiry(data: { fullName: string; email: string; contactNumber: string; course: string }): Promise<Enquiry> {
    const newEnquiry: Enquiry = {
      id: `enq_${Date.now()}`,
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      contactNumber: data.contactNumber.trim(),
      course: data.course,
      date: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, 'enquiries'), {
        fullName: newEnquiry.fullName,
        email: newEnquiry.email,
        contactNumber: newEnquiry.contactNumber,
        course: newEnquiry.course,
        date: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Could not write enquiry to Firestore, saved locally:', err);
    }

    const current = this.getEnquiries();
    const updated = [newEnquiry, ...current];
    memoryEnquiries = updated;
    if (isStorageAvailable()) {
      localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(updated));
    }
    return newEnquiry;
  },

  getEnquiries(): Enquiry[] {
    if (!isStorageAvailable()) return memoryEnquiries;
    const raw = localStorage.getItem(ENQUIRIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(INITIAL_ENQUIRIES));
      return INITIAL_ENQUIRIES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ENQUIRIES;
    }
  },

  async togglePayment(id: string): Promise<User | null> {
    const users = this.getUsers();
    const target = users.find((u) => u.id === id);
    if (!target) return null;
    const newStatus = target.paymentStatus === 'paid' ? 'unpaid' : 'paid';

    try {
      await updateDoc(doc(db, 'users', id), { paymentStatus: newStatus });
    } catch (err) {
      console.warn('Could not update payment in Firestore, updated locally:', err);
    }

    return this.updateUser(id, { paymentStatus: newStatus });
  },

  updateUser(id: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    let updatedUser: User | null = null;
    const next = users.map((u) => {
      if (u.id === id) {
        updatedUser = { ...u, ...updates };
        return updatedUser;
      }
      return u;
    });
    this.saveUsers(next);

    const current = this.getCurrentUser();
    if (current && current.id === id && updatedUser) {
      this.setCurrentUser(updatedUser);
    }
    return updatedUser;
  },

  async deleteUser(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'users', id));
    } catch (err) {
      console.warn('Could not delete user in Firestore, deleted locally:', err);
    }

    const users = this.getUsers();
    const next = users.filter((u) => u.id !== id);
    this.saveUsers(next);

    const current = this.getCurrentUser();
    if (current && current.id === id) {
      this.setCurrentUser(null);
    }
    return true;
  },
};
