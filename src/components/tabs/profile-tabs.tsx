import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { Tab } from "~/models/tab";
import { Link, useLocation } from "@builder.io/qwik-city";

export default component$(() => {
  const { url } = useLocation();
  const tab = useSignal(Tab.My);

  useTask$(({ track }) => {
    track(() => url);
    const filter = url.searchParams.get("filter");
    if (filter) tab.value = filter;
  });

  return (
    <div class="article-toggle">
      <ul class="nav nav-pills outline-active">
        <li class="nav-item">
          <Link class={`nav-link ${tab.value == Tab.My && "active"}`} href={`?filter=${Tab.My}`}>
            {" "}
            My Articles
          </Link>
        </li>
        <li class="nav-item">
          <Link class={`nav-link ${tab.value == Tab.Fav && "active"}`} href={`?filter=${Tab.Fav}`}>
            Favorite Articles
          </Link>
        </li>
      </ul>
    </div>
  );
});
