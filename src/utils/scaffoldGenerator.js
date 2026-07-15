import { formatArticleBody, formatInline, smartenPunctuation, firstParagraphText } from './articleFormatter.js'

const UI_STRINGS = {
  en: { share: 'Share', copyLink: 'Copy link', copied: 'Link copied!', promptCopy: 'Copy the link:', email: 'Email', publishedOn: 'Published on', locale: 'en-US' },
  pt: { share: 'Compartilhar', copyLink: 'Copiar link', copied: 'Link copiado!', promptCopy: 'Copie o link:', email: 'Email', publishedOn: 'Publicado em', locale: 'pt-BR' },
  fr: { share: 'Partager', copyLink: 'Copier le lien', copied: 'Lien copié !', promptCopy: 'Copiez le lien :', email: 'E-mail', publishedOn: 'Publié le', locale: 'fr-FR' },
}

function uiFor(code) {
  return UI_STRINGS[code] || { ...UI_STRINGS.en, locale: 'en-US' }
}

export function slugToPascalCase(slug) {
  return String(slug || '')
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function jsStringLiteral(s) {
  return `'${String(s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
}

// For plain-text JS/JSON string values (document.title, meta description,
// articles.js copy) — nice curly quotes/dashes, no HTML entity escaping.
function jsText(s) {
  return jsStringLiteral(smartenPunctuation(String(s || '')))
}

// For HTML attribute values (meta content="...") — escapes & and " only;
// no smart-quote conversion since crawlers don't care about typography.
function attrSafe(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// v-if / v-else-if / v-else chain helper. `render(lang, directive)` returns
// the attribute string, e.g. `v-if="props.lang==='en'"` or `v-else`.
function langDirective(index, total, code) {
  if (index === total - 1) return 'v-else'
  if (index === 0) return `v-if="props.lang==='${code}'"`
  return `v-else-if="props.lang==='${code}'"`
}

export function generateVueComponent(state) {
  const { slug, date, languages } = state
  const isoDate = date

  const localeMapEntries = languages.map(l => `  ${l.code}: '${uiFor(l.code).locale}'`).join(',\n')
  const publishedLabelEntries = languages.map(l => `  ${l.code}: ${jsStringLiteral(uiFor(l.code).publishedOn)}`).join(',\n')
  const uiStringsEntries = languages.map(l => {
    const ui = uiFor(l.code)
    return `  ${l.code}: { share: ${jsStringLiteral(ui.share)}, copyLink: ${jsStringLiteral(ui.copyLink)}, copied: ${jsStringLiteral(ui.copied)}, promptCopy: ${jsStringLiteral(ui.promptCopy)}, email: ${jsStringLiteral(ui.email)} }`
  }).join(',\n')

  const shareTitleChain = languages
    .map((l, i) => (i === languages.length - 1 ? jsText(l.title) : `props.lang===${jsStringLiteral(l.code)} ? ${jsText(l.title)} :`))
    .join('\n    ')
  const shareTextChain = languages
    .map((l, i) => (i === languages.length - 1 ? jsText(l.desc) : `props.lang===${jsStringLiteral(l.code)} ? ${jsText(l.desc)} :`))
    .join('\n    ')

  const h1Lines = languages
    .map((l, i) => `        <h1 ${langDirective(i, languages.length, l.code)}>${formatInline(l.title)}</h1>`)
    .join('\n')

  const bylineLines = languages
    .map((l, i) => `          <em ${langDirective(i, languages.length, l.code)}>${formatInline(l.byline)}</em>`)
    .join('\n')

  const bodyBlocks = languages
    .map((l, i) => {
      const directive = i === 0 ? 'v-if' : (i === languages.length - 1 ? 'v-else' : 'v-else-if')
      const cond = directive === 'v-else' ? '' : ` props.lang === ${jsStringLiteral(l.code)}`
      const attr = cond ? `${directive}="${cond.trim()}"` : directive
      return `    <template ${attr}>\n${formatArticleBody(l.raw)}\n    </template>`
    })
    .join('\n\n')

  return `<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
const props = defineProps({ lang: { type: String, default: '${languages[0]?.code || 'en'}' }, id: { type: String, default: ${jsStringLiteral(slug)} } })

const TITLES = {
${languages.map(l => `  ${l.code}: ${jsText(l.title)}`).join(',\n')}
}
onMounted(() => { document.title = TITLES[props.lang] || TITLES.${languages[0]?.code || 'en'} })

const canonicalUrl = computed(() => \`#/\${['article', props.id, props.lang].filter(Boolean).join('/')}\`)
const fullUrl = computed(() => window.location.origin + window.location.pathname + canonicalUrl.value)

const shareTitle = computed(() =>
    ${shareTitleChain}
)
const shareText = computed(() =>
    ${shareTextChain}
)

const UI_STRINGS = {
${uiStringsEntries}
}
const ui = computed(() => UI_STRINGS[props.lang] || UI_STRINGS.${languages[0]?.code || 'en'})

const showShareMenu = ref(false)
const shareMenuEl = ref(null)

function onDocumentClick(e) {
  if (!showShareMenu.value) return
  const el = shareMenuEl.value
  if (el && !el.contains(e.target)) showShareMenu.value = false
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick))

async function onShareClick() {
  try {
    if (navigator.share) {
      await navigator.share({ title: shareTitle.value, text: shareText.value, url: fullUrl.value })
      return
    }
  } catch (e) {
    console.warn('Native share failed or was cancelled, falling back to menu:', e)
  }
  showShareMenu.value = true
}

async function copyLink() {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(fullUrl.value)
      alert(ui.value.copied)
    } else {
      prompt(ui.value.promptCopy, fullUrl.value)
    }
  } catch (e) {
    console.error('Clipboard error', e)
    prompt(ui.value.promptCopy, fullUrl.value)
  }
}

const encodedUrl = computed(() => encodeURIComponent(fullUrl.value))
const encodedTitle = computed(() => encodeURIComponent(shareTitle.value))
const encodedText = computed(() => encodeURIComponent(shareText.value))

const pubDate = new Date('${isoDate}T00:00:00Z')
const isoDate = '${isoDate}'
const LOCALES = {
${localeMapEntries}
}
const PUBLISHED_LABELS = {
${publishedLabelEntries}
}
const formattedDate = computed(() => {
  const locale = LOCALES[props.lang] || 'en-US'
  const fmt = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
  return fmt.format(pubDate)
})
const publishedLabel = computed(() => PUBLISHED_LABELS[props.lang] || PUBLISHED_LABELS.${languages[0]?.code || 'en'})
</script>

<template>
  <article class="article">
    <header style="display:flex;align-items:center;justify-content:space-between;gap:1rem; margin-bottom:0.75rem;">
      <div>
${h1Lines}
        <div class="byline">
${bylineLines}
        </div>
        <div class="pubdate">
          <small>{{ publishedLabel }} <time :datetime="isoDate">{{ formattedDate }}</time></small>
        </div>
      </div>
      <div class="share" ref="shareMenuEl" style="position:relative;">
        <button @click="onShareClick" :aria-expanded="showShareMenu ? 'true' : 'false'" aria-haspopup="menu" title="Share" style="border:1px solid var(--color-border);background:transparent;border-radius:6px;padding:0.35rem 0.5rem;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          <span>{{ ui.share }}</span>
        </button>
        <div v-if="showShareMenu" class="share-menu" role="menu">
          <button class="share-item" role="menuitem" @click="copyLink">{{ ui.copyLink }}</button>
          <a class="share-item" role="menuitem" :href="\`mailto:?subject=\${encodedTitle}&body=\${encodedText}%0A%0A\${encodedUrl}\`" target="_blank" rel="noopener">{{ ui.email }}</a>
          <a class="share-item" role="menuitem" :href="\`https://api.whatsapp.com/send?text=\${encodedTitle}%20-%20\${encodedUrl}\`" target="_blank" rel="noopener">WhatsApp</a>
          <a class="share-item" role="menuitem" :href="\`https://x.com/intent/tweet?text=\${encodedTitle}&url=\${encodedUrl}\`" target="_blank" rel="noopener">X / Twitter</a>
          <a class="share-item" role="menuitem" :href="\`https://www.linkedin.com/sharing/share-offsite/?url=\${encodedUrl}\`" target="_blank" rel="noopener">LinkedIn</a>
        </div>
      </div>
    </header>

${bodyBlocks}
  </article>
</template>

<style scoped>
.share-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  min-width: 180px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  border-radius: 8px;
  box-shadow: 0 6px 24px rgba(0,0,0,0.08);
  padding: 0.25rem;
  z-index: 20;
}
.share-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.5rem 0.6rem;
  background: transparent;
  border: none;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  border-radius: 6px;
}
.share-item:hover { background: var(--color-background-soft); }
</style>
`
}

export function generateArticlesJsEntry(state) {
  const { slug, date, languages } = state
  const en = languages.find(l => l.code === 'en') || languages[0]
  const pt = languages.find(l => l.code === 'pt')

  const lines = [
    '  {',
    `    id: ${jsStringLiteral(slug)},`,
    `    href: '#/article/${slug}',`,
    `    date: ${jsStringLiteral(date)},`,
    '    en: {',
    `      title: ${jsText(en?.title)},`,
    `      desc: ${jsText(en?.desc)}`,
    '    },',
  ]
  if (pt) {
    lines.push(
      '    pt: {',
      `      title: ${jsText(pt.title)},`,
      `      desc: ${jsText(pt.desc)}`,
      '    }',
    )
  } else {
    lines.push('    pt: null // TODO: no Portuguese copy provided — Home.vue falls back to `en`')
  }
  lines.push('  },')

  return lines.join('\n')
}

export function generateAppVueSnippet(state) {
  const { slug, languages } = state
  const componentName = slugToPascalCase(slug)
  const extraLanguages = languages.slice(2) // beyond en/pt

  let snippet = `// 1. Add this import near the other page imports in src/App.vue:
import ${componentName} from './pages/${componentName}.vue'

// 2. Add this route branch, just before "<div v-else>Not Found</div>":
    <${componentName} v-else-if="route === 'article' && params.id===${jsStringLiteral(slug)}" :lang="lang" :id="params.id" />`

  if (extraLanguages.length > 0) {
    const codes = extraLanguages.map(l => l.code)
    snippet += `

// 3. This article supports extra language(s) beyond EN/PT: ${codes.join(', ')}.
//    The header's EN/PT toggle is site-wide, but a per-article extra-language
//    button needs to be added by hand (same pattern as the existing Canada
//    French button), e.g.:
    <button v-if="route === 'article' && params.id===${jsStringLiteral(slug)}" :class="{ active: lang === ${jsStringLiteral(codes[0])} }" @click="setLang(${jsStringLiteral(codes[0])})">${codes[0].toUpperCase()}</button>

//    And add '${slug}' alongside 'canadasabatage' in normalizeLang()'s regex
//    so the ${codes[0]} query/hash segment is honored for this article too:
    if (v === ${jsStringLiteral(codes[0])} || v.startsWith(${jsStringLiteral(codes[0] + '-')})) {
      const hash = window.location.hash || '#/'
      if (/^#\\/article\\/(canadasabatage|${slug})\\//i.test(hash)) return ${jsStringLiteral(codes[0])}
    }`
  }

  return snippet
}

export function generateHtaccessLine(state) {
  const { slug } = state
  return `RewriteRule ^article/${slug}/?$ /${slug}.php [L,NC]`
}

export function generatePhpShell(state) {
  const { slug, date, languages } = state
  const en = languages.find(l => l.code === 'en') || languages[0]
  const titleAttr = attrSafe(smartenPunctuation(en?.title || slug))
  const desc = firstParagraphText(en?.raw || '').slice(0, 200) || en?.desc || ''
  const descAttr = desc.replace(/"/g, '&quot;')
  const bodyHtml = formatArticleBody(en?.raw || '')
  const publishedDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`))

  return `<?php // SSR fallback — JS redirect at bottom of <head> ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titleAttr} | Moolytics</title>
  <meta name="description" content="${descAttr}">
  <link rel="canonical" href="/article/${slug}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${titleAttr}">
  <meta property="og:description" content="${descAttr}">
  <meta property="og:site_name" content="Moolytics">
  <meta name="twitter:card" content="summary">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Georgia, 'Times New Roman', Times, serif; background: #fafaf8; color: #1a1a1a; max-width: 860px; margin: 0 auto; padding: 2rem 1.5rem 4rem; font-size: 1rem; line-height: 1.75; }
    a { color: #2a5298; }
    header { margin-bottom: 2rem; border-bottom: 2px solid #ddd; padding-bottom: 1rem; }
    h1 { font-size: 1.8rem; line-height: 1.25; margin-bottom: 0.5rem; }
    .byline { font-style: italic; color: #555; font-size: 0.9rem; }
    h2 { font-size: 1.2rem; margin: 2rem 0 0.6rem; border-left: 4px solid #2a5298; padding-left: 0.75rem; }
    h3 { font-size: 1.05rem; margin: 1.3rem 0 0.4rem; font-weight: 700; }
    p { margin-bottom: 0.9rem; }
    ul, ol { margin: 0.5rem 0 1rem 1.5rem; } li { margin-bottom: 0.4rem; }
    strong { font-weight: 700; }
    footer { margin-top: 3rem; border-top: 1px solid #ddd; padding-top: 1rem; font-size: 0.8rem; color: #888; }
    @media (max-width: 600px) { body { padding: 1rem 1rem 3rem; } h1 { font-size: 1.4rem; } }
  </style>
  <script>(function(){ try { window.location.replace('/#/article/${slug}'); } catch(e){} }());</script>
</head>
<body>

<header>
  <h1>${titleAttr}</h1>
  <div class="byline">${attrSafe(smartenPunctuation(en?.byline || 'Moolytics'))} — Published ${publishedDate}</div>
</header>

${bodyHtml}

<footer>
  <p>Published by Moolytics — <a href="/#/">moolytics.com</a></p>
</footer>

</body>
</html>
`
}
