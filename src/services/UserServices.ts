// src/Services/UserService.ts

import api from "../api/api";
import type { User } from "../models/users";


export default class UserService {
  static async getAll(): Promise<User[]> {
    const res = await api.get("/users");
    return res.data.data; // sesuai struktur dari Laravel
  }

  static async getById(id: string): Promise<User> {
    const res = await api.get(`/users/${id}`);
    return res.data.data;
  }

static async create(user: {
  name: string;
  email: string;
  password: string;
  role: "admin" | "customer";
}) {
  const res = await api.post("/auth/register", user);
  const { user: createdUser, token, expires_at } = res.data.data;
  return { user: createdUser, token, expires_at };
}

static async login(payload: { email: string; password: string }) {
  const res = await api.post("/auth/login", payload);
  const { user, token, expires_at } = res.data.data;
  return { user, token, expires_at };
}

  static async logout(): Promise<void> {
    await api.post("/auth/logout");
  }
}
