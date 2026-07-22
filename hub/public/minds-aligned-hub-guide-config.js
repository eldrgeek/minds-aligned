/* Guide config for the AGI-26 hub — siteMap + walkthrough.
 * The host layer (persona, inferenceUrl, scopeGuard, knowledge) is generated
 * into minds-aligned-hub-host.js and merges OVER this file. Edit tours here.
 */
window.SomaGuideConfig = {
  siteMap: [
    { label: 'Home', path: '/', description: 'The roster — every thinker in the AGI-26 constellation, with a link into their archive.' },
    { label: 'SOMA 2026', path: '/soma2026/', description: 'What SOMA is, why we built the constellation for AGI-26, and what we intend by it.' },
    { label: 'About', path: '/about/', description: 'Co-owners, not subjects — how a thinker keeps sovereignty over their corpus.' },
  ],

  walkthroughs: [
    {
      id: 'site-tour',
      label: 'Show me around',
      keywords: ['tour', 'start', 'show me', 'guide', 'walk', 'overview', 'around'],
      steps: [
        {
          id: 'home',
          label: 'The roster',
          page: '/',
          target: 'nav a[href="/"]',
          narration:
            'This is Society of Minds Aligned — the constellation we built for AGI-26. ' +
            'Every card below is a thinker, and every card opens an archive of their public work.',
          instruction: 'Scroll the roster. Cards with a live archive open in the same tab.',
          demo: 'hover',
        },
        {
          id: 'archive',
          label: 'Inside an archive',
          page: '/',
          narration:
            'Each archive holds that thinker\'s papers and talks, and each one has its own named AI host — ' +
            'Markov for Friston, Lantern for Gopnik, Phi for Koch. A host answers from the corpus and cites it. ' +
            'None of them impersonates the thinker.',
          instruction: 'Open any card to meet its host.',
          demo: 'hover',
        },
        {
          id: 'soma2026',
          label: 'SOMA 2026',
          page: '/soma2026/',
          target: 'nav a[href="/soma2026/"]',
          narration:
            'This page is the why. What SOMA is, what we are trying to prove by building this in public, ' +
            'and what we are asking of the people whose work is here.',
          instruction: 'Read it — it is short.',
          demo: 'hover',
        },
      ],
    },
  ],
};
