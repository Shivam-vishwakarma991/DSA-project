import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  AcademicCapIcon,
  ChartBarIcon,
  TrophyIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  CodeBracketIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Topics', href: '/topics', icon: AcademicCapIcon },
  { name: 'Progress', href: '/progress', icon: ChartBarIcon },
  { name: 'Leaderboard', href: '/leaderboard', icon: TrophyIcon },
  { name: 'Community', href: '/community', icon: UserGroupIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <Link href="/dashboard" className="flex items-center gap-2">
              <CodeBracketIcon className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                DSA Mastery
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 w-1 h-8 bg-primary-500 rounded-r-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Progress Summary */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg p-4 text-white">
              <h3 className="font-semibold mb-2">Daily Goal</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">2 of 3 problems</span>
                <span className="text-sm">67%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2 w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}