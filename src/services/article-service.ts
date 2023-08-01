import { BASE_URL } from "~/common/api";
import type { ArticlesDTO } from "~/models/article";
import type { TagsDTO } from "~/models/tags";

export async function getTags(): Promise<TagsDTO> {
  console.log("FETCH", `${BASE_URL}/tags`);
  try {
    const response = await fetch(`${BASE_URL}/tags`);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    console.log("FETCH tags resolved");
    return await response.json();
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
      throw new Error(response.statusText);
    }
    console.log("FETCH articles resolved");
    return await response.json();
  } catch (e) {
    return Promise.reject("Error occurred while fetching data");
  }
}
