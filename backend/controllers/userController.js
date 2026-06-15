import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/users/profile/:username
// @access  Public
export const getUserProfile = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
    }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (
  req,
  res,
  next
) => {
  try {
    res.status(200).json({
      success: true,
      message:
        'Update profile endpoint placeholder. Ready for business logic.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Follow / Unfollow user
// @route   POST /api/users/follow/:id
// @access  Private
export const followUnfollowUser = async (
  req,
  res,
  next
) => {
  try {
    const targetUser = await User.findById(
      req.params.id
    );

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (
      targetUser._id.toString() ===
      req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          'You cannot follow yourself',
      });
    }

    const currentUser = await User.findById(
      req.user._id
    );

    const isFollowing =
      currentUser.following.some(
        (id) =>
          id.toString() ===
          targetUser._id.toString()
      );

    if (isFollowing) {
      currentUser.following =
        currentUser.following.filter(
          (id) =>
            id.toString() !==
            targetUser._id.toString()
        );

      targetUser.followers =
        targetUser.followers.filter(
          (id) =>
            id.toString() !==
            currentUser._id.toString()
        );

      await currentUser.save();
      await targetUser.save();

      return res.status(200).json({
        success: true,
        following: false,
        followersCount:
          targetUser.followers.length,
      });
    }

    currentUser.following.push(
      targetUser._id
    );

    targetUser.followers.push(
      currentUser._id
    );

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      success: true,
      following: true,
      followersCount:
        targetUser.followers.length,
    });
  } catch (error) {
    next(error);
  }
};