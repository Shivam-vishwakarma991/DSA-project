import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  BellIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function Header() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Search bar */}
          <div className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search problems, topics..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
              <BellIcon className="h-5 w-5 text-gray-500" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* User menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <img
                  src={user?.avatar || '/default-avatar.png'}
                  alt={user?.fullName}
                  className="h-8 w-8 rounded-full"
                />
                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.fullName}
                </span>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => router.push('/profile')}
                          className={`${
                            active ? 'bg-gray-100 dark:bg-gray-700' : ''
                          } flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                        >
                          <UserCircleIcon className="h-4 w-4" />
                          Profile
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => router.push('/settings')}
                          className={`${
                            active ? 'bg-gray-100 dark:bg-gray-700' : ''
                          } flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                        >
                          <Cog6ToothIcon className="h-4 w-4" />
                          Settings
                        </button>
                      )}
                    </Menu.Item>
                    <hr className="my-1 border-gray-200 dark:border-gray-700" />
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-gray-100 dark:bg-gray-700' : ''
                          } flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400`}
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4" />
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
}