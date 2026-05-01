import express from 'express';
import * as partnerController from '../controllers/partner.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/login', partnerController.login);
router.post('/check-phone', partnerController.checkPhone);
router.post('/', partnerController.createPartner);
router.get('/', partnerController.getPartners);
router.get('/:id', partnerController.getPartnerById);

// Protected routes
router.get('/me', protect, partnerController.getMe);
router.put('/business', protect, partnerController.updateBusiness);
router.post('/verify-code', protect, partnerController.verifyCode);
router.put('/:id', protect, partnerController.updatePartner);
router.delete('/:id', protect, partnerController.deletePartner);

export default router;
