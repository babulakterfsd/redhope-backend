import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import { TUser, TUserModel } from './auth.interface';

const userSchema = new Schema<TUser, TUserModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate: {
        validator: (value: string) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: (props) => `${props.value} is not a valid email address`,
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password should be at least 6 characters long'],
      validate: {
        validator: (value: string) => {
          // Password must contain at least one letter and one numeric character
          const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])/;
          return passwordRegex.test(value);
        },
        message: () =>
          'Password should contain at least one letter and one numeric character',
      },
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'donor'],
        message:
          '{VALUE} is not a valid role. User must be either admin or donor',
      },
      default: 'donor',
    },
    profileImage: {
      type: String,
      default: '',
    },
    lastTwoPasswords: [
      {
        oldPassword: String,
        changedAt: Date,
      },
    ],
    isAccountActive: {
      type: Boolean,
      required: [true, 'isAccountActive is required'],
      default: true,
    },
    isAvailableToDonate: {
      type: Boolean,
      required: [true, 'isAvailableToDonate is required'],
      default: true,
    },
    bloodGroup: {
      type: String,
      enum: {
        values: [
          'A-positive',
          'A-negative',
          'B-positive',
          'B-negative',
          'AB-positive',
          'AB-negative',
          'O-positive',
          'O-negative',
        ],
        message: '{VALUE} is not a valid blood group',
      },
      required: [true, 'Blood group is required'],
    },
    location: {
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
      postalCode: {
        type: String,
      },
      mobile: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
      },
    },
  },
);

// hashing the password before saving it to the database
userSchema.pre<TUser>('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});

// another layer of making sure that the password is not returned in the response
userSchema.post<TUser>('save', function (doc, next) {
  doc.password = '';

  next();
});

//custom static method to check if the user exists or not
userSchema.statics.isUserExistsWithEmail = async function (email: string) {
  const userFoundWithEmail = await UserModel.findOne({ email });
  return userFoundWithEmail;
};
userSchema.statics.isUserExistsWithUsername = async function (
  username: string,
) {
  const userFoundWithUsername = await UserModel.findOne({ username });
  return userFoundWithUsername;
};

export const UserModel = model<TUser, TUserModel>('users', userSchema);
