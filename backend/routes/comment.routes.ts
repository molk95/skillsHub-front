import express from 'express';
import commentController from '../controllers/comment.controller';

const router = express.Router();

// Routes publiques
router.get('/', commentController.getAllComments);
router.get('/:id', commentController.getCommentById);
router.get('/forum/:forumId', commentController.getCommentsByForumId);

// Routes pour la création, mise à jour et suppression
router.post('/', commentController.createComment);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

// Routes pour les likes
router.post('/:id/like', commentController.likeComment);

export default router;
