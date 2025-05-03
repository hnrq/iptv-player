import { json } from '@sveltejs/kit';
import parseM3U from '$lib/utils/parseM3U';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => json(await parseM3U(params.url));
