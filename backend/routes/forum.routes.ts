import express from 'express';
import forumController from '../controllers/forum.controller';

const router = express.Router();

// Routes publiques
router.get('/', forumController.getAllForums);
router.get('/:id', forumController.getForumById);

// Routes pour la création, mise à jour et suppression
router.post('/', forumController.createForum);
router.put('/:id', forumController.updateForum);
router.delete('/:id', forumController.deleteForum);

// Routes pour les commentaires
router.post('/:forumId/comments', forumController.addComment);
router.get('/:forumId/comments', forumController.getComments);
router.delete('/:forumId/comments/:commentId', forumController.deleteComment);

export default router;
