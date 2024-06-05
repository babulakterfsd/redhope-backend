/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unsafe-optional-chaining */

import { TBloodRequest } from './request.interface';
import { BloodRequestModel } from './request.model';

// create a blood request
const createBloodRequestInDB = async (bloodRequestData: TBloodRequest) => {
  const { requester, donor } = bloodRequestData;

  // check if requester and donor are same
  if (requester.username === donor.username) {
    throw new Error('You can not request blood from yourself');
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
const getBloodRequestsMadeByMe = async (reqQuery: any) => {
  const { page, limit, requesterEmail } = reqQuery;

  const totalDocs = await BloodRequestModel.countDocuments({
    'requester.email': requesterEmail,
  });
  const meta = {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    total: totalDocs,
  };

  //implement pagination
  const pageToBeFetched = Number(page) || 1;
  const limitToBeFetched = Number(limit) || 10;
  const skip = (pageToBeFetched - 1) * limitToBeFetched;

  const bloodRequests = await BloodRequestModel.find({
    'requester.email': requesterEmail,
  })
    .skip(skip)
    .limit(limitToBeFetched);

  return {
    meta,
    bloodRequests,
  };
};

// get blood requests made to me
const getBloodRequestsMadeToMe = async (reqQuery: any) => {
  const { page, limit, donorEmail } = reqQuery;

  const totalDocs = await BloodRequestModel.countDocuments({
    'donor.email': donorEmail,
  });
  const meta = {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    total: totalDocs,
  };

  //implement pagination
  const pageToBeFetched = Number(page) || 1;
  const limitToBeFetched = Number(limit) || 10;
  const skip = (pageToBeFetched - 1) * limitToBeFetched;

  const bloodRequests = await BloodRequestModel.find({
    'donor.email': donorEmail,
  })
    .skip(skip)
    .limit(limitToBeFetched);

  return {
    meta,
    bloodRequests,
  };
};

export const BloodRequestServices = {
  createBloodRequestInDB,
  getBloodRequestsMadeByMe,
  getBloodRequestsMadeToMe,
};
