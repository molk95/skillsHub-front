import CommunityModel, { ICommunity } from '../models/community.model';
import mongoose from 'mongoose';

export class CommunityService {

  /**
   * Récupère toutes les communautés
   */
  async getAllCommunities(filter = {}, limit = 10, skip = 0): Promise<ICommunity[]> {
    try {
      console.log('=== SERVICE: Récupération des communautés ===');

      const communities = await CommunityModel.find(filter)
        .select('name description creator members events forums isActive avatar coverImage tags createdAt updatedAt')
        .populate('creator', 'fullName email')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      console.log(`Nombre de communautés trouvées: ${communities.length}`);
      if (communities.length > 0) {
        console.log('Première communauté:', communities[0].name);
        console.log('Description première:', communities[0].description);
        console.log('Champs disponibles:', Object.keys(communities[0].toObject()));
      }

      return communities;
    } catch (error) {
      console.error('Erreur dans getAllCommunities:', error);
      throw error;
    }
  }

  /**
   * Récupère une communauté par son ID
   */
  async getCommunityById(id: string): Promise<ICommunity | null> {
    try {
      return await CommunityModel.findById(id)
        .populate('creator', 'fullName email')
        .populate('members', 'fullName email')
        .populate('forums', 'title content')
        .populate('events', 'title description date');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Récupère une communauté par son ID
   */
  async getCommunityById(id: string): Promise<ICommunity | null> {
    try {
      console.log(`Getting community by ID: ${id}`);

      // Vérifier si l'ID est valide
      if (!id || id.length !== 24) {
        console.error('Invalid community ID format:', id);
        return null;
      }

      const community = await CommunityModel.findById(id)
        .select('name description creator members events forums isActive avatar coverImage tags createdAt updatedAt')
        .populate('creator', 'name email')
        .populate('members', 'name email')
        .populate('forums', 'title content')
        .populate('events', 'title description date');

      console.log('Community found:', community);

      if (!community) {
        console.log('No community found with ID:', id);
        return null;
      }

      // Log des données essentielles
      console.log('Community data:', {
        id: community._id,
        name: community.name,
        description: community.description,
        creator: community.creator
      });

      return community;
    } catch (error) {
      console.error('Error getting community by ID:', error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle communauté
   */
  async createCommunity(communityData: any): Promise<ICommunity> {
    try {
      console.log('=== SERVICE: Création communauté ===');
      console.log('Données reçues:', communityData);
      console.log('Nom:', communityData.name);
      console.log('Description:', communityData.description);

      const newCommunity = new CommunityModel({
        name: communityData.name,
        description: communityData.description || '', // S'assurer que description existe
        creator: communityData.creator,
        members: [],
        events: [],
        forums: [],
        isActive: true
      });

      console.log('Objet communauté avant sauvegarde:', newCommunity);
      console.log('Description dans l\'objet:', newCommunity.description);

      const savedCommunity = await newCommunity.save();

      console.log('=== COMMUNAUTÉ SAUVEGARDÉE ===');
      console.log('Communauté sauvegardée:', savedCommunity);
      console.log('Description sauvegardée:', savedCommunity.description);

      return savedCommunity;
    } catch (error) {
      console.error('Error creating community:', error);
      throw error;
    }
  }

  /**
   * Met à jour une communauté
   */
  async updateCommunity(id: string, updateData: Partial<ICommunity>): Promise<ICommunity | null> {
    try {
      console.log(`Updating community ${id} with data:`, updateData);

      const updatedCommunity = await CommunityModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      console.log('Community updated in database:', updatedCommunity);

      if (!updatedCommunity) {
        console.log('No community found with ID:', id);
        return null;
      }

      // Log des données mises à jour
      console.log('Updated community data:', {
        id: updatedCommunity._id,
        name: updatedCommunity.name,
        description: updatedCommunity.description
      });

      return updatedCommunity;
    } catch (error) {
      console.error('Error updating community:', error);
      throw error;
    }
  }

  /**
   * Supprime une communauté
   */
  async deleteCommunity(id: string): Promise<ICommunity | null> {
    try {
      return await CommunityModel.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Ajoute un membre à une communauté
   */
  async addMemberToCommunity(communityId: string, userId: string): Promise<ICommunity | null> {
    try {
      const community = await CommunityModel.findById(communityId);
      if (!community) {
        throw new Error('Communauté non trouvée');
      }

      return await community.addMember(new mongoose.Types.ObjectId(userId));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retire un membre d'une communauté
   */
  async removeMemberFromCommunity(communityId: string, userId: string): Promise<ICommunity | null> {
    try {
      const community = await CommunityModel.findById(communityId);
      if (!community) {
        throw new Error('Communauté non trouvée');
      }

      return await community.removeMember(new mongoose.Types.ObjectId(userId));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Récupère les communautés créées par un utilisateur
   */
  async getCommunityByCreator(creatorId: string): Promise<ICommunity[]> {
    try {
      return await CommunityModel.findByCreator(creatorId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Vérifie si un utilisateur est membre d'une communauté
   */
  async isUserMemberOfCommunity(communityId: string, userId: string): Promise<boolean> {
    try {
      const community = await CommunityModel.findById(communityId);
      if (!community) {
        return false;
      }

      return community.members.some(member => member.toString() === userId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Ajoute un forum à une communauté
   */
  async addForumToCommunity(communityId: string, forumId: string): Promise<ICommunity | null> {
    try {
      return await CommunityModel.findByIdAndUpdate(
        communityId,
        { $addToSet: { forums: forumId } },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Ajoute un événement à une communauté
   */
  async addEventToCommunity(communityId: string, eventId: string): Promise<ICommunity | null> {
    try {
      return await CommunityModel.findByIdAndUpdate(
        communityId,
        { $addToSet: { events: eventId } },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Recherche des communautés par nom ou tags
   */
  async searchCommunities(query: string): Promise<ICommunity[]> {
    try {
      // Add error handling and validation
      if (!query) {
        return [];
      }

      // Use a try-catch block to handle potential regex errors
      let regex;
      try {
        regex = new RegExp(query, 'i');
      } catch (e) {
        // If the query contains special regex characters, escape them
        regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      }

      return await CommunityModel.find({
        $or: [
          { name: { $regex: regex } },
          { tags: { $regex: regex } }
        ]
      }).limit(10);
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  /**
   * Récupère les communautés sans description
   */
  async getCommunitiesWithoutDescription(): Promise<ICommunity[]> {
    try {
      return await CommunityModel.find({
        $or: [
          { description: { $exists: false } },
          { description: null },
          { description: '' },
          { description: /^\s*$/ }
        ]
      });
    } catch (error) {
      throw error;
    }
  }
}

export default new CommunityService();
