import type { AuthorData } from "./author";

export interface ArticleData {
  favorited: boolean;
  author: AuthorData;
  tagList: string[];
  title: string;
  description: string;
  createdAt: string;
  favoritesCount: number;
  slug: string;
}
