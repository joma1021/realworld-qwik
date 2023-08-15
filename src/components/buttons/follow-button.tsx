import type { PropFunction } from "@builder.io/qwik";
import { component$, useContext, useSignal, $, useTask$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import type { UserSessionStore } from "~/common/auth/auth-provider";
import { UserSessionContext } from "~/common/auth/auth-provider";
import { followUser, unfollowUser } from "~/services/profile-service";

interface FollowButtonProps {
  updateFollow$: PropFunction<(follow: boolean) => void>;
  following: boolean;
  username: string;
}

export const FollowButton = component$((props: FollowButtonProps) => {
  const following = useSignal(props.following);
  const userSession = useContext<UserSessionStore>(UserSessionContext);
  const navigate = useNavigate();

  useTask$(({ track }) => {
    track(() => props.following);
    following.value = props.following;
  });

  const handleOnClick = $(async () => {
    if (following.value) {
      const response = await unfollowUser(userSession.authToken, props.username);
      if (response.ok) {
        following.value = false;
        await props.updateFollow$(following.value);
      }
    } else {
      const response = await followUser(userSession.authToken, props.username);
      if (response.ok) {
        following.value = true;
        await props.updateFollow$(following.value);
      }
    }
  });

  return (
    <button
      class={`btn btn-sm btn-${!following.value ? "outline-" : ""}secondary`}
      onClick$={userSession.isLoggedIn ? handleOnClick : $(() => navigate("/register"))}
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

  const handleOnClick = $(async () => {
    if (following.value) {
      const response = await unfollowUser(userSession.authToken, props.username);
      if (response.ok) {
        following.value = false;
      }
    } else {
      const response = await followUser(userSession.authToken, props.username);
      if (response.ok) {
        following.value = true;
      }
    }
  });

  return (
    <button
      class={`btn btn-sm btn-${!following.value ? "outline-" : ""}secondary action-btn`}
      onClick$={userSession.isLoggedIn ? handleOnClick : $(() => navigate("/register"))}
    >
      <i class="ion-plus-round"></i>
      &nbsp; {following.value ? "Unfollow" : "Follow"} {props.username} <span class="counter"></span>
    </button>
  );
});
