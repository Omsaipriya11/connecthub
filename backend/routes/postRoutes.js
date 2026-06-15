import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  likeUnlikePost,
  addComment,
  deleteComment,
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createPost)
  .get(getPosts);

router.route('/:id')
  .get(getPostById)
  .delete(protect, deletePost);

router.post('/like/:id', protect, likeUnlikePost);
router.post('/comment/:id', protect, addComment);
router.delete('/comment/:postId/:commentId', protect, deleteComment);

export default router;
