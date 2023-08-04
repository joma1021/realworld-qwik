import { BASE_URL } from "~/common/api";
import type { ArticleData, ArticlesDTO } from "~/models/article";
import type { CommentData } from "~/models/comment";

export async function getTags(): Promise<string[]> {
  console.log("FETCH", `${BASE_URL}/tags`);
  try {
    const response = await fetch(`${BASE_URL}/tags`);
    if (!response.ok) {
      return Promise.reject(response.statusText);
    }
    console.log("FETCH tags resolved");
    const data = await response.json();
    return data.tags;
  } catch (e) {
    return Promise.reject("Error occurred while fetching data");
  }
}

export async function getGlobalArticles(
  controller?: AbortController,
  tag?: string,
  page?: number
): Promise<ArticlesDTO> {
  const offset = page ? (page - 1) * 10 : 0;
  const searchParams = tag
    ? new URLSearchParams({
        limit: "10",
        offset: `${offset}`,
        tag: tag,
      })
    : new URLSearchParams({
        limit: "10",
        offset: `${offset}`,
      });
  console.log("FETCH", `${BASE_URL}/articles?` + searchParams);
  try {
    const response = await fetch(`${BASE_URL}/articles?` + searchParams, {
      signal: controller?.signal,
    });
    if (!response.ok) {
      return Promise.reject(response.statusText);
    }
    console.log("FETCH articles resolved");
    return await response.json();
  } catch (e) {
    return Promise.reject("Error occurred while fetching data");
  }
}

export async function getArticle(slug: string, controller?: AbortController): Promise<ArticleData> {
  console.log("FETCH", `${BASE_URL}/articles/${slug}`);
  try {
    const response = await fetch(`${BASE_URL}/articles/${slug}`, {
      signal: controller?.signal,
    });
    if (!response.ok) {
      return Promise.reject(response.statusText);
    }
    console.log("FETCH article resolved");
    const data = await response.json();
    return data.article;
  } catch (e) {
    return Promise.reject("Error occurred while fetching data");
  }
}

export async function getComments(slug: string, controller?: AbortController): Promise<CommentData[]> {
  console.log("FETCH", `${BASE_URL}/articles/${slug}/comments`);
  try {
    const response = await fetch(`${BASE_URL}/articles/${slug}/comments`, {
      signal: controller?.signal,
    });
    if (!response.ok) {
      return Promise.reject(response.statusText);
    }
    console.log("FETCH article resolved");
    const data = await response.json();
    return data.comments;
  } catch (e) {
    return Promise.reject("Error occurred while fetching data");
  }
}
