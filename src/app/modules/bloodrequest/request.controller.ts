import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import { TDecodedUser } from '../authentication/auth.interface';
import { BloodRequestServices } from './request.service';

//create blood request
const createBloodRequest = catchAsync(async (req, res) => {
  const token = req?.headers?.authorization;
  const splittedToken = token?.split(' ')[1] as string;

  const decodedUser = jwt.verify(
    splittedToken,
    config.jwt_access_secret as string,
  );

  const result = await BloodRequestServices.createBloodRequestInDB(
    decodedUser as TDecodedUser,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Blood request created successfully',
    data: result,
  });
});

// get blood requests made by me
const getBloodRequestsMadeByMe = catchAsync(async (req, res) => {
  const token = req?.headers?.authorization;
  const splittedToken = token?.split(' ')[1] as string;

  const decodedUser = jwt.verify(
    splittedToken,
    config.jwt_access_secret as string,
  );

  const result = await BloodRequestServices.getBloodRequestsMadeByMe(
    decodedUser as TDecodedUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blood requests made by me fetched successfully',
    data: result,
  });
});

// get blood requests made to me
const getBloodRequestsMadeToMe = catchAsync(async (req, res) => {
  const token = req?.headers?.authorization;
  const splittedToken = token?.split(' ')[1] as string;

  const decodedUser = jwt.verify(
    splittedToken,
    config.jwt_access_secret as string,
  );

  const result = await BloodRequestServices.getBloodRequestsMadeToMe(
    decodedUser as TDecodedUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blood requests made to me fetched successfully',
    data: result,
  });
});

export const BloodRequestController = {
  createBloodRequest,
  getBloodRequestsMadeByMe,
  getBloodRequestsMadeToMe,
};
