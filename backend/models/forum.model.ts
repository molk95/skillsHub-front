import mongoose, { Schema, Document, Model } from "mongoose";

// Interface pour le document Forum
export interface IForum extends Document {
  title: string;
  author: string;
  content: string;
  content_en?: string;
  comments: mongoose.Types.ObjectId[];
  created_at: Date;
  updated_at?: Date;
  community: mongoose.Types.ObjectId;
  ratings: {
    user: mongoose.Types.ObjectId;
    score: number;
  }[];
  participants?: mongoose.Types.ObjectId[];
  viewCount?: number;
  likeCount?: number;
}

// Schéma Mongoose pour Forum
const ForumSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Le titre du forum est requis"],
      trim: true,
      minlength: [3, "Le titre doit contenir au moins 3 caractères"],
      maxlength: [100, "Le titre ne peut pas dépasser 100 caractères"]
    },
    author: {
      type: String,
      required: [true, "L'auteur du forum est requis"],
      trim: true
    },
    content: {
      type: String,
      required: [true, "Le contenu du forum est requis"],
      trim: true,
      minlength: [10, "Le contenu doit contenir au moins 10 caractères"]
    },
    content_en: {
      type: String,
      trim: true
    },
    comments: [{
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }],
    created_at: {
      type: Date,
      default: Date.now
    },
    updated_at: {
      type: Date
    },
    community: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: [true, "La communauté du forum est requise"]
    },
    ratings: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      score: {
        type: Number,
        min: 1,
        max: 5
      }
    }],
    participants: [{
      type: Schema.Types.ObjectId,
      ref: "User"
    }],
    viewCount: {
      type: Number,
      default: 0
    },
    likeCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Ajouter des index pour améliorer les performances des requêtes
ForumSchema.index({ title: 1 });
ForumSchema.index({ author: 1 });
ForumSchema.index({ community: 1 });
ForumSchema.index({ created_at: -1 });

// Virtuals
ForumSchema.virtual('commentCount').get(function(this: IForum) {
  return this.comments.length;
});

ForumSchema.virtual('ratingAverage').get(function(this: IForum) {
  if (this.ratings.length === 0) return 0;

  const sum = this.ratings.reduce((total, rating) => total + rating.score, 0);
  return sum / this.ratings.length;
});

// Middleware pre-save
ForumSchema.pre('save', function(next) {
  // Nous n'ajoutons plus automatiquement l'auteur aux participants car l'auteur est maintenant une chaîne
  // et non plus un ObjectId
  next();
});

// Créer et exporter le modèle
const ForumModel: Model<IForum> = mongoose.model<IForum>("Forum", ForumSchema);

export default ForumModel;
