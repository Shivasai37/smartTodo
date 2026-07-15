// src/components/Skeleton.jsx - Loading skeleton components
const Skeleton = ({ className = '', variant = 'rect' }) => {
  const baseClass = 'skeleton animate-pulse';
  const variants = {
    rect: 'rounded-lg',
    circle: 'rounded-full',
    text: 'rounded h-4',
    card: 'rounded-2xl h-32',
  };

  return <div className={`${baseClass} ${variants[variant] || ''} ${className}`} />;
};

export const CardSkeleton = () => (
  <div className="rounded-2xl p-4 space-y-3" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="w-6 h-6" variant="circle" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-6 w-20" />
    </div>
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-24" />
      <div className="flex gap-1">
        <Skeleton className="w-7 h-7" variant="circle" />
        <Skeleton className="w-7 h-7" variant="circle" />
      </div>
    </div>
  </div>
);

export const StatsSkeleton = () => (
  <div className="rounded-2xl p-5 h-[100px]" style={{ background: 'var(--bg-tertiary)' }}>
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-12" />
      </div>
      <Skeleton className="w-12 h-12" />
    </div>
  </div>
);

export default Skeleton;
