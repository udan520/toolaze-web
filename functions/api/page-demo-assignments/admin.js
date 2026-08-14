import { getCurrentUser } from '../../_shared/auth.mjs';
import { handleOptions, jsonResponse } from '../../_shared/http.mjs';
import { isMediaLibraryAdminEmail } from '../../_shared/media-library.mjs';
import {
  archivePageDemoAssignment,
  listPageDemoAssignments,
  publishPageDemoAssignment,
  saveDraftPageDemoAssignment,
  updateDraftPageDemoAssignment,
} from '../../_shared/page-demo-assignments.mjs';

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') return handleOptions();

  const user = await getCurrentUser(env, request);
  if (!user) return jsonResponse({ error: 'Please sign in with an admin account.' }, 401);
  if (!isMediaLibraryAdminEmail(user.email, env)) {
    return jsonResponse({ error: 'Admin access required.' }, 403);
  }

  if (request.method === 'GET') {
    const url = new URL(request.url);
    return jsonResponse(await listPageDemoAssignments(env, {
      status: url.searchParams.get('status'),
    }));
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed', allow: 'GET, POST, OPTIONS' }, 405);
  }

  const body = await request.json().catch(() => ({}));
  let result;

  if (body.action === 'save_draft') {
    result = await saveDraftPageDemoAssignment(env, body);
  } else if (body.action === 'update_draft') {
    result = await updateDraftPageDemoAssignment(env, body);
  } else if (body.action === 'publish') {
    result = await publishPageDemoAssignment(env, body.assignmentId);
  } else if (body.action === 'archive') {
    result = await archivePageDemoAssignment(env, body.assignmentId);
  } else {
    result = { ok: false, status: 400, error: 'Unknown page demo assignment action.' };
  }

  if (!result.ok) return jsonResponse({ error: result.error }, result.status || 400);
  return jsonResponse({
    ...result,
    previewUrl: result.assignment?.id ? `/admin/page-demo-preview?id=${encodeURIComponent(result.assignment.id)}` : undefined,
  }, body.action === 'save_draft' ? 201 : 200);
}
