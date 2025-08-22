'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import { 
  UserGroupIcon, 
  ChatBubbleLeftRightIcon, 
  HeartIcon,
  ShareIcon,
  BookmarkIcon,
  FireIcon,
  TrophyIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

interface CommunityPost {
  _id: string;
  author: {
    _id: string;
    username: string;
    avatar: string;
    role: string;
  };
  title: string;
  content: string;
  problemTitle?: string;
  topic?: string;
  difficulty?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  tags: string[];
}

interface CommunityMember {
  _id: string;
  username: string;
  avatar: string;
  role: string;
  stats: {
    totalSolved: number;
    streak: number;
  };
  isOnline: boolean;
  lastActive: string;
}

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [activeTab, setActiveTab] = useState<'discussions' | 'solutions' | 'questions'>('discussions');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setPosts([
      {
        _id: '1',
        author: {
          _id: 'user1',
          username: 'alex_coder',
          avatar: 'https://ui-avatars.com/api/?name=Alex+Coder&background=7C3AED&color=fff',
          role: 'student'
        },
        title: 'Efficient solution for Two Sum problem',
        content: 'I found an interesting approach using HashMap that reduces time complexity to O(n). Here\'s my solution...',
        problemTitle: 'Two Sum',
        topic: 'Arrays',
        difficulty: 'Easy',
        likes: 24,
        comments: 8,
        isLiked: false,
        isBookmarked: false,
        createdAt: '2024-01-15T10:30:00Z',
        tags: ['arrays', 'hashmap', 'two-sum']
      },
      {
        _id: '2',
        author: {
          _id: 'user2',
          username: 'dsa_master',
          avatar: 'https://ui-avatars.com/api/?name=DSA+Master&background=10B981&color=fff',
          role: 'moderator'
        },
        title: 'Understanding Binary Tree Traversals',
        content: 'Let me explain the three main traversal methods: inorder, preorder, and postorder with clear examples...',
        problemTitle: 'Binary Tree Inorder Traversal',
        topic: 'Trees',
        difficulty: 'Medium',
        likes: 45,
        comments: 12,
        isLiked: true,
        isBookmarked: true,
        createdAt: '2024-01-14T15:20:00Z',
        tags: ['trees', 'traversal', 'recursion']
      },
      {
        _id: '3',
        author: {
          _id: 'user3',
          username: 'code_ninja',
          avatar: 'https://ui-avatars.com/api/?name=Code+Ninja&background=EF4444&color=fff',
          role: 'student'
        },
        title: 'Help needed with Dynamic Programming',
        content: 'I\'m struggling with the concept of memoization in DP. Can someone explain with a simple example?',
        problemTitle: 'Climbing Stairs',
        topic: 'Dynamic Programming',
        difficulty: 'Easy',
        likes: 18,
        comments: 15,
        isLiked: false,
        isBookmarked: false,
        createdAt: '2024-01-13T09:15:00Z',
        tags: ['dp', 'memoization', 'help']
      }
    ]);

    setMembers([
      {
        _id: 'user1',
        username: 'alex_coder',
        avatar: 'https://ui-avatars.com/api/?name=Alex+Coder&background=7C3AED&color=fff',
        role: 'student',
        stats: { totalSolved: 156, streak: 12 },
        isOnline: true,
        lastActive: '2 min ago'
      },
      {
        _id: 'user2',
        username: 'dsa_master',
        avatar: 'https://ui-avatars.com/api/?name=DSA+Master&background=10B981&color=fff',
        role: 'moderator',
        stats: { totalSolved: 342, streak: 45 },
        isOnline: true,
        lastActive: '5 min ago'
      },
      {
        _id: 'user3',
        username: 'code_ninja',
        avatar: 'https://ui-avatars.com/api/?name=Code+Ninja&background=EF4444&color=fff',
        role: 'student',
        stats: { totalSolved: 89, streak: 7 },
        isOnline: false,
        lastActive: '1 hour ago'
      }
    ]);

    setLoading(false);
  }, []);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post._id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  };

  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post => 
      post._id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Community
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Connect with fellow learners, share solutions, and discuss problems
              </p>
            </div>
            <Button className="bg-primary-600 hover:bg-primary-700">
              <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
              New Post
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            {/* Tabs */}
            <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 mb-6">
              {[
                { id: 'discussions', label: 'Discussions', icon: ChatBubbleLeftRightIcon },
                { id: 'solutions', label: 'Solutions', icon: StarIcon },
                { id: 'questions', label: 'Questions', icon: UserGroupIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {posts.map((post) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="p-6">
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={post.author.avatar}
                          alt={post.author.username}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {post.author.username}
                            </h3>
                            {post.author.role === 'moderator' && (
                              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                                Moderator
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {post.problemTitle && (
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {post.problemTitle}
                          </p>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${getDifficultyColor(post.difficulty)}`}>
                            {post.difficulty}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Post Content */}
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {post.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                        {post.content}
                      </p>
                    </div>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-6">
                        <button
                          onClick={() => handleLike(post._id)}
                          className={`flex items-center space-x-1 text-sm transition-colors ${
                            post.isLiked
                              ? 'text-red-500'
                              : 'text-gray-500 hover:text-red-500'
                          }`}
                        >
                          <HeartIcon className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          <ChatBubbleLeftRightIcon className="h-5 w-5" />
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          <ShareIcon className="h-5 w-5" />
                          <span>Share</span>
                        </button>
                      </div>
                      <button
                        onClick={() => handleBookmark(post._id)}
                        className={`text-sm transition-colors ${
                          post.isBookmarked
                            ? 'text-primary-500'
                            : 'text-gray-500 hover:text-primary-500'
                        }`}
                      >
                        <BookmarkIcon className={`h-5 w-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Online Members */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Online Members
              </h3>
              <div className="space-y-3">
                {members.filter(member => member.isOnline).map((member) => (
                  <div key={member._id} className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {member.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        {member.stats.totalSolved} problems solved
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top Contributors */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Top Contributors
              </h3>
              <div className="space-y-3">
                {members.slice(0, 5).map((member, index) => (
                  <div key={member._id} className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <img
                      src={member.avatar}
                      alt={member.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {member.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        {member.stats.streak} day streak
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Community Stats */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Community Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Members</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Today</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">89</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Posts Today</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Solutions Shared</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">156</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
