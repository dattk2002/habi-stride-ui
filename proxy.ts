import { NextResponse, type NextRequest } from "next/server";

const redesignedRoutes = new Set(["/dashboard", "/habits", "/insights", "/tree", "/settings", "/login", "/register"]);
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/favicon.ico") {
    const iconUrl = request.nextUrl.clone(); iconUrl.pathname = "/habistride-mark-28.png"; iconUrl.search = "";
    return NextResponse.rewrite(iconUrl);
  }
  if (!redesignedRoutes.has(request.nextUrl.pathname)) return NextResponse.next();
  const url = request.nextUrl.clone(); url.pathname = `/v2${request.nextUrl.pathname}`;
  return NextResponse.rewrite(url);
}
export const config = { matcher: ["/dashboard", "/habits", "/insights", "/tree", "/settings", "/login", "/register", "/favicon.ico"] };
