// src/components/TodoCard.jsx - iOS Reminders list theme with Apple specification
import { motion } from 'framer-motion';
import {
  HiOutlineStar, HiStar, HiOutlineCheck
} from 'react-icons/hi';
import { HiOutlinePencilAlt, HiOutlineTrash as TrashIcon } from 'react-icons/hi';
import { formatDate, getPriorityColor, truncate } from '../utils/helpers';

const TodoCard = ({ todo, onEdit, onDelete, onToggleComplete, onToggleFavorite, index = 0 }) => {
  const isCompleted = todo.status === 'completed';

  const getApplePriorityBadge = (p) => {
    switch (p) {
      case 'high': return 'ios-badge ios-badge-high';
      case 'medium': return 'ios-badge ios-badge-medium';
      default: return 'ios-badge ios-badge-low';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.03, duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
      className={`store-utility-card transition-all duration-200 ${isCompleted ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-4">
        {/* iOS style Circular Checkbox */}
        <button
          onClick={() => onToggleComplete(todo)}
          className={`ios-checkbox flex-shrink-0 mt-0.5 ${isCompleted ? 'checked' : ''}`}
        >
          {isCompleted && <HiOutlineCheck size={12} className="text-white" />}
        </button>

        {/* Content detail */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`body-strong truncate ${isCompleted ? 'line-through text-gray-400' : 'text-gray-900 dark:text-gray-150'}`}
            >
              {todo.title}
            </h3>

            {/* Star toggle */}
            <button
              onClick={() => onToggleFavorite(todo)}
              className="p-0.5 text-gray-300 hover:text-yellow-400 transition-colors"
            >
              {todo.favorite ? (
                <HiStar size={16} className="text-yellow-400 animate-pulse" />
              ) : (
                <HiOutlineStar size={16} className="text-gray-400" />
              )}
            </button>
          </div>

          {todo.description && (
            <p className="caption-text mt-1 text-gray-500 truncate">
              {truncate(todo.description, 70)}
            </p>
          )}

          {/* Badges block */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-[10px]">
            <span className={getApplePriorityBadge(todo.priority)}>
              {todo.priority}
            </span>
            <span className="ios-badge" style={{ backgroundColor: 'var(--colors-divider-soft)', color: 'var(--colors-ink-muted-80)' }}>
              {todo.category}
            </span>
            {todo.deadline && (
              <span className="micro-legal font-semibold text-red-500 ml-auto uppercase tracking-wider">
                Due {formatDate(todo.deadline)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer controls using button-pearl-capsule style */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t" style={{ borderColor: 'var(--colors-divider-soft)' }}>
        <span className="micro-legal text-gray-400">
          Added {formatDate(todo.createdAt)}
        </span>
        <div className="flex items-center gap-2">
          {/* Edit Capsule */}
          <button
            onClick={() => onEdit(todo)}
            className="button-pearl-capsule scale-95"
            style={{ padding: '4px 8px', fontSize: '11px' }}
            title="Edit"
          >
            <HiOutlinePencilAlt size={12} />
          </button>
          {/* Delete Capsule */}
          <button
            onClick={() => onDelete(todo)}
            className="button-pearl-capsule text-red-500 border-red-200 dark:border-red-950/20 scale-95"
            style={{ padding: '4px 8px', fontSize: '11px' }}
            title="Delete"
          >
            <TrashIcon size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TodoCard;
