import { component$, useTask$, useContext, useSignal } from "@builder.io/qwik";

import { Link, useLocation } from "@builder.io/qwik-city";
import type { UserSessionStore } from "../../common/auth/auth-provider";
import { UserSessionContext } from "../../common/auth/auth-provider";
import { Tab } from "~/models/tab";

export default component$(() => {
  const userSession = useContext<UserSessionStore>(UserSessionContext);
  const { url } = useLocation();
  const tab = useSignal(userSession.isLoggedIn ? Tab.Your : Tab.Global);

  useTask$(({ track }) => {
    track(() => url);
    const filter = url.searchParams.get("filter");
    if (filter) tab.value = filter;
  });
  return (
    <div class="feed-toggle">
      <ul class="nav nav-pills outline-active">
        <li class="nav-item">
          {userSession.isLoggedIn && (
            <Link class={`nav-link ${tab.value == Tab.Your && "active"}`} style="cursor: pointer;" href={`/?filter=${Tab.Your}`}>
              Your Feed
            </Link>
          )}
        </li>
        <li class="nav-item">
          <Link class={`nav-link ${tab.value == Tab.Global && "active"}`} style="cursor: pointer;" href={`/?filter=${Tab.Global}`}>
            Global Feed
          </Link>
        </li>
        {tab.value != Tab.Your && tab.value != Tab.Global && (
          <li class="nav-item">
            <Link class={"nav-link active"} style="cursor: pointer;">
              #{tab.value}
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
});
