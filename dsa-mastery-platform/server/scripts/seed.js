// ============================================
// server/scripts/seed.js - Comprehensive Seeder
// ============================================
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Topic = require('../src/models/Topic');
const Problem = require('../src/models/Problem');
const User = require('../src/models/User');
const Progress = require('../src/models/Progress');
const logger = require('../src/utils/logger');
const problemsData = [];
const progressData = [];


const seedData = async () => {


  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to MongoDB');

    // ============================================
    // SEED TOPICS (15+ topics)
    // ============================================
    
    const topicsData = [
      {
        title: 'Arrays',
        slug: 'arrays',
        description: 'Master array manipulation, searching, sorting, and common patterns',
        icon: 'array-icon',
        order: 1,
        difficulty: 'Beginner',
        estimatedHours: 20,
        tags: ['fundamentals', 'must-know'],
        resources: [
          {
            type: 'video',
            title: 'Arrays Complete Tutorial',
            url: 'https://youtube.com/watch?v=arrays-complete',
            isPremium: false,
            duration: 45,
            author: 'Tech Guru',
          },
          {
            type: 'article',
            title: 'Understanding Arrays in Depth',
            url: 'https://medium.com/arrays-depth',
            isPremium: false,
          },
          {
            type: 'course',
            title: 'Arrays Masterclass',
            url: 'https://coursera.org/arrays',
            isPremium: true,
          },
        ],
      },
      {
        title: 'Strings',
        slug: 'strings',
        description: 'String manipulation, pattern matching, and string algorithms',
        icon: 'string-icon',
        order: 2,
        difficulty: 'Beginner',
        estimatedHours: 18,
        tags: ['fundamentals', 'interviews'],
        resources: [
          {
            type: 'video',
            title: 'String Algorithms Explained',
            url: 'https://youtube.com/watch?v=strings',
            isPremium: false,
            duration: 30,
          },
        ],
      },
      {
        title: 'Linked Lists',
        slug: 'linked-lists',
        description: 'Singly, doubly, and circular linked lists with operations',
        icon: 'list-icon',
        order: 3,
        difficulty: 'Beginner',
        estimatedHours: 15,
        tags: ['data-structures', 'fundamentals'],
        prerequisites: [],
      },
      {
        title: 'Stacks',
        slug: 'stacks',
        description: 'Stack operations, applications, and problem-solving patterns',
        icon: 'stack-icon',
        order: 4,
        difficulty: 'Beginner',
        estimatedHours: 12,
        tags: ['data-structures', 'lifo'],
      },
      {
        title: 'Queues',
        slug: 'queues',
        description: 'Queue types, operations, and real-world applications',
        icon: 'queue-icon',
        order: 5,
        difficulty: 'Beginner',
        estimatedHours: 12,
        tags: ['data-structures', 'fifo'],
      },
      {
        title: 'Hash Tables',
        slug: 'hash-tables',
        description: 'Hashing, collision resolution, and hash map problems',
        icon: 'hash-icon',
        order: 6,
        difficulty: 'Intermediate',
        estimatedHours: 20,
        tags: ['data-structures', 'important'],
        resources: [
          {
            type: 'video',
            title: 'Hash Tables Deep Dive',
            url: 'https://youtube.com/watch?v=hashtables',
            isPremium: false,
            duration: 60,
          },
        ],
      },
      {
        title: 'Trees',
        slug: 'trees',
        description: 'Binary trees, BST, traversals, and tree algorithms',
        icon: 'tree-icon',
        order: 7,
        difficulty: 'Intermediate',
        estimatedHours: 25,
        tags: ['data-structures', 'recursion'],
      },
      {
        title: 'Heaps',
        slug: 'heaps',
        description: 'Min heap, max heap, priority queues, and heap sort',
        icon: 'heap-icon',
        order: 8,
        difficulty: 'Intermediate',
        estimatedHours: 18,
        tags: ['data-structures', 'priority-queue'],
      },
      {
        title: 'Graphs',
        slug: 'graphs',
        description: 'Graph representations, traversals (BFS/DFS), and algorithms',
        icon: 'graph-icon',
        order: 9,
        difficulty: 'Advanced',
        estimatedHours: 35,
        tags: ['data-structures', 'algorithms', 'important'],
        resources: [
          {
            type: 'video',
            title: 'Graph Algorithms Complete',
            url: 'https://youtube.com/watch?v=graphs',
            isPremium: false,
            duration: 120,
          },
          {
            type: 'book',
            title: 'Introduction to Algorithms - Graph Chapter',
            url: 'https://mitpress.mit.edu/algorithms',
            isPremium: true,
          },
        ],
      },
      {
        title: 'Dynamic Programming',
        slug: 'dynamic-programming',
        description: 'Optimization problems, memoization, and tabulation techniques',
        icon: 'dp-icon',
        order: 10,
        difficulty: 'Advanced',
        estimatedHours: 40,
        tags: ['algorithms', 'optimization', 'hard'],
      },
      {
        title: 'Greedy Algorithms',
        slug: 'greedy-algorithms',
        description: 'Greedy approach, activity selection, and optimization',
        icon: 'greedy-icon',
        order: 11,
        difficulty: 'Intermediate',
        estimatedHours: 22,
        tags: ['algorithms', 'optimization'],
      },
      {
        title: 'Backtracking',
        slug: 'backtracking',
        description: 'Recursive backtracking, N-Queens, Sudoku solver patterns',
        icon: 'backtrack-icon',
        order: 12,
        difficulty: 'Advanced',
        estimatedHours: 28,
        tags: ['algorithms', 'recursion'],
      },
      {
        title: 'Sorting Algorithms',
        slug: 'sorting-algorithms',
        description: 'All major sorting algorithms with time/space complexity',
        icon: 'sort-icon',
        order: 13,
        difficulty: 'Beginner',
        estimatedHours: 15,
        tags: ['algorithms', 'fundamentals'],
      },
      {
        title: 'Searching Algorithms',
        slug: 'searching-algorithms',
        description: 'Linear, binary, and advanced searching techniques',
        icon: 'search-icon',
        order: 14,
        difficulty: 'Beginner',
        estimatedHours: 12,
        tags: ['algorithms', 'fundamentals'],
      },
      {
        title: 'Bit Manipulation',
        slug: 'bit-manipulation',
        description: 'Bitwise operations, tricks, and bit manipulation problems',
        icon: 'bit-icon',
        order: 15,
        difficulty: 'Intermediate',
        estimatedHours: 18,
        tags: ['algorithms', 'tricky'],
      },
      {
        title: 'Recursion',
        slug: 'recursion',
        description: 'Recursive thinking, base cases, and recursive patterns',
        icon: 'recursion-icon',
        order: 16,
        difficulty: 'Intermediate',
        estimatedHours: 20,
        tags: ['algorithms', 'important'],
      },
      {
        title: 'Two Pointers',
        slug: 'two-pointers',
        description: 'Two pointer technique for arrays and linked lists',
        icon: 'pointer-icon',
        order: 17,
        difficulty: 'Beginner',
        estimatedHours: 10,
        tags: ['techniques', 'patterns'],
      },
      {
        title: 'Sliding Window',
        slug: 'sliding-window',
        description: 'Sliding window technique for subarray/substring problems',
        icon: 'window-icon',
        order: 18,
        difficulty: 'Intermediate',
        estimatedHours: 15,
        tags: ['techniques', 'patterns'],
      },
    ];

    // Clear existing data
    await Topic.deleteMany({});
    await Problem.deleteMany({});
    await User.deleteMany({});
    await Progress.deleteMany({});
    logger.info('Cleared existing data');

    const insertedTopics = await Topic.insertMany(topicsData);

    const arrayTopic = insertedTopics.find(t => t.slug === 'arrays');
    const stringTopic = insertedTopics.find(t => t.slug === 'strings');
    const linkedListTopic = insertedTopics.find(t => t.slug === 'linked-lists');
    
    const stringProblems = [
      {
        topicId: stringTopic._id,
        title: 'Valid Anagram',
        description: 'Check if two strings are anagrams',
        difficulty: 'Easy',
        order: 1,
        tags: ['string', 'hash-table', 'sorting'],
        companies: ['Amazon', 'Facebook'],
        frequency: 78,
        links: {
          leetcode: 'https://leetcode.com/problems/valid-anagram/',
        },
        estimatedTime: 15,
      },
      {
        topicId: stringTopic._id,
        title: 'Valid Palindrome',
        description: 'Check if a string is a valid palindrome',
        difficulty: 'Easy',
        order: 2,
        tags: ['string', 'two-pointers'],
        companies: ['Facebook', 'Microsoft'],
        frequency: 72,
        links: {
          leetcode: 'https://leetcode.com/problems/valid-palindrome/',
        },
        estimatedTime: 15,
      },
      {
        topicId: stringTopic._id,
        title: 'Longest Substring Without Repeating Characters',
        description: 'Find the length of longest substring without repeating characters',
        difficulty: 'Medium',
        order: 3,
        tags: ['string', 'hash-table', 'sliding-window'],
        companies: ['Amazon', 'Google', 'Facebook'],
        frequency: 95,
        links: {
          leetcode: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        },
        estimatedTime: 30,
      },
      {
        topicId: stringTopic._id,
        title: 'Longest Palindromic Substring',
        description: 'Find the longest palindromic substring',
        difficulty: 'Medium',
        order: 4,
        tags: ['string', 'dynamic-programming'],
        companies: ['Amazon', 'Microsoft', 'Apple'],
        frequency: 88,
        links: {
          leetcode: 'https://leetcode.com/problems/longest-palindromic-substring/',
        },
        estimatedTime: 35,
      },
      {
        topicId: stringTopic._id,
        title: 'Group Anagrams',
        description: 'Group strings that are anagrams of each other',
        difficulty: 'Medium',
        order: 5,
        tags: ['string', 'hash-table', 'sorting'],
        companies: ['Amazon', 'Facebook', 'Apple'],
        frequency: 86,
        links: {
          leetcode: 'https://leetcode.com/problems/group-anagrams/',
        },
        estimatedTime: 25,
      },
      {
        topicId: stringTopic._id,
        title: 'Valid Parentheses',
        description: 'Check if parentheses are valid',
        difficulty: 'Easy',
        order: 6,
        tags: ['string', 'stack'],
        companies: ['Amazon', 'Facebook', 'Microsoft'],
        frequency: 90,
        links: {
          leetcode: 'https://leetcode.com/problems/valid-parentheses/',
        },
        estimatedTime: 20,
      },
      {
        topicId: stringTopic._id,
        title: 'Longest Common Prefix',
        description: 'Find the longest common prefix among strings',
        difficulty: 'Easy',
        order: 7,
        tags: ['string', 'trie'],
        companies: ['Amazon', 'Apple'],
        frequency: 65,
        links: {
          leetcode: 'https://leetcode.com/problems/longest-common-prefix/',
        },
        estimatedTime: 20,
      },
      {
        topicId: stringTopic._id,
        title: 'Letter Combinations of a Phone Number',
        description: 'Return all possible letter combinations from phone number',
        difficulty: 'Medium',
        order: 8,
        tags: ['string', 'backtracking', 'hash-table'],
        companies: ['Amazon', 'Facebook', 'Microsoft'],
        frequency: 84,
        links: {
          leetcode: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/',
        },
        estimatedTime: 30,
      },
      {
        topicId: stringTopic._id,
        title: 'Generate Parentheses',
        description: 'Generate all combinations of well-formed parentheses',
        difficulty: 'Medium',
        order: 9,
        tags: ['string', 'backtracking', 'dynamic-programming'],
        companies: ['Google', 'Amazon'],
        frequency: 82,
        links: {
          leetcode: 'https://leetcode.com/problems/generate-parentheses/',
        },
        estimatedTime: 35,
      },
      {
        topicId: stringTopic._id,
        title: 'Palindrome Partitioning',
        description: 'Partition string such that every substring is palindrome',
        difficulty: 'Medium',
        order: 10,
        tags: ['string', 'backtracking', 'dynamic-programming'],
        companies: ['Amazon', 'Google'],
        frequency: 75,
        links: {
          leetcode: 'https://leetcode.com/problems/palindrome-partitioning/',
        },
        estimatedTime: 40,
      },
      {
        topicId: stringTopic._id,
        title: 'Word Break',
        description: 'Check if string can be segmented into dictionary words',
        difficulty: 'Medium',
        order: 11,
        tags: ['string', 'dynamic-programming', 'trie'],
        companies: ['Amazon', 'Google', 'Facebook'],
        frequency: 87,
        links: {
          leetcode: 'https://leetcode.com/problems/word-break/',
        },
        estimatedTime: 35,
      },
      {
        topicId: stringTopic._id,
        title: 'Decode Ways',
        description: 'Count number of ways to decode a string',
        difficulty: 'Medium',
        order: 12,
        tags: ['string', 'dynamic-programming'],
        companies: ['Facebook', 'Amazon'],
        frequency: 79,
        links: {
          leetcode: 'https://leetcode.com/problems/decode-ways/',
        },
        estimatedTime: 30,
      },
      {
        topicId: stringTopic._id,
        title: 'Minimum Window Substring',
        description: 'Find minimum window containing all characters',
        difficulty: 'Hard',
        order: 13,
        tags: ['string', 'hash-table', 'sliding-window'],
        companies: ['Facebook', 'Amazon', 'Google'],
        frequency: 92,
        links: {
          leetcode: 'https://leetcode.com/problems/minimum-window-substring/',
        },
        estimatedTime: 45,
      },
      {
        topicId: stringTopic._id,
        title: 'Edit Distance',
        description: 'Find minimum edit distance between two strings',
        difficulty: 'Hard',
        order: 14,
        tags: ['string', 'dynamic-programming'],
        companies: ['Amazon', 'Google', 'Microsoft'],
        frequency: 85,
        links: {
          leetcode: 'https://leetcode.com/problems/edit-distance/',
        },
        estimatedTime: 45,
      },
      {
        topicId: stringTopic._id,
        title: 'Regular Expression Matching',
        description: 'Implement regular expression matching with . and *',
        difficulty: 'Hard',
        order: 15,
        tags: ['string', 'dynamic-programming', 'recursion'],
        companies: ['Google', 'Facebook', 'Microsoft'],
        frequency: 88,
        links: {
          leetcode: 'https://leetcode.com/problems/regular-expression-matching/',
        },
        estimatedTime: 50,
      },
    ];
    const arrayProblems = [
      {
        topicId: arrayTopic._id,
        title: 'Two Sum',
        description: 'Given an array of integers and a target sum, return indices of two numbers that add up to the target',
        difficulty: 'Easy',
        order: 1,
        tags: ['array', 'hash-table', 'two-pointers'],
        companies: ['Google', 'Amazon', 'Microsoft', 'Facebook'],
        frequency: 95,
        links: {
          leetcode: 'https://leetcode.com/problems/two-sum/',
          youtube: 'https://youtube.com/watch?v=two-sum-solution',
          article: 'https://medium.com/two-sum-explained',
        },
        hints: [
          'Consider using a hash map to store seen values',
          'Think about the complement of each number',
        ],
        estimatedTime: 15,
        concepts: ['Hash Table', 'Array Traversal'],
      },
      {
        topicId: arrayTopic._id,
        title: 'Best Time to Buy and Sell Stock',
        description: 'Find the maximum profit from buying and selling a stock once',
        difficulty: 'Easy',
        order: 2,
        tags: ['array', 'dynamic-programming', 'greedy'],
        companies: ['Facebook', 'Amazon', 'Bloomberg'],
        frequency: 88,
        links: {
          leetcode: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
        },
        estimatedTime: 20,
        concepts: ['Kadane Algorithm', 'Greedy'],
      },
      {
        topicId: arrayTopic._id,
        title: 'Contains Duplicate',
        description: 'Check if array contains any duplicates',
        difficulty: 'Easy',
        order: 3,
        tags: ['array', 'hash-table', 'sorting'],
        companies: ['Amazon', 'Apple'],
        frequency: 75,
        links: {
          leetcode: 'https://leetcode.com/problems/contains-duplicate/',
        },
        estimatedTime: 10,
      },
      {
        topicId: arrayTopic._id,
        title: 'Product of Array Except Self',
        description: 'Return an array where each element is the product of all elements except itself',
        difficulty: 'Medium',
        order: 4,
        tags: ['array', 'prefix-sum'],
        companies: ['Amazon', 'Facebook', 'Apple'],
        frequency: 92,
        links: {
          leetcode: 'https://leetcode.com/problems/product-of-array-except-self/',
        },
        hints: ['Think about prefix and suffix products'],
        estimatedTime: 30,
      },
      {
        topicId: arrayTopic._id,
        title: 'Maximum Subarray',
        description: 'Find the contiguous subarray with the largest sum (Kadane\'s Algorithm)',
        difficulty: 'Medium',
        order: 5,
        tags: ['array', 'dynamic-programming', 'divide-conquer'],
        companies: ['Amazon', 'Microsoft', 'LinkedIn'],
        frequency: 85,
        links: {
          leetcode: 'https://leetcode.com/problems/linked-list-cycle/',
        },
        estimatedTime: 15,
      },
      {
        topicId: linkedListTopic._id,
        title: 'Remove Nth Node From End',
        description: 'Remove the nth node from the end of list',
        difficulty: 'Medium',
        order: 4,
        tags: ['linked-list', 'two-pointers'],
        companies: ['Facebook', 'Amazon'],
        frequency: 82,
        links: {
          leetcode: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',
        },
        estimatedTime: 25,
      },
      {
        topicId: linkedListTopic._id,
        title: 'Reorder List',
        description: 'Reorder list to L0→Ln→L1→Ln-1→L2→Ln-2→…',
        difficulty: 'Medium',
        order: 5,
        tags: ['linked-list', 'two-pointers', 'stack'],
        companies: ['Amazon', 'Facebook'],
        frequency: 78,
        links: {
          leetcode: 'https://leetcode.com/problems/reorder-list/',
        },
        estimatedTime: 30,
      },
      {
        topicId: linkedListTopic._id,
        title: 'Add Two Numbers',
        description: 'Add two numbers represented by linked lists',
        difficulty: 'Medium',
        order: 6,
        tags: ['linked-list', 'math', 'recursion'],
        companies: ['Amazon', 'Microsoft', 'Facebook'],
        frequency: 90,
        links: {
          leetcode: 'https://leetcode.com/problems/add-two-numbers/',
        },
        estimatedTime: 30,
      },
      {
        topicId: linkedListTopic._id,
        title: 'Copy List with Random Pointer',
        description: 'Deep copy a linked list with random pointers',
        difficulty: 'Medium',
        order: 7,
        tags: ['linked-list', 'hash-table'],
        companies: ['Amazon', 'Microsoft', 'Facebook'],
        frequency: 86,
        links: {
          leetcode: 'https://leetcode.com/problems/copy-list-with-random-pointer/',
        },
        estimatedTime: 35,
      },
      {
        topicId: linkedListTopic._id,
        title: 'LRU Cache',
        description: 'Design and implement an LRU cache',
        difficulty: 'Medium',
        order: 8,
        tags: ['linked-list', 'hash-table', 'design'],
        companies: ['Amazon', 'Facebook', 'Google'],
        frequency: 95,
        links: {
          leetcode: 'https://leetcode.com/problems/lru-cache/',
        },
        estimatedTime: 45,
      },
      {
        topicId: linkedListTopic._id,
        title: 'Palindrome Linked List',
        description: 'Check if a linked list is palindrome',
        difficulty: 'Easy',
        order: 9,
        tags: ['linked-list', 'two-pointers', 'stack'],
        companies: ['Amazon', 'Facebook'],
        frequency: 75,
        links: {
          leetcode: 'https://leetcode.com/problems/palindrome-linked-list/',
        },
        estimatedTime: 25,
      },
      {
        topicId: linkedListTopic._id,
        title: 'Intersection of Two Linked Lists',
        description: 'Find the node where two linked lists intersect',
        difficulty: 'Easy',
        order: 10,
        tags: ['linked-list', 'two-pointers'],
        companies: ['Amazon', 'Microsoft'],
        frequency: 72,
        links: {
          leetcode: 'https://leetcode.com/problems/intersection-of-two-linked-lists/',
        },
        estimatedTime: 20,
      },
      {
        topicId: linkedListTopic._id,
        title: 'Sort List',
        description: 'Sort a linked list in O(n log n) time',
        difficulty: 'Medium',
        order: 11,
        tags: ['linked-list', 'sorting', 'divide-conquer'],
        companies: ['Facebook', 'Amazon'],
        frequency: 80,
        links: {
          leetcode: 'https://leetcode.com/problems/sort-list/',
        },
        estimatedTime: 40,
      },
      {
        topicId: linkedListTopic._id,
        title: 'Rotate List',
        description: 'Rotate the list to the right by k places',
        difficulty: 'Medium',
        order: 12,
        tags: ['linked-list', 'two-pointers'],
        companies: ['Amazon', 'Microsoft'],
        frequency: 68,
        links: {
          leetcode: 'https://leetcode.com/problems/rotate-list/',
        },
        estimatedTime: 25,
      },
      {
        topicId: linkedListTopic._id,
        title: 'Swap Nodes in Pairs',
        description: 'Swap every two adjacent nodes',
        difficulty: 'Medium',
        order: 13,
        tags: ['linked-list', 'recursion'],
        companies: ['Facebook', 'Microsoft'],
        frequency: 70,
        links: {
          leetcode: 'https://leetcode.com/problems/swap-nodes-in-pairs/',
        },
        estimatedTime: 25,
      },
      {
        topicId: linkedListTopic._id,
        title: 'Merge k Sorted Lists',
        description: 'Merge k sorted linked lists into one',
        difficulty: 'Hard',
        order: 14,
        tags: ['linked-list', 'divide-conquer', 'heap'],
        companies: ['Amazon', 'Facebook', 'Google'],
        frequency: 92,
        links: {
          leetcode: 'https://leetcode.com/problems/merge-k-sorted-lists/',
        },
        estimatedTime: 45,
      },
      {
        topicId: linkedListTopic._id,
        title: 'Reverse Nodes in k-Group',
        description: 'Reverse nodes of linked list k at a time',
        difficulty: 'Hard',
        order: 15,
        tags: ['linked-list', 'recursion'],
        companies: ['Amazon', 'Microsoft', 'Facebook'],
        frequency: 84,
        links: {
          leetcode: 'https://leetcode.com/problems/reverse-nodes-in-k-group/',
        },
        estimatedTime: 50,
      },
    ];
    const usersData = [
      {
        username: 'admin',
        email: 'admin@dsamastery.com',
        password: 'Admin@123',
        fullName: 'Admin User',
        role: 'admin',
        isEmailVerified: true,
        avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=7C3AED&color=fff',
        stats: {
          totalSolved: 250,
          easySolved: 100,
          mediumSolved: 100,
          hardSolved: 50,
          streak: 45,
          longestStreak: 60,
          lastActiveDate: new Date(),
          totalTimeSpent: 15000,
        },
      },
      {
        username: 'johndoe',
        email: 'john@example.com',
        password: 'Password@123',
        fullName: 'John Doe',
        role: 'student',
        isEmailVerified: true,
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3B82F6&color=fff',
        stats: {
          totalSolved: 150,
          easySolved: 70,
          mediumSolved: 60,
          hardSolved: 20,
          streak: 15,
          longestStreak: 30,
          lastActiveDate: new Date(),
          totalTimeSpent: 9000,
        },
        preferences: {
          theme: 'dark',
          difficulty: 'medium',
          dailyGoal: 5,
        },
      },
      {
        username: 'janedoe',
        email: 'jane@example.com',
        password: 'Password@123',
        fullName: 'Jane Doe',
        role: 'student',
        isEmailVerified: true,
        avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&background=EC4899&color=fff',
        stats: {
          totalSolved: 180,
          easySolved: 80,
          mediumSolved: 70,
          hardSolved: 30,
          streak: 25,
          longestStreak: 40,
          lastActiveDate: new Date(),
          totalTimeSpent: 11000,
        },
      },
      {
        username: 'alexsmith',
        email: 'alex@example.com',
        password: 'Password@123',
        fullName: 'Alex Smith',
        role: 'student',
        isEmailVerified: true,
        avatar: 'https://ui-avatars.com/api/?name=Alex+Smith&background=10B981&color=fff',
        stats: {
          totalSolved: 95,
          easySolved: 50,
          mediumSolved: 35,
          hardSolved: 10,
          streak: 7,
          longestStreak: 20,
          lastActiveDate: new Date(Date.now() - 86400000), // Yesterday
          totalTimeSpent: 5500,
        },
      },
      {
        username: 'emilyjohnson',
        email: 'emily@example.com',
        password: 'Password@123',
        fullName: 'Emily Johnson',
        role: 'student',
        isEmailVerified: true,
        avatar: 'https://ui-avatars.com/api/?name=Emily+Johnson&background=F59E0B&color=fff',
        stats: {
          totalSolved: 220,
          easySolved: 90,
          mediumSolved: 90,
          hardSolved: 40,
          streak: 35,
          longestStreak: 50,
          lastActiveDate: new Date(),
          totalTimeSpent: 13000,
        },
        preferences: {
          theme: 'light',
          difficulty: 'hard',
          dailyGoal: 7,
        },
      },
      {
        username: 'mikebrown',
        email: 'mike@example.com',
        password: 'Password@123',
        fullName: 'Mike Brown',
        role: 'student',
        isEmailVerified: true,
        stats: {
          totalSolved: 75,
          easySolved: 40,
          mediumSolved: 28,
          hardSolved: 7,
          streak: 3,
          longestStreak: 15,
          lastActiveDate: new Date(Date.now() - 172800000), // 2 days ago
          totalTimeSpent: 4200,
        },
      },
      {
        username: 'sarahwilson',
        email: 'sarah@example.com',
        password: 'Password@123',
        fullName: 'Sarah Wilson',
        role: 'moderator',
        isEmailVerified: true,
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=8B5CF6&color=fff',
        stats: {
          totalSolved: 300,
          easySolved: 110,
          mediumSolved: 130,
          hardSolved: 60,
          streak: 60,
          longestStreak: 75,
          lastActiveDate: new Date(),
          totalTimeSpent: 18000,
        },
      },
      {
        username: 'davidlee',
        email: 'david@example.com',
        password: 'Password@123',
        fullName: 'David Lee',
        role: 'student',
        isEmailVerified: true,
        stats: {
          totalSolved: 165,
          easySolved: 75,
          mediumSolved: 65,
          hardSolved: 25,
          streak: 18,
          longestStreak: 28,
          lastActiveDate: new Date(),
          totalTimeSpent: 9800,
        },
      },
      {
        username: 'lisachen',
        email: 'lisa@example.com',
        password: 'Password@123',
        fullName: 'Lisa Chen',
        role: 'student',
        isEmailVerified: true,
        avatar: 'https://ui-avatars.com/api/?name=Lisa+Chen&background=DC2626&color=fff',
        stats: {
          totalSolved: 190,
          easySolved: 85,
          mediumSolved: 75,
          hardSolved: 30,
          streak: 22,
          longestStreak: 35,
          lastActiveDate: new Date(),
          totalTimeSpent: 11500,
        },
      },
      {
        username: 'robertgarcia',
        email: 'robert@example.com',
        password: 'Password@123',
        fullName: 'Robert Garcia',
        role: 'student',
        isEmailVerified: true,
        stats: {
          totalSolved: 120,
          easySolved: 60,
          mediumSolved: 45,
          hardSolved: 15,
          streak: 10,
          longestStreak: 25,
          lastActiveDate: new Date(),
          totalTimeSpent: 7200,
        },
      },
      {
        username: 'amandamiller',
        email: 'amanda@example.com',
        password: 'Password@123',
        fullName: 'Amanda Miller',
        role: 'student',
        isEmailVerified: true,
        stats: {
          totalSolved: 135,
          easySolved: 65,
          mediumSolved: 50,
          hardSolved: 20,
          streak: 12,
          longestStreak: 22,
          lastActiveDate: new Date(),
          totalTimeSpent: 8100,
        },
      },
      {
        username: 'kevinwang',
        email: 'kevin@example.com',
        password: 'Password@123',
        fullName: 'Kevin Wang',
        role: 'student',
        isEmailVerified: true,
        avatar: 'https://ui-avatars.com/api/?name=Kevin+Wang&background=0891B2&color=fff',
        stats: {
          totalSolved: 205,
          easySolved: 88,
          mediumSolved: 82,
          hardSolved: 35,
          streak: 28,
          longestStreak: 42,
          lastActiveDate: new Date(),
          totalTimeSpent: 12300,
        },
      },
      {
        username: 'jessicataylor',
        email: 'jessica@example.com',
        password: 'Password@123',
        fullName: 'Jessica Taylor',
        role: 'student',
        isEmailVerified: true,
        stats: {
          totalSolved: 98,
          easySolved: 52,
          mediumSolved: 36,
          hardSolved: 10,
          streak: 5,
          longestStreak: 18,
          lastActiveDate: new Date(),
          totalTimeSpent: 5880,
        },
      },
      {
        username: 'chrismartin',
        email: 'chris@example.com',
        password: 'Password@123',
        fullName: 'Chris Martin',
        role: 'student',
        isEmailVerified: true,
        stats: {
          totalSolved: 175,
          easySolved: 78,
          mediumSolved: 68,
          hardSolved: 29,
          streak: 20,
          longestStreak: 33,
          lastActiveDate: new Date(),
          totalTimeSpent: 10500,
        },
      },
      {
        username: 'rachelgreen',
        email: 'rachel@example.com',
        password: 'Password@123',
        fullName: 'Rachel Green',
        role: 'student',
        isEmailVerified: true,
        avatar: 'https://ui-avatars.com/api/?name=Rachel+Green&background=65A30D&color=fff',
        stats: {
          totalSolved: 145,
          easySolved: 68,
          mediumSolved: 55,
          hardSolved: 22,
          streak: 16,
          longestStreak: 27,
          lastActiveDate: new Date(),
          totalTimeSpent: 8700,
        },
      },
      {
        username: 'thomasanderson',
        email: 'thomas@example.com',
        password: 'Password@123',
        fullName: 'Thomas Anderson',
        role: 'student',
        isEmailVerified: true,
        stats: {
          totalSolved: 255,
          easySolved: 100,
          mediumSolved: 105,
          hardSolved: 50,
          streak: 42,
          longestStreak: 55,
          lastActiveDate: new Date(),
          totalTimeSpent: 15300,
        },
        preferences: {
          theme: 'dark',
          difficulty: 'hard',
          dailyGoal: 10,
        },
      },
    ];

    const linkedListProblems = [
      {
        topicId: linkedListTopic._id,
        title: 'Reverse Linked List',
        description: 'Reverse a singly linked list',
        difficulty: 'Easy',
        order: 1,
        tags: ['linked-list', 'recursion'],
        companies: ['Amazon', 'Microsoft', 'Apple'],
        frequency: 93,
        links: {
          leetcode: 'https://leetcode.com/problems/reverse-linked-list/',
        },
        estimatedTime: 20,
      },
      {
        topicId: linkedListTopic._id,
        title: 'Merge Two Sorted Lists',
        description: 'Merge two sorted linked lists',
        difficulty: 'Easy',
        order: 2,
        tags: ['linked-list', 'recursion'],
        companies: ['Amazon', 'Microsoft', 'Facebook'],
        frequency: 88,
        links: {
          leetcode: 'https://leetcode.com/problems/merge-two-sorted-lists/',
        },
        estimatedTime: 20,
      },
      {
        topicId: linkedListTopic._id,
        title: 'Linked List Cycle',
        description: 'Detect if linked list has a cycle',
        difficulty: 'Easy',
        order: 3,
        tags: ['linked-list', 'two-pointers'],
        companies: ['Amazon', 'Microsoft'],
        frequency: 85,
        links: {
          leetcode: 'https://leetcode.com/problems/maximum-subarray/',
        },
        estimatedTime: 25,
        concepts: ['Kadane Algorithm', 'Dynamic Programming'],
      },
      {
        topicId: arrayTopic._id,
        title: 'Maximum Product Subarray',
        description: 'Find the contiguous subarray with the largest product',
        difficulty: 'Medium',
        order: 6,
        tags: ['array', 'dynamic-programming'],
        companies: ['Amazon', 'Google'],
        frequency: 78,
        links: {
          leetcode: 'https://leetcode.com/problems/maximum-product-subarray/',
        },
        estimatedTime: 35,
      },
      {
        topicId: arrayTopic._id,
        title: 'Find Minimum in Rotated Sorted Array',
        description: 'Find the minimum element in a rotated sorted array',
        difficulty: 'Medium',
        order: 7,
        tags: ['array', 'binary-search'],
        companies: ['Amazon', 'Microsoft', 'Facebook'],
        frequency: 82,
        links: {
          leetcode: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
        },
        estimatedTime: 30,
      },
      {
        topicId: arrayTopic._id,
        title: 'Search in Rotated Sorted Array',
        description: 'Search for a target value in a rotated sorted array',
        difficulty: 'Medium',
        order: 8,
        tags: ['array', 'binary-search'],
        companies: ['Facebook', 'Amazon', 'Microsoft'],
        frequency: 90,
        links: {
          leetcode: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
        },
        estimatedTime: 35,
      },
      {
        topicId: arrayTopic._id,
        title: '3Sum',
        description: 'Find all unique triplets that sum to zero',
        difficulty: 'Medium',
        order: 9,
        tags: ['array', 'two-pointers', 'sorting'],
        companies: ['Amazon', 'Facebook', 'Apple'],
        frequency: 88,
        links: {
          leetcode: 'https://leetcode.com/problems/3sum/',
        },
        hints: [
          'Sort the array first',
          'Use two pointers for the remaining two numbers',
        ],
        estimatedTime: 40,
      },
      {
        topicId: arrayTopic._id,
        title: 'Container With Most Water',
        description: 'Find two lines that together with x-axis forms a container with most water',
        difficulty: 'Medium',
        order: 10,
        tags: ['array', 'two-pointers', 'greedy'],
        companies: ['Amazon', 'Adobe', 'Apple'],
        frequency: 86,
        links: {
          leetcode: 'https://leetcode.com/problems/container-with-most-water/',
        },
        estimatedTime: 30,
      },
      {
        topicId: arrayTopic._id,
        title: 'Merge Intervals',
        description: 'Merge all overlapping intervals',
        difficulty: 'Medium',
        order: 11,
        tags: ['array', 'sorting', 'intervals'],
        companies: ['Facebook', 'Google', 'Amazon'],
        frequency: 93,
        links: {
          leetcode: 'https://leetcode.com/problems/merge-intervals/',
        },
        estimatedTime: 30,
      },
      {
        topicId: arrayTopic._id,
        title: 'Rotate Array',
        description: 'Rotate array to the right by k steps',
        difficulty: 'Medium',
        order: 12,
        tags: ['array', 'math'],
        companies: ['Microsoft', 'Amazon'],
        frequency: 70,
        links: {
          leetcode: 'https://leetcode.com/problems/rotate-array/',
        },
        hints: ['Try reversing parts of the array'],
        estimatedTime: 25,
      },
      {
        topicId: arrayTopic._id,
        title: 'Missing Number',
        description: 'Find the missing number in array containing n distinct numbers',
        difficulty: 'Easy',
        order: 13,
        tags: ['array', 'math', 'bit-manipulation'],
        companies: ['Amazon', 'Microsoft'],
        frequency: 72,
        links: {
          leetcode: 'https://leetcode.com/problems/missing-number/',
        },
        estimatedTime: 15,
      },
      {
        topicId: arrayTopic._id,
        title: 'Move Zeroes',
        description: 'Move all zeroes to the end while maintaining relative order',
        difficulty: 'Easy',
        order: 14,
        tags: ['array', 'two-pointers'],
        companies: ['Facebook', 'Bloomberg'],
        frequency: 68,
        links: {
          leetcode: 'https://leetcode.com/problems/move-zeroes/',
        },
        estimatedTime: 15,
      },
      {
        topicId: arrayTopic._id,
        title: 'Majority Element',
        description: 'Find the element that appears more than n/2 times',
        difficulty: 'Easy',
        order: 15,
        tags: ['array', 'hash-table', 'sorting', 'boyer-moore'],
        companies: ['Amazon', 'Google'],
        frequency: 76,
        links: {
          leetcode: 'https://leetcode.com/problems/majority-element/',
        },
        hints: ['Boyer-Moore Voting Algorithm'],
        estimatedTime: 20,
      },
      {
        topicId: arrayTopic._id,
        title: 'Squares of a Sorted Array',
        description: 'Return squares of sorted array in sorted order',
        difficulty: 'Easy',
        order: 16,
        tags: ['array', 'two-pointers', 'sorting'],
        companies: ['Facebook', 'Google'],
        frequency: 65,
        links: {
          leetcode: 'https://leetcode.com/problems/squares-of-a-sorted-array/',
        },
        estimatedTime: 15,
      },
      {
        topicId: arrayTopic._id,
        title: 'Subarray Sum Equals K',
        description: 'Find total number of continuous subarrays whose sum equals k',
        difficulty: 'Medium',
        order: 17,
        tags: ['array', 'hash-table', 'prefix-sum'],
        companies: ['Facebook', 'Google', 'Amazon'],
        frequency: 89,
        links: {
          leetcode: 'https://leetcode.com/problems/subarray-sum-equals-k/',
        },
        estimatedTime: 35,
      },
      {
        topicId: arrayTopic._id,
        title: 'Next Permutation',
        description: 'Implement next permutation which rearranges numbers into next greater permutation',
        difficulty: 'Medium',
        order: 18,
        tags: ['array', 'two-pointers'],
        companies: ['Google', 'Amazon'],
        frequency: 81,
        links: {
          leetcode: 'https://leetcode.com/problems/next-permutation/',
        },
        estimatedTime: 40,
      },
      {
        topicId: arrayTopic._id,
        title: 'Trapping Rain Water',
        description: 'Calculate how much rain water can be trapped',
        difficulty: 'Hard',
        order: 19,
        tags: ['array', 'two-pointers', 'dynamic-programming', 'stack'],
        companies: ['Amazon', 'Google', 'Facebook', 'Apple'],
        frequency: 94,
        links: {
          leetcode: 'https://leetcode.com/problems/trapping-rain-water/',
        },
        hints: [
          'Think about the maximum water level at each position',
          'Two pointers can optimize space complexity',
        ],
        estimatedTime: 45,
      },
      {
        topicId: arrayTopic._id,
        title: 'Median of Two Sorted Arrays',
        description: 'Find the median of two sorted arrays',
        difficulty: 'Hard',
        order: 20,
        tags: ['array', 'binary-search', 'divide-conquer'],
        companies: ['Amazon', 'Google', 'Apple', 'Microsoft'],
        frequency: 91,
        links: {
          leetcode: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
        },
        estimatedTime: 60,
      },
    ];
    problemsData.push(...linkedListProblems);

    logger.info(`Created ${insertedTopics.length} topics`);

    const insertedProblems = await Problem.insertMany(problemsData);
    logger.info(`Created ${insertedProblems.length} problems`);

    // ============================================
    // SEED USERS (15+ users)
    // ============================================
  
    // Hash passwords and create users
    const createdUsers = [];
    for (const userData of usersData) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    logger.info(`Created ${createdUsers.length} users`);

    // ============================================
    // SEED PROGRESS (Sample progress for some users)
    // ============================================
 
    // Get inserted problems by title for progress creation
    const arrayProblemsInserted = insertedProblems.filter(p => p.topicId.toString() === arrayTopic._id.toString());
    const stringProblemsInserted = insertedProblems.filter(p => p.topicId.toString() === stringTopic._id.toString());
    const linkedListProblemsInserted = insertedProblems.filter(p => p.topicId.toString() === linkedListTopic._id.toString());
    
    // Create progress for first 5 users on array problems
    for (let i = 1; i < 6; i++) {
      const user = createdUsers[i]; // Skip admin
      const problemsToSolve = arrayProblemsInserted.slice(0, Math.floor(Math.random() * 15) + 5);
      
      for (const problem of problemsToSolve) {
        const statuses = ['completed', 'attempted', 'revisit'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        progressData.push({
          userId: user._id,
          problemId: problem._id,
          topicId: arrayTopic._id,
          status: randomStatus,
          notes: randomStatus === 'completed' 
            ? 'Solved using optimal approach' 
            : 'Need to review this problem',
          timeSpent: Math.floor(Math.random() * 60) + 10,
          attempts: Math.floor(Math.random() * 5) + 1,
          lastAttemptDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          completedDate: randomStatus === 'completed' 
            ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
            : null,
          confidence: Math.floor(Math.random() * 5) + 1,
          isBookmarked: Math.random() > 0.7,
          code: randomStatus === 'completed' ? `
// Solution for ${problem.title}
function solution(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}` : null,
          language: 'javascript',
        });
      }
    }

    // Create progress for some users on string problems
    for (let i = 3; i < 8; i++) {
      const user = createdUsers[i];
      const problemsToSolve = stringProblemsInserted.slice(0, Math.floor(Math.random() * 10) + 3);
      
      for (const problem of problemsToSolve) {
        progressData.push({
          userId: user._id,
          problemId: problem._id,
          topicId: stringTopic._id,
          status: Math.random() > 0.5 ? 'completed' : 'attempted',
          timeSpent: Math.floor(Math.random() * 45) + 15,
          attempts: Math.floor(Math.random() * 3) + 1,
          lastAttemptDate: new Date(),
          completedDate: Math.random() > 0.5 ? new Date() : null,
          confidence: Math.floor(Math.random() * 5) + 1,
          isBookmarked: Math.random() > 0.8,
        });
      }
    }

    if (progressData.length > 0) {
      await Progress.insertMany(progressData);
      logger.info(`Created ${progressData.length} progress records`);
    }

    // ============================================
    // SUMMARY
    // ============================================
    logger.info('✅ Seed completed successfully!');
    
    console.log('\n========================================');
    console.log('📊 DATABASE SEEDED SUCCESSFULLY');
    console.log('========================================');
    console.log(`✓ Topics created: ${insertedTopics.length}`);
    // console.log(`✓ Problems created: ${problemsData.length}`);
    console.log(`✓ Users created: ${createdUsers.length}`);
    console.log(`✓ Progress records: ${progressData.length}`);
    console.log('\n🔑 Sample User Credentials:');
    console.log('========================================');
    console.log('Admin:');
    console.log('  Email: admin@dsamastery.com');
    console.log('  Password: Admin@123');
    console.log('\nStudent:');
    console.log('  Email: john@example.com');
    console.log('  Password: Password@123');
    console.log('\nModerator:');
    console.log('  Email: sarah@example.com');
    console.log('  Password: Password@123');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    logger.error('❌ Seed failed:', error);
    console.error('Error details:', error);
    process.exit(1);
  }
};

// Run the seeder
seedData();
   

  
    // Linked List Problems (15 problems)
