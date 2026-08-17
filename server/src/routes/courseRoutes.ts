import { Router } from 'express';
import {
  getFilterOptions,
  search,
} from '../controllers/courseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, search);
router.get('/filter-options', protect, getFilterOptions);

export default router;
