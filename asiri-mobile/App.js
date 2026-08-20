import React, { useState } from 'react';
import axios from 'axios';
import { 
  Home, Search, Bell, Mail, Bookmark, User, 
  Image, Smile, Calendar, MapPin, Heart, Repeat, Share, MessageCircle, LogOut 
} from 'lucide-react-native';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';

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

  const handleRegister = async () => {
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

  const handleLogin = async () => {
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

  const handleCreatePost = () => {
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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#000', color: '#fff', justifyContent: 'center' }}>
      <div style={{ display: 'flex', width: '100%', maxWidth: '1280px' }}>
        
        {/* LEFT SIDEBAR */}
        <aside style={{ width: '260px', padding: '16px', borderRight: '1px solid #2f3336', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Aṣịrị</h1>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button onClick={() => setCurrentView('feed')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', textAlign: 'left', cursor: 'pointer' }}>🏠 Home</button>
              <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', textAlign: 'left', cursor: 'pointer' }}>🔍 Explore</button>
              <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', textAlign: 'left', cursor: 'pointer' }}>🔔 Notifications</button>
              <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', textAlign: 'left', cursor: 'pointer' }}>✉️ Messages</button>
              <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', textAlign: 'left', cursor: 'pointer' }}>👤 Profile</button>
            </nav>
          </div>

          <div>
            {token ? (
              <button onClick={() => setToken('')} style={{ background: '#e50914', color: '#fff', padding: '10px', borderRadius: '20px', border: 'none', width: '100%', fontWeight: 'bold', cursor: 'pointer' }}>Log Out</button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button onClick={() => setCurrentView('login')} style={{ background: '#fff', color: '#000', padding: '10px', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Log In</button>
                <button onClick={() => setCurrentView('register')} style={{ background: '#1d9bf0', color: '#fff', padding: '10px', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Sign Up</button>
              </div>
            )}
          </div>
        </aside>

        {/* MIDDLE FEED */}
        <main style={{ flex: 1, maxWidth: '600px', borderRight: '1px solid #2f3336', padding: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid #2f3336', paddingBottom: '12px' }}>Home</h2>

          {currentView === 'login' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3>Sign In</h3>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '10px', background: '#16181c', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '10px', background: '#16181c', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
              <button onClick={handleLogin} style={{ padding: '10px', background: '#1d9bf0', color: '#fff', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Log In</button>
            </div>
          )}

          {currentView === 'register' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3>Create Account</h3>
              <input type="text" placeholder="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} style={{ padding: '10px', background: '#16181c', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '10px', background: '#16181c', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '10px', background: '#16181c', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
              <button onClick={handleRegister} style={{ padding: '10px', background: '#1d9bf0', color: '#fff', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Sign Up</button>
            </div>
          )}

          {currentView === 'feed' && (
            <>
              <div style={{ borderBottom: '1px solid #2f3336', paddingBottom: '16px', marginBottom: '16px' }}>
                <textarea 
                  placeholder="What is happening?!" 
                  value={newPost} 
                  onChange={(e) => setNewPost(e.target.value)} 
                  style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', fontSize: '18px', outline: 'none', resize: 'none' }}
                  rows={3}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={handleCreatePost} style={{ background: '#1d9bf0', color: '#fff', padding: '8px 16px', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Post</button>
                </div>
              </div>

              <div>
                {posts.map(p => (
                  <div key={p.id} style={{ borderBottom: '1px solid #2f3336', padding: '12px 0' }}>
                    <div style={{ fontWeight: 'bold' }}>{p.author} <span style={{ color: '#71767b', fontWeight: 'normal' }}>{p.handle}</span></div>
                    <p style={{ margin: '8px 0' }}>{p.content}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>

        {/* RIGHT SIDEBAR */}
        <aside style={{ width: '300px', padding: '16px' }}>
          <div style={{ background: '#16181c', borderRadius: '16px', padding: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>What's happening</h3>
            <p style={{ color: '#71767b', fontSize: '12px' }}>Trending in Nigeria</p>
            <p style={{ fontWeight: 'bold' }}>#AsiriApp</p>
          </div>
        </aside>

      </div>
    </div>
  );
}
