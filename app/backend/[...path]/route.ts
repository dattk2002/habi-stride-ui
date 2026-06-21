type Context = { params: Promise<{ path: string[] }> };

async function proxy(request: Request, context: Context) {
  const { path } = await context.params;
  const incoming = new URL(request.url);
  const base = process.env.API_INTERNAL_URL || "http://localhost:3000";
  const target = `${base.replace(/\/$/, "")}/${path.map(encodeURIComponent).join("/")}${incoming.search}`;
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  const hasBody = !["GET", "HEAD"].includes(request.method);
  try {
    const response = await fetch(target, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: "no-store",
    });
    const outgoingHeaders = new Headers(response.headers);
    outgoingHeaders.delete("content-encoding");
    outgoingHeaders.delete("content-length");
    return new Response(response.body, { status: response.status, headers: outgoingHeaders });
  } catch {
    return Response.json({ message: "API is unavailable" }, { status: 502 });
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
