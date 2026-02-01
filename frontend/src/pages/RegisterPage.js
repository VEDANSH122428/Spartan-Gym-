import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    membership_plan: "monthly"
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/members`, formData);
      toast.success("Registration successful! Welcome to Spartans Gym!");
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      const message = error.response?.data?.detail || "Registration failed. Please try again.";
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
    <div className="min-h-screen bg-[#09090B] text-white flex items-center justify-center px-4 py-12 noise-bg">
      <div className="max-w-2xl w-full">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 font-accent tracking-wider"
          data-testid="back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <div className="bg-zinc-900 border border-white/10 p-8 md:p-12">
          <div className="flex items-center justify-center mb-8">
            <Dumbbell className="w-10 h-10 text-red-600" />
            <h1 className="ml-3 text-3xl md:text-4xl font-black tracking-tighter uppercase font-headings" data-testid="register-heading">
              Join Spartans Gym
            </h1>
          </div>

          <div className="h-1 w-24 bg-red-600 mx-auto mb-8"></div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="registration-form">
            <div>
              <label htmlFor="name" className="block text-sm font-accent tracking-wider text-gray-400 mb-2">
                FULL NAME *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-zinc-950 border-zinc-800 focus:border-red-500 focus:ring-red-500/20 rounded-sm h-12 px-4 text-white focus:outline-none focus:ring-2"
                placeholder="Enter your full name"
                data-testid="name-input"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-accent tracking-wider text-gray-400 mb-2">
                EMAIL ADDRESS *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-zinc-950 border-zinc-800 focus:border-red-500 focus:ring-red-500/20 rounded-sm h-12 px-4 text-white focus:outline-none focus:ring-2"
                placeholder="your.email@example.com"
                data-testid="email-input"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-accent tracking-wider text-gray-400 mb-2">
                PHONE NUMBER *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-zinc-950 border-zinc-800 focus:border-red-500 focus:ring-red-500/20 rounded-sm h-12 px-4 text-white focus:outline-none focus:ring-2"
                placeholder="+91 98765 43210"
                data-testid="phone-input"
              />
            </div>

            <div>
              <label htmlFor="membership_plan" className="block text-sm font-accent tracking-wider text-gray-400 mb-2">
                MEMBERSHIP PLAN *
              </label>
              <select
                id="membership_plan"
                name="membership_plan"
                value={formData.membership_plan}
                onChange={handleChange}
                className="w-full bg-zinc-950 border-zinc-800 focus:border-red-500 focus:ring-red-500/20 rounded-sm h-12 px-4 text-white focus:outline-none focus:ring-2"
                data-testid="plan-select"
              >
                <option value="monthly">Monthly - ₹1000</option>
                <option value="quarterly">Quarterly - ₹2500</option>
                <option value="half-yearly">Half-Yearly - ₹5200</option>
                <option value="yearly">Yearly - ₹9000</option>
                <option value="personal-training">Personal Training Add-on - ₹2,000/mo</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full skew-button rounded-none uppercase tracking-widest font-bold px-8 py-4 bg-red-600 hover:bg-red-700 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="submit-btn"
            >
              <span>{loading ? 'Registering...' : 'Complete Registration'}</span>
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6 font-body">
            By registering, you agree to our terms and conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;