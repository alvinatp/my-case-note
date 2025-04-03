import express from 'express';
import {
  getResources,
  getResourceById,
  updateResource,
  searchResources,
  getRecentUpdates,
  createResource,
  importResources,
  addResourceNote,
  saveResource,
  unsaveResource,
  getSavedResources
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

// Protected Routes (Requires Login)
router.post('/:id/save', protect, resourceIdRule(), validate, saveResource);
router.delete('/:id/save', protect, resourceIdRule(), validate, unsaveResource);
router.get('/user/saved', protect, getSavedResources);

// Private Routes (Requires Login)
router.put(
  '/:id',
  protect,
  restrictTo(Role.CASE_MANAGER, Role.ADMIN),
  updateResourceRules(),
  validate,
  updateResource
);

router.post(
  '/:id/notes',
  protect,
  restrictTo(Role.CASE_MANAGER, Role.ADMIN),
  resourceIdRule(),
  validate,
  addResourceNote
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