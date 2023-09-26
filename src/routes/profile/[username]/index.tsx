import { Resource, component$, useContext, useResource$, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import type { UserSessionStore } from "~/common/auth/auth-provider";
import { UserSessionContext } from "~/common/auth/auth-provider";
import type { AuthorData } from "~/models/author";
import { getProfile } from "~/services/profile-service";
import { ActionFollowButton } from "~/components/buttons/follow-button";
import { ArticleListProfile } from "~/components/articles/article-list-profile";

export default component$(() => {
  const navigate = useNavigate();
  const { params } = useLocation();
  const userSession = useContext<UserSessionStore>(UserSessionContext);

  const profile = useResource$<AuthorData>(async ({ cleanup, track }) => {
    track(() => params.username);
    const token = userSession.authToken;
    const controller = new AbortController();
    cleanup(() => controller.abort());
    return getProfile(params.username, token, controller);
  });

  return (
    <div class="profile-page">
      <div class="user-info">
        <div class="container">
          <div class="row">
            <Resource
              value={profile}
              onPending={() => <div>Loading Profile...</div>}
              onRejected={(reason) => <div>Error: {reason}</div>}
              onResolved={(profile) => (
                <div class="col-xs-12 col-md-10 offset-md-1">
                  <img src={profile.image} class="user-img" />
                  <h4>{profile.username}</h4>
                  <p>{profile.bio}</p>

                  {profile.username == userSession.username ? (
                    <button class="btn btn-sm btn-outline-secondary action-btn" onClick$={$(() => navigate("/settings"))}>
                      <i class="ion-gear-a"></i>
                      &nbsp; Edit Profile Settings
                    </button>
                  ) : (
                    <ActionFollowButton following={profile.following} username={profile.username} />
                  )}
                </div>
              )}
            />
          </div>
        </div>
      </div>
      <ArticleListProfile username={params.username} />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Conduit - Profile",
};
