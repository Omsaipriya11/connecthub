import API from './api.js';

export const getPosts = async () => {
  const response = await API.get('/posts');
  return response.data;
};

export const createPost = async (postData) => {
  const response = await API.post('/posts', postData);
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await API.delete(`/posts/${postId}`);
  return response.data;
};

export const likePost = async (postId) => {
  const response = await API.post(`/posts/like/${postId}`);
  return response.data;
};

export const addComment = async (postId, text) => {
  const response = await API.post(
    `/posts/comment/${postId}`,
    { text }
  );

  return response.data;
};

export const deleteComment = async (
  postId,
  commentId
) => {
  const response = await API.delete(
    `/posts/comment/${postId}/${commentId}`
  );

  return response.data;
};