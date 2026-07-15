// src/components/TodoModal.jsx - Apple-style task editor modal sheet
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX } from 'react-icons/hi';
import { categories, priorities } from '../utils/helpers';

const TodoModal = ({ isOpen, onClose, onSubmit, todo = null }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', priority: 'medium', category: 'general',
    deadline: '', reminder: ''
  });

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title || '',
        description: todo.description || '',
        priority: todo.priority || 'medium',
        category: todo.category || 'general',
        deadline: todo.deadline ? todo.deadline.split('T')[0] : '',
        reminder: todo.reminder || ''
      });
    } else {
      setFormData({
        title: '', description: '', priority: 'medium', category: 'general',
        deadline: '', reminder: ''
      });
    }
  }, [todo, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSubmit(formData);
  };

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
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
            className="w-full max-w-lg rounded-[17px] p-6 max-h-[90vh] overflow-y-auto border"
            style={{ 
              background: 'var(--colors-canvas)', 
              borderColor: 'var(--colors-hairline)',
              boxShadow: 'none'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="body-strong text-lg" style={{ color: 'var(--colors-ink)' }}>
                {todo ? 'Edit Todo' : 'New Todo'}
              </h2>
              <button
                onClick={onClose}
                className="button-pearl-capsule scale-95"
                style={{ padding: '6px' }}
              >
                <HiOutlineX size={15} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-405 uppercase tracking-wider mb-1.5Packed text-gray-400">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  placeholder="What needs to be done?"
                  required
                  autoFocus
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-405 uppercase tracking-wider mb-1.5Packed text-gray-400">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Add some details..."
                />
              </div>

              {/* Priority & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-405 uppercase tracking-wider mb-1.5Packed text-gray-400">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="select-field text-xs"
                  >
                    {priorities.map(p => (
                      <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-405 uppercase tracking-wider mb-1.5Packed text-gray-400">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="select-field text-xs"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-405 uppercase tracking-wider mb-1.5Packed text-gray-400">
                  Deadline
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="input-field"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="button-pearl-capsule flex-1 justify-center"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="button-primary flex-1 justify-center"
                >
                  {todo ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TodoModal;
