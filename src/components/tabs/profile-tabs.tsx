import type { PropFunction } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import { Tab } from "~/models/tab";
import { Link } from "@builder.io/qwik-city";
import type { ProfileStore } from "~/routes/profile/[username]";

interface ProfileTabsProps {
  profileStore: ProfileStore;
  updateTab$: PropFunction<(tab: Tab) => void>;
}

export default component$((props: ProfileTabsProps) => {
  const tabs = [
    { tab: Tab.MyArticles, label: "My Articles" },
    { tab: Tab.FavArticles, label: "Favorite Articles" },
  ];

  return (
    <div class="article-toggle">
      <ul class="nav nav-pills outline-active">
        {tabs.map((tab) =>
          props.profileStore.activeTab == tab.tab ? (
            <li class="nav-item" key={tab.label}>
              <Link class="nav-link active">{tab.label}</Link>
            </li>
          ) : (
            <li class="nav-item" key={tab.label}>
              <Link
                class="nav-link"
                style="cursor: pointer;"
                onClick$={async () => {
                  await props.updateTab$(tab.tab);
                }}
              >
                {tab.label}
              </Link>
            </li>
          )
        )}{" "}
      </ul>
    </div>
  );
});
