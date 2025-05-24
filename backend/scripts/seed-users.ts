import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserModel from '../models/user.model';

// Charger les variables d'environnement
dotenv.config();

// Connexion à MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillshub';

// Utilisateurs fictifs
const users = [
  {
    _id: '64f8b8e55a1c9b1c5e8b4567',
    fullName: 'Utilisateur Test',
    email: 'test@example.com',
    password: 'password123',
    bio: 'Utilisateur de test pour le développement',
    skills: ['JavaScript', 'Angular', 'Node.js'],
    isActive: true
  },
  {
    _id: '67dea87c2f7de52f2ddfb22e',
    fullName: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    password: 'password123',
    bio: 'Développeur web passionné',
    skills: ['JavaScript', 'React', 'Node.js'],
    isActive: true
  },
  {
    _id: '67dea87c2f7de52f2ddfb23f',
    fullName: 'Marie Martin',
    email: 'marie.martin@example.com',
    password: 'password123',
    bio: 'Designer UX/UI',
    skills: ['Figma', 'Adobe XD', 'CSS'],
    isActive: true
  },
  {
    _id: '67dea87c2f7de52f2ddfb24g',
    fullName: 'Pierre Durand',
    email: 'pierre.durand@example.com',
    password: 'password123',
    bio: 'Développeur backend',
    skills: ['Java', 'Spring', 'MongoDB'],
    isActive: true
  },
  {
    _id: '67dea87c2f7de52f2ddfb25h',
    fullName: 'Sophie Lefebvre',
    email: 'sophie.lefebvre@example.com',
    password: 'password123',
    bio: 'Développeuse mobile',
    skills: ['Flutter', 'Dart', 'Firebase'],
    isActive: true
  },
  {
    _id: '67dea87c2f7de52f2ddfb26i',
    fullName: 'Thomas Bernard',
    email: 'thomas.bernard@example.com',
    password: 'password123',
    bio: 'DevOps engineer',
    skills: ['Docker', 'Kubernetes', 'AWS'],
    isActive: true
  }
];

// Fonction pour ajouter les utilisateurs
async function seedUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connecté à MongoDB');

    // Supprimer tous les utilisateurs existants
    await UserModel.deleteMany({});
    console.log('Utilisateurs existants supprimés');

    // Ajouter les nouveaux utilisateurs
    await UserModel.insertMany(users);
    console.log('Utilisateurs ajoutés avec succès');

    // Fermer la connexion
    await mongoose.connection.close();
    console.log('Connexion à MongoDB fermée');
  } catch (error) {
    console.error('Erreur lors de l\'ajout des utilisateurs:', error);
  }
}

// Exécuter la fonction
seedUsers();
