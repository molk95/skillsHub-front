import { Request, Response } from 'express';
import forumService from '../services/forum.service';
import communityService from '../services/community.service';

export class ForumController {
  /**
   * Récupère tous les forums
   */
  async getAllForums(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = parseInt(req.query.skip as string) || 0;
      
      const forums = await forumService.getAllForums({}, limit, skip);
      res.status(200).json({
        success: true,
        count: forums.length,
        data: forums
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la récupération des forums'
      });
    }
  }

  /**
   * Récupère un forum par son ID
   */
  async getForumById(req: Request, res: Response): Promise<void> {
    try {
      const forum = await forumService.getForumById(req.params.id);
      
      if (!forum) {
        res.status(404).json({
          success: false,
          message: 'Forum non trouvé'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: forum
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la récupération du forum'
      });
    }
  }

  /**
   * Crée un nouveau forum
   */
  async createForum(req: Request, res: Response): Promise<void> {
    try {
      console.log("Creating forum with data:", req.body);
      
      const forumData = req.body;
      
      // Vérifier si la communauté existe
      if (forumData.community) {
        const community = await communityService.getCommunityById(forumData.community);
        if (!community) {
          res.status(400).json({
            success: false,
            message: 'La communauté spécifiée n\'existe pas'
          });
          return;
        }
      }
      
      const forum = await forumService.createForum(forumData);
      console.log("Forum created:", forum);
      
      // Ajouter le forum à la communauté
      if (forum && forumData.community) {
        await communityService.addForumToCommunity(forumData.community, forum._id.toString());
      }
      
      res.status(201).json({
        success: true,
        data: forum
      });
    } catch (error: any) {
      console.error("Error creating forum:", error);
      res.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de la création du forum'
      });
    }
  }

  /**
   * Met à jour un forum
   */
  async updateForum(req: Request, res: Response): Promise<void> {
    try {
      const forum = await forumService.updateForum(req.params.id, req.body);
      
      if (!forum) {
        res.status(404).json({
          success: false,
          message: 'Forum non trouvé'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: forum
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de la mise à jour du forum'
      });
    }
  }

  /**
   * Supprime un forum
   */
  async deleteForum(req: Request, res: Response): Promise<void> {
    try {
      const forum = await forumService.deleteForum(req.params.id);
      
      if (!forum) {
        res.status(404).json({
          success: false,
          message: 'Forum non trouvé'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Forum supprimé avec succès'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la suppression du forum'
      });
    }
  }

  /**
   * Ajoute un commentaire à un forum
   */
  async addComment(req: Request, res: Response): Promise<void> {
    try {
      const { forumId } = req.params;
      const commentData = req.body;
      
      const comment = await forumService.addComment(forumId, commentData);
      
      res.status(201).json({
        success: true,
        data: comment
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de l\'ajout du commentaire'
      });
    }
  }

  /**
   * Récupère les commentaires d'un forum
   */
  async getComments(req: Request, res: Response): Promise<void> {
    try {
      const { forumId } = req.params;
      
      const comments = await forumService.getComments(forumId);
      
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
   * Supprime un commentaire
   */
  async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const { forumId, commentId } = req.params;
      
      await forumService.deleteComment(forumId, commentId);
      
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
}

export default new ForumController();
