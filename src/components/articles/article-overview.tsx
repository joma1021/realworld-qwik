import { component$, useContext, useStore } from "@builder.io/qwik";
import TagsSidebar from "../tags/tags-sidebar";
import { ArticleList } from "./article-list";
import FeedTabs from "../tabs/feed-tabs";
import { Tab } from "~/models/tab";
import type { UserSessionStore } from "../../common/auth/auth-provider";
import { UserSessionContext } from "../../common/auth/auth-provider";

export interface OverviewStore {
  selectedTag: string;
  activeTab: Tab;
}

export default component$(() => {
  const userSession = useContext<UserSessionStore>(UserSessionContext);
  const overviewStore = useStore<OverviewStore>({
    selectedTag: "",
    activeTab: userSession.isLoggedIn ? Tab.Your : Tab.Global,
  });

  return (
    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <FeedTabs
            overviewStore={overviewStore}
            updateTag$={async (tag) => {
              overviewStore.selectedTag = tag;
            }}
            updateTab$={async (tab) => {
              overviewStore.activeTab = tab;
            }}
          />
          <ArticleList overviewStore={overviewStore} />
        </div>

        <TagsSidebar
          updateTag$={async (tag) => {
            overviewStore.selectedTag = tag;
          }}
        />
      </div>
    </div>
  );
});
