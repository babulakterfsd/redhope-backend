import { z } from 'zod';

export const userSchema = z.object({
  name: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  username: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  email: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  password: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  isAvailableToDonate: z.string({
    invalid_type_error: ' must be true or false',
    required_error: ' is required',
  }),
  role: z.enum(['admin', 'donor'], {
    invalid_type_error: 'User must be either admin or donor',
    required_error: ' is required',
  }),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
    invalid_type_error: ' must be a valid blood group',
    required_error: ' is required',
  }),
  lastTwoPasswords: z
    .array(
      z
        .object({
          oldPassword: z
            .string({
              invalid_type_error: ' must be string',
              required_error: ' is required',
            })
            .optional(),
          changedAt: z
            .date({
              invalid_type_error: ' must be a valid date',
              required_error: ' is required',
            })
            .optional(),
        })
        .optional(),
    )
    .optional(),
  profileImage: z
    .string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    })
    .optional(),

  isAccountActive: z.boolean({
    invalid_type_error: ' must be boolean',
    required_error: ' is required',
  }),
  location: z
    .object({
      address: z.string({
        invalid_type_error: ' must be string',
      }),
      city: z.string({
        invalid_type_error: ' must be string',
      }),
      state: z.string({
        invalid_type_error: ' must be string',
      }),
      country: z.string({
        invalid_type_error: ' must be string',
      }),
      postalCode: z.string({
        invalid_type_error: ' must be string',
      }),
      mobile: z.string({
        invalid_type_error: ' must be string',
      }),
    })
    .optional(),
});

export const signupSchema = z.object({
  name: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  username: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  email: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  password: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  isAvailableToDonate: z.enum(['true', 'false'], {
    invalid_type_error: ' must be true or false',
    required_error: ' is required',
  }),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
    invalid_type_error: ' must be a valid blood group',
    required_error: ' is required',
  }),
});

export const loginSchema = z.object({
  email: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  password: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  newPassword: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
});

export const updateProfileSchema = z.object({
  name: z
    .string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    })
    .optional(),
  username: z
    .string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    })
    .optional(),
  email: z
    .string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    })
    .optional(),
  profileImage: z
    .string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    })
    .optional(),
  isAccountActive: z
    .boolean({
      invalid_type_error: ' must be boolean',
      required_error: ' is required',
    })
    .optional(),
  isAvailableToDonate: z
    .boolean({
      invalid_type_error: ' must be true or false',
      required_error: ' is required',
    })
    .optional(),

  location: z
    .object({
      address: z
        .string({
          invalid_type_error: ' must be string',
        })
        .optional(),
      city: z
        .string({
          invalid_type_error: ' must be string',
        })
        .optional(),
      state: z
        .string({
          invalid_type_error: ' must be string',
        })
        .optional(),
      country: z
        .string({
          invalid_type_error: ' must be string',
        })
        .optional(),
      postalCode: z
        .string({
          invalid_type_error: ' must be string',
        })
        .optional(),
      mobile: z
        .string({
          invalid_type_error: ' must be string',
        })
        .optional(),
    })
    .optional(),
});
