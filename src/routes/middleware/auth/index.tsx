import type { CookieOptions, RequestHandler } from "@builder.io/qwik-city";
import { BASE_URL } from "~/common/api";
import { setHeaders } from "~/common/headers";

export const onPost: RequestHandler = async ({ send, cookie, parseBody, url, next }) => {
  const body = await parseBody();

  const response = await fetch(`${BASE_URL}/users${url.searchParams.get("path") ?? ""}`, {
    method: "POST",
    headers: setHeaders(),
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const res = new Response(JSON.stringify(data), { status: response.status });
    send(res);
    next();
  } else {
    const cookieOptions: CookieOptions = { httpOnly: true, maxAge: [1, "days"], path: "/" };
    cookie.set("authToken", data.user.token, cookieOptions);
    cookie.set("username", data.user.username, cookieOptions);
    cookie.set("image", data.user.image, cookieOptions);
    const response = new Response(JSON.stringify(data), { status: 200 });
    send(response);
  }
};

export const onDelete: RequestHandler = async ({ send, cookie }) => {
  const cookieOptions: CookieOptions = { path: "/" };
  cookie.delete("authToken", cookieOptions);
  cookie.delete("username", cookieOptions);
  cookie.delete("image", cookieOptions);

  const response = new Response("Auth-Cookies deleted", { status: 200 });
  send(response);
};
