import { apiClient, setAuthToken } from "./api.js";
import { ROLES } from "../utils/roles.js";

export const AUTH_TOKEN_KEY = "vendorbridge.jwt";
export const AUTH_USER_KEY = "vendorbridge.user";

const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH !== "false";

// Mock auth keeps the frontend demo usable until a real backend is connected.
function wait(ms = 650) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function createMockToken(email) {
  return btoa(`${email}:${Date.now()}:vendorbridge`);
}

function isExpiredJwt(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ? payload.exp * 1000 <= Date.now() : false;
  } catch {
    return false;
  }
}

function createUserFromSignup(payload) {
  return {
    id: crypto.randomUUID(),
    name: payload.fullName,
    email: payload.email,
    role: payload.role,
    company: payload.role === ROLES.VENDOR ? "Acme Supply Co." : "VendorBridge",
  };
}

function createUserFromLogin(payload) {
  return {
    id: "usr_demo",
    name: payload.email
      .split("@")[0]
      .replace(/[._-]/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase()),
    email: payload.email,
    role: ROLES.ADMIN,
    company: "VendorBridge",
  };
}

export const authService = {
  async login(credentials) {
    if (useMockAuth) {
      await wait();
      return {
        token: createMockToken(credentials.email),
        user: createUserFromLogin(credentials),
      };
    }

    const { data } = await apiClient.post("/auth/login", credentials);
    return data;
  },

  async signup(payload) {
    if (useMockAuth) {
      await wait(800);
      return {
        token: createMockToken(payload.email),
        user: createUserFromSignup(payload),
      };
    }

    const { data } = await apiClient.post("/auth/signup", payload);
    return data;
  },

  async forgotPassword(payload) {
    if (useMockAuth) {
      await wait(600);
      return { message: "Password reset instructions were sent." };
    }

    const { data } = await apiClient.post("/auth/forgot-password", payload);
    return data;
  },

  persistSession(token, user) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    setAuthToken(token);
  },

  clearSession() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setAuthToken(null);
  },

  getStoredSession() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userValue = localStorage.getItem(AUTH_USER_KEY);

    if (!token || !userValue || isExpiredJwt(token)) {
      this.clearSession();
      return { token: null, user: null };
    }

    try {
      const user = JSON.parse(userValue);
      setAuthToken(token);
      return { token, user };
    } catch {
      this.clearSession();
      return { token: null, user: null };
    }
  },
};
