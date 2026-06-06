import { useCallback, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService.js";
import { setUnauthorizedHandler } from "../services/api.js";
import { AuthContext } from "./auth-context.js";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [authError, setAuthError] = useState("");

  // Restore persisted JWT/user data before route guards make decisions.
  useEffect(() => {
    const session = authService.getStoredSession();
    setCurrentUser(session.user);
    setToken(session.token);
    setInitializing(false);
  }, []);

  // One place to update React state, localStorage, and Axios authorization.
  const commitSession = useCallback((session) => {
    authService.persistSession(session.token, session.user);
    setCurrentUser(session.user);
    setToken(session.token);
  }, []);

  const login = useCallback(
    async (credentials) => {
      setAuthError("");
      try {
        const session = await authService.login(credentials);
        commitSession(session);
        return session.user;
      } catch (error) {
        setAuthError(error.message);
        throw error;
      }
    },
    [commitSession]
  );

  const signup = useCallback(
    async (payload) => {
      setAuthError("");
      try {
        const session = await authService.signup(payload);
        commitSession(session);
        return session.user;
      } catch (error) {
        setAuthError(error.message);
        throw error;
      }
    },
    [commitSession]
  );

  const logout = useCallback(() => {
    authService.clearSession();
    setCurrentUser(null);
    setToken(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const value = useMemo(
    () => ({
      authError,
      clearAuthError: () => setAuthError(""),
      currentUser,
      initializing,
      isAuthenticated: Boolean(token && currentUser),
      login,
      logout,
      signup,
      token,
    }),
    [authError, currentUser, initializing, login, logout, signup, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
