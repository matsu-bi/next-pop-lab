export interface GdeltArticle {
  title: string;
  url: string;
  domain?: string;
  language?: string;
  seendate?: string;
  sourcecountry?: string;
}

export interface XPost {
  id: string;
  text: string;
  lang?: string;
  created_at?: string;
  like_count?: number;
  rt_count?: number;
}

export interface StanceCounts {
  support: number;
  oppose: number;
  neutral: number;
  unknown: number;
}
