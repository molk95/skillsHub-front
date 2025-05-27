import UserModel, { IUser } from '../models/user.model';

class UserService {
  /**
   * Récupère tous les utilisateurs
   */
  async getAllUsers(filter = {}, limit = 10, skip = 0): Promise<IUser[]> {
    try {
      return await UserModel.find(filter)
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Récupère un utilisateur par son ID
   */
  async getUserById(id: string): Promise<IUser | null> {
    try {
      return await UserModel.findById(id);
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
