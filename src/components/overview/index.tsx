import { component$ } from "@builder.io/qwik";
import ArticleList from "../articles/article-list";
import TagsSidebar from "../tags/tags-sidebar";

export default component$(() => {
  return (
    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a class="nav-link" href="">
                  Your Feed
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="">
                  Global Feed
                </a>
              </li>
            </ul>
          </div>
          <ArticleList />
          <ul class="pagination">
            <li class="page-item active">
              <a class="page-link" href="">
                1
              </a>
            </li>
            <li class="page-item">
              <a class="page-link" href="">
                2
              </a>
            </li>
          </ul>
        </div>
        <TagsSidebar />
      </div>
    </div>
  );
});
