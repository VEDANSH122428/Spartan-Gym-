import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, ArrowLeft, Lock, User } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/admin/login`, formData);
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUsername', response.data.username);
      toast.success("Login successful!");
      navigate('/admin/dashboard');
    } catch (error) {
      const message = error.response?.data?.detail || "Login failed. Please check your credentials.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex items-center justify-center px-4 noise-bg">
      <div className="max-w-md w-full">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 font-accent tracking-wider"
          data-testid="back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <div className="bg-zinc-900 border border-red-600/30 p-8">
          <div className="flex items-center justify-center mb-8">
            <Dumbbell className="w-10 h-10 text-red-600" />
            <h1 className="ml-3 text-3xl font-black tracking-tighter uppercase font-headings" data-testid="admin-login-heading">
              Admin Login
            </h1>
          </div>

          <div className="h-1 w-24 bg-red-600 mx-auto mb-8"></div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="admin-login-form">
            <div>
              <label htmlFor="username" className="block text-sm font-accent tracking-wider text-gray-400 mb-2">
                USERNAME
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border-zinc-800 focus:border-red-500 focus:ring-red-500/20 rounded-sm h-12 pl-12 pr-4 text-white focus:outline-none focus:ring-2"
                  placeholder="Enter username"
                  data-testid="username-input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-accent tracking-wider text-gray-400 mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border-zinc-800 focus:border-red-500 focus:ring-red-500/20 rounded-sm h-12 pl-12 pr-4 text-white focus:outline-none focus:ring-2"
                  placeholder="Enter password"
                  data-testid="password-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full skew-button rounded-none uppercase tracking-widest font-bold px-8 py-4 bg-red-600 hover:bg-red-700 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="login-btn"
            >
              <span>{loading ? 'Logging in...' : 'Login'}</span>
            </button>
          </form>

          <div className="mt-6 p-4 bg-zinc-950 border border-zinc-800 rounded-sm">
            <p className="text-xs text-gray-500 font-body text-center">
              Default credentials: admin / spartans2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;