import Partner from '../../models/partner.model';
import Category from '../../models/category.model';
import Tag from '../../models/tag.model';
import { IPartner } from '../../models/partner.model';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const createPartner = async (partnerData: Partial<IPartner>): Promise<IPartner> => {
  let prefix = 'PTR'; // Default prefix

  if (partnerData.businessCategory) {
    const category = await Category.findById(partnerData.businessCategory);
    if (category) {
      prefix = category.codePrefix;
    }
  }

  // Generate a random 6-character alphanumeric string
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  const generatedCode = `${prefix}-${randomStr}`;

  // Use provided code or the generated one
  const code = partnerData.code?.toUpperCase() || generatedCode;

  const partner = new Partner({
    ...partnerData,
    code,
    onboarding: {
      basic: true,
      business: false,
      completed: false
    }
  });
  return (await partner.save());
};

export const loginPartner = async (phone: string, code: string) => {
  const partner = await Partner.findOne({ phone, code: code.toUpperCase() }).select('+code');
  if (!partner) {
    throw new Error('Invalid phone number or verification code');
  }

  const token = jwt.sign(
    { id: partner._id, phone: partner.phone },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '30d' }
  );

  // Remove code from the object before returning to controller
  const partnerObj = partner.toObject();
  delete partnerObj.code;

  return {
    partner: partnerObj,
    token
  };
};

export const getPartners = async (): Promise<IPartner[]> => {
  return await Partner.find();
};

export const getPartnerById = async (id: string): Promise<IPartner | null> => {
  return await Partner.findById(id);
};

export const getPartnerDashboardData = async (id: string): Promise<IPartner | null> => {
  return await Partner.findById(id).populate('businessCategory');
};

export const updatePartner = async (id: string, data: Partial<IPartner>): Promise<IPartner | null> => {
  return await Partner.findByIdAndUpdate(id, data, { new: true });
};

export const updateBusinessDetails = async (id: string, businessData: any): Promise<IPartner | null> => {
  return await Partner.findByIdAndUpdate(
    id,
    {
      business: businessData,
      'onboarding.business': true
    },
    { new: true }
  );
};

export const verifyCode = async (id: string, code: string): Promise<IPartner | null> => {
  const partner = await Partner.findById(id).select('+code');
  if (!partner) return null;

  if (partner.code === code.toUpperCase()) {
    partner.onboarding.completed = true;
    const savedPartner = await partner.save();
    const partnerObj = savedPartner.toObject();
    delete partnerObj.code;
    return partnerObj as any;
  }

  throw new Error('Invalid verification code');
};

export const deletePartner = async (id: string): Promise<IPartner | null> => {
  return await Partner.findByIdAndDelete(id);
};

export const checkPartnerExists = async (phone: string): Promise<boolean> => {
  const partner = await Partner.findOne({ phone });
  return !!partner;
};
