import type { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as partnerService from '../services/partner.service';

export const login = async (req: Request, res: Response) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) {
      return res.status(400).json({ message: 'Phone number and code are required', data: null });
    }
    const result = await partnerService.loginPartner(phone, code);
    res.status(200).json({
      message: 'Login successful',
      data: result
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message || 'Login failed', data: null });
  }
};

export const createPartner = async (req: Request, res: Response) => {
  try {
    const partner = await partnerService.createPartner(req.body);
    const result = await partnerService.loginPartner(partner.phone, partner.code as string);
    res.status(201).json({
      message: 'Partner created successfully',
      data: {
        token: result.token,
        partner: result.partner
      }
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error creating partner', data: null });
  }
};

export const getPartners = async (req: Request, res: Response) => {
  try {
    const partners = await partnerService.getPartners();
    res.status(200).json({
      message: 'Partners fetched successfully',
      data: partners
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching partners', data: null });
  }
};

export const getPartnerById = async (req: Request, res: Response) => {
  try {
    const partner = await partnerService.getPartnerById(req.params.id as string);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found', data: null });
    }
    res.status(200).json({
      message: 'Partner fetched successfully',
      data: partner
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching partner', data: null });
  }
};

export const updatePartner = async (req: Request, res: Response) => {
  try {
    const partner = await partnerService.updatePartner(req.params.id as string, req.body);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found', data: null });
    }
    res.status(200).json({
      message: 'Partner updated successfully',
      data: partner
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error updating partner', data: null });
  }
};

export const deletePartner = async (req: Request, res: Response) => {
  try {
    const partner = await partnerService.deletePartner(req.params.id as string);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found', data: null });
    }
    res.status(200).json({
      message: 'Partner deleted successfully',
      data: null
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error deleting partner', data: null });
  }
};

export const updateBusiness = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const partner = await partnerService.updateBusinessDetails(
      authReq.partner.id,
      req.body
    );
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found', data: null });
    }
    res.status(200).json({
      message: 'Business details updated successfully',
      data: partner
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error updating business details', data: null });
  }
};

export const verifyCode = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const { code } = req.body;
    const partner = await partnerService.verifyCode(authReq.partner.id, code);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found', data: null });
    }
    res.status(200).json({
      message: 'Code verified successfully',
      data: partner
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Verification failed', data: null });
  }
};

export const checkPhone = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: 'Phone number is required', data: null });
    }
    const exists = await partnerService.checkPartnerExists(phoneNumber);
    res.status(200).json({
      success: true,
      message: exists ? 'User exists' : 'User does not exist',
      data: { exists }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error checking phone', data: null });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const partner = await partnerService.getPartnerById(authReq.partner.id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found', data: null });
    }
    res.status(200).json({
      success: true,
      message: 'Profile fetched successfully',
      data: partner
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching profile', data: null });
  }
};
