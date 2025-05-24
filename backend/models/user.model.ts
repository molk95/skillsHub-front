import mongoose, { Schema, Document, Model } from "mongoose";

// Interface pour le document User
export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  communities?: mongoose.Types.ObjectId[];
  forums?: mongoose.Types.ObjectId[];
  events?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Schéma Mongoose pour User
const UserSchema: Schema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Le nom complet est requis"],
      trim: true,
      minlength: [3, "Le nom doit contenir au moins 3 caractères"],
      maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"]
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Veuillez fournir un email valide"]
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est requis"],
      minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
      select: false // Ne pas inclure le mot de passe dans les requêtes par défaut
    },
    avatar: {
      type: String
    },
    bio: {
      type: String,
      maxlength: [500, "La biographie ne peut pas dépasser 500 caractères"]
    },
    skills: [{
      type: String,
      trim: true
    }],
    communities: [{
      type: Schema.Types.ObjectId,
      ref: "Community"
    }],
    forums: [{
      type: Schema.Types.ObjectId,
      ref: "Forum"
    }],
    events: [{
      type: Schema.Types.ObjectId,
      ref: "Event"
    }],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Ajouter des index pour améliorer les performances des requêtes
UserSchema.index({ email: 1 });
UserSchema.index({ fullName: 1 });

// Virtuals
UserSchema.virtual('communityCount').get(function(this: IUser) {
  return this.communities ? this.communities.length : 0;
});

UserSchema.virtual('forumCount').get(function(this: IUser) {
  return this.forums ? this.forums.length : 0;
});

UserSchema.virtual('eventCount').get(function(this: IUser) {
  return this.events ? this.events.length : 0;
});

// Créer et exporter le modèle
const UserModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
