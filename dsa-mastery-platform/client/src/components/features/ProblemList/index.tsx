import { useState, useEffect, useRef } from 'react';
import { Problem, Progress } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { updateProgress, fetchUserProgress, fetchAllUserProgress } from '@/store/slices/progressSlice';
import { updateProblemStatus } from '@/store/slices/topicsSlice';
import {
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  PlayIcon,
  LinkIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

interface ProblemListProps {
  problems: Problem[];
  topicId: string;
}

export default function ProblemList({ problems, topicId }: ProblemListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { userProgress } = useSelector((state: RootState) => state.progress);
  const [expandedProblem, setExpandedProblem] = useState<string | null>(null);

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

  // Helper function to get problem status
  const getProblemStatus = (problemId: string) => {
    // First check if we have user progress in Redux store
    const progress = userProgress.find(p => p.problemId === problemId);
    if (progress) {
      return progress.status;
    }
    
    // If no progress in Redux, use the userStatus from the problem data
    const problem = problems.find(p => p._id === problemId);
    return problem?.userStatus || 'pending';
  };

  // Helper function to get completed problems count
  const getCompletedProblemsCount = () => {
    return problems.filter(p => {
      const progress = userProgress.find(up => up.problemId === p._id);
      if (progress) {
        return progress.status === 'completed';
      }
      return p.userStatus === 'completed';
    }).length;
  };

  // Helper function to get attempted problems count (including completed)
  const getAttemptedProblemsCount = () => {
    return problems.filter(p => {
      const progress = userProgress.find(up => up.problemId === p._id);
      if (progress) {
        return progress.status === 'attempted' || progress.status === 'completed';
      }
      return p.userStatus === 'attempted' || p.userStatus === 'completed';
    }).length;
  };

  const [timeSpent, setTimeSpent] = useState<{ [key: string]: number }>({});
  const [showTimeInput, setShowTimeInput] = useState<{ [key: string]: boolean }>({});
  const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({});
  const timeInputRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Handle click outside to close time input popups
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(showTimeInput).forEach(problemId => {
        if (showTimeInput[problemId] && timeInputRefs.current[problemId]) {
          if (!timeInputRefs.current[problemId]?.contains(event.target as Node)) {
            setShowTimeInput(prev => ({ ...prev, [problemId]: false }));
            setTimeSpent(prev => ({ ...prev, [problemId]: 0 }));
          }
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTimeInput]);

  const handleStatusUpdate = async (problemId: string, status: string) => {
    try {
      setUpdatingStatus(prev => ({ ...prev, [problemId]: true }));
      const timeValue = timeSpent[problemId] || 0;
      
      const result = await dispatch(updateProgress({
        problemId,
        status: status as 'pending' | 'attempted' | 'completed' | 'revisit',
        timeSpent: timeValue,
      })).unwrap();
      
      // Update the problem status in the topics slice as well
      dispatch(updateProblemStatus({ problemId, status }));
      
      // Refresh user progress to get the latest data
      await Promise.all([
        dispatch(fetchUserProgress()),
        dispatch(fetchAllUserProgress())
      ]);
      
      // Clear time input after successful update
      setTimeSpent(prev => ({ ...prev, [problemId]: 0 }));
      setShowTimeInput(prev => ({ ...prev, [problemId]: false }));
      
      // Auto-expand the problem when status is updated
      setExpandedProblem(problemId);
      
      // Show success message based on status
      if (status === 'completed') {
        toast.success(`Problem marked as completed! 🎉${timeValue > 0 ? ` (${timeValue} min)` : ''}`);
      } else if (status === 'attempted') {
        toast.success(`Problem marked as attempted!${timeValue > 0 ? ` (${timeValue} min)` : ''}`);
      } else if (status === 'revisit') {
        toast.success(`Problem marked for revisit!${timeValue > 0 ? ` (${timeValue} min)` : ''}`);
      } else {
        toast.success('Progress updated!');
      }
    } catch (error) {
      console.error('Progress update error:', error);
      toast.error('Failed to update progress');
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [problemId]: false }));
    }
  };

  const getNextStatus = (currentStatus: string): string => {
    const statusOrder = ['pending', 'attempted', 'completed', 'revisit'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    return statusOrder[(currentIndex + 1) % statusOrder.length];
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Hard': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleSolidIcon className="h-6 w-6 text-green-500 animate-pulse" />;
      case 'attempted':
        return <ClockIcon className="h-6 w-6 text-yellow-500" />;
      case 'revisit':
        return <ArrowPathIcon className="h-6 w-6 text-blue-500" />;
      default:
        return <div className="h-6 w-6 rounded-full border-2 border-gray-300 dark:border-gray-600" />;
    }
  };

  const getStatusButtonColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'attempted':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'revisit':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  return (
    <div className="space-y-4">
      {problems.map((problem, index) => {
        const status = getProblemStatus(problem._id);
        const isExpanded = expandedProblem === problem._id;

        return (
          <div
            key={problem._id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* Status Icon - Clickable */}
                  <div className="flex-shrink-0 relative">
                    <button
                      onClick={() => {
                        setExpandedProblem(isExpanded ? null : problem._id);
                        if (updatingStatus[problem._id]) return; // Prevent multiple clicks
                        const nextStatus = getNextStatus(status);
                        if (nextStatus === 'completed' || nextStatus === 'attempted') {
                          setShowTimeInput(prev => ({ ...prev, [problem._id]: true }));
                        } else {
                          handleStatusUpdate(problem._id, nextStatus);
                        }
                      }}
                      disabled={updatingStatus[problem._id]}
                      className={`transition-transform hover:scale-110 focus:outline-none ${
                        updatingStatus[problem._id] ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      title={`Click to change status (Current: ${status})`}
                    >
                      {updatingStatus[problem._id] ? (
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-primary-500" />
                      ) : (
                        getStatusIcon(status)
                      )}
                    </button>
                    
                    {/* Time Input Popup */}
               
                  </div>

                  {/* Problem Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        #{index + 1}
                      </span>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {problem.title}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    
                    {/* Tags */}
                    {problem.tags && problem.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {problem.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {problem.links?.leetcode && (
                    <a
                      href={problem.links.leetcode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      title="Solve on LeetCode"
                    >
                      <LinkIcon className="h-5 w-5" />
                    </a>
                  )}
                  {problem.links?.youtube && (
                    <a
                      href={problem.links.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                      title="Watch Video Solution"
                    >
                      <PlayIcon className="h-5 w-5" />
                    </a>
                  )}
                  <button
                    onClick={() => setExpandedProblem(isExpanded ? null : problem._id)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    <svg
                      className={`h-5 w-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {/* Progress Status */}
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Current Status:
                      </span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          status === 'attempted' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          status === 'revisit' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                        }`}>
                          {status === 'completed' ? 'Completed' :
                           status === 'attempted' ? 'Attempted' :
                           status === 'revisit' ? 'Marked for Revisit' :
                           'Not Started'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Status Action Buttons */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <button
                        onClick={() => {
                          if (status !== 'attempted') {
                            setShowTimeInput(prev => ({ ...prev, [problem._id]: true }));
                            setTimeSpent(prev => ({ ...prev, [problem._id]: 0 }));
                          }
                        }}
                        disabled={updatingStatus[problem._id] || status === 'attempted'}
                        className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                          status === 'attempted' 
                            ? 'bg-yellow-500 text-white cursor-default' 
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-800'
                        }`}
                      >
                        Attempted
                      </button>
                      <button
                        onClick={() => {
                          if (status !== 'completed') {
                            setShowTimeInput(prev => ({ ...prev, [problem._id]: true }));
                            setTimeSpent(prev => ({ ...prev, [problem._id]: 0 }));
                          }
                        }}
                        disabled={updatingStatus[problem._id] || status === 'completed'}
                        className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                          status === 'completed' 
                            ? 'bg-green-500 text-white cursor-default' 
                            : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800'
                        }`}
                      >
                        Completed
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(problem._id, 'revisit')}
                        disabled={updatingStatus[problem._id] || status === 'revisit'}
                        className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                          status === 'revisit' 
                            ? 'bg-blue-500 text-white cursor-default' 
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800'
                        }`}
                      >
                        Mark for Revisit
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(problem._id, 'pending')}
                        disabled={updatingStatus[problem._id] || status === 'pending'}
                        className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                          status === 'pending' 
                            ? 'bg-gray-500 text-white cursor-default' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
                        }`}
                      >
                        Reset to Not Started
                      </button>
                    </div>

                    {/* Time Input for Status Update */}
                    {showTimeInput[problem._id] && (
                      <div className="mb-3 p-3 bg-white dark:bg-gray-600 rounded border">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Time spent (minutes):
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={timeSpent[problem._id] || ''}
                            onChange={(e) => setTimeSpent(prev => ({ 
                              ...prev, 
                              [problem._id]: parseInt(e.target.value) || 0 
                            }))}
                            className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent w-20"
                            placeholder="0"
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              const nextStatus = status === 'pending' ? 'attempted' : 'completed';
                              handleStatusUpdate(problem._id, nextStatus);
                            }}
                            className="px-3 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => {
                              setShowTimeInput(prev => ({ ...prev, [problem._id]: false }));
                              setTimeSpent(prev => ({ ...prev, [problem._id]: 0 }));
                            }}
                            className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Overall Progress:
                      </span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-yellow-500 to-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((getCompletedProblemsCount() + getAttemptedProblemsCount()) / problems.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getCompletedProblemsCount() + getAttemptedProblemsCount()}/{problems.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Completed:
                      </span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(getCompletedProblemsCount() / problems.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getCompletedProblemsCount()}/{problems.length}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {problem.description}
                  </p>
                  
                  {problem.hints && problem.hints.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Hints:
                      </h5>
                      <ul className="list-disc list-inside space-y-1">
                        {problem.hints.map((hint, i) => (
                          <li key={i} className="text-sm text-gray-600 dark:text-gray-400">
                            {hint}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}   

