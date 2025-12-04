<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import Home from './pages/Home.vue'
import ArticleBrazilEstonia from './pages/ArticleBrazilEstonia.vue'
import MarketEfficiencyGermany from './pages/MarketEfficiencyGermany.vue'
import GeorgeEastWest from './pages/George-East-West.vue'
import SocietyFailedPrisons from './pages/Society-Failed-Prisons.vue'
import EmployerFines from './pages/employerFines.vue'

const lang = ref(localStorage.getItem('lang') || (navigator.language?.startsWith('pt') ? 'pt' : 'en'))
const route = ref('home')
const params = ref({})

function setLang(l) {
  lang.value = l
  localStorage.setItem('lang', l)
}

function parseHashQuery(q) {
  const out = {}
  if (!q) return out
  q.replace(/^\?/, '').split('&').forEach(p => {
    const [k, v] = p.split('=')
    if (k) out[decodeURIComponent(k)] = decodeURIComponent(v || '')
  })
  return out
}

function parseRoute() {
  const hash = window.location.hash || '#/'
  const afterHash = hash.replace(/^#/, '')
  const [path, queryString] = afterHash.split('?')
  const parts = path.replace(/^\/?/, '').split('/')
  const query = parseHashQuery(queryString || '')

  if (!parts[0]) return { name: 'home', params: {} }

  if (parts[0] === 'article') {
    const id = parts[1] || ''
    const langParam = parts[2] || query.lang || ''
    return { name: 'article', params: { id, lang: langParam } }
  }

  return { name: 'home', params: {} }
}

function syncRoute() {
  const r = parseRoute()
  route.value = r.name
  params.value = r.params
  if (r.params?.lang) setLang(r.params.lang)
  // sanitize after route changes
  nextTick(() => sanitizeAll())
}

// Text sanitizer: remove select emojis and replace em/en dashes with simple hyphen
function sanitizeText(s) {
  if (!s) return s
  let out = s
  // Replace em dash and en dash with hyphen
  out = out.replace(/[\u2014\u2013]/g, '-')
  // Remove specific emojis used in content: flags, tools, sprouts, checkered flag, compass
  const emojiChars = [
    '\u{1F9ED}', // 🧭 compass
    '\u{1F331}', // 🌱 seedling
    '\u{1F6E0}', // 🛠 hammer and wrench (may appear with VS16)
    '\u{FE0F}',  // variation selector 16
    '\u{1F3C1}', // 🏁 checkered flag
    // Flags (regional indicator pairs)
    '\u{1F1E7}\u{1F1F7}', // 🇧🇷 Brazil
    '\u{1F1EA}\u{1F1EA}'  // 🇪🇪 Estonia
  ]
  // Build a regex that matches any of the listed emojis
  const re = new RegExp(emojiChars.join('|'), 'gu')
  out = out.replace(re, '')
  return out
}

function sanitizeAll(rootEl) {
  const root = rootEl || document.getElementById('app')
  if (!root) return
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const toChange = []
  let node
  while ((node = walker.nextNode())) {
    const original = node.nodeValue
    const cleaned = sanitizeText(original)
    if (cleaned !== original) toChange.push([node, cleaned])
  }
  for (const [n, val] of toChange) n.nodeValue = val
}

let observer

onMounted(() => {
  syncRoute()
  window.addEventListener('hashchange', syncRoute)
  // Initial sanitize
  sanitizeAll()
  // Observe DOM changes to keep content sanitized
  observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'childList') {
        m.addedNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            const cleaned = sanitizeText(node.nodeValue)
            if (cleaned !== node.nodeValue) node.nodeValue = cleaned
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            sanitizeAll(node)
          }
        })
      } else if (m.type === 'characterData' && m.target?.nodeType === Node.TEXT_NODE) {
        const cleaned = sanitizeText(m.target.nodeValue)
        if (cleaned !== m.target.nodeValue) m.target.nodeValue = cleaned
      }
    }
  })
  observer.observe(document.getElementById('app'), { subtree: true, childList: true, characterData: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', syncRoute)
  if (observer) observer.disconnect()
})

const isHome = computed(() => route.value === 'home')
</script>

<template>
  <header class="topbar">
    <div class="brand" @click="() => (window.location.hash = '#/')">
      <img src="/moolytics-logo.svg" alt="Moolytics logo" class="logo" />
      <span class="brand-text">Moolytics</span>
    </div>
    <nav class="nav">
      <a href="#/" :class="{ active: isHome }">Home</a>
      <a :href="`#/article/brazil-estonia/${lang}`" :class="{ active: route === 'article' && params.id==='brazil-estonia' }">Brazil vs Estonia</a>
      <a :href="`#/article/market-efficiency-germany/${lang}`" :class="{ active: route === 'article' && params.id==='market-efficiency-germany' }">Market Efficiency (Germany)</a>
      <a :href="`#/article/george-east-west/${lang}`" :class="{ active: route === 'article' && params.id==='george-east-west' }">Henry George (East vs West)</a>
      <a :href="`#/article/society-failed-prisons/${lang}`" :class="{ active: route === 'article' && params.id==='society-failed-prisons' }">Society Failed Prisons</a>
      <a :href="`#/article/employer-fines/${lang}`" :class="{ active: route === 'article' && params.id==='employer-fines' }">Employer Payroll Taxes</a>
    </nav>
    <div class="lang-switch">
      <button :class="{ active: lang === 'en' }" @click="setLang('en')">EN</button>
      <button :class="{ active: lang === 'pt' }" @click="setLang('pt')">PT</button>
    </div>
  </header>

  <main class="content">
    <Home v-if="isHome" :lang="lang" />
    <ArticleBrazilEstonia v-else-if="route === 'article' && params.id==='brazil-estonia'" :lang="lang" :id="params.id" />
    <MarketEfficiencyGermany v-else-if="route === 'article' && params.id==='market-efficiency-germany'" />
    <GeorgeEastWest v-else-if="route === 'article' && params.id==='george-east-west'" :lang="lang" :id="params.id" />
    <SocietyFailedPrisons v-else-if="route === 'article' && params.id==='society-failed-prisons'" :lang="lang" :id="params.id" />
    <EmployerFines v-else-if="route === 'article' && params.id==='employer-fines'" :lang="lang" />
    <div v-else>Not Found</div>
  </main>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
}
.logo { height: 24px; width: 24px; }
.nav a {
  margin-right: 1rem;
  text-decoration: none;
}
.nav a.active { font-weight: 700; }
.lang-switch button { margin-left: 0.5rem; }
.lang-switch .active { font-weight: 700; }
.content {
  max-width: 860px;
  margin: 1.25rem auto 2.5rem;
  padding: 0 1rem;
}
.article img {
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
}
.table-wrapper { overflow-x: auto; }

/* News-like typography */
h1, h2, h3 { font-family: Georgia, 'Times New Roman', Times, serif; }
.article h1 { font-size: 2rem; line-height: 1.25; margin-bottom: 0.25rem; }
.byline { color: var(--vt-c-text-light-2); font-style: italic; margin-bottom: 1rem; }
.article p { margin: 0.75rem 0; }
</style>
