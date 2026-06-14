import { useState, useEffect } from "react";
import { signup } from "../api";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SignupPage() {
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tier, setTier] = useState(searchParams.get("tier") || "Draftsman");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(username, email, password, tier);
      navigate("/sanctuary");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-4 py-20">
      <div className="max-w-md w-full border border-sepia/30 p-8 rounded-lg bg-sepia/5 backdrop-blur-sm">
        <h1 className="text-3xl font-serif text-parchment-light mb-2 text-center">Join the Parlour</h1>
        <p className="text-sepia italic text-sm mb-8 text-center">Create your architect profile</p>
        
        {error && <div className="mb-6 p-3 bg-red-900/20 border border-red-900/50 text-red-400 text-sm rounded">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sepia text-xs uppercase tracking-widest mb-2">Pen Name / Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-void border border-sepia/20 p-3 text-parchment focus:border-sepia outline-none transition-colors rounded"
              required
              placeholder="e.g. TheInkweaver"
            />
          </div>
          <div>
            <label className="block text-sepia text-xs uppercase tracking-widest mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-void border border-sepia/20 p-3 text-parchment focus:border-sepia outline-none transition-colors rounded"
              required
              placeholder="your@inkwell.com"
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
              placeholder="Min 8 characters"
            />
          </div>
          <div>
            <label className="block text-sepia text-xs uppercase tracking-widest mb-2">Selected Station</label>
            <select 
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="w-full bg-void border border-sepia/20 p-3 text-parchment focus:border-sepia outline-none transition-colors rounded appearance-none"
            >
              <option value="Draftsman">The Draftsman (Free)</option>
              <option value="Architect">The Architect ($10/mo)</option>
              <option value="Collective">The Collective ($15/mo)</option>
            </select>
          </div>
          <button 
            type="submit"
            className="w-full bg-sepia text-void py-3 font-serif hover:bg-parchment-light transition-colors rounded shadow-lg shadow-sepia/10"
          >
            Create Profile
          </button>
        </form>
        
        <div className="mt-8 pt-8 border-t border-sepia/10 text-center">
          <p className="text-parchment/40 text-sm mb-4">Already have a profile?</p>
          <a href="/login" className="text-sepia hover:text-parchment-light text-sm transition-colors font-serif italic underline underline-offset-4">Log in to your sanctuary</a>
        </div>
      </div>
    </div>
  );
}
