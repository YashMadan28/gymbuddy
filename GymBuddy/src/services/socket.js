import { io } from "socket.io-client";

// Connect to backend with Vite env variable
const socket = io(import.meta.env.VITE_BACKEND_URL, {
  withCredentials: true,
});

export default socket;

