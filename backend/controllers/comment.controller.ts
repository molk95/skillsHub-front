import { Request, Response } from 'express';
import commentService from '../services/comment.service';

export class CommentController {
  /**
   * Récupère tous les commentaires
   */
  async getAllComments(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = parseInt(req.query.skip as string) || 0;
      
      const comments = await commentService.getAllComments({}, limit, skip);
      res.status(200).json({
        success: true,
        count: comments.length,
        data: comments
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la récupération des commentaires'
      });
    }
  }

  /**
   * Récupère un commentaire par son ID
   */
  async getCommentById(req: Request, res: Response): Promise<void> {
    try {
      const comment = await commentService.getCommentById(req.params.id);
      
      if (!comment) {
        res.status(404).json({
          success: false,
          message: 'Commentaire non trouvé'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: comment
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la récupération du commentaire'
      });
    }
  }

  /**
   * Récupère les commentaires d'un forum
   */
  async getCommentsByForumId(req: Request, res: Response): Promise<void> {
    try {
      const comments = await commentService.getCommentsByForumId(req.params.forumId);
      
      res.status(200).json({
        success: true,
        count: comments.length,
        data: comments
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la récupération des commentaires'
      });
    }
  }

  /**
   * Crée un nouveau commentaire
   */
  async createComment(req: Request, res: Response): Promise<void> {
    try {
      const commentData = req.body;
      
      const comment = await commentService.createComment(commentData);
      
      res.status(201).json({
        success: true,
        data: comment
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de la création du commentaire'
      });
    }
  }

  /**
   * Met à jour un commentaire
   */
  async updateComment(req: Request, res: Response): Promise<void> {
    try {
      const comment = await commentService.updateComment(req.params.id, req.body);
      
      if (!comment) {
        res.status(404).json({
          success: false,
          message: 'Commentaire non trouvé'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: comment
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de la mise à jour du commentaire'
      });
    }
  }

  /**
   * Supprime un commentaire
   */
  async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const comment = await commentService.deleteComment(req.params.id);
      
      if (!comment) {
        res.status(404).json({
          success: false,
          message: 'Commentaire non trouvé'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Commentaire supprimé avec succès'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la suppression du commentaire'
      });
    }
  }

  /**
   * Ajoute un like à un commentaire
   */
  async likeComment(req: Request, res: Response): Promise<void> {
    try {
      const comment = await commentService.likeComment(req.params.id);
      
      if (!comment) {
        res.status(404).json({
          success: false,
          message: 'Commentaire non trouvé'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: comment
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de l\'ajout du like'
      });
    }
  }
}

export default new CommentController();
