import { useState } from "react";
import { login } from "../api";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      // login function already sets localStorage.setItem('inkblot_token', user.id);
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/sanctuary");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-4">
      <div className="max-w-md w-full border border-sepia/30 p-8 rounded-lg bg-sepia/5 backdrop-blur-sm">
        <h1 className="text-3xl font-serif text-parchment-light mb-2 text-center">Enter the Parlour</h1>
        <p className="text-sepia italic text-sm mb-8 text-center">Identity verification required</p>
        
        {error && <div className="mb-6 p-3 bg-red-900/20 border border-red-900/50 text-red-400 text-sm rounded">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sepia text-xs uppercase tracking-widest mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-void border border-sepia/20 p-3 text-parchment focus:border-sepia outline-none transition-colors rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sepia text-xs uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-void border border-sepia/20 p-3 text-parchment focus:border-sepia outline-none transition-colors rounded"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-sepia text-void py-3 font-serif hover:bg-parchment-light transition-colors rounded shadow-lg shadow-sepia/10"
          >
            Authenticate
          </button>
        </form>
        
        <div className="mt-8 pt-8 border-t border-sepia/10 text-center">
          <a href="/" className="text-sepia hover:text-parchment-light text-sm transition-colors font-serif italic">← Return to the Public Feed</a>
        </div>
      </div>
    </div>
  );
}
