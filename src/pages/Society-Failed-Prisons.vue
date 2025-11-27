<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
const props = defineProps({ lang: { type: String, default: 'en' }, id: { type: String, default: 'society-failed-prisons' } })

const canonicalUrl = computed(() => `#/${['article', props.id, props.lang].filter(Boolean).join('/')}`)
const fullUrl = computed(() => window.location.origin + window.location.pathname + canonicalUrl.value)

const shareTitle = computed(() => props.lang === 'pt' ? 'O Custo Duplo do Sistema Punitivo' : 'The Dual Cost of the Punitive System')
const shareText = computed(() => props.lang === 'pt' ? 'Quando a cadeia falha, a sociedade paga.' : 'When prison fails, society pays.')

const showShareMenu = ref(false)
const shareMenuEl = ref(null)
function toggleShareMenu() { showShareMenu.value = !showShareMenu.value }
function closeShareMenu() { showShareMenu.value = false }
function onDocumentClick(e) {
  if (!showShareMenu.value) return
  const el = shareMenuEl.value
  if (el && !el.contains(e.target)) showShareMenu.value = false
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick))

async function onShareClick() {
  try {
    if (navigator.share) {
      await navigator.share({ title: shareTitle.value, text: shareText.value, url: fullUrl.value })
      return
    }
  } catch (e) {
    console.warn('Native share failed or was cancelled, falling back to menu:', e)
  }
  showShareMenu.value = true
}

async function copyLink() {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(fullUrl.value)
      alert(props.lang === 'pt' ? 'Link copiado!' : 'Link copied!')
    } else {
      prompt(props.lang === 'pt' ? 'Copie o link:' : 'Copy the link:', fullUrl.value)
    }
  } catch (e) {
    console.error('Clipboard error', e)
    prompt(props.lang === 'pt' ? 'Copie o link:' : 'Copy the link:', fullUrl.value)
  }
}

const encodedUrl = computed(() => encodeURIComponent(fullUrl.value))
const encodedTitle = computed(() => encodeURIComponent(shareTitle.value))
const encodedText = computed(() => encodeURIComponent(shareText.value))

// Publication date (today), localized per language
const today = new Date()
const isoDate = today.toISOString().split('T')[0]
const formattedDate = computed(() => {
  const locale = props.lang === 'pt' ? 'pt-BR' : 'en-US'
  const fmt = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' })
  return fmt.format(today)
})
</script>

<template>
  <article class="article">
    <header style="display:flex;align-items:center;justify-content:space-between;gap:1rem; margin-bottom:0.75rem;">
      <div>
        <h1 v-if="props.lang==='en'">The Dual Cost of the Punitive System: When Prison Fails, Society Pays</h1>
        <h1 v-else>O Custo Duplo do Sistema Punitivo: Quando a Cadeia Falha, a Sociedade Paga</h1>
        <div class="byline">
          <em v-if="props.lang==='en'">By Aline Foch</em>
          <em v-else>Por Aline Foch</em>
        </div>
        <div class="pubdate">
          <small v-if="props.lang==='en'">Published on <time :datetime="isoDate">{{ formattedDate }}</time></small>
          <small v-else>Publicado em <time :datetime="isoDate">{{ formattedDate }}</time></small>
        </div>
      </div>
      <div class="share" ref="shareMenuEl" style="position:relative;">
        <button @click="onShareClick" :aria-expanded="showShareMenu ? 'true' : 'false'" aria-haspopup="menu" title="Share" style="border:1px solid var(--color-border);background:transparent;border-radius:6px;padding:0.35rem 0.5rem;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          <span>{{ props.lang==='pt' ? 'Compartilhar' : 'Share' }}</span>
        </button>
        <div v-if="showShareMenu" class="share-menu" role="menu">
          <button class="share-item" role="menuitem" @click="copyLink">{{ props.lang==='pt' ? 'Copiar link' : 'Copy link' }}</button>
          <a class="share-item" role="menuitem" :href="`mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`" target="_blank" rel="noopener">{{ props.lang==='pt' ? 'Email' : 'Email' }}</a>
          <a class="share-item" role="menuitem" :href="`https://api.whatsapp.com/send?text=${encodedTitle}%20-%20${encodedUrl}`" target="_blank" rel="noopener">WhatsApp</a>
          <a class="share-item" role="menuitem" :href="`https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`" target="_blank" rel="noopener">X / Twitter</a>
          <a class="share-item" role="menuitem" :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`" target="_blank" rel="noopener">LinkedIn</a>
        </div>
      </div>
    </header>

    <template v-if="props.lang === 'en'">
      <p><strong>The Dual Cost of the Punitive System: When Prison Fails, Society Pays</strong></p>
      <h2>Introduction</h2>
      <p>A common argument in public discourse, often associated with human rights groups and left-leaning politics, asserts that individuals who turn to crime are mostly victims of a system that denied them opportunities. The central critique is that the State punishes rather than rehabilitates, creating a cycle of recidivism. While the prison system's failure in social reintegration is undeniable, the narrative that attributes criminality exclusively to a "lack of option" ignores a crucial element: the social and economic burden that falls on the ordinary citizen, who is repeatedly victimized by this unresolved equation.</p>

      <h2>The Fallacy of "No Choice" and the Allure of Illusion</h2>
      <p>It is a fact that millions of low-income Brazilians live honestly, facing the barriers of limited opportunity daily with hard work and dignity. Arguing that crime is an inevitable consequence of poverty is, at the very least, an oversimplification that disrespects the integrity of these citizens. What attracts many young people to drug trafficking and other illicit activities is not just survival, but the allure of fast money, ostentation, and adrenaline, a promise of power and status that formal work rarely offers. Ignoring this component of "choice" in favor of the illegal path is turning a blind eye to a fundamental dimension of criminal psychology.</p>

      <h2>The Citizen as a Multiple Victim of the System</h2>
      <p>This is the core of the problem: the law-abiding citizen is hit not once, but multiple times by the system's inefficiency.</p>
      <p><strong>Direct Violence:</strong> The first and most traumatic blow is being a victim of robbery, theft, or an act of violence. It is the physical and psychological aggression, the loss of property, and in many cases, the loss of life or loved ones.</p>
      <p><strong>The Financial Burden:</strong> After being victimized, the same citizen, through their taxes, is forced to pay for the perpetrator's stay in jail. The cost is astronomical. According to DEPEN (the National Penitentiary Department), Brazil has a prison population of over 835,000 inmates (2022 data, the most recent consolidated). The average cost to maintain an inmate in the system varies greatly, but conservative estimates point to around R$ 2,500 per month per prisoner. In some states, like São Paulo, this cost can exceed R$ 3,000. When multiplied, this represents an annual cost to public coffers, and therefore, to taxpayers, that exceeds billions of reais.</p>
      <p><strong>Recidivism and the Vicious Cycle:</strong> The third strike occurs when the inmate is released. Without professional qualifications and, often, with stronger ties to crime after experiencing the overcrowded, gang-dominated system, they return to the streets. The statistics, although debated and varying according to the source and methodology, point to an alarming scenario: it is estimated that the recidivism rate in Brazil could exceed 60%, with some studies suggesting even higher figures. The individual who "had no choice" leaves prison even less prepared, and society becomes a target again, restarting the cycle of violence and costs.</p>

      <h2>For a Solution That Relieves the Citizen's Burden</h2>
      <p>The discussion, therefore, needs to evolve. It's not just about improving education in the long term, a noble goal, but one with delayed effects. It is urgent to debate how to transform the prison system from a bottomless pit of expenses into a self-sustaining unit that, at the very least, does not further burden its primary victim.</p>
      <p>A viable proposal, already partially adopted within the system, is prison management by private entities, under strict state supervision. In this model, inmates would be required to work full-time. The production generated in the penitentiaries would be used to cover their own maintenance (food, security, infrastructure), vocational training courses, and also a compulsory savings plan to be accessed upon release.</p>

      <h2>Conclusion</h2>
      <p>The central idea is simple yet powerful: the prisoner must support themselves. It is neither fair nor sustainable for the worker, who has already suffered direct violence, to have their income further penalized by taxes to indefinitely support the one who assaulted them. Transforming prison into an environment of mandatory work and learning is not an inhumane measure; on the contrary, it is a way to restore the inmate's dignity through labor and the prospect of a different future. By doing so, the cycle of state dependency is broken, and the dual burden, moral and financial, that currently crushes the true engine of society, the law-abiding citizen, is alleviated.</p>
    </template>

    <template v-else>
      <p><strong>O Custo Duplo do Sistema Punitivo: Quando a Cadeia Falha, a Sociedade Paga</strong></p>
      <h2>Introdução</h2>
      <p>Um discurso frequente no debate público, muitas vezes associado a setores de direitos humanos e à esquerda política, defende que os indivíduos que ingressam no crime são, em sua maioria, vítimas de um sistema que lhes negou oportunidades. A crítica central é de que o Estado, ao invés de reeducar, pune, criando um ciclo de reincidência. Embora seja inegável a falha do sistema prisional na reintegração social, a narrativa que atribui a criminalidade exclusivamente à "falta de opção" ignora um elemento crucial: o ônus social e econômico que recai sobre o cidadão comum, que é repetidamente vitimado por essa equação mal resolvida.</p>

      <h2>A Falácia da "Falta de Escolha" e o Brilho da Ilusão</h2>
      <p>É um fato que milhões de brasileiros de baixa renda vivem honestamente, enfrentando diariamente as barreiras da falta de oportunidade com trabalho e dignidade. Alegar que o crime é uma consequência inevitável da pobreza é, no mínimo, uma simplificação que desrespeita a integridade desses cidadãos. O que atrai muitos jovens para o tráfico de drogas e outras atividades ilícitas não é apenas a sobrevivência, mas a sedução do dinheiro rápido, da ostentação e da adrenalina, uma promessa de poder e status que o trabalho formal raramente oferece. Ignorar este componente de "escolha" pela via ilegal é fechar os olhos para uma dimensão fundamental da psicologia criminal.</p>

      <h2>O Cidadão como Vítima Múltipla do Sistema</h2>
      <p>Aqui reside o cerne do problema: o cidadão que cumpre suas obrigações é atingido não uma, mas várias vezes pela ineficiência do sistema.</p>
      <p><strong>A Violência Direta:</strong> O primeiro e mais traumático revés é ser vítima de um assalto, furto ou ato de violência. É a agressão física e psicológica, a perda de bens e, em muitos casos, a perda da vida ou de entes queridos.</p>
      <p><strong>O Ônus Financeiro:</strong> Após ser vitimado, o mesmo cidadão, através de seus impostos, é forçado a bancar a estadia do agressor na cadeia. O custo é astronômico. De acordo com o Depen (Departamento Penitenciário Nacional), o Brasil possui uma população carcerária de mais de 835 mil presos (dados de 2022, os mais recentes consolidados). O custo médio para manter um detento no sistema varia enormemente, mas estimativas conservadoras apontam para cerca de R$ 2.500,00 por mês por preso. Em alguns estados, como São Paulo, esse valor pode ultrapassar R$ 3.000,00. Multiplicando-se, temos um custo anual para os cofres públicos, e, portanto, para os contribuintes, que supera a casa dos bilhões de reais.</p>
      <p><strong>A Reincidência e o Ciclo Vicioso:</strong> O terceiro golpe ocorre com a liberação do detento. Sem qualificação profissional e, frequentemente, com laços mais estreitos com o crime após a passagem pelo sistema superlotado e dominado por facções, ele retorna às ruas. As estatísticas, embora debatidas e variarem conforme a fonte e a metodologia, apontam para um cenário alarmante: estima-se que a taxa de reincidência no Brasil possa ultrapassar 60%, com alguns estudos sugerindo números ainda mais altos. O indivíduo que "não teve escolha" sai da prisão ainda menos preparado, e a sociedade é novamente alvo, reiniciando o ciclo de violência e custos.</p>

      <h2>Por uma Solução que Alivie o Fardo do Cidadão</h2>
      <p>A discussão, portanto, precisa evoluir. Não se trata apenas de melhorar a educação a longo prazo, um objetivo nobre, mas de efeito tardio. É urgente debater como transformar o sistema carcerário de um poço sem fundo de despesas em uma unidade autossustentável que, pelo menos, não onere ainda mais quem já é sua vítima primária.</p>
      <p>Uma proposta viável e já adotada em partes do sistema é a gestão prisional por entidades privadas, sob rígida supervisão estatal. Neste modelo, exige-se que os presos trabalhem em tempo integral. A produção gerada nas penitenciárias seria revertida para custear sua própria manutenção (alimentação, segurança, infraestrutura), cursos de qualificação profissional e, ainda, uma poupança compulsória a ser resgatada no momento da soltura.</p>

      <h2>Conclusão</h2>
      <p>A ideia central é simples, mas poderosa: o preso deve se manter. Não é justo, nem sustentável, que o trabalhador, que já sofreu a violência direta, tenha sua renda ainda mais penalizada por impostos para sustentar indefinidamente aquele que o agrediu. Transformar o cárcere em um ambiente de trabalho e aprendizado obrigatório não é uma medida desumana; é, pelo contrário, uma forma de devolver ao detento a dignidade do ofício e a perspectiva de um futuro diferente. Ao fazê-lo, quebra-se o ciclo de dependência estatal e alivia-se o fardo duplo, moral e financeiro, que hoje esmaga o verdadeiro motor da sociedade: o cidadão cumpridor da lei.</p>
    </template>

    <footer style="margin-top:2rem; color: var(--vt-c-text-light-2); font-size: 0.9rem;">
      <p>© 2025  All rights reserved. This article is for informational purposes only.</p>
    </footer>
  </article>
</template>

<style scoped>
.article { padding: 1rem; }
.share-menu { position: absolute; top: 2rem; right: 0; background: var(--color-background); border: 1px solid var(--color-border); border-radius: 8px; padding: 0.25rem; min-width: 160px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
.share-item { display: block; width: 100%; text-align: left; padding: 0.35rem 0.5rem; background: transparent; border: none; cursor: pointer; text-decoration: none; color: inherit; }
.share-item:hover { background: rgba(0,0,0,0.04); }
@media (max-width: 600px) { .article { font-size: 16px; } }
</style>
