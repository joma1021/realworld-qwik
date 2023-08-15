import type { QwikKeyboardEvent } from "@builder.io/qwik";
import { component$, useStore, $, useContext, useSignal } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import type { UserSessionStore } from "~/common/auth/auth-provider";
import { UserSessionContext } from "~/common/auth/auth-provider";
import { validateInput } from "~/common/helpers";
import FormError from "~/components/errors/form-error";
import type { EditArticleData } from "~/models/article";
import { createArticle } from "~/services/article-service";

interface CreateArticleStore {
  hasError: boolean;
  errorMessages: { [key: string]: string[] };
  isLoading: boolean;
  newArticle: EditArticleData;
}

export default component$(() => {
  const userSession = useContext<UserSessionStore>(UserSessionContext);
  const navigate = useNavigate();

  const createArticleStore = useStore<CreateArticleStore>({
    hasError: false,
    errorMessages: { [""]: [""] },
    isLoading: false,
    newArticle: {
      tagList: [],
      title: "",
      description: "",
      body: "",
    },
  });

  const validateArticle = $((newArticle: EditArticleData) => {
    if (validateInput(newArticle.title)) {
      createArticleStore.errorMessages = { [newArticle.title]: ["title can't be blank"] };
      createArticleStore.hasError = true;
      createArticleStore.isLoading = false;
      return false;
    }

    if (validateInput(newArticle.description)) {
      createArticleStore.errorMessages = { [newArticle.description]: ["description can't be blank"] };
      createArticleStore.hasError = true;
      createArticleStore.isLoading = false;
      return false;
    }

    if (validateInput(newArticle.body)) {
      createArticleStore.errorMessages = { [newArticle.body]: ["body can't be blank"] };
      createArticleStore.hasError = true;
      createArticleStore.isLoading = false;
      return false;
    }
    return true;
  });

  const addTag = $((event: QwikKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const tag = (event.target as HTMLInputElement).value;

      createArticleStore.newArticle.tagList.push(tag);
      (event.target as HTMLInputElement).value = "";
    }
  });

  const onRemoveTag = $((tag: string) => {
    createArticleStore.newArticle.tagList = createArticleStore.newArticle.tagList.filter((t) => t != tag);
  });

  const handleSubmit = $(async () => {
    createArticleStore.isLoading = true;

    const newArticle = createArticleStore.newArticle;

    if (await validateArticle(newArticle)) {
      const response = await createArticle(userSession.authToken, newArticle);

      const data = await response.json();

      if (!response.ok) {
        createArticleStore.hasError = true;
        data.status == "error"
          ? (createArticleStore.errorMessages = { ["Error: "]: [data.message] })
          : (createArticleStore.errorMessages = data.errors);
      } else {
        navigate(`/article/${data.article.slug}`);
      }
    }

    createArticleStore.isLoading = false;
  });

  return (
    <div class="editor-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-10 offset-md-1 col-xs-12">
            {createArticleStore.hasError && <FormError errors={createArticleStore.errorMessages} />}
            <form>
              <fieldset>
                <fieldset class="form-group">
                  <input
                    type="text"
                    class="form-control form-control-lg"
                    name="title"
                    placeholder="Article Title"
                    onChange$={$(
                      (event: { target: { value: string } }) =>
                        (createArticleStore.newArticle.title = event.target.value)
                    )}
                  />
                </fieldset>
                <fieldset class="form-group">
                  <input
                    type="text"
                    class="form-control"
                    name="description"
                    placeholder="What's this article about?"
                    onChange$={$(
                      (event: { target: { value: string } }) =>
                        (createArticleStore.newArticle.description = event.target.value)
                    )}
                  />
                </fieldset>
                <fieldset class="form-group">
                  <textarea
                    class="form-control"
                    rows={8}
                    name="body"
                    placeholder="Write your article (in markdown)"
                    onChange$={$(
                      (event: { target: { value: string } }) =>
                        (createArticleStore.newArticle.body = event.target.value)
                    )}
                  ></textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input type="text" class="form-control" name="tag" placeholder="Enter tags" onKeyDown$={addTag} />
                  <div class="tag-list">
                    {createArticleStore.newArticle.tagList.map((tag) => (
                      <span class="tag-default tag-pill" key={tag}>
                        <i class="ion-close-round" onClick$={() => onRemoveTag(tag)}></i>
                        {tag}
                      </span>
                    ))}
                  </div>
                </fieldset>
                <button
                  class="btn btn-lg pull-xs-right btn-primary"
                  type="button"
                  disabled={createArticleStore.isLoading}
                  onClick$={handleSubmit}
                >
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
});
