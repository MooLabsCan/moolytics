const SITE_NAME = 'Moolytics'

const HOME_SEO = {
  en: {
    title: 'Moolytics - Geo-Economics, Public Policy, Markets, and Sports Analysis',
    description: 'Moolytics publishes researched analysis on geo-economics, public policy, taxes, market efficiency, political economy, sports history, and curling.',
    keywords: 'Moolytics, geo-economics, public policy, market efficiency, tax policy, political economy, land value tax, Georgism, sports history, curling, Brazil curling'
  },
  pt: {
    title: 'Moolytics - Analise de Geo-Economia, Politica Publica, Mercados e Esportes',
    description: 'Moolytics publica analises pesquisadas sobre geo-economia, politica publica, impostos, eficiencia de mercado, economia politica, esportes e curling.',
    keywords: 'Moolytics, geo-economia, politica publica, eficiencia de mercado, politica tributaria, economia politica, imposto sobre valor da terra, esportes, curling, curling Brasil'
  }
}

const ARTICLE_KEYWORDS = {
  'tax-wage-ceiling': 'payroll taxes, employer payroll charges, consumption tax, VAT, wage ceiling, tax incidence, labour tax wedge, OECD Taxing Wages, Brazil payroll burden, FGTS, Brazil tax reform, Switzerland, Denmark, Finland, France, Italy',
  'how-language-is-learned': 'how language is learned, second language acquisition, vocabulary size, word families, comprehensible input, spaced repetition, retrieval practice, language learning motivation, immersion, gamification, language app research, Krashen, Paul Nation, extramural English',
  'brazil-curling': 'Brazil curling, Brazilian curling team, curling in Brazil, Arena Ice Brasil, CBDG, World Curling, winter sports Brazil, mixed doubles curling, wheelchair curling Brazil, Brazil Youth Olympics curling',
  'curlings-greatest-shots': 'greatest curling shots, best curling shots, Al Hackner double, Sandra Schmirler shot, Jennifer Jones The Shot, Glenn Howard curling, John Shuster Olympic curling, Niklas Edin Super Spinner, curling history',
  'not-all-left-is-equal': 'social democracy, Nordic model, Brazil left politics, working class mobility, wage growth, redistribution, monopoly, economic mobility, labor markets',
  'marx-george-intro': 'Karl Marx, Henry George, Marx vs George, land value tax, political economy, Georgism, socialism, Progress and Poverty, Das Kapital, single tax',
  canadasabatage: 'Canada venture regulation, TSXV, retail investors, accredited investor rules, venture capital Canada, middle class investing, securities regulation, capital formation',
  'finland-kok': 'Finland election 2023, National Coalition Party, KOK, Finns Party, market reforms Finland, free market policy, Nordic economy, Finnish politics',
  'policy-vs-efficiency': 'policy efficiency, market efficiency, incentives, public policy analysis, economic outcomes, jobs and wages, regulatory reform, mobility',
  'employer-fines': 'payroll taxes, employer payroll tax, employee payroll tax, tax incidence, wage growth, labor costs, payroll tax burden, competitiveness',
  'society-failed-prisons': 'Brazil prisons, punitive system, criminal justice reform, prison policy, public safety Brazil, incarceration costs, recidivism, social cost of prisons',
  'george-east-west': 'Henry George, land value tax, Hong Kong land policy, Singapore land policy, land rents, Georgism, urban economics, public revenue',
  'market-efficiency-germany': 'Germany market efficiency, German economy, Estonia reform, Singapore economy, economic dynamism, regulatory reform, AI economy, competitiveness',
  'brazil-estonia': 'Brazil Estonia taxation, dividend taxation, Estonia corporate tax, Brazil tax policy, profit tax, tax on distribution, business investment, tax reform'
}

const ARTICLE_SECTIONS = {
  'tax-wage-ceiling': 'Tax Policy',
  'how-language-is-learned': 'Learning & Cognition',
  'brazil-curling': 'Sports',
  'curlings-greatest-shots': 'Sports',
  'not-all-left-is-equal': 'Political Economy',
  'marx-george-intro': 'Political Economy',
  canadasabatage: 'Markets',
  'finland-kok': 'Markets',
  'policy-vs-efficiency': 'Public Policy',
  'employer-fines': 'Tax Policy',
  'society-failed-prisons': 'Public Policy',
  'george-east-west': 'Political Economy',
  'market-efficiency-germany': 'Markets',
  'brazil-estonia': 'Tax Policy'
}

function absoluteUrl(path = '/') {
  const origin = window.location.origin
  return new URL(path, origin).toString()
}

function textFor(article, lang) {
  return article?.[lang] ?? article?.en
}

function setHeadTag(selector, tagName, attrs) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement(tagName)
    document.head.appendChild(element)
  }

  Object.entries(attrs).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      element.removeAttribute(key)
    } else {
      element.setAttribute(key, value)
    }
  })
}

function setJsonLd(data) {
  let element = document.getElementById('moolytics-structured-data')
  if (!element) {
    element = document.createElement('script')
    element.id = 'moolytics-structured-data'
    element.type = 'application/ld+json'
    document.head.appendChild(element)
  }
  element.textContent = JSON.stringify(data)
}

function applyMeta(meta) {
  document.documentElement.lang = meta.lang || 'en'
  document.title = meta.title

  setHeadTag('meta[name="description"]', 'meta', { name: 'description', content: meta.description })
  setHeadTag('meta[name="keywords"]', 'meta', { name: 'keywords', content: meta.keywords })
  setHeadTag('meta[name="robots"]', 'meta', { name: 'robots', content: 'index, follow' })
  setHeadTag('link[rel="canonical"]', 'link', { rel: 'canonical', href: meta.url })

  setHeadTag('meta[property="og:type"]', 'meta', { property: 'og:type', content: meta.type })
  setHeadTag('meta[property="og:title"]', 'meta', { property: 'og:title', content: meta.ogTitle || meta.title })
  setHeadTag('meta[property="og:description"]', 'meta', { property: 'og:description', content: meta.description })
  setHeadTag('meta[property="og:url"]', 'meta', { property: 'og:url', content: meta.url })
  setHeadTag('meta[property="og:site_name"]', 'meta', { property: 'og:site_name', content: SITE_NAME })

  setHeadTag('meta[name="twitter:card"]', 'meta', { name: 'twitter:card', content: meta.image ? 'summary_large_image' : 'summary' })
  setHeadTag('meta[name="twitter:title"]', 'meta', { name: 'twitter:title', content: meta.ogTitle || meta.title })
  setHeadTag('meta[name="twitter:description"]', 'meta', { name: 'twitter:description', content: meta.description })

  if (meta.image) {
    setHeadTag('meta[property="og:image"]', 'meta', { property: 'og:image', content: meta.image })
    setHeadTag('meta[name="twitter:image"]', 'meta', { name: 'twitter:image', content: meta.image })
  }

  if (meta.jsonLd) setJsonLd(meta.jsonLd)
}

export function applyHomeSeo({ lang = 'en', articles = [] } = {}) {
  const locale = lang === 'pt' ? 'pt' : 'en'
  const seo = HOME_SEO[locale]
  const url = absoluteUrl('/')

  applyMeta({
    ...seo,
    lang: locale === 'pt' ? 'pt-BR' : 'en-US',
    type: 'website',
    url,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url,
      description: seo.description,
      inLanguage: locale === 'pt' ? 'pt-BR' : 'en-US',
      mainEntity: articles.slice(0, 12).map((article) => {
        const articleText = textFor(article, locale)
        return {
          '@type': 'Article',
          headline: articleText?.title,
          description: articleText?.desc,
          datePublished: article.date,
          articleSection: ARTICLE_SECTIONS[article.id] || 'Analysis',
          keywords: ARTICLE_KEYWORDS[article.id],
          url: absoluteUrl(`/article/${article.id}`)
        }
      })
    }
  })
}

export function applyArticleSeo({ article, lang = 'en' } = {}) {
  if (!article) return false

  const locale = article[lang] ? lang : 'en'
  const articleText = textFor(article, locale)
  const url = absoluteUrl(`/article/${article.id}`)
  const title = `${articleText.title} | ${SITE_NAME}`
  const keywords = ARTICLE_KEYWORDS[article.id] || `${articleText.title}, ${SITE_NAME}`
  const section = ARTICLE_SECTIONS[article.id] || 'Analysis'

  applyMeta({
    title,
    ogTitle: articleText.title,
    description: articleText.desc,
    keywords,
    lang: locale === 'pt' ? 'pt-BR' : 'en-US',
    type: 'article',
    url,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: articleText.title,
      description: articleText.desc,
      datePublished: article.date,
      dateModified: article.date,
      articleSection: section,
      keywords,
      inLanguage: locale === 'pt' ? 'pt-BR' : 'en-US',
      mainEntityOfPage: url,
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: absoluteUrl('/')
      }
    }
  })

  return true
}
