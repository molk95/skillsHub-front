import { Request, Response } from 'express';
import userService from '../services/user.service';

export class UserController {
  /**
   * Récupère tous les utilisateurs
   */
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = parseInt(req.query.skip as string) || 0;
      
      const users = await userService.getAllUsers({}, limit, skip);
      res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la récupération des utilisateurs'
      });
    }
  }

  /**
   * Récupère un utilisateur par son ID
   */
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.getUserById(req.params.id);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la récupération de l\'utilisateur'
      });
    }
  }
}

export default new UserController();
