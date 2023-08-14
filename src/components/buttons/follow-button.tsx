import { component$, useContext, useSignal, $ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import type { UserSessionStore } from "~/common/auth/auth-provider";
import { UserSessionContext } from "~/common/auth/auth-provider";

export const FollowButton = component$((props: { following: boolean; username: string }) => {
  const following = useSignal(props.following);
  const userSession = useContext<UserSessionStore>(UserSessionContext);
  const navigate = useNavigate();
  return (
    <button
      class={`btn btn-sm btn-${!following.value ? "outline-" : ""}secondary`}
      onClick$={userSession.isLoggedIn ? $(() => {}) : $(() => navigate("/register"))}
    >
      <i class="ion-plus-round"></i>
      &nbsp; {following.value ? "Unfollow" : "Follow"} {props.username} <span class="counter"></span>
    </button>
  );
});

export const ActionFollowButton = component$((props: { following: boolean; username: string }) => {
  const following = useSignal(props.following);
  const userSession = useContext<UserSessionStore>(UserSessionContext);
  const navigate = useNavigate();
  return (
    <button
      class={`btn btn-sm btn-${!following.value ? "outline-" : ""}secondary action-btn`}
      onClick$={userSession.isLoggedIn ? $(() => {}) : $(() => navigate("/register"))}
    >
      <i class="ion-plus-round"></i>
      &nbsp; {following.value ? "Unfollow" : "Follow"} {props.username} <span class="counter"></span>
    </button>
  );
});
