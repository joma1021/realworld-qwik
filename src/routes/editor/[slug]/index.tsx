import type { QwikKeyboardEvent } from "@builder.io/qwik";
import { component$, useStore, $, useContext, useResource$, Resource } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import type { UserSessionStore } from "~/common/auth/auth-provider";
import { UserSessionContext } from "~/common/auth/auth-provider";
import { validateInput } from "~/common/helpers";
import FormError from "~/components/errors/form-error";
import type { ArticleData, EditArticleData } from "~/models/article";
import { getArticle, updateArticle } from "~/services/article-service";

interface EditArticleStore {
  hasError: boolean;
  errorMessages: { [key: string]: string[] };
  isLoading: boolean;
  article: EditArticleData;
}

export default component$(() => {
  const userSession = useContext<UserSessionStore>(UserSessionContext);
  const navigate = useNavigate();
  const slug = useLocation().params.slug;

  const editArticleStore = useStore<EditArticleStore>({
    hasError: false,
    errorMessages: { [""]: [""] },
    isLoading: false,
    article: {
      tagList: [],
      title: "",
      description: "",
      body: "",
    },
  });

  const article = useResource$<ArticleData>(async () => {
    const article = await getArticle(slug, userSession.authToken);
    editArticleStore.article = {
      tagList: article.tagList,
      title: article.title,
      description: article.description,
      body: article.body,
    };

    return article;
  });
  const validateArticle = $((newArticle: EditArticleData) => {
    if (validateInput(newArticle.title)) {
      editArticleStore.errorMessages = { [newArticle.title]: ["title can't be blank"] };
      editArticleStore.hasError = true;
      editArticleStore.isLoading = false;
      return false;
    }

    if (validateInput(newArticle.description)) {
      editArticleStore.errorMessages = { [newArticle.description]: ["description can't be blank"] };
      editArticleStore.hasError = true;
      editArticleStore.isLoading = false;
      return false;
    }

    if (validateInput(newArticle.body)) {
      editArticleStore.errorMessages = { [newArticle.body]: ["body can't be blank"] };
      editArticleStore.hasError = true;
      editArticleStore.isLoading = false;
      return false;
    }
    return true;
  });

  const addTag = $((event: QwikKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const tag = (event.target as HTMLInputElement).value;

      editArticleStore.article.tagList.push(tag);
      (event.target as HTMLInputElement).value = "";
    }
  });

  const onRemoveTag = $((tag: string) => {
    editArticleStore.article.tagList = editArticleStore.article.tagList.filter((t) => t != tag);
  });

  const handleSubmit = $(async () => {
    editArticleStore.isLoading = true;

    const article = editArticleStore.article;

    if (await validateArticle(article)) {
      const response = await updateArticle(userSession.authToken, slug, article);
      const data = await response.json();

      if (!response.ok) {
        if (response.status == 422) {
          editArticleStore.hasError = true;
          const data = await response.json();
          data.status == "error"
            ? (editArticleStore.errorMessages = { ["Error: "]: [data.message] })
            : (editArticleStore.errorMessages = data.errors);
        } else {
          editArticleStore.hasError = true;
          editArticleStore.errorMessages = { [""]: ["unknown error"] };
        }
      } else {
        navigate(`/article/${data.article.slug}`);
      }
    }

    editArticleStore.isLoading = false;
  });

  return (
    <div class="editor-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-10 offset-md-1 col-xs-12">
            {editArticleStore.hasError && <FormError errors={editArticleStore.errorMessages} />}
            <Resource
              value={article}
              onPending={() => <div>Loading Article...</div>}
              onRejected={(reason) => <div>Error: {reason}</div>}
              onResolved={(article) => (
                <form>
                  <fieldset>
                    <fieldset class="form-group">
                      <input
                        type="text"
                        class="form-control form-control-lg"
                        name="title"
                        placeholder="Article Title"
                        value={article.title}
                        onChange$={$(
                          (event: { target: { value: string } }) =>
                            (editArticleStore.article.title = event.target.value)
                        )}
                      />
                    </fieldset>
                    <fieldset class="form-group">
                      <input
                        type="text"
                        class="form-control"
                        name="description"
                        placeholder="What's this article about?"
                        value={article.description}
                        onChange$={$(
                          (event: { target: { value: string } }) =>
                            (editArticleStore.article.description = event.target.value)
                        )}
                      />
                    </fieldset>
                    <fieldset class="form-group">
                      <textarea
                        class="form-control"
                        rows={8}
                        name="body"
                        placeholder="Write your article (in markdown)"
                        value={article.body}
                        onChange$={$(
                          (event: { target: { value: string } }) => (editArticleStore.article.body = event.target.value)
                        )}
                      ></textarea>
                    </fieldset>
                    <fieldset class="form-group">
                      <input type="text" class="form-control" name="tag" placeholder="Enter tags" onKeyDown$={addTag} />
                      <div class="tag-list">
                        {editArticleStore.article.tagList.map((tag) => (
                          <span class="tag-default tag-pill" key={tag}>
                            <i class="ion-close-round" onClicks$={() => onRemoveTag(tag)}></i>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </fieldset>
                    <button
                      class="btn btn-lg pull-xs-right btn-primary"
                      type="button"
                      disabled={editArticleStore.isLoading}
                      onClick$={handleSubmit}
                    >
                      Update Article
                    </button>
                  </fieldset>
                </form>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Conduit - Editor",
};
