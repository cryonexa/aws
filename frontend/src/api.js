import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({ baseURL: API_URL });

export function signup(username, password) {
  return api.post("/signup", { username, password });
}

export function login(username, password) {
  return api.post("/login", { username, password });
}

export function fetchUsers() {
  return api.get("/users");
}

export function fetchMessages(me, user) {
  return api.get("/messages", { params: { me, user } });
}

export function fetchAdminUsers() {
  return api.get("/admin/users");
}

export function fetchAdminMessages(limit = 200) {
  return api.get("/admin/messages", { params: { limit } });
}
