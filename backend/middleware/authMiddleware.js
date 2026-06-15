import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the database and attach to request
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        res.status(401);
        return next(new Error('Not authorized, user not found'));
      }

      return next();
    } catch (error) {
      res.status(401);
      return next(new Error('Not authorized, token validation failed'));
    }
  }

  res.status(401);
  return next(new Error('Not authorized, token required'));
};
