import API from './api.js';

export const getUserProfile = async (
  username
) => {
  const response = await API.get(
    `/users/profile/${username}`
  );

  return response.data;
};

export const followUser = async (
  userId
) => {
  const response = await API.post(
    `/users/follow/${userId}`
  );

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