// SOMA Auth config for minds-aligned.org (the hub-public front door).
// Publishable key — safe in client-side code.
//
// Readers never need an account. This file is only fetched on the admin path
// (see the Live Edit bootstrap at the bottom of each page): an ordinary
// visitor never loads it, so the public read path costs what it cost before.
//
// Signing in unlocks one thing: in-place copy editing for app admins
// (SOMA App Standard §17 / §17a).
window.SOMA_AUTH_CONFIG = {
  url: 'https://omfwcodoimjmbrhssvfl.supabase.co',
  anonKey: 'sb_publishable_vi2qDWjozUJ5mi9dwirkLA_rj6UaqLf',

  methods: {
    magicLink: true,
    emailOtp: false,
    password: false,
    phone: false,
    oauth: ['google']
  }
};
