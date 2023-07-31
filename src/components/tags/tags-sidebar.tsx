import { Resource, component$, useResource$ } from "@builder.io/qwik";
import { BASE_URL } from "~/common/api";
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

export default component$(() => {
  const tags = useResource$<TagsDTO>(({ cleanup }) => {
    const controller = new AbortController();
    cleanup(() => controller.abort());
    return getTags();
  });
  return (
    <div class="col-md-3">
      <div class="sidebar">
        <p>Popular Tags</p>

        <Resource
          value={tags}
          onPending={() => <div>Loading Articles...</div>}
          onRejected={(reason) => <div>Error: {reason}</div>}
          onResolved={(tags) => (
            <div class="tag-list">
              {tags.tags.map((tag, i) => (
                <a key={i} href="" class="tag-pill tag-default">
                  {tag}
                </a>
              ))}
            </div>
          )}
        />
      </div>
    </div>
  );
});
