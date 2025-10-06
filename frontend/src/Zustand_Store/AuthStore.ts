'use client';

import { create } from 'zustand';

interface GoogleLoginPayload {
  email: string;
  name: string;
  picture?: string;
  googleId: string;
}

interface RegisterPayload {
  fullname: { firstname: string; lastname: string };
  username: string;
  email: string;
  password: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  googleLogin: (payload: GoogleLoginPayload) => Promise<void>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
  logout: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

async function handleJsonResponse(response: Response) {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : null;
  if (!response.ok) {
    const message = (data && (data.message || data.error)) || `Request failed (${response.status})`;
    throw new Error(message);
  }
  return data;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  token: null,
  user: null,
  error: null,

  async login(email, password) {
    set({ error: null });
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
    const data = await handleJsonResponse(res);
    set({ isAuthenticated: true, token: data.token ?? null, user: data.user ?? null });
  },

  async register(payload) {
    set({ error: null });
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    const data = await handleJsonResponse(res);
    set({ isAuthenticated: true, token: data.token ?? null, user: data.user ?? null });
  },

  async googleLogin(payload) {
    set({ error: null });
    const res = await fetch(`${API_BASE}/google-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    const data = await handleJsonResponse(res);
    set({ isAuthenticated: true, token: data.token ?? null, user: data.user ?? null });
  },

  async checkUsernameAvailability(username) {
    try {
      const res = await fetch(`${API_BASE}/auth/check-username?username=${encodeURIComponent(username)}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await handleJsonResponse(res);
      return Boolean(data?.available);
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Username check failed' });
      return false;
    }
  },

  logout() {
    set({ isAuthenticated: false, token: null, user: null });
  },
}));

export default useAuthStore;


