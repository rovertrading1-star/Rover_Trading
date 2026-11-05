export interface User {
  id: string;
  accountNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  cellNumber: string;
  password?: string;
  paymentStatus: 'paid' | 'unpaid';
  role: 'student' | 'admin';
  createdAt: string;
}

export interface Review {
  id: string;
  rating: number;
  name: string;
  course: string;
  text: string;
  date: string;
}

export interface Enquiry {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  course: string;
  date: string;
}

export type PageView = 'home' | 'login' | 'signup' | 'dashboard' | 'admin';
