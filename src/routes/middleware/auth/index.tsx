import type { CookieOptions, RequestHandler } from "@builder.io/qwik-city";

export const onPost: RequestHandler = async ({ parseBody, send, cookie }) => {
  const body = (await parseBody()) as any;
  const responseError = new Response("Missing token", { status: 401 });

  if (!body?.token) {
    send(responseError);
    return;
  }

  const cookieOptions: CookieOptions = { httpOnly: true, maxAge: [1, "days"], path: "/" };
  cookie.set("authToken", body.token, cookieOptions);
  cookie.set("username", body.username, cookieOptions);
  cookie.set("image", body.image, cookieOptions);

  const response = new Response("Auth-Token stored", { status: 200 });
  send(response);
  return;
};

export const onDelete: RequestHandler = async ({ send, cookie }) => {
  const cookieOptions: CookieOptions = { path: "/" };
  cookie.delete("authToken", cookieOptions);
  cookie.delete("username", cookieOptions);
  cookie.delete("image", cookieOptions);

  const response = new Response("Auth-Token deleted", { status: 200 });
  send(response);
  return;
};
