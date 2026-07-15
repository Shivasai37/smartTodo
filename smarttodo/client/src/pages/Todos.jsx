// src/pages/Todos.jsx - Apple styling exact specs for Tasks page
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { todosAPI } from '../services/api';
import TodoCard from '../components/TodoCard';
import TodoModal from '../components/TodoModal';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import { CardSkeleton } from '../components/Skeleton';
import { categories, priorities } from '../utils/helpers';
import {
  HiOutlinePlus, HiOutlineSearch, HiOutlineFilter,
  HiOutlineClipboardList, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineX
} from 'react-icons/hi';

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 9, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '', category: '', favorite: '' });
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const [showTodoModal, setShowTodoModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingTodo, setDeletingTodo] = useState(null);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sort,
        ...(search && { search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.category && { category: filters.category }),
        ...(filters.favorite && { favorite: filters.favorite })
      };
      const res = await todosAPI.getAll(params);
      setTodos(res.data.todos);
      setPagination(prev => ({ ...prev, ...res.data.pagination }));
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, sort, search, filters]);

  useEffect(() => { fetchTodos(); }, [fetchTodos]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleCreate = async (data) => {
    try {
      await todosAPI.create(data);
      toast.success('Task created');
      setShowTodoModal(false);
      fetchTodos();
    } catch {
      toast.error('Cannot create task');
    }
  };

  const handleUpdate = async (data) => {
    try {
      await todosAPI.update(editingTodo.id, data);
      toast.success('Task updated');
      setShowTodoModal(false);
      setEditingTodo(null);
      fetchTodos();
    } catch {
      toast.error('Cannot update task');
    }
  };

  const handleDelete = async () => {
    try {
      await todosAPI.delete(deletingTodo.id);
      toast.success('Moved to History');
      setShowDeleteModal(false);
      setDeletingTodo(null);
      fetchTodos();
    } catch {
      toast.error('Cannot delete task');
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      const newStatus = todo.status === 'completed' ? 'pending' : 'completed';
      await todosAPI.update(todo.id, { status: newStatus });
      toast.success(newStatus === 'completed' ? 'Task completed' : 'Task pending');
      fetchTodos();
    } catch {
      toast.error('Status error');
    }
  };

  const handleToggleFavorite = async (todo) => {
    try {
      await todosAPI.update(todo.id, { favorite: !todo.favorite });
      toast.success(todo.favorite ? 'Removed stars' : 'Starred');
      fetchTodos();
    } catch {
      toast.error('Star update error');
    }
  };

  const clearFilters = () => {
    setFilters({ status: '', priority: '', category: '', favorite: '' });
    setSearch('');
    setSort('newest');
  };

  const hasActiveFilters = Object.values(filters).some(v => v) || search;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Tasks</h1>
          <p className="caption-text text-gray-400">{pagination.total} active assignments</p>
        </div>
        <button onClick={() => { setEditingTodo(null); setShowTodoModal(true); }} className="button-primary">
          <HiOutlinePlus size={15} /> Add Task
        </button>
      </div>

      {/* Filter and Search */}
      <div className="store-utility-card mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <HiOutlineSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
              placeholder="Search by title, category..."
            />
          </div>

          <select value={sort} onChange={(e) => setSort(e.target.value)} className="select-field sm:w-40 text-xs">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority-high">Priority High</option>
            <option value="priority-low">Priority Low</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="deadline">Deadline</option>
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="button-pearl-capsule scale-95"
            style={{
              background: showFilters ? 'var(--colors-ink)' : 'var(--colors-surface-pearl)',
              color: showFilters ? 'var(--colors-canvas)' : 'var(--colors-ink-muted-80)'
            }}
          >
            <HiOutlineFilter size={14} /> Filter Set
            {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 mt-3 border-t" style={{ borderColor: 'var(--colors-divider-soft)' }}>
                <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="select-field text-xs">
                  <option value="">Status (All)</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
                <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })} className="select-field text-xs">
                  <option value="">Priority (All)</option>
                  {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="select-field text-xs">
                  <option value="">Category (All)</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={filters.favorite} onChange={(e) => setFilters({ ...filters, favorite: e.target.value })} className="select-field text-xs">
                  <option value="">Starred (All)</option>
                  <option value="true">Starred Only</option>
                </select>
              </div>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-[10px] mt-2 font-medium flex items-center gap-0.5 text-red-500 hover:underline">
                  <HiOutlineX size={10} /> Reset filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array(6).fill(null).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : todos.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? "No matches found" : "No assignments"}
          message={hasActiveFilters ? "Try resetting your search query or properties." : "Add a task above to schedule your goals."}
          icon={HiOutlineClipboardList}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence>
              {todos.map((todo, i) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  index={i}
                  onEdit={(t) => { setEditingTodo(t); setShowTodoModal(true); }}
                  onDelete={(t) => { setDeletingTodo(t); setShowDeleteModal(true); }}
                  onToggleComplete={handleToggleComplete}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </AnimatePresence>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-1.5 mt-8">
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page <= 1}
                className="button-pearl-capsule scale-95"
                style={{ padding: '6px' }}
              >
                <HiOutlineChevronLeft size={14} />
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setPagination(p => ({ ...p, page }))}
                  className="button-pearl-capsule scale-95"
                  style={{
                    background: page === pagination.page ? 'var(--colors-ink)' : 'var(--colors-surface-pearl)',
                    color: page === pagination.page ? 'var(--colors-canvas)' : 'var(--colors-ink-muted-80)',
                    width: '32px',
                    height: '32px',
                    justifyContent: 'center',
                    padding: 0
                  }}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
                className="button-pearl-capsule scale-95"
                style={{ padding: '6px' }}
              >
                <HiOutlineChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal Actions */}
      <TodoModal
        isOpen={showTodoModal}
        onClose={() => { setShowTodoModal(false); setEditingTodo(null); }}
        onSubmit={editingTodo ? handleUpdate : handleCreate}
        todo={editingTodo}
      />
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setDeletingTodo(null); }}
        onConfirm={handleDelete}
        title="Remove Task?"
        message="This task will be moved to your history files."
      />
    </motion.div>
  );
};

export default Todos;
