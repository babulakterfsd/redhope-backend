/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TLastPassword = {
  oldPassword: string;
  changedAt: Date;
};

export type TChangePasswordData = {
  currentPassword: string;
  newPassword: string;
};

export type TUser = {
  _id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  isAvailableToDonate: boolean;
  bloodGroup: string;
  profileImage?: string;
  isAccountActive: boolean;
  role: 'admin' | 'donor';
  lastTwoPasswords?: TLastPassword[];
  location?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    mobile?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export type TUserProfileDataToBeUpdated = {
  name?: string;
  email?: string;
  username?: string;
  profileImage?: string;
  isAccountActive?: boolean;
  isAvailableToDonate?: boolean;
  location?: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    mobile: string;
  };
};

export type TChangeUserStatus = {
  email: string;
  activeStatus: boolean;
};

export type TUserRole = 'admin' | 'donor';

export type TDecodedUser = {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: TUserRole;
  isAccountActive: boolean;
  isAvailableToDonate: boolean;
  bloodGroup: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    mobile: string;
  };
  profileImage: string;
  iat: number;
  exp: number;
};

//for creating statics
export interface TUserModel extends Model<TUser> {
  isUserExistsWithEmail(email: string): Promise<TUser | null>;
  isUserExistsWithUsername(email: string): Promise<TUser | null>;
}
