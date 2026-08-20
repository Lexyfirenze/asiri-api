import React, { useState } from 'react';
import axios from 'axios';
import { 
  Home, Search, Bell, Mail, Bookmark, User, 
  Heart, Repeat, Share, MessageCircle, LogOut 
} from 'lucide-react';

const API_BASE_URL = 'https://asiri-api-3spn.onrender.com/api';

export default function App() {
  const [currentView, setCurrentView] = useState('feed');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, {
        email,
        password,
        display_name: displayName || email.split('@')[0]
      });
      if (res.data.success) {
        alert('Account created! You can now log in.');
        setCurrentView('login');
      }
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        setCurrentView('feed');
      }
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    const postObj = {
      id: Date.now(),
      author: user?.user_metadata?.display_name || 'Anonymous',
      handle: `@${user?.email?.split('@')[0] || 'user'}`,
      content: newPost,
      time: 'Just now',
      likes: 0,
      reposts: 0,
      replies: 0
    };
    setPosts([postObj, ...posts]);
    setNewPost('');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#000', color: '#fff', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', width: '100%', maxWidth: '1280px' }}>
        
        {/* LEFT SIDEBAR */}
        <aside style={{ width: '260px', padding: '16px', borderRight: '1px solid #2f3336', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100vh', position: 'sticky', top: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Aṣịrị</h1>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button onClick={() => setCurrentView('feed')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}><Home size={22} /> Home</button>
              <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}><Search size={22} /> Explore</button>
              <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}><Bell size={22} /> Notifications</button>
              <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}><Mail size={22} /> Messages</button>
              <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}><Bookmark size={22} /> Bookmarks</button>
              <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}><User size={22} /> Profile</button>
            </nav>
          </div>

          <div>
            {token ? (
              <button onClick={() => setToken('')} style={{ background: '#e50914', color: '#fff', padding: '10px', borderRadius: '20px', border: 'none', width: '100%', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><LogOut size={18} /> Log Out</button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button onClick={() => setCurrentView('login')} style={{ background: '#fff', color: '#000', padding: '10px', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Log In</button>
                <button onClick={() => setCurrentView('register')} style={{ background: '#1d9bf0', color: '#fff', padding: '10px', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Sign Up</button>
              </div>
            )}
          </div>
        </aside>

        {/* MIDDLE FEED */}
        <main style={{ flex: 1, maxWidth: '600px', borderRight: '1px solid #2f3336', minHeight: '100vh' }}>
          <header style={{ position: 'sticky', top: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', padding: '16px', borderBottom: '1px solid #2f3336' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Home</h2>
          </header>

          {currentView === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', maxWidth: '400px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold' }}>Sign In to Aṣịrị</h3>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '12px', background: '#16181c', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '12px', background: '#16181c', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
              <button type="submit" style={{ padding: '12px', background: '#fff', color: '#000', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Log In</button>
            </form>
          )}

          {currentView === 'register' && (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', maxWidth: '400px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold' }}>Create Account</h3>
              <input type="text" placeholder="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} style={{ padding: '12px', background: '#16181c', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '12px', background: '#16181c', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '12px', background: '#16181c', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
              <button type="submit" style={{ padding: '12px', background: '#1d9bf0', color: '#fff', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Sign Up</button>
            </form>
          )}

          {currentView === 'feed' && (
            <>
              <form onSubmit={handleCreatePost} style={{ borderBottom: '1px solid #2f3336', padding: '16px' }}>
                <textarea 
                  placeholder="What is happening?!" 
                  value={newPost} 
                  onChange={(e) => setNewPost(e.target.value)} 
                  style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', fontSize: '18px', outline: 'none', resize: 'none' }}
                  rows={3}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #2f3336', paddingTop: '12px' }}>
                  <button type="submit" style={{ background: '#1d9bf0', color: '#fff', padding: '8px 20px', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Post</button>
                </div>
              </form>

              <div>
                {posts.map(p => (
                  <article key={p.id} style={{ borderBottom: '1px solid #2f3336', padding: '16px', display: 'flex', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1d9bf0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {p.author[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '14px', color: '#71767b' }}>
                        <span style={{ fontWeight: 'bold', color: '#fff' }}>{p.author}</span>
                        <span>{p.handle}</span>
                        <span>· {p.time}</span>
                      </div>
                      <p style={{ margin: '8px 0', fontSize: '15px' }}>{p.content}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '300px', color: '#71767b', marginTop: '12px' }}>
                        <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><MessageCircle size={16} /> {p.replies}</span>
                        <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Repeat size={16} /> {p.reposts}</span>
                        <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Heart size={16} /> {p.likes}</span>
                        <span style={{ cursor: 'pointer' }}><Share size={16} /></span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </main>

        {/* RIGHT SIDEBAR */}
        <aside style={{ width: '300px', padding: '16px' }}>
          <div style={{ background: '#16181c', borderRadius: '16px', padding: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', marginTop: 0 }}>What's happening</h3>
            <p style={{ color: '#71767b', fontSize: '12px', margin: 0 }}>Trending in Nigeria</p>
            <p style={{ fontWeight: 'bold', margin: '4px 0 0 0' }}>#AsiriApp</p>
          </div>
        </aside>

      </div>
    </div>
  );
}
