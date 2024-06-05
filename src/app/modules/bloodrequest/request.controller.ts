import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import { BloodRequestServices } from './request.service';

//create blood request
const createBloodRequest = catchAsync(async (req, res) => {
  const result = await BloodRequestServices.createBloodRequestInDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Blood request created successfully',
    data: result,
  });
});

// get blood requests made by me
const getBloodRequestsMadeByMe = catchAsync(async (req, res) => {
  const result = await BloodRequestServices.getBloodRequestsMadeByMe(
    req?.query,
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
  const result = await BloodRequestServices.getBloodRequestsMadeToMe(
    req?.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blood requests made to me fetched successfully',
    data: result,
  });
});

// update blood request status
const updateBloodRequestStatus = catchAsync(async (req, res) => {
  const { bloodRequestId, status } = req?.body;

  const result = await BloodRequestServices.updateBloodRequestStatusInDB(
    bloodRequestId,
    status,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blood request status updated successfully',
    data: result,
  });
});

export const BloodRequestController = {
  createBloodRequest,
  getBloodRequestsMadeByMe,
  getBloodRequestsMadeToMe,
  updateBloodRequestStatus,
};
