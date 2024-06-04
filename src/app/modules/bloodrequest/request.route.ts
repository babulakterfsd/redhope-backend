import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BloodRequestController } from './request.controller';
import { bloodRequestValidationSchema } from './request.validation';

const router = express.Router();

// create blood request
router.post(
  '/create-blood-request',
  auth('admin', 'donor'),
  validateRequest(bloodRequestValidationSchema),
  BloodRequestController.createBloodRequest,
);

// get blood requests made by me
router.get(
  '/requests-made-by-me',
  auth('admin', 'donor'),
  BloodRequestController.getBloodRequestsMadeByMe,
);

// get blood requests made to me
router.get(
  '/requests-made-to-me',
  auth('admin', 'donor'),
  BloodRequestController.getBloodRequestsMadeToMe,
);

export const BloodRequestRoutes = router;
