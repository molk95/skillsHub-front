import mongoose, { Schema, Document, Model } from "mongoose";

// Interface pour le document Comment
export interface IComment extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  forum: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at?: Date;
  likes?: number;
  replies?: mongoose.Types.ObjectId[];
}

// Schéma Mongoose pour Comment
const CommentSchema: Schema = new Schema(
  {
    content: {
      type: String,
      required: [true, "Le contenu du commentaire est requis"],
      trim: true,
      minlength: [1, "Le commentaire doit contenir au moins 1 caractère"],
      maxlength: [500, "Le commentaire ne peut pas dépasser 500 caractères"]
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "L'auteur du commentaire est requis"]
    },
    forum: {
      type: Schema.Types.ObjectId,
      ref: "Forum",
      required: [true, "Le forum du commentaire est requis"]
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    updated_at: {
      type: Date
    },
    likes: {
      type: Number,
      default: 0
    },
    replies: [{
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }]
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Ajouter des index pour améliorer les performances des requêtes
CommentSchema.index({ forum: 1 });
CommentSchema.index({ author: 1 });
CommentSchema.index({ created_at: -1 });

// Créer et exporter le modèle
const CommentModel: Model<IComment> = mongoose.model<IComment>("Comment", CommentSchema);

export default CommentModel;
