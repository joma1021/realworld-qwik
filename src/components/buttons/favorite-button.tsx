import type { PropFunction } from "@builder.io/qwik";
import { component$, useContext, useStore, $, useTask$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import type { UserSessionStore } from "~/common/auth/auth-provider";
import { UserSessionContext } from "~/common/auth/auth-provider";
import { favoriteArticle, unfavoriteArticle } from "~/services/article-service";

interface FavoriteStore {
  favorite: boolean;
  count: number;
}

interface FavoriteProps {
  updateFavorite$: PropFunction<(favorite: boolean, count: number) => void>;
  favorite: boolean;
  count: number;
  slug: string;
}

export const FavoriteButtonLarge = component$((props: FavoriteProps) => {
  const favoriteStore = useStore<FavoriteStore>({ favorite: props.favorite, count: props.count });
  const userSession = useContext<UserSessionStore>(UserSessionContext);
  const navigate = useNavigate();

  useTask$(({ track }) => {
    track(() => props.favorite);
    favoriteStore.favorite = props.favorite;
    favoriteStore.count = props.count;
  });

  const handleOnClick = $(async () => {
    if (favoriteStore.favorite) {
      const response = await unfavoriteArticle(userSession.authToken, props.slug);
      if (response.ok) {
        favoriteStore.count -= 1;
        favoriteStore.favorite = false;
        await props.updateFavorite$(favoriteStore.favorite, favoriteStore.count);
      }
    } else {
      const response = await favoriteArticle(userSession.authToken, props.slug);
      if (response.ok) {
        favoriteStore.count += 1;
        favoriteStore.favorite = true;
        await props.updateFavorite$(favoriteStore.favorite, favoriteStore.count);
      }
    }
  });

  return (
    <button
      class={`btn btn-sm btn-${!favoriteStore.favorite ? "outline-" : ""}primary`}
      onClick$={userSession.isLoggedIn ? handleOnClick : $(() => navigate("/register"))}
    >
      <i class="ion-heart"></i>
      &nbsp; {favoriteStore.favorite ? "Unfavorite" : "Favorite"} Article{" "}
      <span class="counter">({favoriteStore.count})</span>
    </button>
  );
});

export const FavoriteButtonSmall = component$((props: { favorite: boolean; count: number; slug: string }) => {
  const favoriteStore = useStore<FavoriteStore>({ favorite: props.favorite, count: props.count });
  const userSession = useContext<UserSessionStore>(UserSessionContext);
  const navigate = useNavigate();

  const handleOnClick = $(async () => {
    if (favoriteStore.favorite) {
      const response = await unfavoriteArticle(userSession.authToken, props.slug);
      if (response.ok) {
        favoriteStore.count -= 1;
        favoriteStore.favorite = false;
      }
    } else {
      const response = await favoriteArticle(userSession.authToken, props.slug);
      if (response.ok) {
        favoriteStore.count += 1;
        favoriteStore.favorite = true;
      }
    }
  });
  return (
    <button
      class={`btn btn-${!favoriteStore.favorite ? "outline-" : ""}primary btn-sm pull-xs-right`}
      onClick$={userSession.isLoggedIn ? handleOnClick : $(() => navigate("/register"))}
    >
      <i class="ion-heart"></i> {favoriteStore.count}
    </button>
  );
});
