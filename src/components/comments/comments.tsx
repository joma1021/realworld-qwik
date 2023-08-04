import { Resource, component$, useResource$ } from "@builder.io/qwik";
import type { CommentData } from "~/models/comment";
import { getComments } from "~/services/article-service";

export default component$((props: { slug: string }) => {
  const comments = useResource$<CommentData[]>(({ cleanup }) => {
    const controller = new AbortController();
    cleanup(() => controller.abort());
    console.log("call article fetch");
    return getComments(props.slug, controller);
  });

  return (
    <div class="row">
      <div class="col-xs-12 col-md-8 offset-md-2">
        <form class="card comment-form">
          <div class="card-block">
            <textarea class="form-control" placeholder="Write a comment..." rows={3}></textarea>
          </div>
          <div class="card-footer">
            <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
            <button class="btn btn-sm btn-primary">Post Comment</button>
          </div>
        </form>

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
                    <a href={`/profile/${comment.author}`} class="comment-author">
                      <img src={comment.author.image} class="comment-author-img" />
                    </a>
                    &nbsp;
                    <a href={`/profile/${comment.author}`} class="comment-author">
                      {comment.author.username}
                    </a>
                    <span class="date-posted">{comment.createdAt}</span>
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
