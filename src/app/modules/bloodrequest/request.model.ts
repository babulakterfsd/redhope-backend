import { Schema, model } from 'mongoose';
import { TBloodRequest } from './request.interface';

const bloodRequestsSchema = new Schema<TBloodRequest>(
  {
    requester: {
      name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
      },
      username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
      },
      isAccountActive: {
        type: Boolean,
        required: [true, 'isAccountActive is required'],
      },
      location: {
        address: {
          type: String,
          default: '',
        },
        city: {
          type: String,
          default: '',
        },
        state: {
          type: String,
          default: '',
        },
        country: {
          type: String,
          default: '',
        },
        postalCode: {
          type: String,
          default: '',
        },
        mobile: {
          type: String,
          default: '',
        },
      },
    },
    donor: {
      name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
      },
      username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
      },
      isAvailableToDonate: {
        type: Boolean,
        required: [true, 'isAvailableToDonate is required'],
      },
      bloodGroup: {
        type: String,
        required: [true, 'Blood group is required'],
        trim: true,
      },
      isAccountActive: {
        type: Boolean,
        required: [true, 'isAccountActive is required'],
      },
      location: {
        address: {
          type: String,
          default: '',
        },
        city: {
          type: String,
          default: '',
        },
        state: {
          type: String,
          default: '',
        },
        country: {
          type: String,
          default: '',
        },
        postalCode: {
          type: String,
          default: '',
        },
        mobile: {
          type: String,
          default: '',
        },
      },
    },
    agreeToTermsAndConditions: {
      type: Boolean,
      required: [true, 'Agree to terms and conditions is required'],
      default: true,
    },
    requestStatus: {
      type: String,
      enum: {
        values: ['pending', 'accepted', 'rejected'],
        message:
          '{VALUE} is not a valid status. Valid values are pending, accepted, rejected',
      },
      default: 'pending',
    },
    donationInfo: {
      hospitalName: {
        type: String,
        required: [true, 'Hospital name is required'],
        trim: true,
      },
      hospitalAddress: {
        type: String,
        required: [true, 'Hospital address is required'],
        trim: true,
      },
      donationDate: {
        type: String,
        required: [true, 'Donation date is required'],
        trim: true,
      },
      reasonForDonation: {
        type: String,
        required: [true, 'Reason for donation is required'],
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

export const BloodRequestModel = model<TBloodRequest>(
  'bloodrequests',
  bloodRequestsSchema,
);
