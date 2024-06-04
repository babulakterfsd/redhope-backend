import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { TCustomErrorForRecentPasswordChange } from '../../interface/error';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TDecodedUser } from './auth.interface';
import { UserServices } from './auth.service';

//create user
const registerUser = catchAsync(async (req, res) => {
  const result = await UserServices.registerUserInDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User has been registered succesfully',
    data: result,
  });
});

//login user
const loginUser = catchAsync(async (req, res) => {
  const result = await UserServices.loginUserInDB(req.body);
  const { accesstoken, refreshfToken, userFromDB } = result;

  res.cookie('refreshfToken', refreshfToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User has been logged in succesfully',
    data: {
      user: {
        _id: userFromDB?._id,
        name: userFromDB?.name,
        email: userFromDB?.email,
        username: userFromDB?.username,
        role: userFromDB?.role,
        profileImage: userFromDB?.profileImage,
        isAccountActive: userFromDB?.isAccountActive,
        isAvailableToDonate: userFromDB?.isAvailableToDonate,
        location: userFromDB?.location,
      },
      token: accesstoken,
    },
  });
});

// verify token from client side
const verifyToken = catchAsync(async (req, res) => {
  const result = await UserServices.verifyToken(req.body.token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Token verification completed!',
    data: result,
  });
});

//get access token using refresh token
const getAccessTokenUsingRefreshToken = catchAsync(async (req, res) => {
  const result = await UserServices.getAccessTokenByRefreshToken(
    req.cookies?.refreshfToken,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token retrieved succesfully!',
    data: result,
  });
});

//change password
const changePassword = catchAsync(async (req, res) => {
  const passwordData = req.body;
  const token = req?.headers?.authorization;
  const splittedToken = token?.split(' ')[1] as string;

  const decodedUser = jwt.verify(
    splittedToken,
    config.jwt_access_secret as string,
  );

  const result = await UserServices.changePasswordInDB(
    passwordData,
    decodedUser as TDecodedUser,
  );

  const { statusCode, message } = result as TCustomErrorForRecentPasswordChange;

  if (statusCode === 406 && message === 'Recent password change detected.') {
    sendResponse(res, {
      statusCode: httpStatus.NOT_ACCEPTABLE,
      success: false,
      message: 'Recent password change detected.',
      data: null,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Password has been changed succesfully',
      data: result,
    });
  }
});

// update user profile
const updateUserProfile = catchAsync(async (req, res) => {
  const dataToBeUpdated = req.body;
  const token = req?.headers?.authorization;
  const splittedToken = token?.split(' ')[1] as string;

  const decodedUser = jwt.verify(
    splittedToken,
    config.jwt_access_secret as string,
  );

  const result = await UserServices.updateUserProfileInDB(
    decodedUser as TDecodedUser,
    dataToBeUpdated,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile has been updated succesfully',
    data: result,
  });
});

// get user profile
const getMyProfile = catchAsync(async (req, res) => {
  const token = req?.headers?.authorization;
  const splittedToken = token?.split(' ')[1] as string;

  const decodedUser = jwt.verify(
    splittedToken,
    config.jwt_access_secret as string,
  );

  const result = await UserServices.getMyProfile(decodedUser as TDecodedUser);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile has been retrieved succesfully',
    data: result,
  });
});

// logout user
const logoutUser = catchAsync(async (req, res) => {
  res.clearCookie('refreshfToken', {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged out successfully!',
    data: null,
  });
});

// get all users for admin
const getAllUsersForAdmin = catchAsync(async (req, res) => {
  const token = req?.headers?.authorization;
  const splittedToken = token?.split(' ')[1] as string;

  const decodedUser = jwt.verify(
    splittedToken,
    config.jwt_access_secret as string,
  );

  const result = await UserServices.getAllUsersFromDB(
    decodedUser as TDecodedUser,
    req,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All users have been retrieved succesfully',
    data: result,
  });
});

// get all donors
const getAllDonors = catchAsync(async (req, res) => {
  const result = await UserServices.getAllDonorsFromDB(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All donors have been retrieved succesfully',
    data: result,
  });
});

// get single donor by username
const getSingleDonorByUsername = catchAsync(async (req, res) => {
  const result = await UserServices.getSingleDonorByUsernameFromDB(
    req?.params?.username,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donor has been retrieved succesfully',
    data: result,
  });
});

// get single donor by email
const getSingleDonorByEmail = catchAsync(async (req, res) => {
  const result = await UserServices.getSingleDonorByEmailFromDB(
    req?.params?.email,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donor has been retrieved succesfully',
    data: result,
  });
});

// activate or deactivate user by admin
const activateOrInactivateAccount = catchAsync(async (req, res) => {
  const token = req?.headers?.authorization;
  const splittedToken = token?.split(' ')[1] as string;

  const decodedUser = jwt.verify(
    splittedToken,
    config.jwt_access_secret as string,
  );

  const { email, activeStatus, userRole } = req.body;

  const result = await UserServices.activateOrInactivateAccount(
    decodedUser as TDecodedUser,
    email,
    activeStatus,
    userRole,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User account has been updated succesfully',
    data: result,
  });
});

export const UserControllers = {
  registerUser,
  loginUser,
  verifyToken,
  getAccessTokenUsingRefreshToken,
  changePassword,
  updateUserProfile,
  logoutUser,
  getAllUsersForAdmin,
  activateOrInactivateAccount,
  getMyProfile,
  getAllDonors,
  getSingleDonorByUsername,
  getSingleDonorByEmail,
};
