export interface Photo {
  id: string;
  imageUrl: string;
  aiGeneratedTags?: string[];
  customTags?: string[];
  colorPalette?: string[];
  userId: string;
  createdAt: string;
}

export interface SearchResult {
  imageUrl: string;
  score: number;
  aiGeneratedTags?: string[];
  colorPalette?: string[];
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  createdAt: string;
  userId: string;
}
