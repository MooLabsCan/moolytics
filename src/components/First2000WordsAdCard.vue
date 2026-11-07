<script setup>
import { computed } from 'vue'

// Promotes the Vocabi essay "The First 2,000 Words". Same shape as
// CurlingIceAdCard so the two sit together on a page.
// The essay lives on vocabi.ca/first-2000-words once Vocabi next deploys;
// until then the Headley Wealth copy is the one that is live.
const props = defineProps({
  lang: { type: String, default: 'en' },
  variant: { type: String, default: 'full' }
})

const href = 'https://headleywealth.liap.ca/first-2000-words.html'
const heroImage = '/images/first-2000-words.jpg'
const logoImage = '/images/vocabi-icon-512.png'

const copy = computed(() => {
  if (props.lang === 'pt') return {
    label: 'Leitura recomendada · em inglês',
    title: 'As Primeiras 2.000 Palavras',
    kicker: 'E se ensinamos idiomas na ordem errada?',
    body: 'Comece pelas palavras mais usadas, não pelas regras. A gramática vem depois, quando você já tem o que dizer. Um ensaio da equipe do Vocabi.',
    cta: 'Ler o artigo',
    detailA: 'Palavras primeiro',
    detailB: 'Leitura de 5 min'
  }

  return {
    label: 'Recommended read',
    title: 'The First 2,000 Words',
    kicker: "What if we've been teaching languages in the wrong order?",
    body: 'Start with the words people actually use, not the rules. Grammar comes along once you have something to say. An essay from the Vocabi team.',
    cta: 'Read the article',
    detailA: 'Words first',
    detailB: '5 min read'
  }
})
</script>

<template>
  <aside class="words-ad" :class="`words-ad-${variant}`">
    <a class="ad-media" :href="href" target="_blank" rel="noopener" :aria-label="copy.title">
      <img class="ad-hero" :src="heroImage" alt="" loading="lazy">
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
    </div>
  </aside>
</template>

<style scoped>
.words-ad {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border: 1px solid rgba(15, 62, 102, 0.2);
  border-radius: 8px;
  background: linear-gradient(135deg, #fdf7ea, #eef7fd);
  box-shadow: 0 14px 38px rgba(15, 62, 102, 0.1);
}

.words-ad-full {
  display: grid;
  grid-template-columns: minmax(180px, 0.82fr) minmax(0, 1fr);
  gap: 1.2rem;
  align-items: center;
  margin: 2.4rem 0 0;
  padding: 1rem;
}

.words-ad-compact {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 0.95rem;
}

.ad-media {
  position: relative;
  display: block;
  min-height: 190px;
  overflow: hidden;
  border-radius: 7px;
  background: #d9f0fc;
}

.words-ad-compact .ad-media {
  min-height: 168px;
  margin-bottom: 0.95rem;
}

.ad-hero {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.ad-logo {
  position: absolute;
  left: 0.75rem;
  bottom: 0.75rem;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  box-shadow: 0 8px 22px rgba(15, 62, 102, 0.28);
}

.ad-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.45rem;
  padding: 0.2rem 0.2rem 0.2rem 0;
}

.words-ad-compact .ad-copy {
  padding: 0;
}

.ad-label,
.ad-meta span {
  font-size: 0.67rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.ad-label {
  margin: 0;
  color: #2d7a3e;
  font-weight: 800;
}

.ad-copy h2 {
  margin: 0;
  color: #0f3e66;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.45rem, 3vw, 2rem);
  font-weight: 800;
  line-height: 1.04;
}

.words-ad-compact .ad-copy h2 {
  font-size: 1.45rem;
}

.ad-kicker {
  margin: 0;
  color: #174a72;
  font-size: 0.92rem;
  font-weight: 800;
}

.ad-body {
  margin: 0;
  color: rgba(43, 33, 24, 0.78);
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
  color: #0f3e66;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(15, 62, 102, 0.18);
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
  background: #2d7a3e;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 800;
  text-decoration: none;
  box-shadow: 0 8px 18px rgba(45, 122, 62, 0.22);
}

.ad-cta:hover {
  background: #23612f;
}

@media (max-width: 640px) {
  .words-ad-full {
    grid-template-columns: 1fr;
  }

  .ad-media {
    min-height: 170px;
  }
}
</style>
