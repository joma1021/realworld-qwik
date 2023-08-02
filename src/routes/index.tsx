import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import ArticleOverview from "../components/articles/article-overview";

export default component$(() => {
  return (
    <div class="home-page">
      <div class="banner">
        <div class="container">
          <h1 class="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>
      <ArticleOverview />
    </div>
  );
});

export const head: DocumentHead = {
  title: "conduit with Qwik",
  meta: [
    {
      name: "description",
      content: "A place to share your knowledge.",
    },
  ],
};
