import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import User from '../models/User';
import multer from 'multer';

const router = express.Router();
const upload = multer();

// Get current user profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update current user profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { username, email, firstName, lastName, role } = req.body;
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, firstName, lastName, role },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Change password endpoint
router.put('/change-password', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?._id;
    const { currentPassword, newPassword } = req.body;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!currentPassword || !newPassword) return res.status(400).json({ success: false, message: 'Missing password fields' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Upload avatar
router.put('/avatar', authenticateToken, upload.single('avatar'), async (req: AuthRequest, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: req.file.buffer, 'avatar.contentType': req.file.mimetype },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Serve avatar
router.get('/avatar', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const user = await User.findById(userId);
    if (!user || !user.avatar) return res.status(404).json({ success: false, message: 'Avatar not found' });
    res.set('Content-Type', user.avatar.contentType || 'image/png');
    res.send(user.avatar);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
