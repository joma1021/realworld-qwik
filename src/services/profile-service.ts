import { BASE_URL } from "~/common/api";
import { getHeaders } from "~/common/headers";
import type { AuthorData } from "~/models/author";

export async function getProfile(username: string, token: string, controller?: AbortController): Promise<AuthorData> {
  console.log("FETCH", `${BASE_URL}/${username}`);
  console.log("token: " + token);
  try {
    const response = await fetch(`${BASE_URL}/profiles/${username}`, {
      method: "GET",
      signal: controller?.signal,
      headers: getHeaders(token),
    });
    if (!response.ok) {
      return Promise.reject(response.statusText);
    }
    console.log("FETCH profile resolved");

    const data = await response.json();
    console.log(data);
    return data.profile;
  } catch (e) {
    return Promise.reject("Error occurred while fetching data");
  }
}
