const express = require('express');
const router = express.Router();
const {
  getTopics,
  getTopic,
  createTopic,
  updateTopic,
  deleteTopic,
  getTopicProblems,
  getTopicResources,
} = require('../controllers/topicsController');
const {
  getProblems,
  getProblem,
  createProblem,
  updateProblem,
  deleteProblem,
} = require('../controllers/problemsController');
const { protect, authorize } = require('../middleware/auth');
const {
  validateTopic,
  validateProblem,
  validateMongoId,
  validatePagination,
  handleValidationErrors,
} = require('../middleware/validation');

// Topic routes
router.get('/', validatePagination, handleValidationErrors, getTopics);
router.get('/:slug', getTopic);
router.get('/:slug/problems', validatePagination, handleValidationErrors, getTopicProblems);
router.get('/:slug/resources', getTopicResources);

// Admin only topic routes
router.post('/', protect, authorize('admin'), validateTopic, handleValidationErrors, createTopic);
router.put('/:id', protect, authorize('admin'), validateMongoId(), handleValidationErrors, updateTopic);
router.delete('/:id', protect, authorize('admin'), validateMongoId(), handleValidationErrors, deleteTopic);

// Problem routes
router.get('/problems/all', validatePagination, handleValidationErrors, getProblems);
router.get('/problems/:id', validateMongoId('id'), handleValidationErrors, getProblem);
router.post('/problems', protect, authorize('admin', 'moderator'), validateProblem, handleValidationErrors, createProblem);
router.put('/problems/:id', protect, authorize('admin', 'moderator'), validateMongoId(), handleValidationErrors, updateProblem);
router.delete('/problems/:id', protect, authorize('admin'), validateMongoId(), handleValidationErrors, deleteProblem);

module.exports = router;