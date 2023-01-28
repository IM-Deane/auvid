import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - auth (auth/login, auth/signup route)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!auth|_next/static|_next/image|favicon.ico).*)",
	],
};

export async function middleware(req: NextRequest) {
	// We need to create a response and hand it to the supabase client to be able to modify the response headers.
	const res = NextResponse.next();

	const supabase = createMiddlewareSupabaseClient({ req, res });

	const {
		data: { session },
	} = await supabase.auth.getSession();

	// Check for valid session
	if (session?.user) {
		// Authentication successful, forward request to protected route.
		return res;
	}

	if (req.nextUrl.pathname === "/auth/login") {
		// If the user is not logged in and is trying to access the login page move to next.
		return NextResponse.rewrite(req.nextUrl.pathname);
	}

	// Invalid session redirect to login page.
	const redirectUrl = req.nextUrl.clone();
	redirectUrl.pathname = "/auth/login";
	redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
	return NextResponse.redirect(redirectUrl);
}
