import { component$, useStore } from "@builder.io/qwik";
import TagsSidebar from "../tags/tags-sidebar";
import { ArticleList } from "../articles/article-list";
import FeedTabs from "../feed/feed-tabs";
import { Tab } from "~/models/tab";

export interface OverviewStore {
  selectedTag: string;
  activeTab: Tab;
}

export default component$(() => {
  console.log("build index store");
  const store = useStore<OverviewStore>({ selectedTag: "", activeTab: Tab.Global });

  return (
    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <FeedTabs
            overviewStore={store}
            updateTag$={async (tag) => {
              store.selectedTag = tag;
            }}
            updateTab$={async (tab) => {
              store.activeTab = tab;
            }}
          />
          <ArticleList overviewStore={store} />
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
