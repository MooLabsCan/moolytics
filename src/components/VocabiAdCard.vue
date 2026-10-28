<script setup>
import { computed } from 'vue'

const props = defineProps({
  lang: { type: String, default: 'en' },
  variant: { type: String, default: 'full' }
})

const logoImage = '/images/vocabi-icon-512.png'

// Tester Central serves EN/FR/PT off a ?lang= param, so send readers to the
// variant matching the article they were just reading.
const href = computed(() =>
  props.lang === 'pt'
    ? 'https://testercentral.liap.ca/?lang=pt'
    : 'https://testercentral.liap.ca/?lang=en'
)

const copy = computed(() => {
  if (props.lang === 'pt') return {
    label: 'Beta aberto - procuram-se testadores',
    title: 'Vocabi',
    kicker: 'Onde a lingua cresce',
    body: 'Um mundo de aprendizado de idiomas onde cada palavra aprendida vira um tijolo para reconstruir uma vila em ruinas. Sem ofensivas, sem vidas, sem punicao. Esta em beta e recrutando testadores para decidir o que ele ainda vai ser.',
    cta: 'Seja um testador',
    detailA: 'Gratuito no beta',
    detailB: 'Sua opiniao guia o roteiro',
    foot: 'Recrutamento pelo Tester Central'
  }

  return {
    label: 'Open beta - testers wanted',
    title: 'Vocabi',
    kicker: 'Where language grows',
    body: 'A language-learning world where every word you learn becomes a brick to rebuild a ruined village. No streaks, no lives, no punishment. It is in beta now and recruiting testers to decide what it still becomes.',
    cta: 'Become a tester',
    detailA: 'Free during beta',
    detailB: 'Your feedback sets the roadmap',
    foot: 'Recruiting through Tester Central'
  }
})
</script>

<template>
  <aside class="vocabi-ad" :class="`vocabi-ad-${variant}`">
    <a class="ad-media" :href="href" target="_blank" rel="noopener" aria-label="Vocabi">
      <span class="ad-courses" aria-hidden="true"></span>
      <img class="ad-logo" :src="logoImage" alt="Vocabi logo" loading="lazy">
    </a>

    <div class="ad-copy">
      <p class="ad-label">{{ copy.label }}</p>
      <h2>{{ copy.title }}</h2>
      <p class="ad-kicker">{{ copy.kicker }}</p>
      <p class="ad-body">{{ copy.body }}</p>
      <div class="ad-meta" aria-hidden="true">
        <span>{{ copy.detailA }}</span>
        <span>{{ copy.detailB }}</span>
      </div>
      <a class="ad-cta" :href="href" target="_blank" rel="noopener">{{ copy.cta }}</a>
      <p class="ad-foot">{{ copy.foot }}</p>
    </div>
  </aside>
</template>

<style scoped>
.vocabi-ad {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border: 1px solid rgba(45, 73, 56, 0.24);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(247, 251, 246, 0.98), rgba(230, 240, 230, 0.86)),
    var(--color-background-soft, #f8f8f8);
  box-shadow: 0 14px 38px rgba(24, 44, 30, 0.1);
}

.vocabi-ad::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(90deg, rgba(45, 73, 56, 0.08) 1px, transparent 1px),
    linear-gradient(0deg, rgba(45, 73, 56, 0.06) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: linear-gradient(135deg, transparent, #000 35%, #000 78%, transparent);
}

.vocabi-ad-full {
  display: grid;
  grid-template-columns: minmax(180px, 0.82fr) minmax(0, 1fr);
  gap: 1.2rem;
  align-items: center;
  margin: 2.4rem 0 0;
  padding: 1rem;
}

.vocabi-ad-compact {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 0.95rem;
}

.ad-media {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 190px;
  overflow: hidden;
  border-radius: 7px;
  background:
    radial-gradient(120% 90% at 50% 8%, rgba(122, 163, 91, 0.4), transparent 62%),
    #1d3021;
}

.vocabi-ad-compact .ad-media {
  min-height: 168px;
  margin-bottom: 0.95rem;
}

/* Brick courses - the app's own "one word, one brick" motif, drawn in CSS so
   the card carries no image dependency beyond the logo. */
.ad-courses {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.09) 2px, transparent 2px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.07) 2px, transparent 2px);
  background-size: 100% 26px, 52px 100%;
  mask-image: linear-gradient(0deg, #000, #000 42%, transparent 88%);
}

.ad-logo {
  position: relative;
  width: 86px;
  height: 86px;
  border-radius: 18px;
  box-shadow: 0 10px 26px rgba(10, 24, 14, 0.45);
}

.ad-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.45rem;
  padding: 0.2rem 0.2rem 0.2rem 0;
}

.vocabi-ad-compact .ad-copy {
  padding: 0;
}

.ad-label,
.ad-meta span {
  font-size: 0.67rem;
  font-variant: small-caps;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.ad-label {
  margin: 0;
  color: #7a5c28;
  font-weight: 800;
}

.ad-copy h2 {
  margin: 0;
  color: #1d3021;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.45rem, 3vw, 2rem);
  font-weight: 800;
  line-height: 1.04;
}

.vocabi-ad-compact .ad-copy h2 {
  font-size: 1.45rem;
}

.ad-kicker {
  margin: 0;
  color: #4c7040;
  font-size: 0.92rem;
  font-weight: 800;
}

.ad-body {
  margin: 0;
  color: rgba(29, 48, 33, 0.78);
  font-size: 0.9rem;
  line-height: 1.56;
}

.ad-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.15rem;
}

.ad-meta span {
  color: #1d3021;
  background: rgba(255, 255, 255, 0.66);
  border: 1px solid rgba(45, 73, 56, 0.2);
  border-radius: 4px;
  padding: 0.12rem 0.42rem;
  font-weight: 700;
}

.ad-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.35rem;
  min-height: 36px;
  padding: 0.48rem 0.9rem;
  border-radius: 6px;
  background: #4c7040;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 800;
  text-decoration: none;
  box-shadow: 0 8px 18px rgba(76, 112, 64, 0.24);
}

.ad-cta:hover {
  background: #3b5a32;
}

.ad-foot {
  margin: 0.1rem 0 0;
  color: rgba(29, 48, 33, 0.55);
  font-size: 0.72rem;
}

@media (max-width: 640px) {
  .vocabi-ad-full {
    grid-template-columns: 1fr;
  }

  .ad-media {
    min-height: 170px;
  }
}
</style>
