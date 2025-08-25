// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  ME: `${API_BASE_URL}/api/auth/me`,
  
  // Attractions endpoints
  ATTRACTIONS: `${API_BASE_URL}/api/attractions`,
  ATTRACTION_DETAILS: (id) => `${API_BASE_URL}/api/attractions/${id}`,
  
  // Crowd data endpoints
  CROWD_DATA: `${API_BASE_URL}/api/crowd`,
  
  // User endpoints
  USER_PREFERENCES: `${API_BASE_URL}/api/users/preferences`,
  USER_PROFILE: `${API_BASE_URL}/api/users/profile`,
};

export default API_BASE_URL;
