// src/pages/Register.jsx - Apple ID style Register page
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await register(formData);
      toast.success(res.message || 'Account created successfully');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'var(--colors-canvas-parchment)' }}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="w-full max-w-sm rounded-[18px] p-8 border"
        style={{
          background: 'var(--colors-canvas)',
          borderColor: 'var(--colors-hairline)',
          boxShadow: 'none'
        }}
      >
        <div className="text-center mb-10">
          <span className="text-2xl font-bold tracking-tight" style={{ color: 'var(--colors-ink)', fontFamily: 'SF Pro Display, sans-serif' }}>
            SmartTodo
          </span>
          <h1 className="body-strong font-medium mt-3 tracking-tight" style={{ color: 'var(--colors-ink-muted-80)' }}>
            Create your account
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-[11px] border overflow-hidden" style={{ borderColor: 'var(--colors-hairline)' }}>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-neutral-900 text-sm outline-none border-b text-center"
              style={{ borderColor: 'var(--colors-hairline)', color: 'var(--colors-ink)' }}
              placeholder="Full Name"
              required
            />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-neutral-900 text-sm outline-none border-b text-center"
              style={{ borderColor: 'var(--colors-hairline)', color: 'var(--colors-ink)' }}
              placeholder="Email"
              required
            />
            <div className="relative border-b" style={{ borderColor: 'var(--colors-hairline)' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-neutral-900 text-sm outline-none text-center"
                style={{ color: 'var(--colors-ink)' }}
                placeholder="Password"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <HiOutlineEyeOff size={16} /> : <HiOutlineEye size={16} />}
              </button>
            </div>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-neutral-900 text-sm outline-none text-center"
              style={{ color: 'var(--colors-ink)' }}
              placeholder="Confirm Password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="button-primary w-full justify-center py-2.5"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-500 hover:underline" style={{ color: 'var(--colors-primary)' }}>
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
