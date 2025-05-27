const { MongoClient } = require('mongodb');

// Configuration MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/skillshub';

// Descriptions par défaut
const descriptions = [
  "Une communauté dynamique où les membres partagent leurs connaissances et expériences.",
  "Rejoignez-nous pour apprendre, partager et grandir ensemble dans un environnement bienveillant.",
  "Espace d'échange et de collaboration pour tous les passionnés de notre domaine.",
  "Communauté active dédiée au partage de compétences et à l'entraide mutuelle.",
  "Un lieu de rencontre virtuel pour échanger, apprendre et développer ses compétences.",
  "Communauté engagée dans le développement personnel et professionnel de ses membres."
];

async function addDescriptions() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔗 Connexion à MongoDB...');
    await client.connect();
    console.log('✅ Connecté à MongoDB');

    const db = client.db('skillshub');
    const collection = db.collection('communities');

    // Récupérer toutes les communautés
    console.log('🔍 Récupération des communautés...');
    const communities = await collection.find({}).toArray();
    console.log(`📊 Trouvé ${communities.length} communautés`);

    // Mettre à jour chaque communauté
    let updatedCount = 0;
    for (const community of communities) {
      const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
      
      const result = await collection.updateOne(
        { _id: community._id },
        { 
          $set: { 
            description: randomDescription,
            updatedAt: new Date()
          } 
        }
      );

      if (result.modifiedCount > 0) {
        updatedCount++;
        console.log(`✅ Mis à jour: "${community.name}" -> "${randomDescription.substring(0, 50)}..."`);
      }
    }

    console.log(`🎉 Terminé ! ${updatedCount} communautés mises à jour avec des descriptions.`);

    // Vérifier le résultat
    console.log('🔍 Vérification...');
    const updatedCommunities = await collection.find({}).toArray();
    console.log('Première communauté après mise à jour:', {
      name: updatedCommunities[0].name,
      description: updatedCommunities[0].description
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
addDescriptions()
  .then(() => {
    console.log('✅ Script terminé avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur lors de l\'exécution du script:', error);
    process.exit(1);
  });
