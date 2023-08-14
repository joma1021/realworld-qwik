import { component$, useContext, useStore, $ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import type { UserSessionStore } from "~/common/auth/auth-provider";
import { UserSessionContext } from "~/common/auth/auth-provider";

interface FavoriteStore {
  favorite: boolean;
  count: number;
}

export const FavoriteButtonLarge = component$((props: { favorite: boolean; count: number }) => {
  const favoriteStore = useStore<FavoriteStore>({ favorite: props.favorite, count: props.count });
  const userSession = useContext<UserSessionStore>(UserSessionContext);
  const navigate = useNavigate();
  return (
    <button
      class={`btn btn-sm btn-${!favoriteStore.favorite ? "outline-" : ""}primary`}
      onClick$={userSession.isLoggedIn ? $(() => {}) : $(() => navigate("/register"))}
    >
      <i class="ion-heart"></i>
      &nbsp; {favoriteStore.favorite ? "Unfavorite" : "Favorite"} Article{" "}
      <span class="counter">({favoriteStore.count})</span>
    </button>
  );
});

export const FavoriteButtonSmall = component$((props: { favorite: boolean; count: number }) => {
  const favoriteStore = useStore<FavoriteStore>({ favorite: props.favorite, count: props.count });
  const userSession = useContext<UserSessionStore>(UserSessionContext);
  const navigate = useNavigate();
  return (
    <button
      class={`btn btn-${!favoriteStore.favorite ? "outline-" : ""}primary btn-sm pull-xs-right`}
      onClick$={userSession.isLoggedIn ? $(() => {}) : $(() => navigate("/register"))}
    >
      <i class="ion-heart"></i> {favoriteStore.count}
    </button>
  );
});
