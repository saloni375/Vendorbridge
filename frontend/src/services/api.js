import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Keeps Axios aligned with the token stored by AuthContext.
export function setAuthToken(token) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete apiClient.defaults.headers.common.Authorization;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";

    return Promise.reject({
      ...error,
      message,
      status: error.response?.status,
    });
  }
);
