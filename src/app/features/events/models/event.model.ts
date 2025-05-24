export interface Event {
  id?: string;
  title: string;
  description: string;
  location: string;
  date: string; // ISO date string
  startTime?: string;
  endTime?: string;
  organizer: string; // Should be a valid MongoDB ObjectId string
  community: string; // Should be a valid MongoDB ObjectId string
  participants?: string[]; // Array of user IDs
  maxParticipants?: number;
  imageUrl?: string;
  tags?: string[];
  isOnline?: boolean;
  meetingLink?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EventCreateDto {
  title: string;
  description: string;
  location: string;
  date: string;
  startTime?: string;
  endTime?: string;
  community: string;
  maxParticipants?: number;
  imageUrl?: string;
  tags?: string[];
  isOnline?: boolean;
  meetingLink?: string;
}

export interface EventUpdateDto {
  title?: string;
  description?: string;
  location?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  maxParticipants?: number;
  imageUrl?: string;
  tags?: string[];
  isOnline?: boolean;
  meetingLink?: string;
}
