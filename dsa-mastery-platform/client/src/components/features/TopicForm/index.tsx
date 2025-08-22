'use client';

import { useState, useEffect } from 'react';
import { Topic } from '@/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { 
  XMarkIcon,
  PlusIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

interface TopicFormProps {
  topic?: Topic | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Topic> & { problems?: any[] }) => void;
  loading?: boolean;
}

export default function TopicForm({ 
  topic, 
  isOpen, 
  onClose, 
  onSubmit, 
  loading = false 
}: TopicFormProps) {
  const [formData, setFormData] = useState<Partial<Topic>>({
    title: '',
    slug: '',
    description: '',
    difficulty: 'Beginner',
    order: 1,
    totalProblems: 0,
    estimatedHours: 1,
    tags: [],
    isActive: true,
    resources: []
  });

  const [newTag, setNewTag] = useState('');
  const [newResource, setNewResource] = useState({
    type: 'video' as const,
    title: '',
    url: '',
    isPremium: false
  });

  const [problems, setProblems] = useState<any[]>([]);
  const [newProblem, setNewProblem] = useState({
    title: '',
    description: '',
    difficulty: 'Easy' as const,
    order: 1,
    tags: [] as string[],
    estimatedTime: 30,
    hints: [] as string[]
  });
  const [newProblemTag, setNewProblemTag] = useState('');
  const [newHint, setNewHint] = useState('');

  useEffect(() => {
    if (topic) {
      setFormData({
        title: topic.title,
        slug: topic.slug,
        description: topic.description,
        difficulty: topic.difficulty,
        order: topic.order,
        totalProblems: topic.totalProblems,
        estimatedHours: topic.estimatedHours,
        tags: topic.tags || [],
        isActive: topic.isActive,
        resources: topic.resources || []
      });
      // Load existing problems
      setProblems(topic.problems || []);
    } else {
      setFormData({
        title: '',
        slug: '',
        description: '',
        difficulty: 'Beginner',
        order: 1,
        totalProblems: 0,
        estimatedHours: 1,
        tags: [],
        isActive: true,
        resources: []
      });
      setProblems([]);
    }
  }, [topic]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' || name === 'totalProblems' || name === 'estimatedHours' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleAddResource = () => {
    if (newResource.title.trim() && newResource.url.trim()) {
      setFormData(prev => ({
        ...prev,
        resources: [...(prev.resources || []), { ...newResource }]
      }));
      setNewResource({
        type: 'video',
        title: '',
        url: '',
        isPremium: false
      });
    }
  };

  const handleRemoveResource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources?.filter((_, i) => i !== index) || []
    }));
  };

  const handleAddProblem = () => {
    if (newProblem.title.trim()) {
      const problemToAdd = {
        ...newProblem,
        _id: `temp_${Date.now()}`, // Temporary ID for new problems
        topicId: topic?._id || '',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setProblems(prev => [...prev, problemToAdd]);
      setNewProblem({
        title: '',
        description: '',
        difficulty: 'Easy',
        order: problems.length + 1,
        tags: [],
        estimatedTime: 30,
        hints: []
      });
    }
  };

  const handleRemoveProblem = (index: number) => {
    setProblems(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddProblemTag = () => {
    if (newProblemTag.trim() && !newProblem.tags.includes(newProblemTag.trim())) {
      setNewProblem(prev => ({
        ...prev,
        tags: [...prev.tags, newProblemTag.trim()]
      }));
      setNewProblemTag('');
    }
  };

  const handleRemoveProblemTag = (tagToRemove: string) => {
    setNewProblem(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddHint = () => {
    if (newHint.trim() && !newProblem.hints.includes(newHint.trim())) {
      setNewProblem(prev => ({
        ...prev,
        hints: [...prev.hints, newHint.trim()]
      }));
      setNewHint('');
    }
  };

  const handleRemoveHint = (hintToRemove: string) => {
    setNewProblem(prev => ({
      ...prev,
      hints: prev.hints.filter(hint => hint !== hintToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update totalProblems count based on actual problems
    const updatedFormData = {
      ...formData,
      totalProblems: problems.length
    };
    
    // Clean problems data - remove temporary IDs for new problems
    const cleanedProblems = problems.map(problem => {
      if (problem._id.startsWith('temp_')) {
        // This is a new problem, remove temporary ID
        const { _id, id, createdAt, updatedAt, ...cleanProblem } = problem;
        return cleanProblem;
      }
      // This is an existing problem, keep the ID
      return problem;
    });
    
    onSubmit({ ...updatedFormData, problems: cleanedProblems });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {topic ? 'Edit Topic' : 'Create New Topic'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty *
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Order *
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Problems
              </label>
              <input
                type="number"
                name="totalProblems"
                value={formData.totalProblems}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estimated Hours
              </label>
              <input
                type="number"
                name="estimatedHours"
                value={formData.estimatedHours}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2"
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-primary-600"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Resources
            </label>
            <div className="space-y-4">
              {formData.resources?.map((resource, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{resource.title}</p>
                    <p className="text-sm text-gray-500">{resource.url}</p>
                    <p className="text-xs text-gray-400">{resource.type} {resource.isPremium && '(Premium)'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveResource(index)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newResource.title}
                  onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Resource title"
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
                <input
                  type="url"
                  value={newResource.url}
                  onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="Resource URL"
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
                <select
                  value={newResource.type}
                  onChange={(e) => setNewResource(prev => ({ ...prev, type: e.target.value as any }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                >
                  <option value="video">Video</option>
                  <option value="article">Article</option>
                  <option value="book">Book</option>
                  <option value="course">Course</option>
                </select>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newResource.isPremium}
                    onChange={(e) => setNewResource(prev => ({ ...prev, isPremium: e.target.checked }))}
                    className="mr-2"
                  />
                  <label className="text-sm">Premium</label>
                </div>
              </div>
              <Button
                type="button"
                onClick={handleAddResource}
                className="w-full"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </div>
          </div>

          {/* Problems */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Problems ({problems.length})
            </label>
            
            {/* Existing Problems */}
            <div className="space-y-3 mb-4">
              {problems.map((problem, index) => (
                <div key={problem._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{problem.order}.</span>
                      <h4 className="font-medium">{problem.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{problem.description}</p>
                    {problem.tags && problem.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {problem.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveProblem(index)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded ml-2"
                  >
                    <XMarkIcon className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Problem */}
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Add New Problem</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newProblem.title}
                    onChange={(e) => setNewProblem(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={newProblem.difficulty}
                    onChange={(e) => setNewProblem(prev => ({ ...prev, difficulty: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    value={newProblem.order}
                    onChange={(e) => setNewProblem(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Estimated Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={newProblem.estimatedTime}
                    onChange={(e) => setNewProblem(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) || 30 }))}
                    min="5"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newProblem.description}
                  onChange={(e) => setNewProblem(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Problem Tags */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newProblemTag}
                    onChange={(e) => setNewProblemTag(e.target.value)}
                    placeholder="Add a tag"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                  <Button
                    type="button"
                    onClick={handleAddProblemTag}
                    className="px-4 py-2"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newProblem.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveProblemTag(tag)}
                        className="hover:text-blue-600"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Problem Hints */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hints
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newHint}
                    onChange={(e) => setNewHint(e.target.value)}
                    placeholder="Add a hint"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                  <Button
                    type="button"
                    onClick={handleAddHint}
                    className="px-4 py-2"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {newProblem.hints.map((hint, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="text-sm">{index + 1}.</span>
                      <span className="flex-1 text-sm">{hint}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHint(hint)}
                        className="hover:text-red-600"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                type="button"
                onClick={handleAddProblem}
                className="w-full"
                disabled={!newProblem.title.trim()}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Problem
              </Button>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : topic ? 'Update Topic' : 'Create Topic'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
