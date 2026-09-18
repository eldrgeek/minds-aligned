#!/usr/bin/env node
/* needs-mike — stop what you are doing, this one needs a person.
 *
 * An automation that needs a human should not leave a line in a log nobody is
 * reading. This puts an alert in FRONT of whatever Mike is doing, and when he
 * says go, foregrounds the exact window where the work is — the page already
 * open at the right URL, not "go find the Stripe dashboard".
 *
 * WHY APPLESCRIPT AND NOT A NOTIFICATION
 *   `display notification` posts to Notification Center: it does not take
 *   focus, it is easy to miss, and it disappears. `display alert` from System
 *   Events, with System Events activated first, is modal and frontmost over
 *   every other app — which is the whole point of the request. The Notification
 *   Center line is still posted as a trail, so there is a record if the alert
 *   is dismissed and forgotten.
 *
 * WHERE IT RUNS
 *   Mike's Mac. It no-ops with a printed message anywhere else — including in
 *   a cloud container, which is where the agent that calls it usually lives.
 *   A caller must therefore never DEPEND on the alert having been seen: print
 *   the instructions too, always. stripe-setup.mjs does both.
 *
 * ARGUMENTS ARE PASSED TO OSASCRIPT AS ARGV, NOT INTERPOLATED INTO THE SCRIPT.
 *   A title with a quote in it would otherwise break the AppleScript, and a
 *   title from an untrusted source could inject into it. `on run argv` keeps
 *   every value a string.
 *
 * USE
 *   node ops/needs-mike.mjs "Title" "What you need to do" "https://url/to/open"
 *   node ops/needs-mike.mjs --test
 *
 *   import { needsMike } from './needs-mike.mjs';
 *   await needsMike({ title, message, url, button });
 *
 * Added 2026-09-18 (Mike Wolf's estate; Claude Opus 5, CCc).
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const run = promisify(execFile);

const IS_MAC = process.platform === 'darwin';

/* Modal, frontmost, and it waits. `giving up after` matters: an alert that
 * blocks forever turns an unattended run into a hung process, so it releases
 * after 10 minutes and reports that nobody answered. */
const ALERT = `on run argv
  set theTitle to item 1 of argv
  set theMessage to item 2 of argv
  set theButton to item 3 of argv
  tell application "System Events"
    activate
    set theResult to display alert theTitle message theMessage as critical buttons {"Later", theButton} default button 2 giving up after 600
  end tell
  if gave up of theResult then return "timeout"
  return button returned of theResult
end run`;

/* Foreground where the work is. Chrome by name first, because that is the
 * browser Yeshie drives and the one with Mike's sessions in it; `open` is the
 * fallback and uses whatever the default browser is. */
const FOREGROUND = `on run argv
  set theUrl to item 1 of argv
  try
    tell application "Google Chrome"
      activate
      if (count of windows) is 0 then
        make new window
        set URL of active tab of window 1 to theUrl
      else
        tell window 1
          set newTab to make new tab with properties {URL:theUrl}
          set active tab index to (count of tabs)
        end tell
        set index of window 1 to 1
      end if
    end tell
    return "chrome"
  on error
    do shell script "open " & quoted form of theUrl
    return "default-browser"
  end try
end run`;

export async function needsMike({ title, message, url, button = 'Open it' } = {}) {
  const line = `${title}${url ? ` → ${url}` : ''}`;

  if (!IS_MAC) {
    /* The caller is somewhere without a desktop — a container, CI, a server.
     * Say so plainly rather than pretending a human was told. */
    console.log(`\n  [needs-mike] ${line}`);
    console.log(`  [needs-mike] ${message}`);
    console.log(`  [needs-mike] (no desktop here — ${process.platform}; nobody was alerted)\n`);
    return { shown: false, answer: null, reason: 'not-macos' };
  }

  // A trail in Notification Center, whatever happens to the alert.
  try {
    await run('osascript', ['-e',
      `display notification ${JSON.stringify(message)} with title ${JSON.stringify(title)} sound name "Submarine"`]);
  } catch { /* notifications may be denied; the alert is the real channel */ }

  let answer = 'error';
  try {
    const { stdout } = await run('osascript',
      ['-e', ALERT, title, message, button], { timeout: 11 * 60 * 1000 });
    answer = stdout.trim();
  } catch (e) {
    console.error(`  [needs-mike] alert failed: ${e.message}`);
    return { shown: false, answer: null, reason: 'alert-failed' };
  }

  if (answer === 'timeout') {
    console.log(`  [needs-mike] nobody answered within 10 minutes.`);
    return { shown: true, answer: 'timeout' };
  }
  if (answer === 'Later') {
    console.log(`  [needs-mike] deferred.`);
    return { shown: true, answer: 'later' };
  }

  if (url) {
    try {
      const { stdout } = await run('osascript', ['-e', FOREGROUND, url]);
      console.log(`  [needs-mike] foregrounded ${stdout.trim()} at ${url}`);
    } catch (e) {
      console.error(`  [needs-mike] could not foreground a window: ${e.message}`);
      console.error(`  [needs-mike] open it yourself: ${url}`);
    }
  }
  return { shown: true, answer: 'accepted' };
}

// ── CLI ──────────────────────────────────────────────────────────────────
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  if (args[0] === '--test') {
    const r = await needsMike({
      title: 'needs-mike test',
      message: 'This is what an alert looks like when something is waiting on you. Pressing the button foregrounds Chrome at the Stripe dashboard.',
      url: 'https://dashboard.stripe.com/test/apikeys',
      button: 'Open Stripe',
    });
    console.log(`  → ${JSON.stringify(r)}`);
  } else if (args.length < 2) {
    console.error('usage: needs-mike.mjs "Title" "Message" [url] [button]   |   --test');
    process.exit(2);
  } else {
    const [title, message, url, button] = args;
    const r = await needsMike({ title, message, url, button });
    process.exit(r.answer === 'accepted' ? 0 : 1);
  }
}
