import { Resource, component$, useContext, useResource$, useStore, $ } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import type { UserSessionStore } from "~/common/auth/auth-provider";
import { UserSessionContext } from "~/common/auth/auth-provider";
import ProfileTabs from "~/components/tabs/profile-tabs";
import type { ArticlesDTO } from "~/models/article";
import type { AuthorData } from "~/models/author";
import { Tab } from "~/models/tab";
import { getProfileArticles } from "~/services/article-service";
import { getProfile } from "~/services/profile-service";
import { ArticlePreview } from "~/components/articles/article-preview";

export interface ProfileStore {
  activeTab: Tab;
  pageNumber: number;
}

export default component$(() => {
  const navigate = useNavigate();
  const username = useLocation().params.username;
  const userSession = useContext<UserSessionStore>(UserSessionContext);
  const profileStore = useStore<ProfileStore>({
    activeTab: Tab.MyArticles,
    pageNumber: 1,
  });

  const profile = useResource$<AuthorData>(async ({ cleanup }) => {
    const token = userSession.authToken;
    const controller = new AbortController();
    cleanup(() => controller.abort());
    return getProfile(username, token, controller);
  });

  const articles = useResource$<ArticlesDTO>(({ track, cleanup }) => {
    track(() => profileStore.pageNumber);
    track(() => profileStore.activeTab);
    const controller = new AbortController();
    cleanup(() => controller.abort());

    if (profileStore.activeTab == Tab.MyArticles) {
      return getProfileArticles(
        username,
        profileStore.activeTab,
        userSession.authToken,
        controller,
        profileStore.pageNumber
      );
    } else {
      return getProfileArticles(
        username,
        profileStore.activeTab,
        userSession.authToken,
        controller,
        profileStore.pageNumber
      );
    }
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
                    <button
                      class="btn btn-sm btn-outline-secondary action-btn"
                      onClick$={$(() => navigate("/settings"))}
                    >
                      <i class="ion-gear-a"></i>
                      &nbsp; Edit Profile Settings
                    </button>
                  ) : (
                    <button class={`btn btn-sm btn-${!profile.following ? "outline-" : ""}secondary action-btn`}>
                      <i class="ion-plus-round"></i>
                      &nbsp; {`${profile.following ? "Unfollow" : "Follow"} ${profile.username}`}
                    </button>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      </div>

      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <ProfileTabs
              profileStore={profileStore}
              updateTab$={async (tab) => {
                profileStore.activeTab = tab;
              }}
            />

            <Resource
              value={articles}
              onPending={() => <div>Loading Articles...</div>}
              onRejected={(reason) => <div>Error: {reason}</div>}
              onResolved={(articles) => (
                <>
                  {articles.articles.length == 0 ? (
                    <div>No articles are here... yet.</div>
                  ) : (
                    <ul>
                      {articles.articles.map((article) => (
                        <ArticlePreview article={article} key={article.slug} />
                      ))}
                    </ul>
                  )}

                  <ul class="pagination">
                    {Array(Math.ceil(articles.articlesCount / 5))
                      .fill(null)
                      .map((_, i) => (
                        <li class={`page-item  ${i == profileStore.pageNumber - 1 ? "active" : ""}`} key={i}>
                          <a
                            class="page-link"
                            style="cursor: pointer;"
                            onClick$={() => {
                              profileStore.pageNumber = i + 1;
                            }}
                          >
                            {i + 1}
                          </a>
                        </li>
                      ))}
                  </ul>
                </>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
