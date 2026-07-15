// src/pages/History.jsx - Apple-style History
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { historyAPI } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import { CardSkeleton } from '../components/Skeleton';
import { formatDate } from '../utils/helpers';
import {
  HiOutlineClock, HiOutlineTrash, HiOutlineRefresh,
  HiOutlineSearch, HiOutlineViewGrid, HiOutlineViewList
} from 'react-icons/hi';

const History = () => {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'all-cards' or 'table'
  const [search, setSearch] = useState('');
  
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [restoreItem, setRestoreItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await historyAPI.getAll();
      setHistoryItems(res.data);
    } catch {
      toast.error('Failed to load history log');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    try {
      await historyAPI.restore(restoreItem.id);
      toast.success('Task restored successfully');
      setShowRestoreModal(false);
      setRestoreItem(null);
      fetchHistory();
    } catch {
      toast.error('Cannot restore task');
    }
  };

  const handlePermanentDelete = async () => {
    try {
      await historyAPI.delete(deleteItem.id);
      toast.success('Task permanently deleted');
      setShowDeleteModal(false);
      setDeleteItem(null);
      fetchHistory();
    } catch {
      toast.error('Cannot purge task');
    }
  };

  const filteredItems = historyItems.filter(item => 
    item.todoTitle.toLowerCase().includes(search.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">History</h1>
          <p className="caption-text text-gray-400">{filteredItems.length} deleted archives</p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg self-start sm:self-auto" style={{ background: 'var(--colors-divider-soft)' }}>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-neutral-800 shadow-sm text-black dark:text-white' : 'text-gray-500'}`}
          >
            <HiOutlineViewList size={16} />
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'cards' ? 'bg-white dark:bg-neutral-800 shadow-sm text-black dark:text-white' : 'text-gray-500'}`}
          >
            <HiOutlineViewGrid size={16} />
          </button>
        </div>
      </div>

      {/* Filter search */}
      <div className="relative mb-6">
        <HiOutlineSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
          placeholder="Filter history archives..."
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(3).fill(null).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title="No history records"
          message="Your archived tasks will appear here."
          icon={HiOutlineClock}
        />
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              className="store-utility-card flex flex-col justify-between"
            >
              <div>
                <h3 className="body-strong truncate text-gray-900 dark:text-gray-150">{item.todoTitle}</h3>
                <p className="micro-legal mt-1" style={{ color: 'var(--colors-ink-muted-48)' }}>
                  Purged {formatDate(item.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-2 border-t" style={{ borderColor: 'var(--colors-divider-soft)' }}>
                <button
                  onClick={() => { setRestoreItem(item); setShowRestoreModal(true); }}
                  className="button-pearl-capsule text-xs scale-90"
                >
                  <HiOutlineRefresh size={12} /> Restore
                </button>
                <button
                  onClick={() => { setDeleteItem(item); setShowDeleteModal(true); }}
                  className="button-pearl-capsule text-red-500 border-red-200 dark:border-red-950/20 text-xs scale-90 ml-auto"
                >
                  <HiOutlineTrash size={12} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: 'var(--colors-hairline)', background: 'var(--colors-canvas)' }}>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b bg-gray-50/50 dark:bg-neutral-800/10" style={{ borderColor: 'var(--colors-hairline)' }}>
                <th className="p-3 font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Title</th>
                <th className="p-3 font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Category</th>
                <th className="p-3 font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Deleted At</th>
                <th className="p-3 font-semibold text-gray-500 uppercase tracking-wider text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--colors-hairline)' }}>
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/20 dark:hover:bg-neutral-900/10">
                  <td className="p-3 font-semibold text-gray-900 dark:text-gray-150">{item.todoTitle}</td>
                  <td className="p-3 text-gray-400 capitalize">{item.category || 'general'}</td>
                  <td className="p-3 text-gray-400">{formatDate(item.createdAt)}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => { setRestoreItem(item); setShowRestoreModal(true); }}
                      className="button-pearl-capsule scale-90 inline-flex"
                      title="Restore"
                    >
                      <HiOutlineRefresh size={12} />
                    </button>
                    <button
                      onClick={() => { setDeleteItem(item); setShowDeleteModal(true); }}
                      className="button-pearl-capsule text-red-500 border-red-200 dark:border-red-950/20 scale-90 inline-flex"
                      title="Delete Permanently"
                    >
                      <HiOutlineTrash size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Alerts */}
      <ConfirmModal
        isOpen={showRestoreModal}
        onClose={() => { setShowRestoreModal(false); setRestoreItem(null); }}
        onConfirm={handleRestore}
        title="Restore Task?"
        message={`Do you want to restore "${restoreItem?.todoTitle}" back to your active list?`}
      />
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setDeleteItem(null); }}
        onConfirm={handlePermanentDelete}
        title="Purge Task?"
        message="This action is irreversible. The task will be deleted permanently."
      />
    </motion.div>
  );
};

export default History;
