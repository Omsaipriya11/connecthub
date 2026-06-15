import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      res.status(400);
      throw new Error('Please fill in all required fields (name, username, email, password)');
    }

    const emailNormalized = email.toLowerCase();
    const usernameNormalized = username.toLowerCase();

    // Check username uniqueness
    const usernameExists = await User.findOne({ username: usernameNormalized });
    if (usernameExists) {
      res.status(400);
      throw new Error('Username is already taken');
    }

    // Check email uniqueness
    const emailExists = await User.findOne({ email: emailNormalized });
    if (emailExists) {
      res.status(400);
      throw new Error('Email is already registered');
    }

    // Create user (triggers User schema pre-save encryption hook)
    const user = await User.create({
      name,
      username: usernameNormalized,
      email: emailNormalized,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        data: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          bio: user.bio,
          profilePicture: user.profilePicture,
          followers: user.followers.length,
          following: user.following.length,
        },
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data received');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please enter email/username and password');
    }

    // Support logging in via either email or username
    const searchParam = email.toLowerCase();
    const user = await User.findOne({
      $or: [{ email: searchParam }, { username: searchParam }],
    }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        success: true,
        token: generateToken(user._id),
        data: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          bio: user.bio,
          profilePicture: user.profilePicture,
          followers: user.followers.length,
          following: user.following.length,
        },
      });
    } else {
      res.status(401);
      throw new Error('Invalid credentials provided');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user details
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      data: {
        id: req.user._id,
        name: req.user.name,
        username: req.user.username,
        email: req.user.email,
        bio: req.user.bio,
        profilePicture: req.user.profilePicture,
        followers: req.user.followers.length,
        following: req.user.following.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear session
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};
