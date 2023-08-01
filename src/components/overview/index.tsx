import { component$, useStore } from "@builder.io/qwik";
import TagsSidebar from "../tags/tags-sidebar";
import { ArticleList } from "../articles/article-list";

export interface OverviewStore {
  selectedTag: string;
  selectedNavElement: string;
}

export default component$(() => {
  const store = useStore<OverviewStore>({ selectedTag: "", selectedNavElement: "Global Feed" });

  return (
    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a class="nav-link" href="">
                  Your Feed
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="">
                  Global Feed
                </a>
              </li>
            </ul>
          </div>
          <ArticleList selectedTag={store.selectedTag} />
        </div>

        <TagsSidebar
          updateTag$={async (tag) => {
            store.selectedTag = tag;
          }}
        />
      </div>
    </div>
  );
});
