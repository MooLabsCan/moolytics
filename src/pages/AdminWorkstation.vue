<script setup>
import { ref, computed } from 'vue'
import { formatArticleBody } from '../utils/articleFormatter.js'
import {
  slugToPascalCase,
  generateVueComponent,
  generateArticlesJsEntry,
  generateAppVueSnippet,
  generateHtaccessLine,
  generatePhpShell,
} from '../utils/scaffoldGenerator.js'

function todayIso() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function kebabCase(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const slug = ref('')
const date = ref(todayIso())

const languages = ref([
  { code: 'en', title: '', desc: '', byline: 'Moolytics — Economic Geography', raw: '' },
  { code: 'pt', title: '', desc: '', byline: 'Moolytics — Geografia Econômica', raw: '' },
])

const activeEditIndex = ref(0)
const activePreviewIndex = ref(0)
const newLangCode = ref('')

function addLanguage() {
  const code = newLangCode.value.trim().toLowerCase()
  if (!code) return
  if (languages.value.some(l => l.code === code)) return
  languages.value.push({ code, title: '', desc: '', byline: 'Moolytics', raw: '' })
  newLangCode.value = ''
  activeEditIndex.value = languages.value.length - 1
}

function removeLanguage(index) {
  if (languages.value.length <= 1) return
  languages.value.splice(index, 1)
  if (activeEditIndex.value >= languages.value.length) activeEditIndex.value = languages.value.length - 1
  if (activePreviewIndex.value >= languages.value.length) activePreviewIndex.value = languages.value.length - 1
}

function suggestSlug() {
  const en = languages.value.find(l => l.code === 'en') || languages.value[0]
  if (en?.title) slug.value = kebabCase(en.title)
}

const genState = computed(() => ({
  slug: slug.value.trim() || 'untitled-article',
  date: date.value,
  languages: languages.value.map(l => ({
    code: l.code.trim().toLowerCase(),
    title: l.title.trim(),
    desc: l.desc.trim(),
    byline: l.byline.trim(),
    raw: l.raw,
  })),
}))

const validationWarnings = computed(() => {
  const warnings = []
  if (!slug.value.trim()) warnings.push('Slug is empty — using a placeholder until you set one.')
  for (const l of languages.value) {
    if (!l.title.trim()) warnings.push(`"${l.code}" has no title yet.`)
    if (!l.raw.trim()) warnings.push(`"${l.code}" has no body text yet.`)
  }
  return warnings
})

function safeGenerate(fn) {
  try {
    return fn(genState.value)
  } catch (e) {
    return `/* Generator error: ${e.message} */`
  }
}

const componentFileName = computed(() => `${slugToPascalCase(genState.value.slug)}.vue`)
const phpFileName = computed(() => `${genState.value.slug}.php`)

const generatedVue = computed(() => safeGenerate(generateVueComponent))
const generatedArticlesEntry = computed(() => safeGenerate(generateArticlesJsEntry))
const generatedAppSnippet = computed(() => safeGenerate(generateAppVueSnippet))
const generatedHtaccessLine = computed(() => safeGenerate(generateHtaccessLine))
const generatedPhpShell = computed(() => safeGenerate(generatePhpShell))

const outputs = computed(() => [
  {
    key: 'vue',
    label: `${componentFileName.value} — new file in src/pages/`,
    content: generatedVue.value,
    filename: componentFileName.value,
  },
  {
    key: 'articles',
    label: 'articles.js entry — paste at the top of the array in src/data/articles.js',
    content: generatedArticlesEntry.value,
  },
  {
    key: 'appvue',
    label: 'App.vue wiring — import + route (+ extra-language notes if applicable)',
    content: generatedAppSnippet.value,
  },
  {
    key: 'htaccess',
    label: '.htaccess rule — add to public/.htaccess and dist/.htaccess, above the SPA fallback',
    content: generatedHtaccessLine.value,
  },
  {
    key: 'php',
    label: `${phpFileName.value} — new SEO shell in public/`,
    content: generatedPhpShell.value,
    filename: phpFileName.value,
  },
])

const copiedKey = ref('')
async function copyOutput(out) {
  try {
    await navigator.clipboard.writeText(out.content)
    copiedKey.value = out.key
    setTimeout(() => { if (copiedKey.value === out.key) copiedKey.value = '' }, 1500)
  } catch (e) {
    prompt('Copy this text:', out.content)
  }
}

function downloadOutput(out) {
  const blob = new Blob([out.content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = out.filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

const previewLang = computed(() => languages.value[activePreviewIndex.value] || languages.value[0])
const previewHtml = computed(() => formatArticleBody(previewLang.value?.raw || ''))
</script>

<template>
  <div class="admin">
    <header class="admin-header">
      <h1>Article Workstation</h1>
      <p class="hint">Dev-only scaffolding tool — paste raw text per language, get the .vue page plus the articles.js / App.vue / .htaccess / SEO-shell snippets to drop in by hand. Nothing here is written to disk automatically.</p>
    </header>

    <section class="meta-row">
      <label class="field">
        <span>Slug (article id)</span>
        <div class="slug-row">
          <input v-model="slug" placeholder="e.g. my-new-article" />
          <button type="button" class="btn-small" @click="suggestSlug">Suggest from EN title</button>
        </div>
      </label>
      <label class="field">
        <span>Publish date</span>
        <input v-model="date" type="date" />
      </label>
    </section>

    <div v-if="validationWarnings.length" class="warnings">
      <strong>Heads up:</strong>
      <ul><li v-for="w in validationWarnings" :key="w">{{ w }}</li></ul>
    </div>

    <section class="lang-editor">
      <div class="lang-tabs">
        <button
          v-for="(l, i) in languages"
          :key="l.code + i"
          :class="['lang-tab', { active: activeEditIndex === i }]"
          @click="activeEditIndex = i"
        >
          {{ l.code.toUpperCase() || '?' }}
          <span v-if="languages.length > 1" class="remove-x" @click.stop="removeLanguage(i)">&times;</span>
        </button>
        <span class="add-lang">
          <input v-model="newLangCode" placeholder="fr" maxlength="5" @keyup.enter="addLanguage" />
          <button type="button" class="btn-small" @click="addLanguage">+ Add language</button>
        </span>
      </div>

      <div v-if="languages[activeEditIndex]" class="lang-fields">
        <label class="field">
          <span>Language code</span>
          <input v-model="languages[activeEditIndex].code" placeholder="en / pt / fr…" />
        </label>
        <label class="field">
          <span>Title</span>
          <input v-model="languages[activeEditIndex].title" placeholder="Article title" />
        </label>
        <label class="field">
          <span>Short description (used for meta description &amp; share text)</span>
          <input v-model="languages[activeEditIndex].desc" placeholder="One or two sentences" />
        </label>
        <label class="field">
          <span>Byline</span>
          <input v-model="languages[activeEditIndex].byline" />
        </label>
        <label class="field">
          <span>Body (Markdown-lite: <code>## heading</code>, <code>### subheading</code>, blank line = new paragraph, <code>- item</code> for lists, <code>**bold**</code>, <code>*italic*</code>)</span>
          <textarea v-model="languages[activeEditIndex].raw" rows="16" placeholder="Paste raw article text here…"></textarea>
        </label>
      </div>
    </section>

    <section class="preview-section">
      <div class="preview-header">
        <h2>Live preview</h2>
        <div class="preview-tabs">
          <button
            v-for="(l, i) in languages"
            :key="'pv-' + l.code + i"
            :class="['lang-tab', { active: activePreviewIndex === i }]"
            @click="activePreviewIndex = i"
          >{{ l.code.toUpperCase() || '?' }}</button>
        </div>
      </div>
      <div class="preview-pane article">
        <h1>{{ previewLang?.title || '(untitled)' }}</h1>
        <div class="byline">{{ previewLang?.byline }}</div>
        <div v-html="previewHtml"></div>
      </div>
    </section>

    <section class="outputs-section">
      <h2>Generated scaffolding</h2>
      <div v-for="out in outputs" :key="out.key" class="output-panel">
        <div class="output-header">
          <span class="output-label">{{ out.label }}</span>
          <span class="output-actions">
            <button type="button" class="btn-small" @click="copyOutput(out)">{{ copiedKey === out.key ? 'Copied!' : 'Copy' }}</button>
            <button v-if="out.filename" type="button" class="btn-small" @click="downloadOutput(out)">Download</button>
          </span>
        </div>
        <pre class="code-block"><code>{{ out.content }}</code></pre>
      </div>
    </section>
  </div>
</template>

<style scoped>
.admin { max-width: 1100px; margin: 0 auto; padding: 1rem 0 4rem; }
.admin-header h1 { font-family: Georgia, 'Times New Roman', Times, serif; margin-bottom: 0.25rem; }
.hint { color: var(--vt-c-text-light-2, #888); font-size: 0.9rem; max-width: 70ch; }

.meta-row { display: flex; gap: 1.5rem; flex-wrap: wrap; margin: 1.25rem 0; }
.field { display: flex; flex-direction: column; gap: 0.3rem; font-size: 0.85rem; flex: 1; min-width: 220px; }
.field span { color: var(--vt-c-text-light-2, #888); }
.field input, .field textarea {
  font: inherit;
  padding: 0.45rem 0.6rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: inherit;
}
.field textarea { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 0.85rem; resize: vertical; }
.slug-row { display: flex; gap: 0.5rem; }
.slug-row input { flex: 1; }

.warnings {
  background: rgba(200,140,0,0.08);
  border: 1px solid rgba(200,140,0,0.3);
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
  margin-bottom: 1.25rem;
  font-size: 0.85rem;
}
.warnings ul { margin: 0.3rem 0 0 1.1rem; }

.btn-small {
  font-size: 0.78rem;
  padding: 0.3rem 0.6rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: transparent;
  color: inherit;
  cursor: pointer;
}
.btn-small:hover { background: var(--color-background-soft); }

.lang-editor { border: 1px solid var(--color-border); border-radius: 10px; padding: 1rem; margin-bottom: 1.5rem; }
.lang-tabs { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1rem; }
.lang-tab {
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
.lang-tab.active { background: rgba(122,92,40,0.12); border-color: #7a5c28; }
.remove-x { opacity: 0.6; }
.remove-x:hover { opacity: 1; }
.add-lang { display: inline-flex; gap: 0.4rem; align-items: center; margin-left: 0.5rem; }
.add-lang input { width: 4rem; padding: 0.3rem 0.5rem; border: 1px solid var(--color-border); border-radius: 6px; background: var(--color-background); color: inherit; }

.lang-fields { display: flex; flex-direction: column; gap: 0.75rem; }

.preview-section { margin-bottom: 1.5rem; }
.preview-header { display: flex; align-items: center; justify-content: space-between; }
.preview-tabs { display: flex; gap: 0.4rem; }
.preview-pane {
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 1.5rem 1.75rem;
  margin-top: 0.75rem;
  background: var(--color-background);
}
.preview-pane h1 { font-family: Georgia, 'Times New Roman', Times, serif; font-size: 1.7rem; line-height: 1.25; margin-bottom: 0.25rem; }
.preview-pane .byline { color: var(--vt-c-text-light-2); font-style: italic; margin-bottom: 1rem; }
.preview-pane :deep(h2) { font-family: Georgia, 'Times New Roman', Times, serif; margin: 1.1rem 0 0.35rem; }
.preview-pane :deep(h3) { font-family: Georgia, 'Times New Roman', Times, serif; margin: 0.9rem 0 0.25rem; }
.preview-pane :deep(p) { margin: 0.75rem 0; }
.preview-pane :deep(ul) { margin: 0.5rem 0 1rem 1.5rem; }
.preview-pane :deep(li) { margin-bottom: 0.4rem; }

.outputs-section h2 { margin-bottom: 0.75rem; }
.output-panel { border: 1px solid var(--color-border); border-radius: 10px; margin-bottom: 1rem; overflow: hidden; }
.output-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: var(--color-background-soft);
  border-bottom: 1px solid var(--color-border);
  gap: 0.75rem;
}
.output-label { font-size: 0.82rem; font-weight: 600; }
.output-actions { display: flex; gap: 0.4rem; flex-shrink: 0; }
.code-block {
  margin: 0;
  padding: 0.9rem 1rem;
  max-height: 360px;
  overflow: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.78rem;
  white-space: pre;
}
</style>
