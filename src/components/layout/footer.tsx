import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
export default component$(() => {
  return (
    <footer>
      <div class="container">
        <Link href="/" class="logo-font">
          conduit
        </Link>
        <span class="attribution">
          An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed
          under MIT.
        </span>
      </div>
    </footer>
  );
});
