export type TBloodRequest = {
  _id: string;
  requester: {
    _id: string;
    name: string;
    username: string;
    email: string;
    isAvailableToDonate: boolean;
    bloodGroup: string;
    profileImage?: string;
    isAccountActive: boolean;
    role: 'admin' | 'donor';
    location?: {
      address?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
      mobile?: string;
    };
  };
  donationInfo: {
    hospitalName: string;
    hospitalAddress: string;
    donationDate: string;
    reasonForDonation: string;
  };
  donor: {
    _id: string;
    name: string;
    username: string;
    email: string;
    isAvailableToDonate: boolean;
    bloodGroup: string;
    profileImage?: string;
    isAccountActive: boolean;
    role: 'admin' | 'donor';
    location?: {
      address?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
      mobile?: string;
    };
  };
  agreeToTermsAndConditions: boolean;
  requestStatus: 'pending' | 'accepted' | 'rejected';
};
