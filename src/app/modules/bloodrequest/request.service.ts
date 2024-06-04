/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unsafe-optional-chaining */

import { TDecodedUser } from '../authentication/auth.interface';
import { TBloodRequest } from './request.interface';
import { BloodRequestModel } from './request.model';

// create a blood request
const createBloodRequestInDB = async (
  decodedUser: TDecodedUser,
  bloodRequestData: TBloodRequest,
) => {
  const { requester, donor } = bloodRequestData;

  // check if logged in user is requester or not
  if (decodedUser.username !== requester.username) {
    throw new Error(
      'RedHope does not allow you to create blood request for others. Only you can create blood request for yourself.',
    );
  }

  // check if requester and donor are same
  if (requester.username === donor.username) {
    throw new Error('Requester and donor cannot be same');
  }
  // check if donor is available to donate
  if (!donor.isAvailableToDonate) {
    throw new Error('Donor is not available to donate');
  }
  // check if donor is active
  if (!donor.isAccountActive) {
    throw new Error('Donor is not active');
  }

  // check if requester has already pending request to this donor
  const isPendingRequestAlreadyExists = await BloodRequestModel.findOne({
    'requester.username': requester.username,
    'donor.username': donor.username,
    requestStatus: 'pending',
  });

  if (isPendingRequestAlreadyExists) {
    throw new Error('Requester already has pending request to this donor');
  }

  // create request
  const result = BloodRequestModel.create(bloodRequestData);

  if (!result) {
    throw new Error('Error in creating blood request');
  }

  return result;
};

// get blood requests made by me
const getBloodRequestsMadeByMe = async (decodedUser: TDecodedUser) => {
  const bloodRequests = await BloodRequestModel.find({
    'requester._id': decodedUser._id,
  });

  return bloodRequests;
};

// get blood requests made to me
const getBloodRequestsMadeToMe = async (decodedUser: TDecodedUser) => {
  const bloodRequests = await BloodRequestModel.find({
    'donor._id': decodedUser._id,
  });

  return bloodRequests;
};

export const BloodRequestServices = {
  createBloodRequestInDB,
  getBloodRequestsMadeByMe,
  getBloodRequestsMadeToMe,
};
