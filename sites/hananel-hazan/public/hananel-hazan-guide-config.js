/* Hananel Hazan per-site config for the SOMA Guide widget.
 * Persona: Reservoir — an AI host grounded in Hananel Hazan's published corpus.
 * NOT impersonation. Text-only until voice agent is configured.
 * The generated host layer (hananel-hazan-host.js) merges OVER this file.
 */
window.SomaGuideConfig = {
  persona: {
    id:      'reservoir',
    name:    'Reservoir',
    avatar:  '≋',
    greeting:
      "I'm Reservoir, the AI host of this archive. I'm grounded in Hananel Hazan's published work — spiking neural networks, liquid state machines and reservoir computing, learning in unconventional substrates, and computational models of collective cellular behavior. I am not Hazan; I'm a guide to what he wrote.",
    shortGreeting: "Good to see you again. Where shall we pick up?",
    walkthroughDone:
      "That's the shape of this archive. Ask me about the papers, or explore on your own.",
  },

  // TODO: wire ConvAI voice agent when ready
  voiceAgentId: null,
  ttsProxyUrl:  'https://bill-talk.netlify.app/.netlify/functions/el-proxy',

  walkthroughs: [
    {
      id:       'site-tour',
      label:    'Tour Hananel Hazan',
      keywords: ['tour', 'start', 'show me', 'guide', 'walk', 'overview'],
      steps: [
        {
          id:          'home',
          label:       'Home',
          page:        '/',
          target:      'nav a[href="/"]',
          narration:
            "Welcome to the Hananel Hazan archive — a searchable index of his published " +
            "papers, built for Society of Minds Aligned and AGI-26. Hazan is at the Allen " +
            "Discovery Center at Tufts, in Michael Levin's lab.",
          instruction: "You're on the home page.",
          demo:        'hover',
        },
        {
          id:          'corpus',
          label:       'Corpus',
          page:        '/corpus/',
          target:      'nav a[href="/corpus/"]',
          narration:
            "The Corpus lists every indexed record — spiking networks, liquid state " +
            "machines, bioelectric circuits, closed-loop electrophysiology. Search by " +
            "title, abstract, author, or journal.",
          instruction: "Try a search or scroll the publication list.",
          demo:        'hover',
        },
        {
          id:          'dictionary',
          label:       'Dictionary',
          page:        '/dictionary/',
          target:      'nav a[href="/dictionary/"]',
          narration:
            "The Dictionary is the vocabulary you need to read the archive — reservoir " +
            "computing, liquid state machines, dynamic clamp, bioelectric circuits — each " +
            "pointed at a paper in the corpus.",
          instruction: "Scan the terms, then follow one into the papers.",
          demo:        'hover',
        },
        {
          id:          'ask',
          label:       'Ask',
          page:        '/ask/',
          target:      'nav a[href="/ask/"]',
          narration:
            "Ask me anything about the corpus and I'll answer from the indexed passages " +
            "and cite them. I don't speak for Hazan — only about what he published.",
          instruction: "Type a question in the chat.",
          demo:        'hover',
        },
      ],
    },
  ],
};
