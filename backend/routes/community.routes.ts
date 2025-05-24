import express from 'express';
import communityController from '../controllers/community.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// Routes publiques
router.get('/', communityController.getAllCommunities);
router.get('/search', communityController.searchCommunities);
router.get('/:id', communityController.getCommunityById);
router.get('/:communityId/members/:userId', communityController.checkMembership);

// Route utilitaire pour ajouter des descriptions
router.post('/add-descriptions', communityController.addDescriptions);

// Routes temporairement sans authentification pour les tests
router.post('/', communityController.createCommunity); // Retiré authMiddleware
router.put('/:id', communityController.updateCommunity); // Retiré authMiddleware
router.delete('/:id', communityController.deleteCommunity); // Retiré authMiddleware
router.post('/:communityId/members/:userId', communityController.addMember); // Retiré authMiddleware
router.delete('/:communityId/members/:userId', communityController.removeMember); // Retiré authMiddleware

// Routes pour les membres
router.post('/:communityId/members/:userId', communityController.addMember);
router.delete('/:communityId/members/:userId', communityController.removeMember);

export default router;



