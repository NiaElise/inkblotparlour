import { useState, useEffect } from "react";
import { fetchAdminUsers, fetchAdminStoryworlds, fetchAdminPosts } from "../api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [worlds, setWorlds] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [u, w, p] = await Promise.all([
          fetchAdminUsers(),
          fetchAdminStoryworlds(),
          fetchAdminPosts()
        ]);
        setUsers(u);
        setWorlds(w);
        setPosts(p);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="p-8 text-parchment/60 font-serif">Reading the archives...</div>;
  if (error) return <div className="p-8 text-red-400 font-serif">Error: {error}</div>;

  return (
    <div className="p-8 space-y-12 bg-void min-h-screen text-parchment selection:bg-sepia/30">
      <header className="border-b border-sepia/30 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif text-parchment-light">Admin Archives</h1>
          <p className="text-sepia italic">The overseer\s sanctuary</p>
        </div>
        <a href="/" className="text-sepia hover:text-parchment-light text-sm underline underline-offset-4 font-serif">Public Site</a>
      </header>

      <section>
        <h2 className="text-2xl font-serif mb-6 text-parchment-light flex items-center">
          <span className="w-8 h-px bg-sepia/30 mr-4"></span>
          Fiction Architects ({users.length})
        </h2>
        <div className="overflow-x-auto border border-sepia/20 rounded-lg bg-sepia/5">
          <table className="w-full text-left">
            <thead className="bg-sepia/10 text-sepia text-xs uppercase tracking-[0.2em] font-medium">
              <tr>
                <th className="p-4 border-b border-sepia/20">Username</th>
                <th className="p-4 border-b border-sepia/20">Email</th>
                <th className="p-4 border-b border-sepia/20">Tier</th>
                <th className="p-4 border-b border-sepia/20">Role</th>
                <th className="p-4 border-b border-sepia/20">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sepia/10">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-sepia/5 transition-colors group">
                  <td className="p-4 text-parchment-light font-serif">{user.username}</td>
                  <td className="p-4 text-parchment/70 font-mono text-sm">{user.email || "N/A"}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${
                      user.tier === "Collective" ? "bg-sepia text-void font-bold" : 
                      user.tier === "Architect" ? "border border-sepia text-sepia" : "border border-parchment/20 text-parchment/40"
                    }`}>
                      {user.tier}
                    </span>
                  </td>
                  <td className="p-4 text-parchment/40 uppercase text-[10px] tracking-widest">{user.role}</td>
                  <td className="p-4 text-parchment/30 text-sm">{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section>
          <h2 className="text-2xl font-serif mb-6 text-parchment-light flex items-center">
            <span className="w-8 h-px bg-sepia/30 mr-4"></span>
            Storyworlds ({worlds.length})
          </h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-sepia/20">
            {worlds.map(world => (
              <div key={world.id} className="p-6 border border-sepia/20 rounded-lg bg-sepia/5 hover:border-sepia/40 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-serif text-parchment-light group-hover:text-sepia transition-colors">{world.title}</h3>
                  <a href={`/sanctuary/studio/${world.id}`} className="text-[10px] uppercase tracking-widest text-sepia hover:text-parchment-light border border-sepia/30 px-2 py-1 rounded">
                    Oversee
                  </a>
                </div>
                <p className="text-parchment/60 text-sm line-clamp-2 italic mb-4 font-serif">
                  {world.description || "A world yet to be described..."}
                </p>
                <div className="flex items-center text-[10px] uppercase tracking-widest text-parchment/30">
                  <span className="mr-2">Owner ID:</span>
                  <span className="font-mono text-parchment/50">{world.user_id}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-serif mb-6 text-parchment-light flex items-center">
            <span className="w-8 h-px bg-sepia/30 mr-4"></span>
            Recent Fragments ({posts.length})
          </h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-sepia/20">
            {posts.map(post => (
              <div key={post.id} className="p-4 border border-sepia/10 rounded bg-sepia/5 hover:bg-sepia/10 transition-colors">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-sepia mb-3">
                  <span className="font-mono">{post.user_id}</span>
                  <span>{new Date(post.created_at).toLocaleString()}</span>
                </div>
                <p className="text-parchment/80 italic font-serif leading-relaxed">
                  <span className="text-sepia mr-2">¶</span>
                  {post.content}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
