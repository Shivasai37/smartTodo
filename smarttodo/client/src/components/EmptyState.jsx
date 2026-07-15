// src/components/EmptyState.jsx - Empty state illustration
import { motion } from 'framer-motion';

const EmptyState = ({ title, message, icon: Icon, action, actionLabel }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: 'var(--bg-tertiary)' }}>
          {Icon && <Icon size={40} style={{ color: 'var(--text-muted)' }} />}
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full"
          style={{ background: 'var(--gradient-primary)', opacity: 0.3 }} />
        <div className="absolute -bottom-1 -left-3 w-6 h-6 rounded-full"
          style={{ background: 'var(--gradient-success)', opacity: 0.3 }} />
      </div>

      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
        {title || 'Nothing here yet'}
      </h3>
      <p className="text-sm text-center max-w-xs mb-6" style={{ color: 'var(--text-muted)' }}>
        {message || 'Get started by creating your first item.'}
      </p>
      {action && (
        <button onClick={action} className="btn-gradient text-sm">
          {actionLabel || 'Get Started'}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
