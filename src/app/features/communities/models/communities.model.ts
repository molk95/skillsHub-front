export interface Community {
  _id?: string;
  name: string;
  description?: string;
  tags?: string[] | string;
  memberCount?: number;
  creator: string | { _id: string; fullName?: string; email?: string };
  members?: Array<string | { _id: string }>;
  forums?: string[];
  events?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CommunityCreateDto {
  name: string;
  description?: string;
  tags?: string[] | string;
}

export interface CommunityUpdateDto {
  name?: string;
  description?: string;
  tags?: string[] | string;
}



