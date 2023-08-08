import { BASE_URL } from "~/common/api";
import { getHeaders } from "~/common/headers";
import type { ArticleData, ArticlesDTO } from "~/models/article";
import type { CommentData } from "~/models/comment";
import { Tab } from "~/models/tab";

export async function getTags(): Promise<string[]> {
  console.log("FETCH", `${BASE_URL}/tags`);
  try {
    const response = await fetch(`${BASE_URL}/tags`, { method: "GET" });
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
      method: "GET",
      signal: controller?.signal,
      headers: getHeaders(),
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

export async function getYourArticles(
  token: string,
  controller?: AbortController,
  page?: number
): Promise<ArticlesDTO> {
  const offset = page ? (page - 1) * 10 : 0;
  const searchParams = new URLSearchParams({
    limit: "10",
    offset: `${offset}`,
  });
  console.log("FETCH", `${BASE_URL}/articles/feed?` + searchParams);
  try {
    const response = await fetch(`${BASE_URL}/articles/feed?` + searchParams, {
      method: "GET",
      signal: controller?.signal,
      headers: getHeaders(token),
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

export async function getProfileArticles(
  username: string,
  tab: Tab,
  token: string,
  controller?: AbortController,
  page?: number
): Promise<ArticlesDTO> {
  const offset = page ? (page - 1) * 5 : 0;

  const searchParams =
    tab == Tab.FavArticles
      ? new URLSearchParams({
          limit: "5",
          offset: `${offset}`,
          favorited: username,
        })
      : new URLSearchParams({
          limit: "5",
          offset: `${offset}`,
          author: username,
        });

  console.log("FETCH", `${BASE_URL}/articles?` + searchParams);
  try {
    const response = await fetch(`${BASE_URL}/articles?` + searchParams, {
      method: "GET",
      signal: controller?.signal,
      headers: getHeaders(token),
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
      method: "GET",
      signal: controller?.signal,
      headers: getHeaders(),
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
      method: "GET",
      signal: controller?.signal,
      headers: getHeaders(),
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
