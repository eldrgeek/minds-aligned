/* Anil Seth per-site config for the SOMA Guide widget.
 * Persona: Seth Guide — an AI guide grounded in Anil K. Seth's public corpus.
 * NOT impersonation. Text-only until voice agent is configured.
 */
window.SomaGuideConfig = {
  persona: {
    id:      'seth',
    name:    'Seth Guide',
    avatar:  '🧠',
    greeting:
      "I'm an AI guide grounded in Anil K. Seth's published work — consciousness science, predictive processing, and the nature of perception and the self. I'm not Anil Seth myself, but I can help you navigate the corpus and the ideas this research introduced.",
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
      label:    'Tour Anil Seth',
      keywords: ['tour', 'start', 'show me', 'guide', 'walk', 'overview'],
      steps: [
        {
          id:          'home',
          label:       'Home',
          page:        '/',
          target:      'nav a[href="/"]',
          narration:
            "Welcome to the Anil K. Seth archive — a searchable index of published papers, " +
            "built for Society of Minds Aligned and AGI-26.",
          instruction: "You're on the home page.",
          demo:        'hover',
        },
        {
          id:          'corpus',
          label:       'Corpus',
          page:        '/corpus/',
          target:      'nav a[href="/corpus/"]',
          narration:
            "The Corpus lists every indexed paper. Search by title, abstract, author, or journal.",
          instruction: "Try a search or scroll the publication list.",
          demo:        'hover',
        },
        {
          id:          'dictionary',
          label:       'Dictionary',
          page:        '/dictionary/',
          target:      'nav a[href="/dictionary/"]',
          narration:
            "The Dictionary will collect key terms from the published work — coming soon.",
          instruction: "Stub for now.",
          demo:        'hover',
        },
        {
          id:          'ask',
          label:       'Ask',
          page:        '/ask/',
          target:      'nav a[href="/ask/"]',
          narration:
            "Ask will provide cited Q&A over the corpus — coming soon.",
          instruction: "Stub for now.",
          demo:        'hover',
        },
      ],
    },
  ],
};
