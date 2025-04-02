import express from 'express';
import {
  getResources,
  getResourceById,
  updateResource,
  searchResources,
  getRecentUpdates,
  createResource,
  importResources
} from '../controllers/resourceController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { Role } from '@prisma/client';
import {
  getResourcesRules,
  resourceIdRule,
  updateResourceRules,
  searchResourcesRules,
  getUpdatesRules,
  createResourceRules,
  validate
} from '../middleware/validators.js';

const router = express.Router();

// Public Routes
router.get('/', getResourcesRules(), validate, getResources);
router.get('/search', searchResourcesRules(), validate, searchResources);
router.get('/updates', getUpdatesRules(), validate, getRecentUpdates);
router.get('/:id', resourceIdRule(), validate, getResourceById);

// Private Routes (Requires Login)
router.post(
  '/:id/update',
  protect,
  restrictTo(Role.CASE_MANAGER, Role.ADMIN),
  updateResourceRules(),
  validate,
  updateResource
);

// Admin-only Routes
router.post(
  '/create',
  protect,
  restrictTo(Role.ADMIN),
  createResourceRules(),
  validate,
  createResource
);

router.post(
  '/import',
  protect,
  restrictTo(Role.ADMIN),
  importResources
);

export default router; 