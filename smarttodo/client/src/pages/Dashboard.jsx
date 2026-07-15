// src/pages/Dashboard.jsx - Apple design aligned Dashboard
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { todosAPI } from '../services/api';
import StatsCard from '../components/StatsCard';
import ProgressCircle from '../components/ProgressCircle';
import EmptyState from '../components/EmptyState';
import { StatsSkeleton } from '../components/Skeleton';
import { getGreeting, getTodayDate, getRelativeTime } from '../utils/helpers';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  HiOutlineClipboardList, HiOutlineCheckCircle, HiOutlineClock,
  HiOutlineTrash, HiOutlinePlus, HiOutlineLightningBolt
} from 'react-icons/hi';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, deleted: 0 });
  const [recentTodos, setRecentTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickTitle, setQuickTitle] = useState('');
  const [addingQuick, setAddingQuick] = useState(false);

  const [categoryData, setCategoryData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await todosAPI.getAll({ limit: 1000 });
      const todos = res.data.todos;

      const completed = todos.filter(t => t.status === 'completed').length;
      const pending = todos.filter(t => t.status === 'pending').length;

      setStats({ total: todos.length, completed, pending, deleted: 0 });
      setRecentTodos(todos.slice(0, 5));

      const catMap = {};
      todos.forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + 1; });
      setCategoryData(Object.entries(catMap).map(([name, value]) => ({ name, value })));

      const priMap = { high: 0, medium: 0, low: 0 };
      todos.forEach(t => { priMap[t.priority] = (priMap[t.priority] || 0) + 1; });
      setPriorityData([
        { name: 'High', value: priMap.high, fill: 'var(--colors-danger)' },    
        { name: 'Medium', value: priMap.medium, fill: 'var(--colors-warning)' },   
        { name: 'Low', value: priMap.low, fill: 'var(--colors-success)' }
      ]);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    setAddingQuick(true);
    try {
      await todosAPI.create({ title: quickTitle.trim(), priority: 'medium', category: 'general' });
      toast.success('Todo created');
      setQuickTitle('');
      fetchData();
    } catch {
      toast.error('Failed to create todo');
    } finally {
      setAddingQuick(false);
    }
  };

  const completionPercentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
  // Apple palette colors for charts (Action Blue, Sky Blue, Slate details)
  const COLORS = ['#0066cc', '#2997ff', '#515154', '#86868b', '#aeaeb2', '#f5f5f7'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="page-container"
    >
      {/* Dynamic Header */}
      <div className="mb-8">
        <span className="fine-print font-semibold uppercase tracking-wider text-gray-400">
          {getTodayDate()}
        </span>
        <h1 className="display-md tracking-tight mt-1 text-gray-905 dark:text-gray-100">
          {getGreeting()}, {user?.name?.split(' ')[0]}
        </h1>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array(4).fill(null).map((_, i) => <StatsSkeleton key={i} />)
        ) : (
          <>
            <StatsCard title="Total Tasks" value={stats.total} icon={HiOutlineClipboardList} color="var(--colors-primary)" delay={0.05} />
            <StatsCard title="Completed" value={stats.completed} icon={HiOutlineCheckCircle} color="var(--colors-success)" delay={0.1} />
            <StatsCard title="Pending" value={stats.pending} icon={HiOutlineClock} color="var(--colors-warning)" delay={0.15} />
            <StatsCard title="Purged Log" value={stats.deleted} icon={HiOutlineTrash} color="var(--colors-danger)" delay={0.2} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Add Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="store-utility-card"
          >
            <h3 className="caption-strong uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
              <HiOutlineLightningBolt className="text-yellow-500" /> Quick Add Todo
            </h3>
            <form onSubmit={handleQuickAdd} className="flex gap-3">
              <input
                type="text"
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                className="input-field flex-1"
                placeholder="Buy groceries, call team..."
              />
              <button type="submit" disabled={addingQuick} className="button-primary">
                <HiOutlinePlus size={15} /> Add
              </button>
            </form>
          </motion.div>

          {/* Recent list cards */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="store-utility-card"
          >
            <h3 className="caption-strong uppercase tracking-wider text-gray-400 mb-4">
              Recent Tasks
            </h3>
            {recentTodos.length === 0 ? (
              <EmptyState title="No tasks" message="Create your first todo to see recent tasks here." icon={HiOutlineClipboardList} />
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentTodos.map((todo) => (
                  <div key={todo.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full ${todo.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'}`} />
                      <p className="body-strong text-sm truncate text-gray-800 dark:text-gray-200">
                        {todo.title}
                      </p>
                    </div>
                    <span className="caption-text text-gray-400 ml-3">
                      {getRelativeTime(todo.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Charts Row */}
          {categoryData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Categories */}
              <div className="store-utility-card">
                <h3 className="caption-strong uppercase tracking-wider text-gray-400 mb-4">Tasks by Category</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={4} dataKey="value">
                      {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--colors-canvas)', border: '1px solid var(--colors-hairline)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Priorities */}
              <div className="store-utility-card">
                <h3 className="caption-strong uppercase tracking-wider text-gray-400 mb-4">Tasks by Priority</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={priorityData}>
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--colors-ink-muted-80)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: 'var(--colors-ink-muted-80)' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: 'var(--colors-canvas)', border: '1px solid var(--colors-hairline)' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {priorityData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Right side analytics */}
        <div className="space-y-6">
          <div className="store-utility-card text-center flex flex-col items-center">
            <h3 className="caption-strong uppercase tracking-wider text-gray-400 mb-4 w-full">Completion Progress</h3>
            <ProgressCircle percentage={completionPercentage} size={110} />
            <p className="caption-text text-gray-400 mt-4">
              {stats.completed} of {stats.total} goals met
            </p>
          </div>

          <div className="store-utility-card">
            <h3 className="caption-strong uppercase tracking-wider text-gray-400 mb-4">Task Insights</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Completion Rate', value: `${Math.round(completionPercentage)}%`, color: 'var(--colors-success)' },
                { label: 'Open Assignments', value: stats.pending, color: 'var(--colors-warning)' },
                { label: 'Created Lifetime', value: stats.total, color: 'var(--colors-primary)' }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b last:border-0 border-gray-100 dark:border-gray-800 text-xs">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="font-semibold" style={{ color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
