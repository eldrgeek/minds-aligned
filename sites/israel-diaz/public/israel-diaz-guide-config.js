/* Israel Diaz per-site config for the SOMA Guide widget.
 * Persona: Zero State — an AI host grounded in Israel Diaz's public writing.
 * NOT impersonation. Text-only until voice agent is configured.
 * The generated host layer (israel-diaz-host.js) merges OVER this file.
 */
window.SomaGuideConfig = {
  persona: {
    id:      'zero-state',
    name:    'Zero State',
    avatar:  '◎',
    greeting:
      "I'm Zero State, the AI host of this archive. I'm grounded in Israel Diaz's public writing — conxiOS/consciOS, Sunday+Night, and his advertising career — not in an academic corpus, and not in him. Ask me a question and I'll answer from what he's actually published, and cite it.",
    shortGreeting: "Good to see you again. Where shall we pick up?",
    walkthroughDone:
      "That's the shape of this archive. Ask me about his writing, or explore on your own.",
  },

  // TODO: wire ConvAI voice agent when ready
  voiceAgentId: null,
  ttsProxyUrl:  'https://bill-talk.netlify.app/.netlify/functions/el-proxy',

  walkthroughs: [
    {
      id:       'site-tour',
      label:    'Tour Israel Diaz',
      keywords: ['tour', 'start', 'show me', 'guide', 'walk', 'overview'],
      steps: [
        {
          id:          'home',
          label:       'Home',
          page:        '/',
          target:      'nav a[href="/"]',
          narration:
            "Welcome to the Israel Diaz archive — an index of his public writing, built " +
            "for Society of Minds Aligned and AGI-26. Diaz founded conxiOS and " +
            "Sunday+Night, after three decades in advertising creative leadership.",
          instruction: "You're on the home page.",
          demo:        'hover',
        },
        {
          id:          'corpus',
          label:       'Corpus',
          page:        '/corpus/',
          target:      'nav a[href="/corpus/"]',
          narration:
            "The Corpus lists every indexed record — conxiOS site text, agency copy, " +
            "press, and interview. This is public writing, not academic publication.",
          instruction: "Try a search or scroll the list.",
          demo:        'hover',
        },
        {
          id:          'dictionary',
          label:       'Dictionary',
          page:        '/dictionary/',
          target:      'nav a[href="/dictionary/"]',
          narration:
            "The Dictionary is Diaz's own vocabulary — zero state, the nine needs, " +
            "polarity, transmute, NeedState — each pointed at a source, with gaps marked " +
            "where the public writing doesn't spell a term out.",
          instruction: "Scan the terms, then follow one into the corpus.",
          demo:        'hover',
        },
        {
          id:          'ask',
          label:       'Ask',
          page:        '/ask/',
          target:      'nav a[href="/ask/"]',
          narration:
            "Ask me anything about the corpus and I'll answer from the indexed passages " +
            "and cite them. I don't speak for Diaz — only about what he published.",
          instruction: "Type a question in the chat.",
          demo:        'hover',
        },
      ],
    },
  ],
};
