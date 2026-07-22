/* _onboard.js — SOMA Onboard configuration for the AGI-26 constellation.
 *
 * ONE membership for the whole constellation, not one per archive.
 *
 * SOMA-APP-STANDARD §15b keeps apps federated — vc_members and r1x1_members are
 * deliberately different tables. That rule is about separate *apps*. The AGI-26
 * constellation is a single app with thirteen surfaces: someone who joins standing
 * in front of the Friston archive has joined the constellation, and should not be
 * asked to join again at Koch. So there is one `agi26_` prefix, served from the hub,
 * and every property points its invite affordance here.
 *
 * Tables live in the shared SOMA Auth project (omfwcodoimjmbrhssvfl), created
 * 2026-07-22 from @soma/onboard's schema template.
 */

import { createOnboard } from '@soma/onboard';
import { createSupabaseStore } from '@soma/onboard/store/supabase';

export const config = {
  appId: 'agi26',
  tablePrefix: 'agi26',
  brandName: 'Society of Minds Aligned',
  origin: 'https://agi2026.netlify.app',
  hostName: 'Mike Wolf',
  virtualHostName: 'Chora',
  purposeOneLiner:
    'The AGI-26 constellation: an archive and a named AI host for each thinker building toward AGI.',

  /* Who someone is at AGI-26, not what they do for a living. These become the role
   * options on the join form, so they have to be the words an actual attendee would
   * pick standing in a hallway. */
  roles: ['researcher', 'builder', 'student', 'writer', 'investor', 'organizer', 'other'],

  inviteSubject: '{inviter} invited you into the AGI-26 constellation',
};

export const onboard = createOnboard(config, {
  store: createSupabaseStore(config),
});
