export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  STORE_OWNER: 'store_owner'
};

export const ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrator',
  [USER_ROLES.USER]: 'User',
  [USER_ROLES.STORE_OWNER]: 'Store Owner'
};

export const RATING_VALUES = [1, 2, 3, 4, 5];

export const VALIDATION_RULES = {
  NAME: {
    MIN_LENGTH: 20,
    MAX_LENGTH: 60
  },
  ADDRESS: {
    MAX_LENGTH: 400
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 16,
    REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/
  },
  COMMENT: {
    MAX_LENGTH: 1000
  }
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    UPDATE_PASSWORD: '/auth/password'
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET: (id) => `/users/${id}`,
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    STATS: '/users/stats'
  },
  STORES: {
    LIST: '/stores',
    CREATE: '/stores',
    GET: (id) => `/stores/${id}`,
    UPDATE: (id) => `/stores/${id}`,
    DELETE: (id) => `/stores/${id}`,
    SEARCH: '/stores/search'
  },
  RATINGS: {
    LIST: '/ratings',
    CREATE: '/ratings',
    UPDATE: (id) => `/ratings/${id}`,
    DELETE: (id) => `/ratings/${id}`,
    BY_STORE: (storeId) => `/ratings/store/${storeId}`,
    BY_USER: '/ratings/my',
    STATS: '/ratings/stats'
  },
  ADMIN: {
    DASHBOARD_STATS: '/admin/dashboard-stats'
  }
};

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  SORT_BY: 'createdAt',
  SORT_ORDER: 'DESC'
};

export const SORT_OPTIONS = {
  USERS: [
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'role', label: 'Role' },
    { value: 'createdAt', label: 'Date Created' }
  ],
  STORES: [
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'createdAt', label: 'Date Added' }
  ],
  RATINGS: [
    { value: 'rating', label: 'Rating' },
    { value: 'createdAt', label: 'Date' },
    { value: 'updatedAt', label: 'Last Updated' }
  ]
};

export const TOAST_MESSAGES = {
  SUCCESS: {
    LOGIN: 'Login successful!',
    REGISTER: 'Registration successful! Welcome to the platform!',
    LOGOUT: 'Logged out successfully',
    PASSWORD_UPDATE: 'Password updated successfully',
    USER_CREATED: 'User created successfully',
    USER_UPDATED: 'User updated successfully',
    USER_DELETED: 'User deleted successfully',
    STORE_CREATED: 'Store created successfully',
    STORE_UPDATED: 'Store updated successfully',
    STORE_DELETED: 'Store deleted successfully',
    RATING_SUBMITTED: 'Rating submitted successfully',
    RATING_UPDATED: 'Rating updated successfully',
    RATING_DELETED: 'Rating deleted successfully'
  },
  ERROR: {
    LOGIN: 'Login failed',
    REGISTER: 'Registration failed',
    PASSWORD_UPDATE: 'Failed to update password',
    USER_FETCH: 'Failed to fetch users',
    USER_CREATE: 'Failed to create user',
    USER_UPDATE: 'Failed to update user',
    USER_DELETE: 'Failed to delete user',
    STORE_FETCH: 'Failed to fetch stores',
    STORE_CREATE: 'Failed to create store',
    STORE_UPDATE: 'Failed to update store',
    STORE_DELETE: 'Failed to delete store',
    RATING_SUBMIT: 'Failed to submit rating',
    RATING_UPDATE: 'Failed to update rating',
    RATING_DELETE: 'Failed to delete rating',
    GENERIC: 'An error occurred. Please try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    NETWORK: 'Network error. Please check your connection.',
    SERVER: 'Server error. Please try again later.'
  }
};

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user'
};

export const RATING_COLORS = {
  1: 'text-red-600',
  2: 'text-orange-600',
  3: 'text-yellow-600',
  4: 'text-blue-600',
  5: 'text-green-600'
};

export const ROLE_COLORS = {
  [USER_ROLES.ADMIN]: 'bg-purple-100 text-purple-800',
  [USER_ROLES.USER]: 'bg-blue-100 text-blue-800',
  [USER_ROLES.STORE_OWNER]: 'bg-green-100 text-green-800'
};