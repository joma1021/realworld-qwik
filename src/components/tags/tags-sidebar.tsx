import { Resource, component$, useResource$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { getTags } from "~/services/article-service";

export default component$(() => {
  const tags = useResource$<string[]>(() => {
    return getTags();
  });
  return (
    <div class="col-md-3">
      <div class="sidebar">
        <p>Popular Tags</p>
        <Resource
          value={tags}
          onPending={() => <div>Loading Tags...</div>}
          onRejected={(reason) => <div>Error: {reason}</div>}
          onResolved={(tags) => (
            <div class="tag-list">
              {tags.map((tag) => (
                <Link class="tag-pill tag-default" style="cursor: pointer;" key={tag} href={`/?filter=${tag}`}>
                  {tag}
                </Link>
              ))}
            </div>
          )}
        />
      </div>
    </div>
  );
});
