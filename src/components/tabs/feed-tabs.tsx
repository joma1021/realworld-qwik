import type { PropFunction } from "@builder.io/qwik";
import { component$, useTask$ } from "@builder.io/qwik";
import { Tab } from "~/models/tab";
import type { OverviewStore } from "../articles/article-overview";
import { Link } from "@builder.io/qwik-city";

interface FeedTabsProps {
  overviewStore: OverviewStore;
  updateTag$: PropFunction<(tag: string) => void>;
  updateTab$: PropFunction<(tab: Tab) => void>;
}

export default component$((props: FeedTabsProps) => {
  const tabs = [
    { tab: Tab.Your, label: "Your Feed" },
    { tab: Tab.Global, label: "Global Feed" },
    { tab: Tab.Tag, label: "" },
  ];

  useTask$(({ track }) => {
    track(() => props.overviewStore.selectedTag);
    if (props.overviewStore.selectedTag != "") props.updateTab$(Tab.Tag);
  });
  console.log(`Render Feed-Tabs: Props-Tag:${props.overviewStore.activeTab};`);
  return (
    <div class="feed-toggle">
      <ul class="nav nav-pills outline-active">
        {tabs.map((tab) =>
          props.overviewStore.activeTab == tab.tab ? (
            <li class="nav-item" key={tab.label}>
              <Link class="nav-link active">
                {props.overviewStore.activeTab == Tab.Tag ? `#${props.overviewStore.selectedTag}` : tab.label}
              </Link>
            </li>
          ) : (
            <li class="nav-item" key={tab.label}>
              <Link
                class="nav-link"
                style="cursor: pointer;"
                onClick$={async () => {
                  await props.updateTab$(tab.tab);
                  await props.updateTag$("");
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
