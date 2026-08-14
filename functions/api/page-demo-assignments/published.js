import { handleOptions, jsonResponse } from '../../_shared/http.mjs';
import { listPublishedPageDemoAssignments } from '../../_shared/page-demo-assignments.mjs';

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') return handleOptions();
  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed', allow: 'GET, OPTIONS' }, 405);
  }

  const url = new URL(request.url);
  const pageSlug = url.searchParams.get('pageSlug') || url.searchParams.get('slug') || '';
  if (!pageSlug.trim()) return jsonResponse({ error: 'pageSlug is required.' }, 400);

  const result = await listPublishedPageDemoAssignments(env, {
    pageSlug,
    locale: url.searchParams.get('locale') || undefined,
  });

  return jsonResponse(result, 200, {
    'Cache-Control': 'public, max-age=0, s-maxage=15, stale-while-revalidate=45',
  });
}
