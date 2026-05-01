import express from 'express';
import userRoutes from './user.routes';
import partnerRoutes from './partner.routes';
import categoryRoutes from './category.routes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/partners', partnerRoutes);
router.use('/categories', categoryRoutes);

export default router;
