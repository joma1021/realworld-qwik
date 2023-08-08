import type { PropFunction } from "@builder.io/qwik";
import { Resource, component$, useResource$ } from "@builder.io/qwik";
import { getTags } from "~/services/article-service";

interface TagSidebarProps {
  updateTag$: PropFunction<(tag: string) => void>;
}

export default component$((props: TagSidebarProps) => {
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
                <a
                  class="tag-pill tag-default"
                  style="cursor: pointer;"
                  key={tag}
                  onClick$={async () => await props.updateTag$(tag)}
                >
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
