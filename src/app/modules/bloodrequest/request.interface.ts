export type TBloodRequest = {
  _id: string;
  requester: {
    name: string;
    username: string;
    email: string;
    isAccountActive: boolean;
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
    name: string;
    username: string;
    email: string;
    isAvailableToDonate: boolean;
    bloodGroup: string;
    isAccountActive: boolean;
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
