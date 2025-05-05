import axios from "axios";
import { getAuth } from "firebase/auth";

/**
 * This Axios file centralizes configuration for all API requests.
 */

// Create a pre-configured Axios instance
const instance = axios.create({
   // Backend base URL from environment variables
  baseURL: import.meta.env.VITE_BACKEND_URL,
  // Include cookies in cross-origin requests if needed
  withCredentials: true,
});

/**
 * Request interceptor to automatically attach Firebase ID token
 * to the Authorization header for authenticated API requests.
 */
instance.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    // If a user is signed in, attach their token to the request
    if (currentUser) {
      const token = await currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Forward any request errors
    return Promise.reject(error);
  }
);

export default instance;


