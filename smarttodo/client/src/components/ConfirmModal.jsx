// src/components/ConfirmModal.jsx - Apple-style delete confirmation modal
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineExclamation } from 'react-icons/hi';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
            className="w-full max-w-sm rounded-[18px] p-6 text-center border"
            style={{ 
              background: 'var(--colors-canvas)', 
              borderColor: 'var(--colors-hairline)',
              boxShadow: 'none'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(255, 59, 48, 0.08)' }}>
              <HiOutlineExclamation size={24} style={{ color: 'var(--colors-danger)' }} />
            </div>
            
            <h3 className="body-strong mb-2" style={{ color: 'var(--colors-ink)' }}>
              {title || 'Are you sure?'}
            </h3>
            
            <p className="caption-text mb-6" style={{ color: 'var(--colors-ink-muted-80)' }}>
              {message || 'This action cannot be undone.'}
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="button-pearl-capsule flex-1 justify-center"
              >
                Cancel
              </button>
              <button 
                onClick={onConfirm}
                className="button-primary flex-1 justify-center"
                style={{ background: 'var(--colors-danger)' }}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
