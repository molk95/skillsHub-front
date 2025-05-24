const mongoose = require('mongoose');

// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillshub';

// Descriptions par défaut
const descriptions = [
  "Une communauté dynamique où les membres partagent leurs connaissances et expériences.",
  "Rejoignez-nous pour apprendre, partager et grandir ensemble dans un environnement bienveillant.",
  "Espace d'échange et de collaboration pour tous les passionnés de notre domaine.",
  "Communauté active dédiée au partage de compétences et à l'entraide mutuelle.",
  "Un lieu de rencontre virtuel pour échanger, apprendre et développer ses compétences.",
  "Communauté engagée dans le développement personnel et professionnel de ses membres."
];

async function fixDescriptions() {
  try {
    console.log('🔗 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Utiliser directement la collection MongoDB
    const db = mongoose.connection.db;
    const collection = db.collection('communities');

    // Trouver toutes les communautés sans description
    console.log('🔍 Recherche des communautés sans description...');
    const communitiesWithoutDescription = await collection.find({
      $or: [
        { description: { $exists: false } },
        { description: null },
        { description: '' }
      ]
    }).toArray();

    console.log(`📊 Trouvé ${communitiesWithoutDescription.length} communautés sans description`);

    if (communitiesWithoutDescription.length === 0) {
      console.log('✅ Toutes les communautés ont déjà une description !');
      return;
    }

    // Mettre à jour chaque communauté
    let updatedCount = 0;
    for (const community of communitiesWithoutDescription) {
      const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
      
      await collection.updateOne(
        { _id: community._id },
        { 
          $set: { 
            description: randomDescription,
            updatedAt: new Date()
          } 
        }
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
  fixDescriptions()
    .then(() => {
      console.log('✅ Script terminé avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur lors de l\'exécution du script:', error);
      process.exit(1);
    });
}

module.exports = { fixDescriptions };
