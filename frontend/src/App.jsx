import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL



function App() {
  const [authMode, setAuthMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [user, setUser] = useState(() => {
    const savedUser = window.localStorage.getItem('notes-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }

    const fetchNotes = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/notes`, {
          params: { userId: user.id },
        });
        setNotes(data.notes || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotes();
  }, [user]);

  const handleAuth = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const endpoint = authMode === 'login' ? `${API_URL}/user/login` : `${API_URL}/user/register`;
    console.log("endpoint",endpoint)
    console.log("url", API_URL)
    const payload = authMode === 'login'
      ? { email: form.email, password: form.password }
      : { name: form.name, email: form.email, password: form.password };

    try {
      const { data } = await axios.post(endpoint, payload);

      if (authMode === 'login') {
        const nextUser = data.user;
        setUser(nextUser);
        window.localStorage.setItem('notes-user', JSON.stringify(nextUser));
        setForm({ name: '', email: '', password: '' });
        setMessage({ type: 'success', text: data.message });
      } else {
        setAuthMode('login');
        setForm({ name: '', email: '', password: '' });
        setMessage({ type: 'success', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || error.message || 'Authentication failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (event) => {
    event.preventDefault();
    if (!newNote.trim() || !user) return;

    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/notes`, {
        content: newNote,
        userId: user.id,
      });

      setNewNote('');
      setNotes((current) => [data.note, ...current]);
      setMessage({ type: 'success', text: 'Note added successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || error.message || 'Unable to save note' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete(`${API_URL}/notes/${noteId}`);
      setNotes((current) => current.filter((note) => note.id !== noteId));
      setMessage({ type: 'success', text: 'Note deleted' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || error.message || 'Unable to delete note' });
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('notes-user');
    setUser(null);
    setNotes([]);
    setMessage({ type: 'success', text: 'You have been logged out' });
  };

  return (
    <div className="app-shell">
      <header className="hero-card">
        <div>
          <p className="eyebrow">Secure notes</p>
          <h1>Keep your thoughts organized</h1>
          <p className="hero-copy">
            Sign in or create an account to manage your personal notes in one place.
          </p>
        </div>
        {user && (
          <button type="button" className="secondary-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </header>

      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

      {!user ? (
        <section className="panel">
          <div className="panel-header">
            <h2>{authMode === 'login' ? 'Welcome back' : 'Create an account'}</h2>
            <button
              type="button"
              className="link-btn"
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            >
              {authMode === 'login' ? 'Need an account?' : 'Already have one?'}
            </button>
          </div>

          <form onSubmit={handleAuth} className="form-stack">
            {authMode === 'register' && (
              <input
                type="text"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Your name"
                required
              />
            )}
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="Email address"
              required
            />
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Password"
              required
            />
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Register'}
            </button>
          </form>
        </section>
      ) : (
        <div className="dashboard-grid">
          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Signed in as</p>
                <h2>{user.name}</h2>
              </div>
              <span className="pill">{notes.length} notes</span>
            </div>

            <form onSubmit={handleAddNote} className="form-stack">
              <textarea
                rows="4"
                value={newNote}
                onChange={(event) => setNewNote(event.target.value)}
                placeholder="Write a new note..."
                required
              />
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Saving...' : 'Add note'}
              </button>
            </form>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h2>Your notes</h2>
            </div>
            <div className="notes-list">
              {notes.length === 0 ? (
                <p className="empty-state">No notes yet. Add your first one above.</p>
              ) : (
                notes.map((note) => (
                  <article key={note.id} className="note-card">
                    <p>{note.content}</p>
                    <button type="button" className="delete-btn" onClick={() => handleDeleteNote(note.id)}>
                      Delete
                    </button>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
