import React, { useState } from "react";
import { useAuthStore } from "../../store/UseAuthStore";
import { useNavigate } from "react-router";
import { addMockUser, mockUsers } from "../../moks/users";

export default function Registrasi(){
    const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const {setAuth} = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
  }

  const handleSubmit = (e: React.FormEvent)=>{
    e.preventDefault();

    if(!form.name || !form.email || !form.password){
        return alert("Semua field Wajib di isi")
    }

    if(!form.password !== !form.password_confirmation ){
        return alert("Konfirmasi password tidak cocok")
    }

      const isExist = mockUsers.find((u) => u.email === form.email);
    if (isExist) {
      return alert("Email sudah digunakan.");
    }

      const newUser = addMockUser({
      name: form.name,
      email: form.email,
      password: form.password,
      role: "customer",
    });

     setAuth(newUser, "dummy-token");

    
    if (newUser.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

    return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Register</h2>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Nama"
        className="input"
      />
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="input"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        className="input"
      />
      <input
        name="password_confirmation"
        type="password"
        value={form.password_confirmation}
        onChange={handleChange}
        placeholder="Konfirmasi Password"
        className="input"
      />
      <button type="submit" className="btn w-full">
        Daftar
      </button>
    </form>
  );
}