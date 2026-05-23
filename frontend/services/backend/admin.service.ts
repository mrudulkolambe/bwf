import Admin from '../../models/admin.model';
import Partner from '../../models/partner.model';
import Category from '../../models/category.model';
import jwt from 'jsonwebtoken';
import { sendAdminOTPEmail } from '@/lib/email-service';

export const requestAdminOTP = async (phoneInput: string, emailInput: string) => {
  const phone = phoneInput.trim();
  const email = emailInput.toLowerCase().trim();

  // If no admin exists in the system, auto-seed a default one
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    const defaultPhone = process.env.ADMIN_DEFAULT_PHONE || '9999999999';
    const defaultEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@bwf.connect';
    
    const newAdmin = new Admin({
      phone: defaultPhone.trim(),
      email: defaultEmail.toLowerCase().trim(),
    });
    await newAdmin.save();
    console.log(`[Admin Seeding] Default admin account created. Phone: ${defaultPhone}, Email: ${defaultEmail}`);
  }

  // Find admin by phone and email
  const admin = await Admin.findOne({ phone, email });
  if (!admin) {
    throw new Error('Admin account with these details does not exist');
  }

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Set expiration to 10 minutes from now
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  admin.otp = otp;
  admin.otpExpires = otpExpires;
  await admin.save();

  // Send the OTP via email
  await sendAdminOTPEmail(email, otp);

  return {
    success: true,
    message: 'Verification code sent to your email',
    code: otp
  };
};

export const verifyAdminOTP = async (phoneInput: string, emailInput: string, otpInput: string) => {
  const phone = phoneInput.trim();
  const email = emailInput.toLowerCase().trim();
  const otp = otpInput.trim();

  // Find admin, including otp and otpExpires fields
  const admin = await Admin.findOne({ phone, email }).select('+otp +otpExpires');
  if (!admin) {
    throw new Error('Invalid admin credentials');
  }

  // Validate OTP and expiration
  if (!admin.otp || admin.otp !== otp) {
    throw new Error('Invalid verification code');
  }

  if (!admin.otpExpires || admin.otpExpires < new Date()) {
    throw new Error('Verification code has expired. Please request a new one.');
  }

  // Clear OTP fields
  admin.otp = undefined;
  admin.otpExpires = undefined;
  await admin.save();

  // Generate JWT token
  const token = jwt.sign(
    { id: admin._id, email: admin.email, phone: admin.phone, role: 'admin' },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '30d' }
  );

  const adminObj = admin.toObject();
  delete adminObj.otp;
  delete adminObj.otpExpires;

  return {
    admin: adminObj,
    token
  };
};

export interface PartnerFilterOptions {
  search?: string;
  category?: string;
  status?: 'all' | 'completed' | 'pending';
  lang?: string;
}

export const getPartners = async (options: PartnerFilterOptions = {}) => {
  const query: any = {};

  // Apply search text
  if (options.search) {
    const searchRegex = new RegExp(options.search.trim(), 'i');
    query.$or = [
      { firstname: searchRegex },
      { lastname: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
      { 'business.name': searchRegex },
      { 'business.location': searchRegex }
    ];
  }

  // Apply category filter
  if (options.category && options.category !== 'all') {
    query.businessCategory = options.category;
  }

  // Apply status filter
  if (options.status && options.status !== 'all') {
    if (options.status === 'completed') {
      query['onboarding.completed'] = true;
    } else if (options.status === 'pending') {
      query['onboarding.completed'] = false;
    }
  }

  const partners = await Partner.find(query)
    .select('+code')
    .populate('businessCategory')
    .sort({ createdAt: -1 });

  const lang = options.lang || 'en';

  return partners.map(partner => {
    const obj = partner.toObject();
    if (obj.businessCategory) {
      const cat = obj.businessCategory;
      if (cat.title && typeof cat.title === 'object') {
        cat.title = cat.title[lang as keyof typeof cat.title] || cat.title.en;
      }
      if (cat.description && typeof cat.description === 'object') {
        cat.description = cat.description[lang as keyof typeof cat.description] || cat.description.en;
      }
    }
    return obj;
  });
};

export const updatePartnerVerification = async (id: string, completed: boolean, lang: string = 'en') => {
  const partner = await Partner.findById(id);
  if (!partner) {
    throw new Error('Partner not found');
  }

  partner.onboarding.completed = completed;
  await partner.save();

  const populated = await Partner.findById(id).select('+code').populate('businessCategory');
  if (!populated) return null;

  const obj = populated.toObject();
  if (obj.businessCategory) {
    const cat = obj.businessCategory;
    if (cat.title && typeof cat.title === 'object') {
      cat.title = cat.title[lang as keyof typeof cat.title] || cat.title.en;
    }
    if (cat.description && typeof cat.description === 'object') {
      cat.description = cat.description[lang as keyof typeof cat.description] || cat.description.en;
    }
  }
  return obj;
};

export const deletePartner = async (id: string, lang: string = 'en') => {
  const partner = await Partner.findById(id).select('+code').populate('businessCategory');
  if (!partner) {
    throw new Error('Partner not found');
  }

  await Partner.findByIdAndDelete(id);

  const obj = partner.toObject();
  if (obj.businessCategory) {
    const cat = obj.businessCategory;
    if (cat.title && typeof cat.title === 'object') {
      cat.title = cat.title[lang as keyof typeof cat.title] || cat.title.en;
    }
    if (cat.description && typeof cat.description === 'object') {
      cat.description = cat.description[lang as keyof typeof cat.description] || cat.description.en;
    }
  }
  return obj;
};
