import mongoose, { Schema, Document, Model } from "mongoose";

// Interface pour le document Community
export interface ICommunity extends Document {
  name: string;
  description?: string;
  creator: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  forums: mongoose.Types.ObjectId[];
  events: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  avatar?: string;
  coverImage?: string;
  tags?: string[];
}

// Schéma Mongoose pour Community
const CommunitySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom de la communauté est requis"],
      trim: true,
      minlength: [3, "Le nom doit contenir au moins 3 caractères"],
      maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"]
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "La description ne peut pas dépasser 500 caractères"]
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Le créateur de la communauté est requis"]
    },
    members: [{
      type: Schema.Types.ObjectId,
      ref: "User"
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
    },
    avatar: {
      type: String
    },
    coverImage: {
      type: String
    },
    tags: [{
      type: String,
      trim: true
    }]
  },
  {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Ajouter des index pour améliorer les performances des requêtes
CommunitySchema.index({ name: 1 });
CommunitySchema.index({ creator: 1 });
CommunitySchema.index({ tags: 1 });

// Virtuals
CommunitySchema.virtual('memberCount').get(function(this: ICommunity) {
  return this.members.length;
});

CommunitySchema.virtual('forumCount').get(function(this: ICommunity) {
  return this.forums.length;
});

CommunitySchema.virtual('eventCount').get(function(this: ICommunity) {
  return this.events.length;
});

// Middleware pre-save
CommunitySchema.pre('save', function(next) {
  // Ajouter automatiquement le créateur aux membres s'il n'y est pas déjà
  if (this.isNew && this.creator && !this.members.includes(this.creator)) {
    this.members.push(this.creator);
  }
  next();
});

// Méthodes statiques
CommunitySchema.statics.findByCreator = function(creatorId: string) {
  return this.find({ creator: creatorId });
};

// Méthodes d'instance
CommunitySchema.methods.addMember = function(userId: mongoose.Types.ObjectId) {
  if (!this.members.includes(userId)) {
    this.members.push(userId);
  }
  return this.save();
};

CommunitySchema.methods.removeMember = function(userId: mongoose.Types.ObjectId) {
  this.members = this.members.filter(member => !member.equals(userId));
  return this.save();
};

// Créer et exporter le modèle
const CommunityModel: Model<ICommunity> = mongoose.model<ICommunity>("Community", CommunitySchema);

export default CommunityModel;