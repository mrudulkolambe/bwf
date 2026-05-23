export interface PartnerCategory {
  _id: string;
  title: string;
  description: string;
  codePrefix: string;
}

export interface Partner {
  _id: string;
  firstname: string;
  lastname: string;
  phone: string;
  email?: string;
  code?: string;
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
  businessCategory?: PartnerCategory;
  onboarding: {
    basic: boolean;
    business: boolean;
    completed: boolean;
  };
  createdAt: string;
  updatedAt: string;
}
