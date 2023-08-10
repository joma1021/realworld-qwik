import { component$, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import type { UserSessionStore } from "~/components/auth/auth-provider";
import { UserSessionContext } from "~/components/auth/auth-provider";

export default component$(() => {
  const userSession = useContext<UserSessionStore>(UserSessionContext);
  const pathname = useSignal("");
  const { url } = useLocation();
  useTask$(({ track }) => {
    track(() => url);
    pathname.value = url.pathname;
  });
  return (
    <nav class="navbar navbar-light">
      <div class="container">
        <Link class="navbar-brand" href="/">
          conduit
        </Link>
        {userSession.isLoggedIn ? (
          <ul class="nav navbar-nav pull-xs-right">
            <li class="nav-item">
              <Link class={`nav-link ${pathname.value == "/" ? "active" : ""}`} href="/">
                Home
              </Link>
            </li>

            <li class="nav-item">
              <Link class={`nav-link ${pathname.value === "/editor/" ? "active" : ""}`} href="/editor">
                <i class="ion-compose"></i>&nbsp;New Article{" "}
              </Link>
            </li>

            <li class="nav-item">
              <Link class={`nav-link ${pathname.value === "/setting/" ? "active" : ""}`} href="/settings">
                {" "}
                <i class="ion-gear-a"></i>&nbsp;Settings{" "}
              </Link>
            </li>
            <li class="nav-item">
              {/* TODO: <Link> doesn't lead to a updated of userprofile / reload of page if switching between profiles even tough rout url updates. It may be a bug from qwik -> find solution*/}
              <a
                class={`nav-link ${pathname.value.includes("profile") ? "active" : ""}`}
                href={`/profile/${userSession.username}`}
              >
                {userSession.image && <img width={25} height={25} src={userSession.image} class="user-pic" />}
                {userSession.username}
              </a>
            </li>
          </ul>
        ) : (
          <ul class="nav navbar-nav pull-xs-right">
            <li class="nav-item">
              <Link class={`nav-link ${pathname.value === "/" ? "active" : ""}`} href="/">
                Home
              </Link>
            </li>
            <li class="nav-item">
              <Link class={`nav-link ${pathname.value === "/login/" ? "active" : ""}`} href="/login">
                Sign In
              </Link>
            </li>
            <li class="nav-item">
              <Link class={`nav-link ${pathname.value === "/register/" ? "active" : ""}`} href="/register">
                Sign Up
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
});
