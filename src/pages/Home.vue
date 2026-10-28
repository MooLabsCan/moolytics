<script setup>
import { computed } from 'vue'
import articlesData from '../data/articles.js'
import CurlingIceAdCard from '../components/CurlingIceAdCard.vue'

const props = defineProps({ lang: { type: String, default: 'en' } })

const SPORTS_IDS = new Set(['brazil-curling', 'curlings-greatest-shots'])

const articles = computed(() =>
  [...articlesData].sort((a, b) => b.date.localeCompare(a.date))
)

const sportsArticles = computed(() =>
  articles.value.filter((article) => SPORTS_IDS.has(article.id))
)

const analysisArticles = computed(() =>
  articles.value.filter((article) => !SPORTS_IDS.has(article.id))
)

const featured = computed(() => analysisArticles.value[0] ?? articles.value[0] ?? null)
const rest = computed(() => analysisArticles.value.filter((article) => article.id !== featured.value?.id))

function t(article) {
  return article[props.lang] ?? article.en
}

function formatDate(iso) {
  if (!iso) return ''
  const [y, m] = iso.split('-')
  const months = props.lang === 'pt'
    ? ['janeiro','fevereiro','marco','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']
    : ['January','February','March','April','May','June','July','August','September','October','November','December']
  return props.lang === 'pt' ? `${months[+m - 1]} de ${y}` : `${months[+m - 1]} ${y}`
}

function getTopic(article) {
  if (SPORTS_IDS.has(article.id)) return props.lang === 'pt' ? 'Esportes' : 'Sports'
  if (article.id.includes('language')) return props.lang === 'pt' ? 'Aprendizado' : 'Learning'
  if (article.id.includes('marx') || article.id.includes('george')) return props.lang === 'pt' ? 'Ideias' : 'Ideas'
  if (article.id.includes('tax') || article.id.includes('fines') || article.id.includes('estonia')) return props.lang === 'pt' ? 'Impostos' : 'Tax'
  if (article.id.includes('finland') || article.id.includes('canada')) return props.lang === 'pt' ? 'Mercados' : 'Markets'
  return props.lang === 'pt' ? 'Politica' : 'Policy'
}

const ui = computed(() => {
  if (props.lang === 'pt') return {
    siteTitle: 'Moolytics',
    eyebrow: 'Geo-economia, politica publica e esporte explicado com dados',
    siteIntro: 'Analises longas e pesquisadas sobre mercados, impostos, instituicoes e as historias esportivas que revelam como sistemas funcionam.',
    latest: 'Mais recente',
    featured: 'Artigo principal',
    section: 'Analises em destaque',
    sportsSection: 'Esportes',
    sportsIntro: 'Reportagens esportivas com a mesma lente de pesquisa: contexto historico, incentivos, infraestrutura e desenvolvimento.',
    read: 'Ler artigo',
    explore: 'Explorar esportes'
  }
  return {
    siteTitle: 'Moolytics',
    eyebrow: 'Geo-economics, public policy, and sports explained with data',
    siteIntro: 'Long-form, researched analysis on markets, taxes, institutions, and the sports stories that reveal how systems are built.',
    latest: 'Latest',
    featured: 'Lead Analysis',
    section: 'Featured Analysis',
    sportsSection: 'Sports',
    sportsIntro: 'Sports reporting with the same research lens: history, incentives, infrastructure, and development pathways.',
    read: 'Read article',
    explore: 'Explore sports'
  }
})
</script>

<template>
  <section class="home">
    <header class="hero">
      <div class="hero-copy">
        <p class="eyebrow">{{ ui.eyebrow }}</p>
        <h1>{{ ui.siteTitle }}</h1>
        <p class="site-intro">{{ ui.siteIntro }}</p>
        <div class="hero-actions">
          <a href="#featured-analysis" class="btn btn-primary">{{ ui.section }}</a>
          <a href="#sports" class="btn">{{ ui.explore }}</a>
        </div>
      </div>

      <CurlingIceAdCard :lang="props.lang" variant="compact" />
    </header>

    <section id="featured-analysis" class="content-section">
      <div class="section-row">
        <h2 class="section-label">{{ ui.section }}</h2>
        <div class="section-rule"></div>
      </div>

      <article v-if="featured" class="card card-featured">
        <div class="card-meta">
          <span class="tag-latest">{{ ui.latest }}</span>
          <span class="topic">{{ getTopic(featured) }}</span>
          <span class="card-date">{{ formatDate(featured.date) }}</span>
        </div>
        <h3 class="card-title card-title-lg">{{ t(featured).title }}</h3>
        <p class="card-desc">{{ t(featured).desc }}</p>
        <a :href="featured.href" class="text-link">{{ ui.read }}</a>
      </article>

      <div class="cards-grid">
        <article v-for="article in rest" :key="article.id" class="card">
          <div class="card-meta">
            <span class="topic">{{ getTopic(article) }}</span>
            <span class="card-date">{{ formatDate(article.date) }}</span>
          </div>
          <h3 class="card-title">{{ t(article).title }}</h3>
          <p class="card-desc">{{ t(article).desc }}</p>
          <a :href="article.href" class="text-link">{{ ui.read }}</a>
        </article>
      </div>
    </section>

    <section id="sports" class="content-section sports-section">
      <div class="section-row">
        <div>
          <h2 class="section-label">{{ ui.sportsSection }}</h2>
          <p class="section-intro">{{ ui.sportsIntro }}</p>
        </div>
        <div class="section-rule"></div>
      </div>

      <div class="sports-grid">
        <article v-for="article in sportsArticles" :key="article.id" class="sports-card">
          <div class="card-meta">
            <span class="topic">{{ getTopic(article) }}</span>
            <span class="card-date">{{ formatDate(article.date) }}</span>
          </div>
          <h3 class="card-title">{{ t(article).title }}</h3>
          <p class="card-desc">{{ t(article).desc }}</p>
          <a :href="article.href" class="text-link">{{ ui.read }}</a>
        </article>
      </div>
    </section>
  </section>
</template>

<style scoped>
.home {
  position: relative;
  padding-top: 0.5rem;
}

.home::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  z-index: -1;
  width: min(100vw, 1180px);
  height: 390px;
  transform: translateX(-50%);
  background:
    linear-gradient(90deg, rgba(89, 111, 98, 0.08) 1px, transparent 1px),
    linear-gradient(180deg, rgba(89, 111, 98, 0.08), transparent 72%);
  background-size: 34px 100%, auto;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
  gap: 1.5rem;
  align-items: stretch;
  padding: 2rem 0 2.25rem;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 2rem;
}

.hero-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 300px;
  padding: 0.25rem 0;
}

.eyebrow,
.section-label,
.card-date,
.topic,
.tag-latest {
  font-size: 0.68rem;
  font-variant: small-caps;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.eyebrow {
  color: #596f62;
  margin: 0 0 0.8rem;
  font-weight: 700;
}

.hero h1 {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(2.3rem, 7vw, 4.8rem);
  line-height: 0.95;
  margin: 0 0 1rem;
  color: var(--color-heading, inherit);
}

.site-intro {
  font-size: 1.04rem;
  color: var(--vt-c-text-light-2, #666);
  margin: 0;
  line-height: 1.65;
  max-width: 62ch;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.35rem;
}

.content-section {
  margin-top: 2rem;
}

.section-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.section-label {
  font-family: Georgia, 'Times New Roman', serif;
  color: var(--vt-c-text-light-2, #777);
  margin: 0;
  white-space: nowrap;
}

.section-intro {
  margin: 0.35rem 0 0;
  color: var(--vt-c-text-light-2, #666);
  max-width: 62ch;
  line-height: 1.55;
  font-size: 0.9rem;
}

.section-rule {
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.card,
.sports-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.25rem 1.35rem 1.15rem;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0)),
    var(--color-background, #fff);
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  transition: box-shadow 0.18s, transform 0.18s, border-color 0.18s;
}

.card:hover,
.sports-card:hover {
  box-shadow: 0 8px 28px rgba(28, 38, 46, 0.09);
  transform: translateY(-2px);
  border-color: rgba(89, 111, 98, 0.35);
}

.card-featured {
  margin-bottom: 1rem;
  padding: 1.75rem 2rem 1.55rem;
  border-left: 4px solid #596f62;
  background:
    linear-gradient(135deg, rgba(237, 244, 239, 0.82), transparent 55%),
    var(--color-background-soft, #fafafa);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.sports-section {
  padding-top: 0.75rem;
}

.sports-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.sports-card {
  background:
    linear-gradient(180deg, rgba(215, 234, 223, 0.3), transparent 42%),
    var(--color-background, #fff);
}

.card-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.card-date {
  color: var(--vt-c-text-light-2, #888);
}

.topic,
.tag-latest {
  font-weight: 700;
  color: #596f62;
  background: rgba(89, 111, 98, 0.1);
  border: 1px solid rgba(89, 111, 98, 0.2);
  padding: 0.1rem 0.45rem;
  border-radius: 4px;
}

.tag-latest {
  color: #7a5c28;
  background: rgba(122, 92, 40, 0.1);
  border-color: rgba(122, 92, 40, 0.22);
}

.card-title {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.35;
  margin: 0;
  color: var(--color-heading, inherit);
}

.card-title-lg {
  font-size: clamp(1.35rem, 3vw, 2rem);
  line-height: 1.18;
}

.card-desc {
  font-size: 0.87rem;
  line-height: 1.62;
  color: var(--vt-c-text-light-2, #666);
  margin: 0;
  flex: 1;
}

.btn {
  display: inline-block;
  align-self: flex-start;
  padding: 0.48rem 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.82rem;
  color: inherit;
  transition: background 0.15s, border-color 0.15s;
}

.btn:hover {
  background: var(--color-background-soft, #f5f5f5);
  border-color: #596f62;
}

.btn-primary {
  border-color: #596f62;
  color: #2d4938;
  background: rgba(89, 111, 98, 0.08);
}

.btn-primary:hover {
  background: rgba(89, 111, 98, 0.15);
}

.text-link {
  align-self: flex-start;
  margin-top: 0.2rem;
  color: #2d4938;
  font-size: 0.82rem;
  font-weight: 700;
  text-decoration: none;
  border-bottom: 1px solid rgba(45, 73, 56, 0.35);
}

.text-link::after {
  content: ' ->';
}

.text-link:hover {
  border-bottom-color: currentColor;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 760px) {
  .hero {
    grid-template-columns: 1fr;
    padding-top: 1.25rem;
  }

  .section-row {
    align-items: flex-start;
  }

  .cards-grid,
  .sports-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .hero h1 {
    font-size: 2.45rem;
  }

  .card-featured {
    padding: 1.3rem 1.25rem 1.15rem;
  }

  .section-rule {
    display: none;
  }
}
</style>
