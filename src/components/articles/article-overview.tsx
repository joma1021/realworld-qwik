import { component$, useContext, useStore } from "@builder.io/qwik";
import TagsSidebar from "../tags/tags-sidebar";
import { ArticleList } from "./article-list";
import FeedTabs from "../feed/feed-tabs";
import { Tab } from "~/models/tab";
import type { UserSessionStore } from "../auth/auth-provider";
import { UserSessionContext } from "../auth/auth-provider";

export interface OverviewStore {
  selectedTag: string;
  activeTab: Tab;
}

export default component$(() => {
  console.log("build index store");
  const userSession = useContext<UserSessionStore>(UserSessionContext);
  const store = useStore<OverviewStore>({ selectedTag: "", activeTab: userSession.isLoggedIn ? Tab.Your : Tab.Global });

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
              console.log("tab updated to " + tab);
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
