/* Minimal guide config for michael-levin — created by build-hosts.mjs because none existed.
 * Safe to replace with a hand-authored siteMap + walkthroughs; the host layer in
 * michael-levin-host.js merges over whatever is here. */
window.SomaGuideConfig = {
  siteMap: [
    { label: 'Home',       path: '/',            description: 'Overview of the Michael Levin's published work archive.' },
    { label: 'Corpus',     path: '/corpus/',     description: 'Every indexed paper and talk, searchable.' },
    { label: 'Dictionary', path: '/dictionary/', description: 'Key terms drawn from the work.' },
    { label: 'Ask',        path: '/ask/',        description: 'Ask a question and get an answer grounded in the corpus.' },
  ],
  walkthroughs: [],
};
