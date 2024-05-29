/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unsafe-optional-chaining */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/AppError';

import { Request } from 'express';

import {
  TChangePasswordData,
  TDecodedUser,
  TLastPassword,
  TUser,
  TUserProfileDataToBeUpdated,
  TUserRole,
} from './auth.interface';
import { UserModel } from './auth.model';

//create user in DB
const registerUserInDB = async (user: TUser) => {
  const isUserExistsWithEmail = await UserModel.isUserExistsWithEmail(
    user?.email,
  );
  const isUserExistsWithUsername = await UserModel.isUserExistsWithUsername(
    user?.username,
  );

  user = {
    ...user,
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      mobile: '',
    },
    role: 'donor',
    isAvailableToDonate: true,
    isAccountActive: true,
  };

  if (isUserExistsWithEmail) {
    throw new Error(
      'User with this email already exists, please try with different  email.',
    );
  } else if (isUserExistsWithUsername) {
    throw new Error(
      'User with this username already exists, please try with different  username.',
    );
  } else {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      // transaction - 1
      const newUser = await UserModel.create([user], {
        session,
      });

      await session.commitTransaction();
      await session.endSession();

      if (newUser.length < 1) {
        throw new Error('Registration failed !');
      }

      return newUser[0];
    } catch (err: any) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error(err);
    }
  }
};

// login suser in DB
const loginUserInDB = async (user: TUser) => {
  const isUserExistsWithEmail = await UserModel.isUserExistsWithEmail(
    user?.email,
  );
  const userFromDB = await UserModel.findOne({
    email: user?.email,
  });

  if (!isUserExistsWithEmail) {
    throw new Error('No user found with this email');
  }

  if (userFromDB?.isAccountActive === false) {
    throw new Error('User account is inactive, please contact admin');
  }

  const isPasswordMatched = await bcrypt.compare(
    user?.password,
    userFromDB?.password as string,
  );
  if (!isPasswordMatched) {
    throw new Error('Incorrect password');
  }

  //create token and send it to client side
  const payload = {
    _id: userFromDB?._id,
    name: userFromDB?.name,
    username: userFromDB?.username,
    email: userFromDB?.email,
    role: userFromDB?.role,
    isAccountActive: userFromDB?.isAccountActive,
    isAvailableToDonate: userFromDB?.isAvailableToDonate,
    bloodGroup: userFromDB?.bloodGroup,
    profileImage: userFromDB?.profileImage,
    location: userFromDB?.location,
  };

  const accesstoken = jwt.sign(payload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expires_in,
  });

  const refreshfToken = jwt.sign(payload, config.jwt_refresh_secret as string, {
    expiresIn: config.jwt_refresh_expires_in,
  });

  return {
    accesstoken,
    refreshfToken,
    userFromDB,
  };
};

//verify token from client side
const verifyToken = async (token: string) => {
  if (!token) {
    return false;
  }

  // checking token is valid or not
  let decodedUser: JwtPayload | string;

  try {
    decodedUser = jwt.verify(
      token as string,
      config.jwt_access_secret as string,
    ) as JwtPayload;
  } catch (error) {
    return false;
  }

  const { email } = decodedUser as JwtPayload;

  // checking if the user exists
  const user = await UserModel.isUserExistsWithEmail(email);

  if (!user) {
    return false;
  }

  return true;
};

//generate refresh token
const getAccessTokenByRefreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Refresh token is required');
  }

  // checking token is valid or not
  let decodedUser: JwtPayload | string;

  try {
    decodedUser = jwt.verify(
      token as string,
      config.jwt_refresh_secret as string,
    ) as JwtPayload;
  } catch (error) {
    throw new JsonWebTokenError('Unauthorized Access!');
  }

  const { _id, name, role, email, isAccountActive } = decodedUser as JwtPayload;

  // checking if the user exists
  const userFromDB = await UserModel.isUserExistsWithEmail(email);

  if (!userFromDB) {
    throw new AppError(httpStatus.NOT_FOUND, 'Unauthorized Access!');
  }

  const payload = {
    _id: userFromDB?._id,
    name: userFromDB?.name,
    username: userFromDB?.username,
    email: userFromDB?.email,
    role: userFromDB?.role,
    isAccountActive: userFromDB?.isAccountActive,
    isAvailableToDonate: userFromDB?.isAvailableToDonate,
    bloodGroup: userFromDB?.bloodGroup,
    profileImage: userFromDB?.profileImage,
    location: userFromDB?.location,
  };

  const accessToken = jwt.sign(payload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expires_in,
  });

  return {
    accessToken,
  };
};

// change password
const changePasswordInDB = async (
  passwordData: TChangePasswordData,
  user: TDecodedUser,
) => {
  const { currentPassword, newPassword } = passwordData;

  // check if the user exists in the database
  const userFromDB = await UserModel.findOne({
    email: user?.email,
  });
  if (!userFromDB) {
    throw new JsonWebTokenError('Unauthorized Access!');
  }

  if (
    userFromDB?.email === 'babulakterfsd@gmail.com' ||
    userFromDB?.email === 'xpawal@gmail.com'
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Password change is not allowed for this demo account. Please create your own account to check this feature.',
    );
  }

  const currentAccesstokenIssuedAt = user?.iat * 1000;

  let lastPasswordChangedAt: Date | number = userFromDB?.lastTwoPasswords?.[1]
    ?.changedAt
    ? (userFromDB?.lastTwoPasswords?.[1]?.changedAt as Date)
    : (userFromDB?.lastTwoPasswords?.[0]?.changedAt as Date);

  //convert lastPasswordChangedAt to miliseconds
  lastPasswordChangedAt = new Date(lastPasswordChangedAt as Date).getTime();

  if (userFromDB?.lastTwoPasswords?.length === 0) {
    lastPasswordChangedAt = (userFromDB?.createdAt as Date).getTime();
  }

  if (currentAccesstokenIssuedAt < lastPasswordChangedAt) {
    // throw new JsonWebTokenError('Unauthorized Access!');
    return {
      statusCode: 406,
      status: 'failed',
      message: 'Recent password change detected.',
    };
  }

  // check if the current password the user gave is correct
  const isPasswordMatched = await bcrypt.compare(
    currentPassword,
    userFromDB.password,
  );
  if (!isPasswordMatched) {
    throw new Error('Current password does not match');
  }

  // Check if new password is the same as the current one
  const isSameAsCurrent = currentPassword === newPassword;
  if (isSameAsCurrent) {
    throw new Error('New password must be different from the current password');
  }

  // Check if the new password is the same as the last two passwords
  const isSameAsLastTwoPasswords = userFromDB?.lastTwoPasswords?.some(
    (password: TLastPassword) => {
      return bcrypt.compareSync(newPassword, password.oldPassword);
    },
  );

  if (isSameAsLastTwoPasswords) {
    const lastUsedDate = userFromDB?.lastTwoPasswords?.[0]?.changedAt;
    const formattedLastUsedDate = lastUsedDate
      ? new Date(lastUsedDate).toLocaleString()
      : 'unknown';

    throw new Error(
      `Password change failed. Ensure the new password is unique and not among the last 2 used (last used on ${formattedLastUsedDate}).`,
    );
  }

  // Check if the new password meets the minimum requirements

  if (newPassword.length < 6 || !/\d/.test(newPassword)) {
    throw new Error(
      'New password must be minimum 6 characters and include both letters and numbers',
    );
  }

  // Update the password and keep track of the last two passwords
  const hashedNewPassword = await bcrypt.hash(newPassword, 12);

  const newLastTwoPasswords = () => {
    if (userFromDB?.lastTwoPasswords?.length === 0) {
      return [{ oldPassword: userFromDB?.password, changedAt: new Date() }];
    } else if (userFromDB?.lastTwoPasswords?.length === 1) {
      return [
        ...userFromDB?.lastTwoPasswords,
        { oldPassword: userFromDB?.password, changedAt: new Date() },
      ];
    } else if (userFromDB?.lastTwoPasswords?.length === 2) {
      return [
        userFromDB?.lastTwoPasswords[1],
        { oldPassword: userFromDB?.password, changedAt: new Date() },
      ];
    }
  };

  const result = await UserModel.findOneAndUpdate(
    { email: userFromDB?.email },
    {
      password: hashedNewPassword,
      lastTwoPasswords: newLastTwoPasswords(),
    },
    {
      new: true,
    },
  );

  if (!result) {
    throw new Error('Password change failed');
  }

  const modifiedResult = {
    _id: result?._id,
    name: result?.name,
    username: result?.username,
    email: result?.email,
    role: result?.role,
  };

  return modifiedResult;
};

//update user profile
const updateUserProfileInDB = async (
  user: TDecodedUser,
  dataToBeUpdated: TUserProfileDataToBeUpdated,
) => {
  const userFromDB = await UserModel.findOne({
    email: user?.email,
  });

  if (!userFromDB) {
    throw new JsonWebTokenError('Unauthorized Access!');
  }

  if (dataToBeUpdated?.email) {
    if (
      user?.email === 'babulakterfsd@gmail.com' ||
      user?.email === 'xpawal@gmail.com'
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Update email is not allowed for this demo account. Please create your own account to check this feature.',
      );
    }
  }

  const {
    name,
    username,
    email,
    profileImage,
    isAccountActive,
    isAvailableToDonate,
    location,
  } = dataToBeUpdated;

  const result = await UserModel.findOneAndUpdate(
    { email: userFromDB?.email },
    {
      name: name ? name : userFromDB?.name,
      username: username ? username : userFromDB?.username,
      email: email ? email : userFromDB?.email,
      profileImage: profileImage ? profileImage : userFromDB?.profileImage,
      isAccountActive: isAccountActive
        ? isAccountActive
        : userFromDB?.isAccountActive,
      isAvailableToDonate: isAvailableToDonate
        ? isAvailableToDonate
        : userFromDB?.isAvailableToDonate,
      location: location
        ? {
            address: location.address
              ? location.address
              : userFromDB?.location?.address,
            city: location.city ? location.city : userFromDB?.location?.city,
            state: location.state
              ? location.state
              : userFromDB?.location?.state,
            postalCode: location.postalCode
              ? location.postalCode
              : userFromDB?.location?.postalCode,
            country: location.country
              ? location.country
              : userFromDB?.location?.country,
            mobile: location.mobile
              ? location.mobile
              : userFromDB?.location?.mobile,
          }
        : userFromDB?.location,
    },
    {
      new: true,
    },
  );

  if (!result) {
    throw new Error('Update failed');
  }

  const modifiedResult = {
    _id: result?._id,
    name: result?.name,
    username: result?.username,
    email: result?.email,
    role: result?.role,
    profileImage: result?.profileImage,
    isAccountActive: result?.isAccountActive,
    isAvailableToDonate: result?.isAvailableToDonate,
    location: result?.location,
  };

  return modifiedResult;
};

//logout user from db
const logoutUserInDB = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Token is required');
  }

  // checking token is valid or not
  let decodedUser: JwtPayload | string;

  try {
    decodedUser = jwt.verify(
      token as string,
      config.jwt_access_secret as string,
    ) as JwtPayload;
  } catch (error) {
    throw new JsonWebTokenError('Unauthorized Access!');
  }
  const { email } = decodedUser as JwtPayload;

  // checking if the user exists
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'Unauthorized Access!');
  }

  return true;
};

// get all users for admin to manage
const getAllUsersFromDB = async (decodedUser: TDecodedUser, req: Request) => {
  const { role } = decodedUser;
  if (role !== 'admin') {
    throw new Error('Unauthorized Access');
  }

  const { page, limit, search } = req?.query;
  const totalDocs = await UserModel.countDocuments();

  const meta = {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    total: totalDocs,
  };

  //implement pagination
  const pageToBeFetched = Number(page) || 1;
  const limitToBeFetched = Number(limit) || 10;
  const skip = (pageToBeFetched - 1) * limitToBeFetched;

  // search by name or email
  const filter: Record<string, any> = {};

  if (search) {
    filter.$or = [
      { name: new RegExp(String(search), 'i') },
      { email: new RegExp(String(search), 'i') },
    ];
  }

  const result = await UserModel.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitToBeFetched);

  return {
    meta,
    data: result?.map((user) => {
      return {
        _id: user?._id,
        name: user?.name,
        username: user?.username,
        email: user?.email,
        role: user?.role,
        profileImage: user?.profileImage,
        isAccountActive: user?.isAccountActive,
        isAvailableToDonate: user?.isAvailableToDonate,
        location: user?.location,
        bloodGroup: user?.bloodGroup,
      };
    }),
  };
};

// activate or inactivate an user by admin
const activateOrInactivateAccount = async (
  decodedUser: TDecodedUser,
  email: string,
  activeStatus: boolean,
  userRole: TUserRole,
) => {
  const { role: decodedUserRole } = decodedUser;
  if (decodedUserRole !== 'admin') {
    throw new Error('Unauthorized Access');
  }

  const user = await UserModel.findOne({
    email,
  });

  if (!user) {
    throw new Error('User not found');
  }

  user.isAccountActive =
    activeStatus !== undefined ? activeStatus : user?.isAccountActive;
  user.role = userRole !== undefined ? userRole : user?.role;
  await user.save();

  return {
    _id: user?._id,
    name: user?.name,
    username: user?.username,
    email: user?.email,
    role: user?.role,
    profileImage: user?.profileImage,
    isAccountActive: user?.isAccountActive,
    isAvailableToDonate: user?.isAvailableToDonate,
    location: user?.location,
    bloodGroup: user?.bloodGroup,
  };
};

// get my profile
const getMyProfile = async (decodedUser: TDecodedUser) => {
  const user = await UserModel.findOne({
    email: decodedUser?.email,
  });

  if (!user) {
    throw new JsonWebTokenError('Unauthorized Access!');
  }

  return {
    _id: user?._id,
    name: user?.name,
    username: user?.username,
    email: user?.email,
    role: user?.role,
    profileImage: user?.profileImage,
    isAccountActive: user?.isAccountActive,
    isAvailableToDonate: user?.isAvailableToDonate,
    location: user?.location,
    bloodGroup: user?.bloodGroup,
  };
};

export const UserServices = {
  registerUserInDB,
  loginUserInDB,
  verifyToken,
  getAccessTokenByRefreshToken,
  changePasswordInDB,
  updateUserProfileInDB,
  logoutUserInDB,
  getAllUsersFromDB,
  activateOrInactivateAccount,
  getMyProfile,
};
