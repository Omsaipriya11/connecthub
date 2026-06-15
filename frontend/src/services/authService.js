import API from './api.js';

export const register = async (userData) => {
  const response = await API.post(
    '/auth/register',
    userData
  );

  return response.data;
};

export const login = async (credentials) => {
  const response = await API.post(
    '/auth/login',
    credentials
  );

  return response.data;
};

export const getMe = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};

export const logout = async () => {
  const response = await API.post('/auth/logout');
  return response.data;
};

export const updateProfile = async (
  profileData
) => {
  const response = await API.put(
    '/users/profile',
    profileData
  );

  return response.data;
};

export const getUserProfile = async (
  username
) => {
  const response = await API.get(
    `/users/profile/${username}`
  );

  return response.data;
};