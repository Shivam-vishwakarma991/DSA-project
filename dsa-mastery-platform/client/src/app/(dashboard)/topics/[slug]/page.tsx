'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchTopicDetails, fetchTopicProblems, updateProblemStatus } from '@/store/slices/topicsSlice';
import { fetchUserProgress, fetchAllUserProgress } from '@/store/slices/progressSlice';
import { progressAPI } from '@/lib/api/progress';
import ProblemList from '@/components/features/ProblemList';
import ResourceLinks from '@/components/features/ResourceLinks';
import { Loader } from '@/components/common/Loader';
import { Tab } from '@headlessui/react';
import toast from 'react-hot-toast';
import { 
  ChartBarIcon,
  CodeBracketIcon,
  BookOpenIcon,
  ArrowLeftIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { currentTopic, problems, loading } = useSelector((state: RootState) => state.topics);
  const { userProgress, statistics } = useSelector((state: RootState) => state.progress);
  const [mounted, setMounted] = useState(false);
  const [detailedProgress, setDetailedProgress] = useState<any>(null);
  const [loadingProgress, setLoadingProgress] = useState(false);

  // Sync problem status with user progress data
  useEffect(() => {
    if (userProgress.length > 0 && problems.length > 0) {
      userProgress.forEach(progress => {
        const problem = problems.find(p => p._id === progress.problemId);
        if (problem && problem.userStatus !== progress.status) {
          dispatch(updateProblemStatus({ 
            problemId: progress.problemId, 
            status: progress.status 
          }));
        }
      });
    }
  }, [userProgress, problems, dispatch]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !params.slug) return;
    
    const fetchTopicData = async () => {
      try {
        // Fetch all data in parallel
        await Promise.all([
          dispatch(fetchTopicDetails(params.slug as string)),
          dispatch(fetchTopicProblems(params.slug as string)),
          dispatch(fetchUserProgress()),
          dispatch(fetchAllUserProgress())
        ]);
        
        // Fetch detailed topic progress
        setLoadingProgress(true);
        const response = await progressAPI.getTopicDetailedProgress(params.slug as string);
        setDetailedProgress(response.data);
      } catch (error) {
        console.error('Failed to fetch topic data:', error);
      } finally {
        setLoadingProgress(false);
      }
    };
    
    fetchTopicData();
  }, [dispatch, params.slug, mounted]);

  // Force refresh when userProgress changes to ensure latest data
  useEffect(() => {
    if (mounted && userProgress.length > 0) {
      // Refresh detailed progress when userProgress changes
      const refreshDetailedProgress = async () => {
        try {
          setLoadingProgress(true);
          const response = await progressAPI.getTopicDetailedProgress(params.slug as string);
          setDetailedProgress(response.data);
        } catch (error) {
          console.error('Failed to refresh detailed progress:', error);
        } finally {
          setLoadingProgress(false);
        }
      };
      
      refreshDetailedProgress();
    }
  }, [mounted, userProgress.length, params.slug]);

  // Debug logging
  console.log('🔍 Topic Page Data:', {
    currentTopic: currentTopic?.title,
    problemsCount: problems.length,
    userProgressCount: userProgress.length,
    statistics: statistics,
    detailedProgress: detailedProgress,
    userProgressSample: userProgress.slice(0, 3) // Show first 3 progress records
  });

  if (!mounted || loading || !currentTopic) {
    return <Loader fullScreen />;
  }

  // Use detailed progress data if available, otherwise fall back to Redux data
  const getCompletedProblemsCount = () => {
    if (detailedProgress?.progress) {
      return detailedProgress.progress.completed;
    }
    
    // If we have topic progress in statistics, use that
    if (statistics?.topicProgress && Array.isArray(statistics.topicProgress)) {
      const topicProgress = statistics.topicProgress.find((tp: any) => tp.topicSlug === params.slug);
      if (topicProgress) {
        return topicProgress.completed;
      }
    }
    
    // Fallback to filtering problems
    return problems.filter(p => {
      // Check if we have progress in Redux store
      const progress = userProgress.find(up => up.problemId === p._id);
      if (progress) {
        return progress.status === 'completed';
      }
      // If no progress in Redux, use the userStatus from the problem data
      return p.userStatus === 'completed';
    }).length;
  };

  const getAttemptedProblemsCount = () => {
    if (detailedProgress?.progress) {
      return detailedProgress.progress.attempted;
    }
    
    // If we have topic progress in statistics, use that
    if (statistics?.topicProgress && Array.isArray(statistics.topicProgress)) {
      const topicProgress = statistics.topicProgress.find((tp: any) => tp.topicSlug === params.slug);
      if (topicProgress) {
        return topicProgress.attempted;
      }
    }
    
    // Fallback to filtering problems
    return problems.filter(p => {
      const progress = userProgress.find(up => up.problemId === p._id);
      if (progress) {
        return progress.status === 'attempted';
      }
      return p.userStatus === 'attempted';
    }).length;
  };

  const completedCount = getCompletedProblemsCount();
  const attemptedCount = getAttemptedProblemsCount();
  // Calculate progress percentage including both attempted and completed problems
  const progressPercentage = detailedProgress?.progress?.percentage || 
    (problems.length > 0 ? ((completedCount + attemptedCount) / problems.length) * 100 : 0);

  // Debug progress calculation
  console.log('📊 Progress Calculation:', {
    completedCount,
    attemptedCount,
    totalProblems: problems.length,
    progressPercentage,
    detailedProgressPercentage: detailedProgress?.progress?.percentage,
    userProgressForTopic: userProgress.filter(p => {
      const problem = problems.find(prob => prob._id === p.problemId);
      return problem && problem.topicId === currentTopic?._id;
    })
  });

  return (
    <div className="space-y-6">
      {/* Header with Back Button and Refresh */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/topics')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Topics
        </button>
        
        <button
          onClick={async () => {
            try {
              await Promise.all([
                dispatch(fetchUserProgress()),
                dispatch(fetchAllUserProgress())
              ]);
              
              // Refresh detailed progress
              const response = await progressAPI.getTopicDetailedProgress(params.slug as string);
              setDetailedProgress(response.data);
              
              toast.success('Progress data refreshed!');
            } catch (error) {
              toast.error('Failed to refresh progress data');
            }
          }}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Progress
        </button>
      </div>

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
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2">
                <CodeBracketIcon className="h-5 w-5 text-primary-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {problems.length} Problems
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {completedCount} Completed
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-yellow-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {attemptedCount} Attempted
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpenIcon className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {currentTopic.estimatedHours} Hours
                </span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Overall Progress
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {completedCount + attemptedCount}/{problems.length} ({Math.round(progressPercentage)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Not Started</span>
                <span>In Progress</span>
                <span>Completed</span>
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