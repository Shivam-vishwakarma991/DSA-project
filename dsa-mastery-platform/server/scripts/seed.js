require('dotenv').config();
const mongoose = require('mongoose');
const Topic = require('../src/models/Topic');
const Problem = require('../src/models/Problem');
const User = require('../src/models/User');
const logger = require('../src/utils/logger');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to MongoDB');

    // Clear existing data
    await Topic.deleteMany({});
    await Problem.deleteMany({});
    await User.deleteMany({});
    logger.info('Cleared existing data');

    // Seed Topics
    const topics = [
      {
        title: 'Arrays',
        slug: 'arrays',
        description: 'Master array manipulation and common patterns',
        icon: 'array-icon',
        order: 1,
        difficulty: 'Beginner',
        estimatedHours: 20,
        resources: [
          {
            type: 'video',
            title: 'Arrays Introduction',
            url: 'https://youtube.com/watch?v=arrays101',
            isPremium: false,
          },
        ],
      },
      {
        title: 'Linked Lists',
        slug: 'linked-lists',
        description: 'Learn about singly and doubly linked lists',
        icon: 'list-icon',
        order: 2,
        difficulty: 'Beginner',
        estimatedHours: 15,
      },
      {
        title: 'Trees',
        slug: 'trees',
        description: 'Explore binary trees, BST, and tree traversals',
        icon: 'tree-icon',
        order: 3,
        difficulty: 'Intermediate',
        estimatedHours: 25,
      },
      {
        title: 'Dynamic Programming',
        slug: 'dynamic-programming',
        description: 'Master optimization problems with DP',
        icon: 'dp-icon',
        order: 4,
        difficulty: 'Advanced',
        estimatedHours: 40,
      },
    ];

    const createdTopics = await Topic.insertMany(topics);
    logger.info(`Created ${createdTopics.length} topics`);

    // Seed Problems for Arrays topic
    const arrayTopic = createdTopics.find(t => t.slug === 'arrays');
    const arrayProblems = [
      {
        topicId: arrayTopic._id,
        title: 'Two Sum',
        description: 'Find two numbers that add up to a target',
        difficulty: 'Easy',
        order: 1,
        tags: ['array', 'hash-table'],
        companies: ['Google', 'Amazon', 'Microsoft'],
        links: {
          leetcode: 'https://leetcode.com/problems/two-sum/',
          youtube: 'https://youtube.com/watch?v=twosum',
        },
        estimatedTime: 15,
      },
      {
        topicId: arrayTopic._id,
        title: 'Best Time to Buy and Sell Stock',
        description: 'Find maximum profit from stock prices',
        difficulty: 'Easy',
        order: 2,
        tags: ['array', 'dynamic-programming'],
        companies: ['Facebook', 'Amazon'],
        links: {
          leetcode: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
        },
        estimatedTime: 20,
      },
      {
        topicId: arrayTopic._id,
        title: 'Container With Most Water',
        description: 'Find two lines that form a container with maximum water',
        difficulty: 'Medium',
        order: 3,
        tags: ['array', 'two-pointers'],
        companies: ['Amazon', 'Adobe'],
        links: {
          leetcode: 'https://leetcode.com/problems/container-with-most-water/',
        },
        estimatedTime: 30,
      },
    ];

    await Problem.insertMany(arrayProblems);
    logger.info('Created sample problems');

    // Create admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@dsamastery.com',
      password: 'Admin@123',
      fullName: 'Admin User',
      role: 'admin',
      isEmailVerified: true,
    });

    logger.info('Created admin user');
    logger.info('Seed completed successfully!');
    
    console.log('\n=================================');
    console.log('Admin Credentials:');
    console.log('Email: admin@dsamastery.com');
    console.log('Password: Admin@123');
    console.log('=================================\n');

    process.exit(0);
  } catch (error) {
    logger.error('Seed failed:', error);
    process.exit(1);
  }
};

seedData();
