<script setup>
import { computed } from 'vue'

const props = defineProps({
  lang: { type: String, default: 'en' },
  variant: { type: String, default: 'full' }
})

const heroImage = '/images/%D0%B8%D0%BA%D0%BE%D0%BD%D0%BA%D0%B0%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8%20%D0%BA%D0%B5%D1%80%D0%BB%D0%B8%D0%BD%D0%B3.svg'
const logoImage = '/images/Curling_Ice_logo_6.png'

const copy = computed(() => {
  if (props.lang === 'pt') return {
    label: 'Jogue no gelo',
    title: 'Curling Ice',
    kicker: 'Simulador gratuito de curling',
    body: 'Teste linhas, peso e colisões em desafios inspirados por jogadas reais. Disponível para Android, iOS e web, em 17 idiomas.',
    cta: 'Jogar gratis',
    detailA: 'Fisica realista',
    detailB: 'Mobile e web'
  }

  return {
    label: 'Play the ice',
    title: 'Curling Ice',
    kicker: 'Free curling simulator',
    body: 'Try lines, weight, and collisions in challenges inspired by real shots. Available on Android, iOS, and web in 17 languages.',
    cta: 'Play free',
    detailA: 'Realistic physics',
    detailB: 'Mobile and web'
  }
})
</script>

<template>
  <aside class="curling-ad" :class="`curling-ad-${variant}`">
    <a class="ad-media" href="https://curling.liap.ca/install" target="_blank" rel="noopener" aria-label="Curling Ice">
      <img class="ad-hero" :src="heroImage" alt="" loading="lazy">
      <img class="ad-logo" :src="logoImage" alt="Curling Ice logo" loading="lazy">
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
      <a class="ad-cta" href="https://curling.liap.ca/install" target="_blank" rel="noopener">{{ copy.cta }}</a>
    </div>
  </aside>
</template>

<style scoped>
.curling-ad {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border: 1px solid rgba(68, 108, 108, 0.24);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(247, 251, 249, 0.98), rgba(228, 239, 235, 0.86)),
    var(--color-background-soft, #f8f8f8);
  box-shadow: 0 14px 38px rgba(27, 47, 48, 0.1);
}

.curling-ad::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(90deg, rgba(68, 108, 108, 0.08) 1px, transparent 1px),
    linear-gradient(0deg, rgba(68, 108, 108, 0.06) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: linear-gradient(135deg, transparent, #000 35%, #000 78%, transparent);
}

.curling-ad-full {
  display: grid;
  grid-template-columns: minmax(180px, 0.82fr) minmax(0, 1fr);
  gap: 1.2rem;
  align-items: center;
  margin: 2.4rem 0 0;
  padding: 1rem;
}

.curling-ad-compact {
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
  background: #e7f0ee;
}

.curling-ad-compact .ad-media {
  min-height: 168px;
  margin-bottom: 0.95rem;
}

.ad-hero {
  width: 100%;
  height: 100%;
  min-height: inherit;
  object-fit: cover;
  display: block;
}

.ad-logo {
  position: absolute;
  left: 0.75rem;
  bottom: 0.75rem;
  width: 54px;
  height: 54px;
  border-radius: 8px;
  box-shadow: 0 8px 22px rgba(26, 47, 48, 0.24);
}

.ad-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.45rem;
  padding: 0.2rem 0.2rem 0.2rem 0;
}

.curling-ad-compact .ad-copy {
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
  color: #8b3f47;
  font-weight: 800;
}

.ad-copy h2 {
  margin: 0;
  color: #1a2f30;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.45rem, 3vw, 2rem);
  font-weight: 800;
  line-height: 1.04;
}

.curling-ad-compact .ad-copy h2 {
  font-size: 1.45rem;
}

.ad-kicker {
  margin: 0;
  color: #446c6c;
  font-size: 0.92rem;
  font-weight: 800;
}

.ad-body {
  margin: 0;
  color: rgba(26, 47, 48, 0.76);
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
  color: #1a2f30;
  background: rgba(255, 255, 255, 0.66);
  border: 1px solid rgba(68, 108, 108, 0.2);
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
  background: #bb434c;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 800;
  text-decoration: none;
  box-shadow: 0 8px 18px rgba(187, 67, 76, 0.22);
}

.ad-cta:hover {
  background: #9e3640;
}

@media (max-width: 640px) {
  .curling-ad-full {
    grid-template-columns: 1fr;
  }

  .ad-media {
    min-height: 170px;
  }
}
</style>
