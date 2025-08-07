// src/Models/User.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  created_at?: string;
}
