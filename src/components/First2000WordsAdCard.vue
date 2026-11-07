<script setup>
import { computed } from 'vue'

// Promotes the Vocabi essay "The First 2,000 Words".
// The visual is the essay's argument: common words in rough frequency order, most common
// first, set large and dark and fading as frequency drops. The first dozen sit
// on honey, the colour Vocabi uses for words you've already collected.
// English readers see Spanish; Portuguese readers see English, the language
// they would be learning.
// The essay lives on vocabi.ca/first-2000-words once Vocabi next deploys;
// until then the Headley Wealth copy is the one that is live.
const props = defineProps({
  lang: { type: String, default: 'en' },
  variant: { type: String, default: 'full' }
})

const href = 'https://headleywealth.liap.ca/first-2000-words.html'

const WORDS = {
  es: 'de la que el en y a los se no un por con una para es lo como más pero yo ya muy sí todo bien hay casa día tiempo vida mundo año agua hablar hombre noche ciudad amigo nuevo mujer comer libro grande perro nadar gracias',
  en: 'the of and to a in is you that it he was for on are as with they at be this have from or one had by word but not what all were we when your can said there use each which she do how their if will up other about out many then them'
}

const copy = computed(() => {
  if (props.lang === 'pt') return {
    words: WORDS.en,
    title: 'As primeiras 2.000 palavras',
    body: 'E se ensinamos idiomas na ordem errada? Comece pelas palavras que as pessoas mais usam e deixe a gramática vir depois.',
    by: 'Um ensaio da equipe do Vocabi, em inglês.',
    cta: 'Ler o ensaio'
  }
  return {
    words: WORDS.es,
    title: 'The first 2,000 words',
    body: "What if we've been teaching languages in the wrong order? Start with the words people use most, and let grammar follow.",
    by: 'An essay from the Vocabi team.',
    cta: 'Read the essay'
  }
})

// Size and ink fall with rank, roughly the way frequency does.
const wall = computed(() => copy.value.words.split(' ').map((w, i) => ({
  w,
  got: i < 12,
  size: (2.1 / (1 + i * 0.09) + 0.62).toFixed(2) + 'rem',
  ink: Math.max(0.28, 1 - i * 0.016).toFixed(2)
})))
</script>

<template>
  <aside class="words-ad" :class="`words-ad-${variant}`">
    <a class="wall" :href="href" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">
      <span
        v-for="(item, i) in wall"
        :key="i"
        class="w"
        :class="{ got: item.got }"
        :style="{ fontSize: item.size, opacity: item.ink }"
      >{{ item.w }}</span>
    </a>

    <div class="copy">
      <h2>{{ copy.title }}</h2>
      <p class="body">{{ copy.body }}</p>
      <p class="by">{{ copy.by }}</p>
      <a class="cta" :href="href" target="_blank" rel="noopener">{{ copy.cta }}</a>
    </div>
  </aside>
</template>

<style scoped>
.words-ad {
  --sky: #d9f0fc;
  --navy: #0f3e66;
  --honey: #fdeab9;
  --leaf: #2d7a3e;
  --display: 'Baloo 2', 'Trebuchet MS', system-ui, sans-serif;
  background: var(--sky);
  color: var(--navy);
  border-radius: 18px;
  overflow: hidden;
}

.words-ad-full {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  margin: 2.4rem 0 0;
}

.words-ad-compact {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

/* The wall: words flow like a ranked list read left to right. */
.wall {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 0.1rem 0.42rem;
  padding: 1.1rem 1.2rem;
  max-height: 15.5rem;
  overflow: hidden;
  background: #fff;
  text-decoration: none;
  color: var(--navy);
  font-family: var(--display);
  font-weight: 800;
  line-height: 1.05;
  /* the list keeps going; let it fade rather than stop */
  mask-image: linear-gradient(180deg, #000 62%, transparent);
  -webkit-mask-image: linear-gradient(180deg, #000 62%, transparent);
}

.words-ad-compact .wall {
  max-height: 11rem;
}

.w {
  padding: 0 0.18em;
  border-radius: 0.28em;
}

.w.got {
  background: var(--honey);
}

.copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 1.4rem 1.5rem 1.5rem;
}

.copy h2 {
  margin: 0;
  font-family: var(--display);
  font-weight: 800;
  font-size: clamp(1.7rem, 3.4vw, 2.2rem);
  line-height: 1;
  color: var(--navy);
  text-wrap: balance;
}

.body {
  margin: 0.7rem 0 0;
  font-size: 0.98rem;
  line-height: 1.5;
  max-width: 34ch;
}

.by {
  margin: 0.55rem 0 0;
  font-size: 0.85rem;
  color: #174a72;
  opacity: 0.8;
}

.cta {
  margin-top: 1rem;
  padding: 0.55rem 1.05rem;
  border-radius: 999px;
  background: var(--leaf);
  color: #fff;
  font-weight: 800;
  font-size: 0.92rem;
  text-decoration: none;
}

.cta:hover {
  background: #23612f;
}

.cta:focus-visible {
  outline: 3px solid var(--navy);
  outline-offset: 3px;
}

@media (max-width: 640px) {
  .words-ad-full {
    grid-template-columns: 1fr;
  }

  .wall {
    max-height: 11rem;
  }
}
</style>
