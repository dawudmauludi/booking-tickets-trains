// src/mocks/users.ts
import { v4 as uuid } from "uuid";

export type MockUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "customer";
};

export const mockUsers: MockUser[] = [
  {
    id: uuid(),
    name: "Admin User",
    email: "admin@gmail.com",
    password: "admin12345",
    role: "admin",
  },
  {
    id: uuid(),
    name: "Customer User",
    email: "customer@gmail.com",
    password: "customer12345",
    role: "customer",
  }
];

// Fungsi menambahkan user baru
export function addMockUser(user: Omit<MockUser, "id">): MockUser {
  const newUser: MockUser = { id: uuid(), ...user };
  mockUsers.push(newUser);
  return newUser;
}
