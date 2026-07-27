/**
 * soma-page-qr — every AGI-26 page carries a QR code that leads back to itself.
 *
 * Built for the conference floor: open a thinker's page on a laptop, someone
 * else scans the strip at the bottom and walks away with the same page on their
 * phone. Tap the code to blow it up big enough to scan across a table.
 *
 * The URL is read from `window.location` at runtime rather than baked in at
 * build time — several sites in this constellation carry a stale `site:` value
 * in their astro.config (the dead `<slug>.agi-2026.netlify.app` pattern), and
 * two of the thirteen properties live outside this monorepo entirely. Reading
 * the live location is the only source that is right on every property, on
 * Netlify deploy previews, and after any future custom-domain move.
 *
 * Source of truth: packages/feedback/src/page-qr/page-qr.src.js
 * Bundle + distribute with: node packages/feedback/src/page-qr/build.mjs
 * Never edit the generated public/js/soma-page-qr.js copies by hand.
 */
import QRCode from 'qrcode'

const INK = '#0a0f1a'
const PAPER = '#ffffff'

function pageUrl() {
  const loc = window.location
  // Hash is view state, not identity — a scanned code should land on the page,
  // not on whatever anchor the person happened to have open. Query survives
  // because the join/channel params (?ch=) are load-bearing.
  return loc.origin + loc.pathname + loc.search
}

function prettyUrl(url) {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

function svgFor(url, size) {
  return QRCode.toString(url, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 1,
    width: size,
    color: { dark: INK, light: PAPER },
  })
}

const CSS = `
.soma-qr {
  border-top: 1px solid rgba(255,255,255,.1);
  background: #070b14;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.soma-qr__btn {
  border: 0;
  padding: 6px;
  border-radius: 8px;
  background: ${PAPER};
  line-height: 0;
  cursor: zoom-in;
  flex: 0 0 auto;
}
.soma-qr__btn:focus-visible { outline: 2px solid #6f9bff; outline-offset: 3px; }
.soma-qr__btn svg { display: block; width: 76px; height: 76px; }
.soma-qr__copy { min-width: 0; }
.soma-qr__label {
  margin: 0;
  font-size: .78rem;
  line-height: 1.5;
  color: #e9eaed;
  font-weight: 600;
}
.soma-qr__url {
  margin: .15rem 0 0;
  font-size: .72rem;
  line-height: 1.5;
  color: #9ba3b5;
  font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  overflow-wrap: anywhere;
}
.soma-qr__hint {
  margin: .15rem 0 0;
  font-size: .68rem;
  color: #6b7488;
}
.soma-qr-modal {
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  padding: 1.5rem;
  background: rgba(4,7,13,.94);
  backdrop-filter: blur(4px);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.soma-qr-modal__tile {
  padding: 18px;
  border-radius: 16px;
  background: ${PAPER};
  line-height: 0;
}
.soma-qr-modal__tile svg {
  display: block;
  width: min(64vw, 62vh, 420px);
  height: min(64vw, 62vh, 420px);
}
.soma-qr-modal__url {
  margin: 0;
  max-width: 90vw;
  text-align: center;
  font-size: .82rem;
  color: #cfd4e0;
  font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  overflow-wrap: anywhere;
}
.soma-qr-modal__close {
  border: 1px solid rgba(255,255,255,.25);
  background: transparent;
  color: #e9eaed;
  font-size: .78rem;
  letter-spacing: .04em;
  text-transform: uppercase;
  padding: .5rem 1.1rem;
  border-radius: 999px;
  cursor: pointer;
}
.soma-qr-modal__close:hover { background: rgba(255,255,255,.08); }
@media (max-width: 520px) {
  .soma-qr { flex-direction: column; text-align: center; }
}
@media print {
  /* A printed page should still carry the way back to its live self. */
  .soma-qr { background: transparent; border-top: 1px solid #ccc; }
  .soma-qr__label { color: #000; }
  .soma-qr__url { color: #333; }
  .soma-qr__hint { display: none; }
  .soma-qr-modal { display: none !important; }
}
`

function injectStyle() {
  if (document.getElementById('soma-qr-style')) return
  const style = document.createElement('style')
  style.id = 'soma-qr-style'
  style.textContent = CSS
  document.head.appendChild(style)
}

function openModal(url) {
  const overlay = document.createElement('div')
  overlay.className = 'soma-qr-modal'
  overlay.setAttribute('role', 'dialog')
  overlay.setAttribute('aria-modal', 'true')
  overlay.setAttribute('aria-label', 'QR code for this page')

  const tile = document.createElement('div')
  tile.className = 'soma-qr-modal__tile'

  const caption = document.createElement('p')
  caption.className = 'soma-qr-modal__url'
  caption.textContent = prettyUrl(url)

  const close = document.createElement('button')
  close.type = 'button'
  close.className = 'soma-qr-modal__close'
  close.textContent = 'Close'

  overlay.append(tile, caption, close)
  document.body.appendChild(overlay)

  const previouslyFocused = document.activeElement
  close.focus()

  function dismiss() {
    overlay.remove()
    document.removeEventListener('keydown', onKey)
    if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus()
  }
  function onKey(e) {
    if (e.key === 'Escape') dismiss()
  }
  document.addEventListener('keydown', onKey)
  close.addEventListener('click', dismiss)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) dismiss()
  })

  svgFor(url, 420).then((svg) => {
    tile.innerHTML = svg
  })
}

function mount() {
  const url = pageUrl()

  // file:// and about: pages produce a URL nobody can scan their way to.
  if (!/^https?:$/.test(window.location.protocol)) return
  if (document.querySelector('.soma-qr')) return

  injectStyle()

  const bar = document.createElement('section')
  bar.className = 'soma-qr'
  bar.setAttribute('aria-label', 'Scan to open this page')

  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'soma-qr__btn'
  btn.setAttribute('aria-label', 'Enlarge the QR code for ' + prettyUrl(url))

  const copy = document.createElement('div')
  copy.className = 'soma-qr__copy'
  copy.innerHTML =
    '<p class="soma-qr__label">Scan to open this page</p>' +
    '<p class="soma-qr__url"></p>' +
    '<p class="soma-qr__hint">Tap the code to enlarge it for someone across the table.</p>'
  copy.querySelector('.soma-qr__url').textContent = prettyUrl(url)

  bar.append(btn, copy)

  svgFor(url, 152)
    .then((svg) => {
      btn.innerHTML = svg
      btn.addEventListener('click', () => openModal(url))
      document.body.appendChild(bar)
    })
    .catch(() => {
      /* A QR that cannot be drawn is not worth an empty strip. */
    })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount)
} else {
  mount()
}
