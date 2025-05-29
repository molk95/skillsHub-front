export interface Forum {
    _id: string;
    title: string;
    author: string;
    content: string;
    content_en?: string;
    comments: string[];
    community: string;
    ratings: {
      user: string;
      score: number;
    }[];
  }
  