export const STORAGE_KEYS = {
  CURRENT_USER: 'rofinet_current_user',
  USER_DATA: 'rofinet_user_data',
  ORDERS: 'rofinet_orders',
  REVIEWS: 'rofinet_reviews',
  ADMIN_DATA: 'rofinet_admin_data'
};

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

export const clearAllStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

// Funciones específicas para usuarios
export const saveUser = (user) => {
  const users = loadFromStorage(STORAGE_KEYS.USER_DATA, []);
  const existingIndex = users.findIndex(u => u.email === user.email);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  saveToStorage(STORAGE_KEYS.USER_DATA, users);
  saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
  return user;
};

export const getCurrentUser = () => {
  return loadFromStorage(STORAGE_KEYS.CURRENT_USER, null);
};

export const getUserByEmail = (email) => {
  const users = loadFromStorage(STORAGE_KEYS.USER_DATA, []);
  return users.find(u => u.email === email);
};

export const saveOrder = (order) => {
  const orders = loadFromStorage(STORAGE_KEYS.ORDERS, []);
  orders.unshift(order);
  saveToStorage(STORAGE_KEYS.ORDERS, orders);
  return order;
};

export const getUserOrders = (userId) => {
  const orders = loadFromStorage(STORAGE_KEYS.ORDERS, []);
  return orders.filter(order => order.userId === userId);
};

export const saveReview = (review) => {
  const reviews = loadFromStorage(STORAGE_KEYS.REVIEWS, []);
  reviews.unshift(review);
  saveToStorage(STORAGE_KEYS.REVIEWS, reviews);
  return review;
};

export const getUserReviews = (userId) => {
  const reviews = loadFromStorage(STORAGE_KEYS.REVIEWS, []);
  return reviews.filter(review => review.userId === userId);
};