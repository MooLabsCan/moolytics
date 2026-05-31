<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import rawHtml from '../../docs/o-grande-debate-v1.html?raw'

const bodyHtml = rawHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? ''

// Scope the CSS so it only affects content inside .pt-debate.
// - Keep :root custom-property definitions as global (benign, unique names).
// - Redirect body{} styles onto .pt-debate .sheet so font/size settings are contained.
// - Drop html,body{} reset and body::before{} fixed overlay (not appropriate inside SPA).
const scopedCss = (() => {
  let css = rawHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/i)?.[1] ?? ''
  css = css.replace(/\bbody\s*\{/, '.pt-debate .sheet {')
  css = css.replace(/html\s*,\s*body\s*\{[^}]*\}/, '')
  css = css.replace(/body::before\s*\{[\s\S]*?\}/, '')
  return css
})()

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700' +
  '&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700' +
  '&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400' +
  '&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap'

let styleEl = null

onMounted(() => {
  if (!document.querySelector('link[data-pt-debate-fonts]')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.dataset.ptDebateFonts = ''
    link.href = FONT_URL
    document.head.appendChild(link)
  }
  styleEl = document.createElement('style')
  styleEl.dataset.ptDebateStyle = 'v1'
  styleEl.textContent = scopedCss
  document.head.appendChild(styleEl)
})

onBeforeUnmount(() => {
  styleEl?.remove()
})
</script>

<template>
  <div class="pt-debate" v-html="bodyHtml"></div>
</template>

<style scoped>
.pt-debate {
  /* Provide the parchment body background the standalone HTML had on <body> */
  background:
    radial-gradient(ellipse at 20% 10%, rgba(120,95,40,.10), transparent 55%),
    radial-gradient(ellipse at 85% 90%, rgba(90,30,18,.08), transparent 50%),
    #e9e0cb;
  padding: 2rem 1rem 5rem;
}
</style>