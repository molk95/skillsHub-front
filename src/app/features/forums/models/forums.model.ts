import { Comment } from './comment.model';

export interface Forum {
  id?: string;
  title: string;
  author: string; // Should be a valid MongoDB ObjectId string
  content: string;
  content_en?: string;
  comments: string[] | Comment[]; // Can be either string[] for backward compatibility or Comment[]
  created_at: string;
  community: string; // Should be a valid MongoDB ObjectId string
  ratings: {
    user: string; // Should be a valid MongoDB ObjectId string
    score: number;
  }[];
  participants?: string[]; // Added participants field
  viewCount?: number; // Nombre de vues
  likeCount?: number; // Nombre de j'aime
}
