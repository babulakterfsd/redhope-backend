import { z } from 'zod';

export const bloodRequestValidationSchema = z.object({
  requester: z.object({
    _id: z.string({
      invalid_type_error: 'Requester ID must be a string',
      required_error: 'Requester ID is required',
    }),
    name: z.string({
      invalid_type_error: 'Requester name must be a string',
      required_error: 'Requester name is required',
    }),
    username: z.string({
      invalid_type_error: 'Requester username must be a string',
      required_error: 'Requester username is required',
    }),
    email: z.string({
      invalid_type_error: 'Requester email must be a string',
      required_error: 'Requester email is required',
    }),
    isAvailableToDonate: z.boolean({
      invalid_type_error: 'Requester isAvailableToDonate must be a boolean',
      required_error: 'Requester isAvailableToDonate is required',
    }),
    bloodGroup: z.string({
      invalid_type_error: 'Requester bloodGroup must be a string',
      required_error: 'Requester bloodGroup is required',
    }),
    profileImage: z.string({
      invalid_type_error: 'Requester profileImage must be a string',
    }),
    isAccountActive: z.boolean({
      invalid_type_error: 'Requester isAccountActive must be a boolean',
      required_error: 'Requester isAccountActive is required',
    }),
    role: z.string({
      invalid_type_error: 'Requester role must be a string',
      required_error: 'Requester role is required',
    }),
    location: z.object({
      address: z.string({
        invalid_type_error: 'Requester location address must be a string',
      }),
      city: z.string({
        invalid_type_error: 'Requester location city must be a string',
      }),
      state: z.string({
        invalid_type_error: 'Requester location state must be a string',
      }),
      country: z.string({
        invalid_type_error: 'Requester location country must be a string',
      }),
      postalCode: z.string({
        invalid_type_error: 'Requester location postalCode must be a string',
      }),
      mobile: z.string({
        invalid_type_error: 'Requester location mobile must be a string',
      }),
    }),
  }),
  donationInfo: z.object({
    hospitalName: z.string({
      invalid_type_error: 'Donation hospitalName must be a string',
      required_error: 'Donation hospitalName is required',
    }),
    hospitalAddress: z.string({
      invalid_type_error: 'Donation hospitalAddress must be a string',
      required_error: 'Donation hospitalAddress is required',
    }),
    donationDate: z.string({
      invalid_type_error: 'Donation donationDate must be a string',
      required_error: 'Donation donationDate is required',
    }),
    reasonForDonation: z.string({
      invalid_type_error: 'Donation reasonForDonation must be a string',
      required_error: 'Donation reasonForDonation is required',
    }),
  }),
  donor: z.object({
    _id: z.string({
      invalid_type_error: 'Donor ID must be a string',
      required_error: 'Donor ID is required',
    }),
    name: z.string({
      invalid_type_error: 'Donor name must be a string',
      required_error: 'Donor name is required',
    }),
    username: z.string({
      invalid_type_error: 'Donor username must be a string',
      required_error: 'Donor username is required',
    }),
    email: z.string({
      invalid_type_error: 'Donor email must be a string',
      required_error: 'Donor email is required',
    }),
    isAvailableToDonate: z.boolean({
      invalid_type_error: 'Donor isAvailableToDonate must be a boolean',
      required_error: 'Donor isAvailableToDonate is required',
    }),
    bloodGroup: z.string({
      invalid_type_error: 'Donor bloodGroup must be a string',
      required_error: 'Donor bloodGroup is required',
    }),
    profileImage: z.string({
      invalid_type_error: 'Donor profileImage must be a string',
    }),
    isAccountActive: z.boolean({
      invalid_type_error: 'Donor isAccountActive must be a boolean',
      required_error: 'Donor isAccountActive is required',
    }),
    role: z.string({
      invalid_type_error: 'Donor role must be a string',
      required_error: 'Donor role is required',
    }),
    location: z.object({
      address: z.string({
        invalid_type_error: 'Donor location address must be a string',
      }),
      city: z.string({
        invalid_type_error: 'Donor location city must be a string',
      }),
      state: z.string({
        invalid_type_error: 'Donor location state must be a string',
      }),
      country: z.string({
        invalid_type_error: 'Donor location country must be a string',
      }),
      postalCode: z.string({
        invalid_type_error: 'Donor location postalCode must be a string',
      }),
      mobile: z.string({
        invalid_type_error: 'Donor location mobile must be a string',
      }),
    }),
  }),
  agreeToTermsAndConditions: z.boolean({
    invalid_type_error: 'Agree to terms and conditions must be a boolean',
    required_error: 'Agree to terms and conditions is required',
  }),
  requestStatus: z.enum(['pending', 'accepted', 'rejected'], {
    invalid_type_error: ' must be a valid blood group',
    required_error: ' is required',
  }),
});
