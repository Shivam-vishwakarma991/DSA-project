'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchTopicDetails, fetchTopicProblems } from '@/store/slices/topicsSlice';
import ProblemList from '@/components/features/ProblemList';
import ResourceLinks from '@/components/features/ResourceLinks';
import { Loader } from '@/components/common/Loader';
import { Tab } from '@headlessui/react';
import { 
  ChartBarIcon,
  CodeBracketIcon,
  BookOpenIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { currentTopic, problems, loading } = useSelector((state: RootState) => state.topics);
  const { userProgress } = useSelector((state: RootState) => state.progress);

  useEffect(() => {
    if (params.slug) {
      dispatch(fetchTopicDetails(params.slug as string));
      dispatch(fetchTopicProblems(params.slug as string));
    }
  }, [dispatch, params.slug]);

  if (loading || !currentTopic) {
    return <Loader fullScreen />;
  }

  const topicProgress = problems.filter(p => 
    userProgress.some(up => up.problemId === p._id && up.status === 'completed')
  ).length;

  const progressPercentage = problems.length > 0 
    ? (topicProgress / problems.length) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.push('/topics')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Back to Topics
      </button>

      {/* Topic Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {currentTopic.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {currentTopic.description}
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <CodeBracketIcon className="h-5 w-5 text-primary-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {problems.length} Problems
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {topicProgress} Completed
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpenIcon className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {currentTopic.estimatedHours} Hours
                </span>
              </div>
            </div>
          </div>

          {/* Progress Circle */}
          <div className="relative w-24 h-24">
            <svg className="transform -rotate-90 w-24 h-24">
              <circle
                cx="48"
                cy="48"
                r="36"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="48"
                cy="48"
                r="36"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 36}`}
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - progressPercentage / 100)}`}
                className="text-primary-500 transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors
              ${selected
                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-gray-900'
              }`
            }
          >
            Problems
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors
              ${selected
                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-gray-900'
              }`
            }
          >
            Resources
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-6">
          <Tab.Panel>
            <ProblemList problems={problems} topicId={currentTopic._id} />
          </Tab.Panel>
          <Tab.Panel>
            <ResourceLinks resources={currentTopic.resources} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}