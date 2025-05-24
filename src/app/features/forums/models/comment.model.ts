export interface Comment {
  id?: string;
  content: string;
  author: string; // Should be a valid MongoDB ObjectId string
  authorName?: string; // Display name of the author
  forum: string; // Reference to the forum this comment belongs to
  created_at: string;
  updated_at?: string;
  likes?: number;
  replies?: Comment[]; // For nested comments if needed
}
