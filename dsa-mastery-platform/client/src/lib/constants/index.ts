export const DIFFICULTY_LEVELS = {
    EASY: 'Easy',
    MEDIUM: 'Medium',
    HARD: 'Hard',
  } as const;
  
  export const PROGRESS_STATUS = {
    PENDING: 'pending',
    ATTEMPTED: 'attempted',
    COMPLETED: 'completed',
    REVISIT: 'revisit',
  } as const;
  
  export const USER_ROLES = {
    STUDENT: 'student',
    ADMIN: 'admin',
    MODERATOR: 'moderator',
  } as const;
  
  export const RESOURCE_TYPES = {
    VIDEO: 'video',
    ARTICLE: 'article',
    BOOK: 'book',
    COURSE: 'course',
  } as const;
  
  export const SORT_OPTIONS = [
    { value: 'createdAt', label: 'Newest First' },
    { value: '-createdAt', label: 'Oldest First' },
    { value: 'title', label: 'Title (A-Z)' },
    { value: '-title', label: 'Title (Z-A)' },
    { value: 'difficulty', label: 'Difficulty' },
  ];
  
  export const ITEMS_PER_PAGE = 20;
  
  export const THEME_OPTIONS = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ];
  