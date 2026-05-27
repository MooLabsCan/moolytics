<script setup>
import { computed } from 'vue'
import articlesData from '../data/articles.js'

const props = defineProps({ lang: { type: String, default: 'en' } })

const articles = computed(() =>
  [...articlesData].sort((a, b) => b.date.localeCompare(a.date))
)

const featured = computed(() => articles.value[0] ?? null)
const rest = computed(() => articles.value.slice(1))

function t(article) {
  return article[props.lang] ?? article.en
}

function formatDate(iso) {
  const [y, m] = iso.split('-')
  const months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December']
  return `${months[+m - 1]} ${y}`
}

const ui = computed(() => {
  if (props.lang === 'pt') return {
    siteTitle: 'Moolytics — Geo-Economia em Foco',
    siteIntro: 'Análises de dados, políticas públicas e mercados — com ênfase em geoeconomia.',
    featured: 'Mais recente',
    section: 'Artigos em destaque',
    read: 'Ler artigo'
  }
  return {
    siteTitle: 'Moolytics — Geo-Economics in Focus',
    siteIntro: 'Data-driven analysis on public policy and markets — with a geo-economics lens.',
    featured: 'Latest',
    section: 'Featured Articles',
    read: 'Read article'
  }
})
</script>

<template>
  <section class="home">

    <!-- ── Site header ── -->
    <div class="site-header">
      <h1 class="site-title">{{ ui.siteTitle }}</h1>
      <p class="site-intro">{{ ui.siteIntro }}</p>
    </div>

    <div class="section-row">
      <h2 class="section-label">{{ ui.section }}</h2>
      <div class="section-rule"></div>
    </div>

    <!-- ── Featured (newest) article ── -->
    <article v-if="featured" class="card card-featured">
      <div class="card-meta">
        <span class="tag-latest">{{ ui.featured }}</span>
        <span class="card-date">{{ formatDate(featured.date) }}</span>
      </div>
      <h3 class="card-title card-title-lg">{{ t(featured).title }}</h3>
      <p class="card-desc">{{ t(featured).desc }}</p>
      <a :href="featured.href" class="btn btn-primary">{{ ui.read }} &rarr;</a>
    </article>

    <!-- ── Article grid ── -->
    <div class="cards-grid">
      <article v-for="article in rest" :key="article.id" class="card">
        <div class="card-meta">
          <span class="card-date">{{ formatDate(article.date) }}</span>
        </div>
        <h3 class="card-title">{{ t(article).title }}</h3>
        <p class="card-desc">{{ t(article).desc }}</p>
        <a :href="article.href" class="btn">{{ ui.read }}</a>
      </article>
    </div>

  </section>
</template>

<style scoped>
.home {
  padding-top: 0.5rem;
}

/* ── Site header ── */
.site-header {
  padding: 1.75rem 0 1.5rem;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 1.75rem;
}
.site-title {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.4rem, 3.5vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0 0 0.5rem;
  color: var(--color-heading, inherit);
}
.site-intro {
  font-size: 0.95rem;
  color: var(--vt-c-text-light-2, #888);
  margin: 0;
  line-height: 1.6;
  max-width: 56ch;
}

/* ── Section heading ── */
.section-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}
.section-label {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 0.72rem;
  font-variant: small-caps;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--vt-c-text-light-2, #999);
  margin: 0;
  white-space: nowrap;
}
.section-rule {
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

/* ── Base card ── */
.card {
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 1.25rem 1.4rem 1.1rem;
  background: var(--color-background, #fff);
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  transition: box-shadow 0.18s, transform 0.18s;
}
.card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}

/* ── Featured card ── */
.card-featured {
  margin-bottom: 1.25rem;
  padding: 1.75rem 2rem 1.5rem;
  border-left: 4px solid #7a5c28;
  background: var(--color-background-soft, #faf8f4);
}

/* ── Card meta (date + badge) ── */
.card-meta {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}
.card-date {
  font-size: 0.7rem;
  font-variant: small-caps;
  letter-spacing: 0.08em;
  color: var(--vt-c-text-light-2, #aaa);
}
.tag-latest {
  font-size: 0.62rem;
  font-variant: small-caps;
  letter-spacing: 0.1em;
  font-weight: 700;
  color: #7a5c28;
  background: rgba(122,92,40,0.1);
  border: 1px solid rgba(122,92,40,0.25);
  padding: 0.1rem 0.45rem;
  border-radius: 3px;
}

/* ── Card title ── */
.card-title {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.35;
  margin: 0;
  color: var(--color-heading, inherit);
}
.card-title-lg {
  font-size: clamp(1.05rem, 2.5vw, 1.4rem);
}

/* ── Card description ── */
.card-desc {
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--vt-c-text-light-2, #666);
  margin: 0;
  flex: 1;
}

/* ── Buttons ── */
.btn {
  display: inline-block;
  align-self: flex-start;
  margin-top: 0.25rem;
  padding: 0.4rem 0.85rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.8rem;
  color: inherit;
  transition: background 0.15s, border-color 0.15s;
}
.btn:hover {
  background: var(--color-background-soft, #f5f5f5);
  border-color: #9b7d48;
}
.btn-primary {
  border-color: #7a5c28;
  color: #5a3c10;
  background: rgba(122,92,40,0.06);
}
.btn-primary:hover {
  background: rgba(122,92,40,0.14);
}

/* ── Grid ── */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (max-width: 580px) {
  .cards-grid { grid-template-columns: 1fr; }
  .card-featured { padding: 1.25rem 1.2rem 1.1rem; }
}
</style>