#!/usr/bin/env node
/**
 * Scaffold a thinker subsite from the Levinese template pattern.
 * Usage: node scaffold-subsite.mjs <site-dir>
 * Site dir must contain a papers/ folder and site.config.json.
 */

import { readFileSync, writeFileSync, mkdirSync, symlinkSync, existsSync, cpSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const siteDir = process.argv[2];
if (!siteDir) {
  console.error('Usage: node scaffold-subsite.mjs <site-dir>');
  process.exit(1);
}

const config = JSON.parse(readFileSync(join(siteDir, 'site.config.json'), 'utf8'));
const {
  slug,
  name,
  shortName,
  tagline,
  bio,
  bioLinks,
  personaId,
  personaName,
  personaAvatar,
  personaGreeting,
  guideConfigFile,
} = config;

const dirs = [
  'scripts',
  'src/content',
  'src/data',
  'src/layouts',
  'src/pages/corpus',
  'src/pages/dictionary',
  'src/pages/ask',
  'public/js',
];

for (const d of dirs) {
  mkdirSync(join(siteDir, d), { recursive: true });
}

// Papers stay in site-root papers/; aggregate script builds papers.json for pages + MiniSearch.

// Copy shared static assets from Levinese
const levinese = '/Users/mikewolf/Projects/Levinese';
cpSync(join(levinese, 'public/js/soma-auth.js'), join(siteDir, 'public/js/soma-auth.js'));
cpSync(join(levinese, 'public/js/soma-auth-config.js'), join(siteDir, 'public/js/soma-auth-config.js'));
cpSync('/Users/mikewolf/Projects/agi-2026/favicon.svg', join(siteDir, 'public/favicon.svg'));

writeFileSync(join(siteDir, 'package.json'), JSON.stringify({
  name: slug,
  type: 'module',
  version: '0.1.0',
  private: true,
  scripts: {
    dev: 'astro dev',
    build: 'node scripts/aggregate-content.mjs && astro build',
    preview: 'astro preview',
  },
  dependencies: {
    '@astrojs/tailwind': '^5.1.3',
    astro: '^4.16.0',
    minisearch: '^7.2.0',
    tailwindcss: '^3.4.14',
  },
}, null, 2) + '\n');

writeFileSync(join(siteDir, 'astro.config.mjs'), `import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
});
`);

writeFileSync(join(siteDir, 'tailwind.config.mjs'), `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        navy: '#0F141F',
        surface: '#161D2B',
        ink: '#E8ECF4',
        muted: '#8B95A8',
        accent: {
          DEFAULT: '#3C6CDD',
          light: '#1A2844',
          mid: '#5A84E8',
        },
        border: '#2A3347',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
`);

writeFileSync(join(siteDir, 'tsconfig.json'), `{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
`);

writeFileSync(join(siteDir, '.gitignore'), `node_modules/
dist/
.astro/
`);

writeFileSync(join(siteDir, 'scripts/aggregate-content.mjs'), `#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const root = new URL('..', import.meta.url).pathname;
const papersDir = join(root, 'papers');
const outFile = join(root, 'src/data/papers.json');

const files = readdirSync(papersDir).filter(f => f.endsWith('.json')).sort();
const papers = files.map(f => {
  const slug = f.replace(/\\.json$/, '');
  const data = JSON.parse(readFileSync(join(papersDir, f), 'utf8'));
  return { slug, ...data };
});

writeFileSync(outFile, JSON.stringify(papers, null, 2));
console.log(\`Aggregated \${papers.length} papers → src/data/papers.json\`);
`);

writeFileSync(join(siteDir, 'src/env.d.ts'), `/// <reference path="../.astro/types.d.ts" />\n`);

writeFileSync(join(siteDir, 'src/content/config.ts'), `// Papers are aggregated to src/data/papers.json — no content collection needed yet.
export const collections = {};
`);

writeFileSync(join(siteDir, 'src/data/corpus-non-papers.json'), '[]\n');
writeFileSync(join(siteDir, 'src/data/papers.json'), '[]\n');

// Base layout
writeFileSync(join(siteDir, 'src/layouts/Base.astro'), `---
interface Props {
  title: string;
  description?: string;
}
const { title, description = "${tagline}" } = Astro.props;
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title} — ${shortName}</title>
  <meta name="description" content={description} />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    :root {
      --font-serif: 'Cormorant Garamond', Georgia, serif;
      --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      --font-mono: 'IBM Plex Mono', ui-monospace, monospace;
    }
    body { font-family: var(--font-sans); }
    h1, h2, h3, h4, .serif { font-family: var(--font-serif); }
    .font-mono { font-family: var(--font-mono); }
  </style>
</head>
<body class="bg-navy text-ink min-h-screen flex flex-col">
  <nav class="sticky top-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-border">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
      <a href="/" class="font-serif font-medium text-lg text-accent hover:text-accent-mid transition-colors tracking-wide">
        ${shortName}
      </a>
      <div class="flex items-center gap-6 text-sm font-medium text-muted">
        <a href="/corpus/" class="hover:text-ink transition-colors">Corpus</a>
        <a href="/dictionary/" class="hover:text-ink transition-colors">Dictionary</a>
        <a href="/ask/" class="hover:text-ink transition-colors">Ask</a>
        <button id="soma-signin" type="button" class="hover:text-ink transition-colors">Sign in</button>
      </div>
    </div>
  </nav>

  <main class="flex-1">
    <slot />
  </main>

  <footer class="border-t border-border mt-16">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-muted text-sm text-center sm:text-left">
        ${name} · Society of Minds Aligned · AGI-26, 2026
      </p>
      <p class="text-muted text-xs opacity-60 font-mono">
        SOMA
      </p>
    </div>
  </footer>

  <script is:inline src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"></script>
  <script is:inline src="/js/soma-auth-config.js"></script>
  <script is:inline src="/js/soma-auth.js"></script>
  <script is:inline>
    (function () {
      if (!window.SomaAuth) return;
      window.SomaAuth.onAuthStateChange(function (event, session) {
        window.SomaAuth.session = session || null;
        var btn = document.getElementById('soma-signin');
        if (btn) btn.textContent = session && session.user ? 'Sign out' : 'Sign in';
        if (window.somaGuide && typeof window.somaGuide.refreshIdentity === 'function') {
          try { window.somaGuide.refreshIdentity(); } catch (e) {}
        }
      });
      window.SomaAuth.init(window.SOMA_AUTH_CONFIG.url, window.SOMA_AUTH_CONFIG.anonKey);
      document.addEventListener('DOMContentLoaded', function () {
        var btn = document.getElementById('soma-signin');
        if (!btn) return;
        btn.addEventListener('click', function () {
          if (window.SomaAuth.session && window.SomaAuth.session.user) {
            window.SomaAuth.signOut();
            return;
          }
          var email = window.prompt('Enter your email to sign in. You will receive a magic link.');
          if (!email) return;
          window.SomaAuth.signInWithOtp(email, { emailRedirectTo: window.location.origin + '/' })
            .then(function (r) {
              window.alert(r && r.error ? ('Sign-in error: ' + r.error.message) : 'Check your email for the magic link.');
            });
        });
      });
    })();
  </script>

  <link rel="stylesheet" href="https://soma-guide.netlify.app/soma-guide.css" />
  <script is:inline src="/${guideConfigFile}"></script>
  <script is:inline src="https://soma-guide.netlify.app/soma-guide.js"></script>
</body>
</html>
`);

const bioLinksHtml = bioLinks.map(l =>
  `<a href="${l.url}" target="_blank" rel="noopener" class="text-accent hover:text-accent-mid font-medium transition-colors">${l.label} ↗</a>`
).join('\n          ');

writeFileSync(join(siteDir, 'src/pages/index.astro'), `---
import Base from '../layouts/Base.astro';
import papersData from '../data/papers.json';

const paperCount = papersData.length;
---
<Base title="Home" description="${tagline}">
  <section class="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-12">
    <div class="max-w-2xl">
      <p class="text-sm font-mono font-medium text-accent uppercase tracking-widest mb-4">AGI-26 keynote</p>
      <h1 class="font-serif text-4xl sm:text-5xl font-medium text-ink leading-tight mb-6">
        ${name}
      </h1>
      <p class="text-lg text-muted leading-relaxed mb-8">
        ${bio}
      </p>
      <div class="flex flex-wrap gap-3">
        <a href="/corpus/" class="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-accent-mid transition-colors">
          Browse Corpus
        </a>
        <a href="/dictionary/" class="inline-flex items-center gap-2 bg-surface border border-border text-ink px-5 py-2.5 rounded-md text-sm font-medium hover:border-accent/40 transition-colors">
          Dictionary
        </a>
        <a href="/ask/" class="inline-flex items-center gap-2 bg-surface border border-border text-ink px-5 py-2.5 rounded-md text-sm font-medium hover:border-accent/40 transition-colors">
          Ask
        </a>
      </div>
    </div>
  </section>

  <section class="max-w-5xl mx-auto px-4 sm:px-6 py-10 border-t border-border">
    <div class="grid md:grid-cols-2 gap-12 items-start">
      <div>
        <h2 class="font-serif text-2xl font-medium text-ink mb-4">Public work</h2>
        <p class="text-muted leading-relaxed mb-4">
          This subsite indexes ${name}'s published papers as a searchable corpus — the foundation for a grounded AI guide and cross-thinker synthesis in Society of Minds Aligned.
        </p>
        <div class="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          ${bioLinksHtml}
        </div>
      </div>
      <div>
        <h2 class="font-serif text-2xl font-medium text-ink mb-4">Corpus</h2>
        <a href="/corpus/" class="inline-flex items-baseline gap-2">
          <span class="font-mono text-3xl font-medium text-accent">{paperCount}</span>
          <span class="text-muted text-sm hover:text-accent transition-colors">papers →</span>
        </a>
      </div>
    </div>
  </section>
</Base>
`);

writeFileSync(join(siteDir, 'src/pages/dictionary/index.astro'), `---
import Base from '../../layouts/Base.astro';
---
<Base title="Dictionary" description="Concept dictionary for ${name} — coming soon.">
  <div class="max-w-3xl mx-auto px-4 sm:px-6 pt-16 pb-20">
    <p class="text-sm font-mono font-medium text-accent uppercase tracking-widest mb-3">Dictionary</p>
    <h1 class="font-serif text-3xl sm:text-4xl font-medium text-ink mb-4">Concept dictionary</h1>
    <p class="text-muted leading-relaxed mb-4">
      Coming soon. This will collect key terms from ${name}'s published work — each entry grounded in the corpus with citations.
    </p>
    <a href="/corpus/" class="text-accent hover:text-accent-mid text-sm font-medium">Browse the paper corpus →</a>
  </div>
</Base>
`);

writeFileSync(join(siteDir, 'src/pages/ask/index.astro'), `---
import Base from '../../layouts/Base.astro';
---
<Base title="Ask" description="Ask questions grounded in ${name}'s published work — coming soon.">
  <div class="max-w-3xl mx-auto px-4 sm:px-6 pt-16 pb-20">
    <p class="text-sm font-mono font-medium text-accent uppercase tracking-widest mb-3">Ask</p>
    <h1 class="font-serif text-3xl sm:text-4xl font-medium text-ink mb-4">Ask</h1>
    <p class="text-muted leading-relaxed mb-4">
      Coming soon. Ask will let you query ${name}'s published work with cited answers — not impersonation, but synthesis grounded in the corpus.
    </p>
    <p class="text-muted leading-relaxed text-sm">
      For now, use the guide widget (bottom-right) for a text-only tour of the site, or browse the <a href="/corpus/" class="text-accent hover:text-accent-mid">corpus</a> directly.
    </p>
  </div>
</Base>
`);

// Corpus page - papers only
writeFileSync(join(siteDir, 'src/pages/corpus/index.astro'), readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'corpus-template.astro'),
  'utf8'
).replaceAll('__SITE_NAME__', name).replaceAll('__SHORT_NAME__', shortName));

// Guide config
writeFileSync(join(siteDir, `public/${guideConfigFile}`), `/* ${shortName} per-site config for the SOMA Guide widget.
 * Persona: ${personaName} — an AI guide grounded in ${name}'s public corpus.
 * NOT impersonation. Text-only until voice agent is configured.
 */
window.SomaGuideConfig = {
  persona: {
    id:      '${personaId}',
    name:    '${personaName}',
    avatar:  '${personaAvatar}',
    greeting:
      "${personaGreeting}",
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
      label:    'Tour ${shortName}',
      keywords: ['tour', 'start', 'show me', 'guide', 'walk', 'overview'],
      steps: [
        {
          id:          'home',
          label:       'Home',
          page:        '/',
          target:      'nav a[href="/"]',
          narration:
            "Welcome to the ${name} archive — a searchable index of published papers, " +
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
`);

console.log(`Scaffolded ${slug} at ${siteDir}`);