import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserControllers } from './auth.controller';
import {
  changePasswordSchema,
  changeUserStatusSchema,
  loginSchema,
  signupSchema,
  updateProfileSchema,
} from './auth.validation';

const router = express.Router();

router.get('/get-my-profile', UserControllers.getMyProfile);
router.post('/logout', UserControllers.logoutUser);

router.post(
  '/register',
  validateRequest(signupSchema),
  UserControllers.registerUser,
);

router.post('/login', validateRequest(loginSchema), UserControllers.loginUser);

router.post(
  '/change-password',
  validateRequest(changePasswordSchema),
  UserControllers.changePassword,
);

router.put(
  '/update-profile',
  validateRequest(updateProfileSchema),
  UserControllers.updateUserProfile,
);

router.post('/verify-token', UserControllers.verifyToken);

router.post('/refresh-token', UserControllers.getAccessTokenUsingRefreshToken);

// get all users for admin
router.get('/getallusers', auth('admin'), UserControllers.getAllUsersForAdmin);

// get all donors
router.get('/getalldonors', UserControllers.getAllDonors);

// get single donor by username
router.get('/getalldonors/:username', UserControllers.getSingleDonorByUsername);

// activate or inactivate user by admin
router.post(
  '/change-user-status-or-role',
  validateRequest(changeUserStatusSchema),
  auth('admin'),
  UserControllers.activateOrInactivateAccount,
);

export const AuthRoutes = router;
