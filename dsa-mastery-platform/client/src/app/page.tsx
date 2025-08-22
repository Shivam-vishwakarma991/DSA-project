'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { 
  ChartBarIcon, 
  CodeBracketIcon, 
  AcademicCapIcon,
  RocketLaunchIcon,
  UserGroupIcon,
  TrophyIcon 
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router, isClient]);

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const features = [
    {
      icon: CodeBracketIcon,
      title: 'Structured Learning Path',
      description: 'Follow a carefully curated path from basics to advanced topics',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: ChartBarIcon,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics and insights',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: AcademicCapIcon,
      title: 'Quality Resources',
      description: 'Access handpicked tutorials, articles, and problem solutions',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: RocketLaunchIcon,
      title: 'Interview Ready',
      description: 'Practice problems frequently asked in top tech companies',
      color: 'from-green-500 to-teal-500',
    },
    {
      icon: UserGroupIcon,
      title: 'Community Support',
      description: 'Learn together with a community of passionate developers',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: TrophyIcon,
      title: 'Achievements',
      description: 'Earn badges and certificates as you complete milestones',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2"
              >
                <CodeBracketIcon className="h-8 w-8 text-primary-500" />
                <span className="text-xl font-bold text-white">DSA Mastery</span>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <Link
                href="/login"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Master{' '}
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Data Structures
              </span>
              <br />& Algorithms
            </h1>
            <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Your comprehensive platform to ace coding interviews and become a better problem solver
              with structured learning paths and real-time progress tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-xl"
              >
                Start Learning Free
              </Link>
              <Link
                href="#features"
                className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all border border-gray-700"
              >
                Explore Features
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
          >
            {[
              { label: 'Topics', value: '50+' },
              { label: 'Problems', value: '500+' },
              { label: 'Resources', value: '1000+' },
              { label: 'Active Learners', value: '10K+' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built with modern learning principles and gamification to keep you motivated
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-primary-500 transition-all group"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of developers mastering DSA the right way
            </p>
            <Link
              href="/signup"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
            >
              Get Started for Free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 DSA Mastery. Built with ❤️ for developers.
          </p>
        </div>
      </footer>
    </div>
  );
}