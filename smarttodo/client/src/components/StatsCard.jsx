// src/components/StatsCard.jsx - Apple Cupertino metrics card
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, color = 'var(--colors-primary)', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      className="store-utility-card flex flex-col justify-between"
      style={{ minHeight: '110px' }}
    >
      <div className="flex items-center justify-between">
        <span className="caption-strong uppercase tracking-wider font-semibold text-neutral-400">
          {title}
        </span>
        <div 
          className="w-7 h-7 rounded-sm flex items-center justify-center bg-gray-50 dark:bg-neutral-800"
          style={{ color }}
        >
          {Icon && <Icon size={15} />}
        </div>
      </div>
      <div className="mt-3">
        <span className="display-md text-[30px] font-semibold text-gray-900 dark:text-gray-100">
          {value}
        </span>
      </div>
    </motion.div>
  );
};

export default StatsCard;
