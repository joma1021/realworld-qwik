import { Resource, component$, useContext, useResource$, $, useStore } from "@builder.io/qwik";
import type { CommentData } from "~/models/comment";

import type { UserSessionStore } from "~/common/auth/auth-provider";
import { UserSessionContext } from "~/common/auth/auth-provider";
import { Link } from "@builder.io/qwik-city";
import { validateInput } from "~/common/helpers";
import { createComment, deleteComment, getComments } from "~/services/comment-service";

export interface CommentStore {
  isLoading: boolean;
  newComment: CommentData | null;
  refreshComments: boolean;
}

export default component$((props: { slug: string }) => {
  const userSession = useContext<UserSessionStore>(UserSessionContext);
  const commentStore = useStore<CommentStore>({ isLoading: false, newComment: null, refreshComments: false });

  const comments = useResource$<CommentData[]>(({ track, cleanup }) => {
    track(() => commentStore.newComment);
    track(() => commentStore.refreshComments);
    commentStore.refreshComments = false;
    const controller = new AbortController();
    cleanup(() => controller.abort());
    return getComments(props.slug, userSession.authToken, controller);
  });

  const onSubmitComment = $(async (event: any) => {
    commentStore.isLoading = true;

    const comment = event.target.comment.value;

    if (validateInput(comment)) {
      commentStore.isLoading = false;
      return;
    }
    try {
      commentStore.newComment = await createComment(props.slug, comment, userSession.authToken);
    } catch (e) {
      commentStore.isLoading = false;
      return;
    }
    commentStore.isLoading = false;
    event.target.comment.value = "";
  });

  const onDeleteComment = $(async (commentId: number) => {
    try {
      await deleteComment(props.slug, commentId, userSession.authToken);
      commentStore.refreshComments = true;
    } catch (e) {
      return;
    }
  });

  return (
    <div class="row">
      <div class="col-xs-12 col-md-8 offset-md-2">
        {userSession.isLoggedIn ? (
          <form class="card comment-form" onSubmit$={onSubmitComment} preventdefault:submit>
            <div class="card-block">
              <textarea class="form-control" name="comment" placeholder="Write a comment..." rows={3}></textarea>
            </div>
            <div class="card-footer">
              <img src={userSession.image} class="comment-author-img" />
              <button class="btn btn-sm btn-primary" type="submit" disabled={commentStore.isLoading}>
                Post Comment{" "}
              </button>
            </div>
          </form>
        ) : (
          <div class="row">
            <div class="col-xs-12 col-md-8 offset-md-2">
              <p>
                <Link href="/login">Sign in</Link>
                &nbsp; or &nbsp;
                <Link href="/register">Sign up</Link>
                &nbsp; to add comments on this article.
              </p>
            </div>
          </div>
        )}

        <Resource
          value={comments}
          onPending={() => <div>Loading Comments...</div>}
          onRejected={(reason) => <div>Error: {reason}</div>}
          onResolved={(comments) => (
            <div class="tag-list">
              {comments.map((comment) => (
                <div class="card" key={comment.id}>
                  <div class="card-block">
                    <p class="card-text">{comment.body}</p>
                  </div>
                  <div class="card-footer">
                    <Link href={`/profile/${comment.author}`} class="comment-author">
                      <img src={comment.author.image} class="comment-author-img" />
                    </Link>
                    &nbsp;
                    <Link href={`/profile/${comment.author}`} class="comment-author">
                      {comment.author.username}
                    </Link>
                    <span class="date-posted">{comment.createdAt}</span>
                    {comment.author.username == userSession.username && (
                      <span class="mod-options">
                        <i class="ion-trash-a" onClick$={() => onDeleteComment(comment.id)}></i>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        />
      </div>
    </div>
  );
});
