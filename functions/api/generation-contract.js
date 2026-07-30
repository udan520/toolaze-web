import {
  IMAGE_GENERATION_CONTRACT_VERSION,
  SUPPORTED_IMAGE_GENERATION_MODEL_IDS,
} from '../_shared/image-generation-contract.mjs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store',
};

export async function onRequest({ request }) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (request.method !== 'GET') {
    return Response.json({ error: 'Method not allowed' }, { status: 405, headers: CORS });
  }

  return Response.json({
    version: IMAGE_GENERATION_CONTRACT_VERSION,
    models: SUPPORTED_IMAGE_GENERATION_MODEL_IDS,
  }, { headers: CORS });
}
