import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { ArticleData } from "~/models/article";
import { FavoriteButtonSmall } from "../buttons/favorite-button";

export const ArticlePreview = component$((props: { article: ArticleData; key: string }) => {
  return (
    <div class="article-preview" key={props.key}>
      <div class="article-meta">
        {/* TODO: <Link> doesn't lead to a updated of userprofile / reload of page if switching between profiles even tough rout url updates. It may be a bug from qwik -> find solution*/}
        <a href={`/profile/${props.article.author.username}`}>
          <img src={`${props.article.author.image}`} />
        </a>
        <div class="info">
          <a href={`/profile/${props.article.author.username}`} class="author">
            {props.article.author.username}
          </a>
          <span class="date">{props.article.createdAt}</span>
        </div>
        <FavoriteButtonSmall
          favorite={props.article.favorited}
          count={props.article.favoritesCount}
          slug={props.article.slug}
        />
      </div>
      <Link href={`/article/${props.article.slug}`} class="preview-link">
        <h1>{props.article.title}</h1>
        <p>{props.article.description}</p>
        <span>Read more...</span>
        <ul class="tag-list">
          {props.article.tagList.map((tag) => (
            <li key={tag} class="tag-default tag-pill tag-outline">
              {tag}
            </li>
          ))}
        </ul>
      </Link>
    </div>
  );
});
