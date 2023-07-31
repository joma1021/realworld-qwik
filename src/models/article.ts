import type { AuthorData } from "./author";

export interface ArticleData {
  favorited: boolean;
  author: AuthorData;
  tagList: string[];
  title: string;
  description: string;
  createdAt: string;
  updatedAT: string;
  favoritesCount: number;
  slug: string;
  body: string;
}

export interface ArticlesDTO {
  articles: ArticleData[];
  articlesCount: number;
}
