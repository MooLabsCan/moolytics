<script setup>
import { computed } from 'vue'
const props = defineProps({ lang: { type: String, default: 'en' } })

const t = computed(() => {
  if (props.lang === 'pt') {
    return {
      title: 'Moolytics - Geo-Economia em Foco',
      intro: 'Bem-vindo ao Moolytics. Análises de dados, políticas públicas e mercados - com ênfase em geoeconomia.',
      sample: 'Artigos em destaque',
      article1: 'Brasil vs Estônia - Tributação de Dividendos',
      article2: 'A Eficiência de Mercado Global - Alemanha em foco',
      article3: 'Henry George — Rejeitado no Ocidente, Abraçado no Oriente',
      read: 'Ler artigo'
    }
  }
  return {
    title: 'Moolytics - Geo-Economics in Focus',
    intro: 'Welcome to Moolytics. Data-driven analysis on public policy and markets - with a geo-economics lens.',
    sample: 'Featured Articles',
    article1: 'Brazil vs Estonia - Dividend Taxation',
    article2: 'The Global Pivot to Market Efficiency (Germany)',
    article3: 'Henry George — Rejected in the West, Embraced in the East',
    read: 'Read article'
  }
})
</script>

<template>
  <section>
    <h1>{{ t.title }}</h1>
    <p>{{ t.intro }}</p>

    <h2 style="margin-top: 2rem">{{ t.sample }}</h2>
    <div class="cards">
      <article class="card">
        <header>
          <h3>{{ t.article1 }}</h3>
        </header>
        <p>
          <span v-if="props.lang==='en'">A comparison of Brazil’s profit-tax/exempt-dividend model with Estonia’s tax-on-distribution approach, and implications for growth and fairness.</span>
          <span v-else>Uma comparação entre o modelo brasileiro (tributa lucro/isenta dividendos) e o modelo estoniano (tributa na distribuição), e seus impactos no crescimento e na equidade.</span>
        </p>
        <a :href="`#/article/brazil-estonia/${props.lang}`" class="btn">{{ t.read }}</a>
      </article>
      <article class="card">
        <header>
          <h3>{{ t.article2 }}</h3>
        </header>
        <p>
          <span v-if="props.lang==='en'">Why market efficiency matters now: lessons from Estonia and Singapore, and what Germany must fix to regain dynamism.</span>
          <span v-else>Por que a eficiência de mercado importa agora: lições de Estônia e Cingapura, e o que a Alemanha precisa ajustar para recuperar dinamismo.</span>
        </p>
        <a :href="`#/article/market-efficiency-germany/${props.lang}`" class="btn">{{ t.read }}</a>
      </article>
      <article class="card">
        <header>
          <h3>{{ t.article3 }}</h3>
        </header>
        <p>
          <span v-if="props.lang==='en'">Henry George’s land value tax—ignored in the West, implemented in the East. How Hong Kong and Singapore turned land rents into growth, housing, and low taxes.</span>
          <span v-else>O imposto sobre valor da terra de Henry George — ignorado no Ocidente, implementado no Oriente. Como Hong Kong e Singapura converteram rendas da terra em crescimento, moradia e impostos baixos.</span>
        </p>
        <a :href="`#/article/george-east-west/${props.lang}`" class="btn">{{ t.read }}</a>
      </article>
    </div>
  </section>
</template>

<style scoped>
.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
.card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
}
.btn {
  display: inline-block;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  text-decoration: none;
}
</style>
