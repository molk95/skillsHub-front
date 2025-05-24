import { Request, Response } from 'express';
import communityService from '../services/community.service';

export class CommunityController {
  /**
   * Crée une nouvelle communauté
   */
  async createCommunity(req: Request, res: Response): Promise<void> {
    try {
      console.log("Creating community with data:", req.body);

      // Commentez temporairement la vérification d'authentification pour les tests
      /*
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
        return;
      }
      */

      const communityData = req.body;

      // Utilisez un ID de créateur par défaut pour les tests
      communityData.creator = "64f8b8e55a1c9b1c5e8b4567"; // Utilisez un ID valide de votre base de données

      const community = await communityService.createCommunity(communityData);
      console.log("Community created:", community);

      res.status(201).json({
        success: true,
        data: community
      });
    } catch (error: any) {
      console.error("Error creating community:", error);
      res.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de la création de la communauté'
      });
    }
  }

  /**
   * Crée une nouvelle communauté
   */
  async createCommunity(req: Request, res: Response): Promise<void> {
    try {
      console.log('=== CRÉATION COMMUNAUTÉ BACKEND ===');
      console.log('Données reçues:', req.body);
      console.log('Nom:', req.body.name);
      console.log('Description:', req.body.description);

      const communityData = {
        name: req.body.name,
        description: req.body.description,
        creator: req.body.creator || '64f8b8e55a1c9b1c5e8b4567' // ID par défaut pour les tests
      };

      console.log('Données à sauvegarder:', communityData);

      const community = await communityService.createCommunity(communityData);

      console.log('=== COMMUNAUTÉ CRÉÉE BACKEND ===');
      console.log('Communauté sauvegardée:', community);
      console.log('Description sauvegardée:', community.description);

      res.status(201).json({
        success: true,
        data: community
      });
    } catch (error: any) {
      console.error('❌ Erreur création communauté:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de la création de la communauté'
      });
    }
  }

  /**
   * Récupère toutes les communautés
   */
  async getAllCommunities(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = parseInt(req.query.skip as string) || 0;

      const communities = await communityService.getAllCommunities({}, limit, skip);

      console.log('=== COMMUNAUTÉS RÉCUPÉRÉES BACKEND ===');
      console.log(`Nombre de communautés: ${communities.length}`);
      if (communities.length > 0) {
        console.log('Première communauté:', communities[0].name);
        console.log('Description première:', communities[0].description);
      }

      res.status(200).json({
        success: true,
        count: communities.length,
        data: communities
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la récupération des communautés'
      });
    }
  }

  /**
   * Récupère une communauté par son ID
   */
  async getCommunityById(req: Request, res: Response): Promise<void> {
    try {
      const community = await communityService.getCommunityById(req.params.id);

      if (!community) {
        res.status(404).json({
          success: false,
          message: 'Communauté non trouvée'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: community
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la récupération de la communauté'
      });
    }
  }

  /**
   * Met à jour une communauté
   */
  async updateCommunity(req: Request, res: Response): Promise<void> {
    try {
      const community = await communityService.updateCommunity(req.params.id, req.body);

      if (!community) {
        res.status(404).json({
          success: false,
          message: 'Communauté non trouvée'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: community
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de la mise à jour de la communauté'
      });
    }
  }

  /**
   * Supprime une communauté
   */
  async deleteCommunity(req: Request, res: Response): Promise<void> {
    try {
      const community = await communityService.deleteCommunity(req.params.id);

      if (!community) {
        res.status(404).json({
          success: false,
          message: 'Communauté non trouvée'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Communauté supprimée avec succès'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la suppression de la communauté'
      });
    }
  }

  /**
   * Ajoute un membre à une communauté
   */
  async addMember(req: Request, res: Response): Promise<void> {
    try {
      const { communityId, userId } = req.params;
      console.log(`Adding member ${userId} to community ${communityId}`);

      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'ID utilisateur manquant'
        });
        return;
      }

      const community = await communityService.addMemberToCommunity(communityId, userId);

      if (!community) {
        res.status(404).json({
          success: false,
          message: 'Communauté non trouvée'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: community
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de l\'ajout du membre'
      });
    }
  }

  /**
   * Retire un membre d'une communauté
   */
  async removeMember(req: Request, res: Response): Promise<void> {
    try {
      const { communityId, userId } = req.params;

      const community = await communityService.removeMemberFromCommunity(communityId, userId);

      if (!community) {
        res.status(404).json({
          success: false,
          message: 'Communauté non trouvée'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: community
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erreur lors du retrait du membre'
      });
    }
  }

  /**
   * Vérifie si un utilisateur est membre d'une communauté
   */
  async checkMembership(req: Request, res: Response): Promise<void> {
    try {
      const { communityId, userId } = req.params;

      const isMember = await communityService.isUserMemberOfCommunity(communityId, userId);

      res.status(200).json({
        success: true,
        data: isMember
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de la vérification du statut de membre'
      });
    }
  }

  /**
   * Recherche des communautés
   */
  async searchCommunities(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query.q as string;

      if (!query) {
        res.status(400).json({
          success: false,
          message: 'Paramètre de recherche requis'
        });
        return;
      }

      const communities = await communityService.searchCommunities(query);

      res.status(200).json({
        success: true,
        count: communities.length,
        data: communities
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la recherche de communautés'
      });
    }
  }

  /**
   * Ajoute des descriptions aux communautés qui n'en ont pas
   */
  async addDescriptions(req: Request, res: Response): Promise<void> {
    try {
      console.log('🔧 Ajout de descriptions aux communautés...');

      const defaultDescriptions = [
        "Une communauté dynamique où les membres partagent leurs connaissances et expériences.",
        "Rejoignez-nous pour apprendre, partager et grandir ensemble dans un environnement bienveillant.",
        "Espace d'échange et de collaboration pour tous les passionnés de notre domaine.",
        "Communauté active dédiée au partage de compétences et à l'entraide mutuelle.",
        "Un lieu de rencontre virtuel pour échanger, apprendre et développer ses compétences.",
        "Communauté engagée dans le développement personnel et professionnel de ses membres.",
        "Plateforme collaborative pour partager des idées, des projets et des opportunités.",
        "Espace convivial pour networker et développer ses compétences avec d'autres passionnés."
      ];

      // Trouver toutes les communautés sans description
      const communitiesWithoutDescription = await communityService.getCommunitiesWithoutDescription();

      if (communitiesWithoutDescription.length === 0) {
        res.status(200).json({
          success: true,
          message: 'Toutes les communautés ont déjà une description',
          updated: 0
        });
        return;
      }

      let updatedCount = 0;
      for (const community of communitiesWithoutDescription) {
        const randomDescription = defaultDescriptions[Math.floor(Math.random() * defaultDescriptions.length)];

        await communityService.updateCommunity(community._id.toString(), {
          description: randomDescription
        });

        updatedCount++;
        console.log(`✅ Mis à jour: "${community.name}"`);
      }

      res.status(200).json({
        success: true,
        message: `${updatedCount} communautés mises à jour avec des descriptions`,
        updated: updatedCount
      });
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'ajout des descriptions:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de l\'ajout des descriptions'
      });
    }
  }
}

export default new CommunityController();








