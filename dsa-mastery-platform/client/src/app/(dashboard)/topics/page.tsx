'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchTopics, createTopic, updateTopic, deleteTopic } from '@/store/slices/topicsSlice';
import TopicCard from '@/components/features/TopicCard';
import TopicForm from '@/components/features/TopicForm';
import { Loader } from '@/components/common/Loader';
import { Button } from '@/components/common/Button';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function TopicsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { topics, loading } = useSelector((state: RootState) => state.topics);
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mounted, setMounted] = useState(false);
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Delete confirmation state
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    topicId: string | null;
    topicTitle: string;
  }>({
    isOpen: false,
    topicId: null,
    topicTitle: ''
  });

  // Check if user has admin privileges
  const canManageTopics = user?.role === 'admin' || user?.role === 'moderator';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    dispatch(fetchTopics());
  }, [dispatch, mounted]);

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          topic?.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || topic?.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const handleCreateTopic = () => {
    setEditingTopic(null);
    setIsFormOpen(true);
  };

  const handleEditTopic = (topic: any) => {
    setEditingTopic(topic);
    setIsFormOpen(true);
  };

  const handleDeleteTopic = (topicId: string, topicTitle: string) => {
    setDeleteDialog({
      isOpen: true,
      topicId,
      topicTitle
    });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.topicId) return;
    
    try {
      await dispatch(deleteTopic(deleteDialog.topicId)).unwrap();
      toast.success('Topic deleted successfully');
      setDeleteDialog({ isOpen: false, topicId: null, topicTitle: '' });
    } catch (error) {
      toast.error('Failed to delete topic');
    }
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, topicId: null, topicTitle: '' });
  };

  const handleFormSubmit = async (data: any) => {
    setFormLoading(true);
    try {
      if (editingTopic) {
        await dispatch(updateTopic({ id: editingTopic._id, data })).unwrap();
        toast.success('Topic updated successfully');
      } else {
        await dispatch(createTopic(data)).unwrap();
        toast.success('Topic created successfully');
      }
      setIsFormOpen(false);
      setEditingTopic(null);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(editingTopic ? 'Failed to update topic' : 'Failed to create topic');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTopic(null);
  };

  if (!mounted || loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Learning Topics
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Choose a topic to start mastering Data Structures and Algorithms
          </p>
        </div>
        
        {/* Create Topic Button - Admin Only */}
        {canManageTopics && (
          <Button
            onClick={handleCreateTopic}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Create Topic
          </Button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-gray-500" />
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Squares2X2Icon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <ListBulletIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Topics Grid/List */}
      <motion.div
        layout
        className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }
      >
        {filteredTopics.map((topic, index) => (
          <motion.div
            key={topic._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative group"
          >
            <TopicCard topic={topic} viewMode={viewMode} />
            
            {/* Action Buttons - Show on hover - Admin Only */}
            {canManageTopics && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditTopic(topic)}
                    className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    title="Edit topic"
                  >
                    <PencilIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDeleteTopic(topic._id, topic.title)}
                    className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Delete topic"
                  >
                    <TrashIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {filteredTopics.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No topics found matching your criteria
          </p>
        </div>
      )}

      {/* Topic Form Modal */}
      <TopicForm
        topic={editingTopic}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete Topic"
        message={`Are you sure you want to delete "${deleteDialog.topicTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={loading}
      />
    </div>
  );
}
