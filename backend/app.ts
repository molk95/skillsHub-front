import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

// Routes
import communityRoutes from './routes/community.routes';
import userRoutes from './routes/user.routes';
import forumRoutes from './routes/forum.routes';
import commentRoutes from './routes/comment.routes';

// Charger les variables d'environnement
dotenv.config();

// Créer l'application Express
const app = express();

// Middleware
app.use(cors({
  origin: '*', // Accepter toutes les origines
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/communities', communityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/forums', forumRoutes);
app.use('/api/comments', commentRoutes);

// Route par défaut
app.get('/', (req, res) => {
  res.send('API SkillsHUB est en ligne!');
});

// Connexion à MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillshub';
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connecté à MongoDB');
  })
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB:', err);
  });

// Port
const PORT = process.env.PORT || 3000;

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

export default app;
