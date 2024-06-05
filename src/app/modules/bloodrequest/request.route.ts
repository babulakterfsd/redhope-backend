import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BloodRequestController } from './request.controller';
import { bloodRequestValidationSchema } from './request.validation';

const router = express.Router();

// create blood request
router.post(
  '/create-blood-request',
  validateRequest(bloodRequestValidationSchema),
  BloodRequestController.createBloodRequest,
);

// get blood requests made by me
router.get(
  '/requests-made-by-me',
  BloodRequestController.getBloodRequestsMadeByMe,
);

// get blood requests made to me
router.get(
  '/requests-made-to-me',
  BloodRequestController.getBloodRequestsMadeToMe,
);

export const BloodRequestRoutes = router;
