export interface Photo {
  id: string;
  imageUrl: string;
  description?: string | null;
  altDescription?: string | null;
  colorPalette?: string[] | null;
  suggestedTags?: string[] | null;
  customTags?: string[] | null;
  dateSaved: string;
}

export interface SearchResult {
  imageUrl: string;
  description: string;
  altDescription: string;
  score: number;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  type: string;
  timestamp: string;
}
