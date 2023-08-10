import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";

import Header from "~/components/layout/header";
import Footer from "~/components/layout/footer";

export const onGet: RequestHandler = async ({ cacheControl, url, cookie, redirect }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
  // Protect Routes
  const authToken = cookie.get("authToken")?.value;
  const pathname = url.pathname;
  if ((pathname == "/editor/" || pathname == "/settings/" || pathname.includes("/profile/")) && !authToken)
    throw redirect(302, "/login");
};

export default component$(() => {
  return (
    <>
      <Header />
      <main>
        <Slot />
      </main>
      <Footer />
    </>
  );
});
