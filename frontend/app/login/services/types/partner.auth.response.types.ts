export interface Partner {
  id: string;
  firstname: string;
  lastname: string;
  phone: string;
  email?: string;
  available: boolean;
  business?: {
    name?: string;
    coordinates?: {
      lat?: number;
      lng?: number;
    };
    location?: string;
    tags?: string[];
  };
  businessCategory?: string;
  onboarding: {
    basic: boolean;
    business: boolean;
    completed: boolean;
  };
}

export interface PartnerAuthResponse {
  token: string;
  partner: Partner;
}
