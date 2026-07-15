// src/pages/Profile.jsx - Profile management page with Apple styling
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { formatDate } from '../utils/helpers';

const Profile = () => {
  const { user } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('All fields are required');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    // Simulate updating in Express (Can be connected to backend easily if required)
    setTimeout(() => {
      toast.success('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="page-container"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Account Settings</h1>
        <p className="caption-text text-gray-400">Manage your credentials and security details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="store-utility-card flex flex-col items-center text-center">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=1d1d1f&color=fff`}
            alt="Avatar"
            className="w-20 h-20 rounded-[18px] object-cover mb-4 border"
            style={{ borderColor: 'var(--colors-hairline)' }}
          />
          <h2 className="body-strong text-gray-900 dark:text-gray-100">{user?.name}</h2>
          <p className="caption-text text-gray-400 mb-4">{user?.email}</p>
          <div className="w-full flex items-center justify-between p-3 rounded-[11px] text-xs" style={{ background: 'var(--colors-divider-soft)' }}>
            <span style={{ color: 'var(--colors-ink-muted-80)' }}>Member Since</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{formatDate(user?.createdAt)}</span>
          </div>
        </div>

        {/* Change Password / Settings */}
        <div className="md:col-span-2 store-utility-card">
          <h3 className="caption-strong mb-4 text-gray-800 dark:text-gray-200">Security Settings</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="input-field"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="input-field"
                placeholder="Enter new password (min 6 characters)"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="input-field"
                placeholder="Confirm your new password"
              />
            </div>
            <button type="submit" disabled={loading} className="button-primary w-full sm:w-auto">
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
