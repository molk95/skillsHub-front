export interface Feedback {
    _id?: string; // ID du feedback (généré automatiquement par MongoDB)
    userId: string; // ID de l'utilisateur qui a donné le feedback
    targetUserId: string; // ID de l'utilisateur cible
    rating: number; // Note (entre 1 et 5)
    comment?: string; // Commentaire optionnel
    timestamp?: Date; // Date de création du feedback
    funActivity?: string; // Activité amusante générée par l'API externe
    personalityTraits?: PersonalityTraits; // Traits de personnalité analysés
    randomUserInfo?: string; // Informations aléatoires sur l'utilisateur
  }
  
  export interface PersonalityTraits {
    openness: number; // Ouverture
    conscientiousness: number; // Conscience professionnelle
    extraversion: number; // Extraversion
    agreeableness: number; // Agréabilité
    neuroticism: number; // Névrosisme
  }