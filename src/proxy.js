import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

// Next.js 16 "proxy" (formerly middleware): refreshes the Supabase session and guards the CMS dashboard.
export async function proxy(request) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(list) {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user && request.nextUrl.pathname.startsWith('/staff/dashboard')) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = '/staff/login';
    return NextResponse.redirect(redirect);
  }
  return response;
}
export const config = { matcher: ['/staff/:path*'] };
