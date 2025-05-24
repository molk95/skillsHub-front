import ForumModel, { IForum } from '../models/forum.model';
import CommentModel, { IComment } from '../models/comment.model';

class ForumService {
  /**
   * Récupère tous les forums
   */
  async getAllForums(filter = {}, limit = 10, skip = 0): Promise<IForum[]> {
    try {
      return await ForumModel.find(filter)
        .populate('community', 'name')
        .sort({ created_at: -1 })
        .limit(limit)
        .skip(skip);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Récupère un forum par son ID
   */
  async getForumById(id: string): Promise<IForum | null> {
    try {
      return await ForumModel.findById(id)
        .populate('community', 'name')
        .populate({
          path: 'comments',
          populate: {
            path: 'author',
            select: 'fullName email'
          }
        });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Crée un nouveau forum
   */
  async createForum(forumData: Partial<IForum>): Promise<IForum> {
    try {
      const newForum = new ForumModel(forumData);
      return await newForum.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Met à jour un forum
   */
  async updateForum(id: string, updateData: Partial<IForum>): Promise<IForum | null> {
    try {
      return await ForumModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Supprime un forum
   */
  async deleteForum(id: string): Promise<IForum | null> {
    try {
      return await ForumModel.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Ajoute un commentaire à un forum
   */
  async addComment(forumId: string, commentData: Partial<IComment>): Promise<IComment> {
    try {
      const newComment = new CommentModel({
        ...commentData,
        forum: forumId
      });

      const savedComment = await newComment.save();

      // Ajouter le commentaire au forum
      await ForumModel.findByIdAndUpdate(
        forumId,
        { $push: { comments: savedComment._id } }
      );

      return savedComment;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Récupère les commentaires d'un forum
   */
  async getComments(forumId: string): Promise<IComment[]> {
    try {
      return await CommentModel.find({ forum: forumId })
        .populate('author', 'fullName email')
        .sort({ created_at: -1 });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Supprime un commentaire
   */
  async deleteComment(forumId: string, commentId: string): Promise<void> {
    try {
      // Supprimer le commentaire
      await CommentModel.findByIdAndDelete(commentId);

      // Retirer le commentaire du forum
      await ForumModel.findByIdAndUpdate(
        forumId,
        { $pull: { comments: commentId } }
      );
    } catch (error) {
      throw error;
    }
  }
}

export default new ForumService();
