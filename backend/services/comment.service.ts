import CommentModel, { IComment } from '../models/comment.model';
import ForumModel from '../models/forum.model';

class CommentService {
  /**
   * Récupère tous les commentaires
   */
  async getAllComments(filter = {}, limit = 10, skip = 0): Promise<IComment[]> {
    try {
      return await CommentModel.find(filter)
        .populate('author', 'fullName email')
        .populate('forum', 'title')
        .sort({ created_at: -1 })
        .limit(limit)
        .skip(skip);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Récupère un commentaire par son ID
   */
  async getCommentById(id: string): Promise<IComment | null> {
    try {
      return await CommentModel.findById(id)
        .populate('author', 'fullName email')
        .populate('forum', 'title');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Récupère les commentaires d'un forum
   */
  async getCommentsByForumId(forumId: string): Promise<IComment[]> {
    try {
      return await CommentModel.find({ forum: forumId })
        .populate('author', 'fullName email')
        .sort({ created_at: -1 });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Crée un nouveau commentaire
   */
  async createComment(commentData: Partial<IComment>): Promise<IComment> {
    try {
      const newComment = new CommentModel(commentData);
      const savedComment = await newComment.save();
      
      // Ajouter le commentaire au forum
      if (commentData.forum) {
        await ForumModel.findByIdAndUpdate(
          commentData.forum,
          { $push: { comments: savedComment._id } }
        );
      }
      
      return savedComment;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Met à jour un commentaire
   */
  async updateComment(id: string, updateData: Partial<IComment>): Promise<IComment | null> {
    try {
      return await CommentModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Supprime un commentaire
   */
  async deleteComment(id: string): Promise<IComment | null> {
    try {
      const comment = await CommentModel.findById(id);
      
      if (!comment) {
        return null;
      }
      
      // Retirer le commentaire du forum
      await ForumModel.findByIdAndUpdate(
        comment.forum,
        { $pull: { comments: id } }
      );
      
      return await CommentModel.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Ajoute un like à un commentaire
   */
  async likeComment(id: string): Promise<IComment | null> {
    try {
      return await CommentModel.findByIdAndUpdate(
        id,
        { $inc: { likes: 1 } },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }
}

export default new CommentService();
