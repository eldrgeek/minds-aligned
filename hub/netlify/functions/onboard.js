/* onboard.js — one splat function for every SOMA Onboard route.
 *
 * Routed from /api/onboard/* by hub/netlify.toml. Serverless rather than edge (unlike
 * /api/ask): these are single Supabase round-trips, tens of milliseconds, nowhere near
 * the Free-plan 10s ceiling — and the store needs the Node Supabase client.
 *
 * Routes it serves (see @soma/onboard README): invite-info, prepare-invite, invite-send,
 * invite-open, one-click-join, join, invitees, session.
 */

import { onboard } from './_onboard.js';

export const handler = onboard.route;
