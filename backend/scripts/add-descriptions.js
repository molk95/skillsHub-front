const mongoose = require('mongoose');
const CommunityModel = require('../models/community.model').default;

// Configuration de la base de données
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillshub';

// Descriptions par défaut pour différents types de communautés
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

async function addDescriptionsToCommunities() {
  try {
    console.log('🔗 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Trouver toutes les communautés sans description ou avec description vide
    console.log('🔍 Recherche des communautés sans description...');
    const communitiesWithoutDescription = await CommunityModel.find({
      $or: [
        { description: { $exists: false } },
        { description: null },
        { description: '' },
        { description: /^\s*$/ } // Regex pour les chaînes vides ou avec seulement des espaces
      ]
    });

    console.log(`📊 Trouvé ${communitiesWithoutDescription.length} communautés sans description`);

    if (communitiesWithoutDescription.length === 0) {
      console.log('✅ Toutes les communautés ont déjà une description !');
      return;
    }

    // Mettre à jour chaque communauté
    let updatedCount = 0;
    for (const community of communitiesWithoutDescription) {
      // Choisir une description aléatoire
      const randomDescription = defaultDescriptions[Math.floor(Math.random() * defaultDescriptions.length)];
      
      // Mettre à jour la communauté
      await CommunityModel.findByIdAndUpdate(
        community._id,
        { 
          $set: { 
            description: randomDescription 
          } 
        },
        { new: true }
      );

      updatedCount++;
      console.log(`✅ Mis à jour: "${community.name}" -> "${randomDescription.substring(0, 50)}..."`);
    }

    console.log(`🎉 Terminé ! ${updatedCount} communautés mises à jour avec des descriptions.`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
if (require.main === module) {
  addDescriptionsToCommunities()
    .then(() => {
      console.log('✅ Script terminé avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur lors de l\'exécution du script:', error);
      process.exit(1);
    });
}

module.exports = { addDescriptionsToCommunities };
