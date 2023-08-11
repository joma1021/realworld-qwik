import type { PropFunction } from "@builder.io/qwik";
import { component$, useTask$, useContext } from "@builder.io/qwik";
import { Tab } from "~/models/tab";
import type { OverviewStore } from "../articles/article-overview";
import { Link } from "@builder.io/qwik-city";
import type { UserSessionStore } from "../../common/auth/auth-provider";
import { UserSessionContext } from "../../common/auth/auth-provider";

interface FeedTabsProps {
  overviewStore: OverviewStore;
  updateTag$: PropFunction<(tag: string) => void>;
  updateTab$: PropFunction<(tab: Tab) => void>;
}

export default component$((props: FeedTabsProps) => {
  const userSession = useContext<UserSessionStore>(UserSessionContext);
  useTask$(({ track }) => {
    track(() => props.overviewStore.selectedTag);
    if (props.overviewStore.selectedTag != "") props.updateTab$(Tab.Tag);
  });
  return (
    <div class="feed-toggle">
      <ul class="nav nav-pills outline-active">
        <li class="nav-item">
          {userSession.isLoggedIn && (
            <Link
              class={`nav-link ${props.overviewStore.activeTab == Tab.Your && "active"}`}
              style="cursor: pointer;"
              onClick$={async () => {
                await props.updateTab$(Tab.Your);
                await props.updateTag$("");
              }}
            >
              Your Feed
            </Link>
          )}
        </li>
        <li class="nav-item">
          <Link
            class={`nav-link ${props.overviewStore.activeTab == Tab.Global && "active"}`}
            style="cursor: pointer;"
            onClick$={async () => {
              await props.updateTab$(Tab.Global);
              await props.updateTag$("");
            }}
          >
            Global Feed
          </Link>
        </li>
        {props.overviewStore.activeTab == Tab.Tag && (
          <li class="nav-item">
            <Link class={`nav-link ${props.overviewStore.activeTab == Tab.Tag && "active"}`} style="cursor: pointer;">
              #{props.overviewStore.selectedTag}
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
});
