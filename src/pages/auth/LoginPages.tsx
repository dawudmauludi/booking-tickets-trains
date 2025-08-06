import React, { useState } from "react";
import { mockUsers } from "../../moks/users";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/UseAuthStore";

export default function Login(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {setAuth} = useAuthStore()
     const navigate = useNavigate();
    
    
    const handleLogin = async (e: React.FormEvent)=>{
        e.preventDefault();

        const user = mockUsers.find(u => u.email === email && u.password === password);
        if(user){
            setAuth(user, "fake-jwt-token");
            
            navigate("/")
             if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } else {
      alert("Email atau password salah");
    }
        
    };

    return(

      <form onSubmit={handleLogin} className="max-w-md space-y-4">
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input"
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input"
      />
      <button type="submit" className="btn">Login</button>
      <span>Apakah Belum Memiliki Akun? <a href="/auth/registrasi">Registasi</a> </span>
    </form>
  );
}