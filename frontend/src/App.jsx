import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { LogOut, User, Home as HomeIcon, Loader, ShieldAlert } from 'lucide-react';
import PostComposer from './components/PostComposer.jsx';
import { getPosts } from './services/postService.js';
import PostFeed from './components/PostFeed.jsx';

const Header = () => {
  const { user, logout } = useAuth();
  return (
    <header className="main-header">
      <div className="header-container">
        <Link to="/" className="logo">
          <svg className="logo-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          ConnectHub
        </Link>
        {user && (
          <div className="nav-profile">
            <Link to="/profile" className="nav-link">
              <User size={18} />
              <span>{user.name}</span>
            </Link>
            <button className="btn btn-secondary btn-icon" onClick={logout} title="Sign Out">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

const Home = () => {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await getPosts();

        if (response.success) {
          setPosts(response.data);
        }
      } catch (error) {
        console.error('Failed loading posts:', error);
      } finally {
        setLoadingPosts(false);
      }
    };

    loadPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleDeletePost = (postId) => {
    setPosts((prev) =>
      prev.filter((post) => post._id !== postId)
    );
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="welcome-banner">
        <h2>Welcome to ConnectHub, {user?.name}!</h2>
        <p className="subtitle">@{user?.username}</p>
      </div>

      <div
        style={{
          background: '#1a2338',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
        }}
      >
        <PostComposer onPostCreated={handlePostCreated} />
      </div>

      {loadingPosts ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <div className="feed-placeholder">
          <h3>Your Feed is Empty</h3>
          <p>Create your first post.</p>
        </div>
      ) : (
        <PostFeed
          posts={posts}
          onDelete={handleDeletePost}
        />
      )}
    </div>
  );
};

const Profile = () => {
  const { user } = useAuth();

  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(
    user?.name || ''
  );

  const [bio, setBio] = useState(
    user?.bio || ''
  );

  const [profilePicture, setProfilePicture] =
    useState(user?.profilePicture || '');

  const handleSave = async () => {
    try {
      const { updateProfile } = await import(
        './services/authService.js'
      );

      await updateProfile({
        name,
        bio,
        profilePicture,
      });

      alert(
        'Profile updated successfully. Refresh page to see changes.'
      );

      setEditing(false);
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="page-container profile-container animate-fade-in">
      <div className="profile-header">
        <div className="profile-avatar-placeholder">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt={name}
              className="profile-img"
            />
          ) : (
            <span className="profile-avatar-initials">
              {name
                ? name[0].toUpperCase()
                : 'U'}
            </span>
          )}
        </div>

        <div className="profile-details">
          {editing ? (
            <>
              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Name"
              />

              <br />
              <br />

              <input
                value={profilePicture}
                onChange={(e) =>
                  setProfilePicture(
                    e.target.value
                  )
                }
                placeholder="Profile Picture URL"
              />
            </>
          ) : (
            <>
              <h2>{user?.name}</h2>

              <p className="profile-username">
                @{user?.username}
              </p>

              <p className="profile-email">
                {user?.email}
              </p>
            </>
          )}
        </div>
      </div>

      <hr className="profile-divider" />

      <div className="profile-bio-section">
        <h3>Bio</h3>

        {editing ? (
          <textarea
            rows="4"
            value={bio}
            onChange={(e) =>
              setBio(e.target.value)
            }
            style={{
              width: '100%',
              padding: '10px',
            }}
          />
        ) : (
          <p className="profile-bio">
            {user?.bio ||
              'No bio written yet. Tell the world about yourself!'}
          </p>
        )}
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <span className="stat-value">
            {user?.followers || 0}
          </span>

          <span className="stat-label">
            Followers
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-value">
            {user?.following || 0}
          </span>

          <span className="stat-label">
            Following
          </span>
        </div>
      </div>

      <div
        className="profile-actions"
        style={{
          display: 'flex',
          gap: '10px',
        }}
      >
        <Link
          to="/"
          className="btn btn-secondary"
        >
          Back to Feed
        </Link>

        {editing ? (
          <button
            onClick={handleSave}
            className="btn btn-primary"
          >
            Save Profile
          </button>
        ) : (
          <button
            onClick={() =>
              setEditing(true)
            }
            className="btn btn-primary"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>Sign In</h2>
      {error && (
        <div className="alert-error">
          <ShieldAlert size={18} />
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Username or Email</label>
          <input
            type="text"
            placeholder="Enter username or email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? <Loader className="spinner" size={18} /> : 'Sign In'}
        </button>
      </form>
      <p className="auth-footer">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </div>
  );
};

const Register = () => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsSubmitting(false);
      return;
    }

    const result = await register(name, username, email, password);
    if (!result.success) {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>Create Account</h2>
      {error && (
        <div className="alert-error">
          <ShieldAlert size={18} />
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? <Loader className="spinner" size={18} /> : 'Register'}
        </button>
      </form>
      <p className="auth-footer">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="loader-screen">
        <Loader className="spinner" size={36} />
        <p>Connecting to server...</p>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return (
    <>
      <Header />
      <main className="main-content">{children}</main>
    </>
  );
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="loader-screen">
        <Loader className="spinner" size={36} />
      </div>
    );
  }
  if (user) return <Navigate to="/" replace />;
  return <div className="auth-layout">{children}</div>;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
