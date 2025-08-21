import { motion } from 'framer-motion';

interface LoaderProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function Loader({ fullScreen = false, size = 'md', text }: LoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const loader = (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700" />
        <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
      </motion.div>
      {text && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
        {loader}
      </div>
    );
  }

  return loader;
}