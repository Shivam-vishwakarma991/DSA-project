import { useState } from 'react';
import { Problem, Progress } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { updateProgress } from '@/store/slices/progressSlice';
import {
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  PlayIcon,
  LinkIcon,
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

  const getProblemStatus = (problemId: string) => {
    const progress = userProgress.find(p => p.problemId === problemId);
    return progress?.status || 'pending';
  };

  const handleStatusUpdate = async (problemId: string, status: string) => {
    try {
      await dispatch(updateProgress({
        problemId,
        topicId,
        status,
      })).unwrap();
      toast.success('Progress updated!');
    } catch (error) {
      toast.error('Failed to update progress');
    }
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
        return <CheckCircleSolidIcon className="h-6 w-6 text-green-500" />;
      case 'attempted':
        return <ClockIcon className="h-6 w-6 text-yellow-500" />;
      case 'revisit':
        return <ArrowPathIcon className="h-6 w-6 text-blue-500" />;
      default:
        return <div className="h-6 w-6 rounded-full border-2 border-gray-300 dark:border-gray-600" />;
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
                  {/* Status Checkbox */}
                  <button
                    onClick={() => handleStatusUpdate(
                      problem._id,
                      status === 'completed' ? 'pending' : 'completed'
                    )}
                    className="transition-transform hover:scale-110"
                  >
                    {getStatusIcon(status)}
                  </button>

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

