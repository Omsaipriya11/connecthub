import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  followUnfollowUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile/:username', getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/follow/:id', protect, followUnfollowUser);

export default router;
