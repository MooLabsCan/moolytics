<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import First2000WordsAdCard from '../components/First2000WordsAdCard.vue'

const props = defineProps({ lang: { type: String, default: 'en' }, id: { type: String, default: 'vocabi-language-learning' } })

const TITLES = {
  en: 'On the Horizon: Vocabi Is a Fantastic New Way to Build a Vocabulary in a New Language',
  pt: 'No Horizonte: Vocabi É uma Nova e Fantástica Maneira de Construir Vocabulário em Outro Idioma'
}
onMounted(() => { document.title = TITLES[props.lang] || TITLES.en })

const canonicalUrl = computed(() => `#/${['article', props.id, props.lang].filter(Boolean).join('/')}`)
const fullUrl = computed(() => window.location.origin + window.location.pathname + canonicalUrl.value)

const shareTitle = computed(() => TITLES[props.lang] || TITLES.en)
const shareText = computed(() => props.lang === 'pt'
  ? 'Cada palavra aprendida vira um tijolo em uma vila por onde você pode caminhar, com uma revisão espaçada de verdade por baixo.'
  : 'Every word you learn becomes a brick in a village you can walk through, with real spaced review underneath.')

const showShareMenu = ref(false)
const shareMenuEl = ref(null)

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

const pubDate = new Date('2026-11-05T00:00:00Z')
const isoDate = '2026-11-05'
const LOCALES = { en: 'en-US', pt: 'pt-BR' }
const formattedDate = computed(() => {
  const locale = LOCALES[props.lang] || 'en-US'
  const fmt = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
  return fmt.format(pubDate)
})
</script>

<template>
  <article class="article">
    <header style="display:flex;align-items:center;justify-content:space-between;gap:1rem; margin-bottom:0.75rem;">
      <div>
        <h1 v-if="props.lang==='en'">On the Horizon: Vocabi Is a Fantastic New Way to Build a Vocabulary in a New Language</h1>
        <h1 v-else>No Horizonte: Vocabi É uma Nova e Fantástica Maneira de Construir Vocabulário em Outro Idioma</h1>
        <div class="byline">
          <em v-if="props.lang==='en'">Moolytics &mdash; Learning &amp; Cognition</em>
          <em v-else>Moolytics &mdash; Aprendizado e Cognição</em>
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
          <a class="share-item" role="menuitem" :href="`mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`" target="_blank" rel="noopener">Email</a>
          <a class="share-item" role="menuitem" :href="`https://api.whatsapp.com/send?text=${encodedTitle}%20-%20${encodedUrl}`" target="_blank" rel="noopener">WhatsApp</a>
          <a class="share-item" role="menuitem" :href="`https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`" target="_blank" rel="noopener">X / Twitter</a>
          <a class="share-item" role="menuitem" :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`" target="_blank" rel="noopener">LinkedIn</a>
        </div>
      </div>
    </header>

    <template v-if="props.lang === 'en'">
      <p class="disclosure"><strong>Disclosure:</strong> Vocabi is made by the people behind Moolytics, and this site runs ads for it. This is a favourable piece, so weigh it accordingly. It is based on the app&rsquo;s public pages and its source code.</p>

      <p>Most language apps sell you a habit. <a href="https://vocabi.ca/" target="_blank" rel="noopener">Vocabi</a> offers you a place. You start in the ruins of a small village, and each word you learn becomes a brick with that word on its face. By your hundredth word, you are walking around a town with roofs on.</p>
      <p>That could easily be a gimmick. What makes Vocabi a fantastic tool to watch is what sits under the charm: a real review scheduler, a single deck of words fed from everywhere you meet the language, and a refusal to guilt you into coming back. It is young and unproven, and it is still one of the most promising ideas on the language-learning horizon.</p>

      <figure class="infographic">
        <img src="/images/vocabi-village-forest.jpg" alt="A Vocabi village seen from above, surrounded by forest" loading="lazy">
        <figcaption>The Brazilian village, one of the places your words can build. Image: Vocabi.</figcaption>
      </figure>

      <h2>The Problem It Goes After</h2>
      <p>As we covered in <a href="#/article/how-language-is-learned/en">How a Language Is Actually Learned</a>, vocabulary is the arithmetic at the bottom of everything. Depending on what you want to do with a language, you need somewhere between three thousand and nine thousand word families. You will not absorb those by exposure alone. In one study of learners using a graded reader, only about one word in 25 survived three months on the strictest measure.</p>
      <p>Deliberate practice does far better, but it has a different problem: it is tedious, and people stop. So a vocabulary tool has to do two jobs at once. It has to make the words stick, and it has to be somewhere you want to return to for hundreds of hours. Most tools are good at one of those. Vocabi is an attempt at both.</p>

      <h2>A Word Becomes a Brick</h2>
      <p>The road starts before the words do. If the language has a new alphabet, as Georgian, Arabic or Armenian does, you trace each letter until your hand knows it, sort letters into jars, and write your first real words.</p>
      <p>Then come the first 100 words, a list of common words in frequency order. Ten word games teach them, including Matchy, Word Search, Crossword, Lamplight, Word Blocks and Verbacid, most of them in pavilions around the village. Three small bubbles fill as you answer a word correctly, and the third fires a brick. After the hundredth word, a much larger walkable world opens beyond the village, and your words come with you.</p>

      <figure class="infographic">
        <img src="/images/vocabi-village-100.jpg" alt="A congratulations card reading 100, you learned your first 100 words in Portuguese, over a finished village" loading="lazy">
        <figcaption>What 100 words looks like. Image: Vocabi.</figcaption>
      </figure>

      <h2>A Serious Scheduler Under the Village</h2>
      <p>This is the part that won us over, because nothing on the surface advertises it. A new word returns at 1, 6 and 15 minutes. It can go from new to learned inside a single sitting, and a wrong answer sends it back to the start of those steps. It then moves to review at one day, then six days, then longer gaps that grow with how easily you recall it, up to a year.</p>
      <p>&ldquo;Learned&rdquo; is also not a one-way door. A word needs three correct answers in a row, or four attempts at a good ratio, and you have to keep your accuracy at 75 percent or the word is demoted. Learned words keep coming back for review.</p>
      <p>That lines up with the most reliable findings in the field. Cepeda and colleagues&rsquo; synthesis of 317 experiments found spaced practice beat massed practice on recall, 47.3 percent against 36.7. Roediger and Karpicke showed that testing yourself beats re-reading after a week, even though re-reading feels more productive. A word game that makes you recall the word, on a spaced schedule, is the research with a nicer coat on.</p>

      <h2>One Deck, Wherever You Meet the Word</h2>
      <p>Reading is how you meet words, and deliberate practice is how you keep them. Plenty of learners split that across three tools that know nothing about each other. In Vocabi it is one account and one deck:</p>
      <ul>
        <li><strong>Reader and stories:</strong> read from a shelf or paste any text, tap a word for its meaning, and keep it.</li>
        <li><strong>Translator:</strong> type or speak, read the result, and keep any word from it.</li>
        <li><strong>Browser extension:</strong> tap a word in the subtitles on Netflix, YouTube or Angel. The video pauses, and the translation stays covered, uncovering as you tap the words you did not know.</li>
        <li><strong>Moo Yap:</strong> live chat with real people, where the words you know are underlined and any other word is a tap away.</li>
      </ul>
      <p>A word you tap in a subtitle tonight can turn up in a game on your phone tomorrow, and learning it raises your village. That loop is the best idea in the product, and it is hard for a single-purpose tool to copy.</p>

      <figure class="infographic">
        <img src="/images/vocabi-games-reader.jpg" alt="The Lamplight word game beside a Portuguese story in the Reader with one word tapped" loading="lazy">
        <figcaption>Lamplight, and a story about a bakery cat in the Reader. Image: Vocabi.</figcaption>
      </figure>

      <h2>No Streak to Protect</h2>
      <p>The only streak in Vocabi belongs to a single word. There is no daily counter to reset if you take a week off. A round that teaches nothing new just says &ldquo;Round complete!&rdquo; rather than reporting zero. And when you have nothing left to do in the world, the journal says: &ldquo;Nobody is waiting on you. Go and talk to someone.&rdquo;</p>
      <p>The research gives some reason to like this. In Deci, Koestner and Ryan&rsquo;s meta-analysis, rewards for completing a task lowered intrinsic motivation, while informative feedback about what you actually did raised it. A brick is still a reward, so Vocabi does not escape that literature. But a brick with your word on it is at least a record of what you can now do, not a debt you owe the app tomorrow.</p>

      <h2>What It Has Not Proved Yet</h2>
      <p>Enthusiasm should come with limits, and Vocabi has some:</p>
      <ul>
        <li><strong>No outcome data.</strong> We know of no published study of what Vocabi learners retain. The science above supports its methods, not its results.</li>
        <li><strong>A hundred words is a start.</strong> Against a target of thousands, the village is a beginning, and the larger world still has to prove it can carry a learner further.</li>
        <li><strong>Platforms.</strong> It runs on Android and the web, with no iOS app. The extension is on desktop Chrome, with a small group of testers for now.</li>
        <li><strong>Languages.</strong> It teaches from English or Portuguese, with French on the way. Russian, Ukrainian and Serbian are open for their alphabets so far, and Japanese is coming soon.</li>
        <li><strong>Ads and energy.</strong> It is free, with light ads in the games and the world. An energy bar ends a sitting in the forest, though not in the village.</li>
      </ul>

      <h2>Worth Trying Early</h2>
      <p>Vocabi is doing what a vocabulary tool should do: make recall the core activity, space it properly, gather every word in one place, and give you a reason to come back that is not fear of losing something. If the outcomes match the design, it will be a very good tool. It is already a delightful one.</p>
      <div class="cta">
        <p><strong>Try it yourself.</strong> Start your first village at <a href="https://vocabi.ca/" target="_blank" rel="noopener">vocabi.ca</a>, read more on the <a href="https://vocabi.ca/about" target="_blank" rel="noopener">About Vocabi</a> page, or <a href="https://play.google.com/store/apps/details?id=ca.liap.vocabi.twa" target="_blank" rel="noopener">get it on Google Play</a>.</p>
      </div>
    </template>

    <template v-else>
      <p class="disclosure"><strong>Aviso:</strong> o Vocabi é feito pelas mesmas pessoas por trás da Moolytics, e este site exibe anúncios dele. Este é um texto favorável, então leve isso em conta. Ele se baseia nas páginas públicas do aplicativo e no seu código-fonte.</p>

      <p>A maioria dos aplicativos de idiomas vende um hábito. O <a href="https://vocabi.ca/" target="_blank" rel="noopener">Vocabi</a> oferece um lugar. Você começa nas ruínas de uma pequena vila, e cada palavra aprendida vira um tijolo com essa palavra gravada na face. Na centésima palavra, você está caminhando por uma cidade com telhados.</p>
      <p>Isso poderia facilmente ser só um truque. O que torna o Vocabi uma ferramenta fantástica de se acompanhar é o que está por baixo do charme: um verdadeiro agendador de revisões, um único baralho de palavras alimentado de todos os lugares onde você encontra o idioma, e a recusa em usar a culpa para fazer você voltar. Ele é jovem e ainda não foi comprovado, e mesmo assim é uma das ideias mais promissoras no horizonte do aprendizado de idiomas.</p>

      <figure class="infographic">
        <img src="/images/vocabi-village-forest.jpg" alt="Uma vila do Vocabi vista de cima, cercada por floresta" loading="lazy">
        <figcaption>A vila brasileira, um dos lugares que suas palavras podem construir. Imagem: Vocabi.</figcaption>
      </figure>

      <h2>O Problema que Ele Enfrenta</h2>
      <p>Como mostramos em <a href="#/article/how-language-is-learned/pt">Como um Idioma é Realmente Aprendido</a>, o vocabulário é a aritmética que está na base de tudo. Dependendo do que você quer fazer com um idioma, são necessárias entre três mil e nove mil famílias de palavras. Você não vai absorver tudo isso só pela exposição. Em um estudo com aprendizes usando um livro graduado, apenas cerca de uma palavra em 25 sobreviveu a três meses na medida mais rigorosa.</p>
      <p>A prática deliberada funciona muito melhor, mas tem outro problema: é tediosa, e as pessoas desistem. Por isso, uma ferramenta de vocabulário precisa fazer dois trabalhos ao mesmo tempo. Precisa fixar as palavras e precisa ser um lugar ao qual você queira voltar por centenas de horas. A maioria das ferramentas é boa em um dos dois. O Vocabi é uma tentativa de fazer ambos.</p>

      <h2>Uma Palavra Vira um Tijolo</h2>
      <p>O caminho começa antes das palavras. Se o idioma tem um alfabeto novo, como o georgiano, o árabe ou o armênio, você traça cada letra até sua mão conhecê-la, separa letras em potes e escreve suas primeiras palavras de verdade.</p>
      <p>Depois vêm as primeiras 100 palavras, uma lista de palavras comuns em ordem de frequência. Dez jogos de palavras as ensinam, entre eles Matchy, Word Search, Crossword, Lamplight, Word Blocks e Verbacid, a maioria em pavilhões ao redor da vila. Três pequenas bolhas se enchem conforme você acerta uma palavra, e a terceira dispara um tijolo. Depois da centésima palavra, um mundo muito maior para explorar a pé se abre além da vila, e suas palavras vão com você.</p>

      <figure class="infographic">
        <img src="/images/vocabi-village-100.jpg" alt="Um cartão de parabéns com o número 100, você aprendeu suas primeiras 100 palavras em português, sobre uma vila pronta" loading="lazy">
        <figcaption>Como são 100 palavras. Imagem: Vocabi.</figcaption>
      </figure>

      <h2>Um Agendador Sério por Baixo da Vila</h2>
      <p>Foi esta parte que nos conquistou, porque nada na superfície a anuncia. Uma palavra nova volta depois de 1, 6 e 15 minutos. Ela pode passar de nova a aprendida em uma única sessão, e uma resposta errada a devolve ao início dessas etapas. Depois ela passa para revisão em um dia, depois em seis dias, depois em intervalos maiores que crescem conforme a facilidade com que você se lembra dela, até um ano.</p>
      <p>&ldquo;Aprendida&rdquo; também não é uma porta de mão única. Uma palavra precisa de três acertos seguidos, ou de quatro tentativas com uma boa proporção, e você precisa manter a precisão em 75 por cento, ou a palavra é rebaixada. As palavras aprendidas continuam voltando para revisão.</p>
      <p>Isso combina com os achados mais confiáveis da área. A síntese de Cepeda e colegas, com 317 experimentos, mostrou que a prática espaçada supera a prática concentrada na evocação, 47,3 por cento contra 36,7. Roediger e Karpicke mostraram que testar a si mesmo supera a releitura depois de uma semana, embora reler pareça mais produtivo. Um jogo de palavras que faz você evocar a palavra, em um cronograma espaçado, é a pesquisa com uma roupa mais bonita.</p>

      <h2>Um Só Baralho, Onde Quer que Você Encontre a Palavra</h2>
      <p>A leitura é como você encontra palavras, e a prática deliberada é como você as mantém. Muitos aprendizes dividem isso entre três ferramentas que não sabem nada umas das outras. No Vocabi é uma só conta e um só baralho:</p>
      <ul>
        <li><strong>Leitor e histórias:</strong> leia de uma estante ou cole qualquer texto, toque em uma palavra para ver o significado e guarde-a.</li>
        <li><strong>Tradutor:</strong> digite ou fale, leia o resultado e guarde qualquer palavra dele.</li>
        <li><strong>Extensão de navegador:</strong> toque em uma palavra nas legendas da Netflix, do YouTube ou do Angel. O vídeo pausa, e a tradução fica coberta, revelando-se conforme você toca nas palavras que não conhecia.</li>
        <li><strong>Moo Yap:</strong> bate-papo ao vivo com pessoas reais, em que as palavras que você conhece aparecem sublinhadas e qualquer outra está a um toque de distância.</li>
      </ul>
      <p>Uma palavra tocada em uma legenda hoje à noite pode aparecer em um jogo no seu celular amanhã, e aprendê-la faz sua vila crescer. Esse ciclo é a melhor ideia do produto, e é difícil de copiar para uma ferramenta de propósito único.</p>

      <figure class="infographic">
        <img src="/images/vocabi-games-reader.jpg" alt="O jogo de palavras Lamplight ao lado de uma história em português no Leitor, com uma palavra tocada" loading="lazy">
        <figcaption>Lamplight, e uma história sobre um gato de padaria no Leitor. Imagem: Vocabi.</figcaption>
      </figure>

      <h2>Nenhuma Ofensiva para Proteger</h2>
      <p>A única ofensiva no Vocabi pertence a uma única palavra. Não há contador diário para zerar se você tirar uma semana de folga. Uma rodada que não ensina nada novo apenas diz que a rodada terminou, em vez de relatar um zero. E quando você não tem mais nada a fazer no mundo, o diário diz, em essência, que ninguém está esperando por você e que você pode ir conversar com alguém.</p>
      <p>A pesquisa dá alguns motivos para gostar disso. Na meta-análise de Deci, Koestner e Ryan, recompensas por concluir uma tarefa reduziram a motivação intrínseca, enquanto o retorno informativo sobre o que você de fato fez a aumentou. Um tijolo ainda é uma recompensa, então o Vocabi não escapa dessa literatura. Mas um tijolo com a sua palavra é pelo menos um registro do que você já consegue fazer, e não uma dívida com o aplicativo para amanhã.</p>

      <h2>O que Ele Ainda Não Provou</h2>
      <p>O entusiasmo deve vir com limites, e o Vocabi tem alguns:</p>
      <ul>
        <li><strong>Sem dados de resultado.</strong> Não conhecemos nenhum estudo publicado sobre o que os aprendizes do Vocabi retêm. A ciência acima apoia seus métodos, não seus resultados.</li>
        <li><strong>Cem palavras são um começo.</strong> Diante de uma meta de milhares, a vila é um início, e o mundo maior ainda precisa provar que consegue levar o aprendiz mais longe.</li>
        <li><strong>Plataformas.</strong> Funciona no Android e na web, sem aplicativo para iOS. A extensão roda no Chrome para desktop, com um pequeno grupo de testadores por enquanto.</li>
        <li><strong>Idiomas.</strong> Ensina a partir do inglês ou do português, com o francês a caminho. Russo, ucraniano e sérvio estão abertos por enquanto apenas para seus alfabetos, e o japonês chega em breve.</li>
        <li><strong>Anúncios e energia.</strong> É gratuito, com anúncios leves nos jogos e no mundo. Uma barra de energia encerra uma sessão na floresta, mas não na vila.</li>
      </ul>

      <h2>Vale Experimentar Cedo</h2>
      <p>O Vocabi faz o que uma ferramenta de vocabulário deve fazer: torna a evocação a atividade central, espaça-a corretamente, reúne todas as palavras em um só lugar e dá um motivo para voltar que não é o medo de perder algo. Se os resultados acompanharem o projeto, será uma ferramenta muito boa. Já é uma ferramenta encantadora.</p>
      <div class="cta">
        <p><strong>Experimente você mesmo.</strong> Comece sua primeira vila em <a href="https://vocabi.ca/" target="_blank" rel="noopener">vocabi.ca</a>, leia mais na página <a href="https://vocabi.ca/about" target="_blank" rel="noopener">Sobre o Vocabi</a> ou <a href="https://play.google.com/store/apps/details?id=ca.liap.vocabi.twa" target="_blank" rel="noopener">baixe no Google Play</a>.</p>
      </div>
    </template>

    <First2000WordsAdCard :lang="props.lang" />

    <h2>{{ props.lang==='pt' ? 'Fontes' : 'Sources' }}</h2>
    <ul class="sources">
      <li>Nation, I.S.P. (2006). How large a vocabulary is needed for reading and listening? <em>Canadian Modern Language Review</em>, 63(1). <a href="https://www.lextutor.ca/cover/papers/nation_2006.pdf" target="_blank" rel="noopener">PDF</a></li>
      <li>Waring, R., &amp; Takaki, M. (2003). At what rate do learners learn and retain new vocabulary from reading a graded reader? <em>Reading in a Foreign Language</em>, 15(2). <a href="https://eric.ed.gov/?id=EJ676380" target="_blank" rel="noopener">ERIC</a></li>
      <li>Webb, S., Yanagisawa, A., &amp; Uchihara, T. (2020). How effective are intentional vocabulary-learning activities? A meta-analysis. <em>Modern Language Journal</em>, 104(4). <a href="https://eric.ed.gov/?id=EJ1277328" target="_blank" rel="noopener">ERIC</a></li>
      <li>Cepeda, N.J., et al. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. <em>Psychological Bulletin</em>, 132(3). <a href="https://pubmed.ncbi.nlm.nih.gov/16719566/" target="_blank" rel="noopener">PubMed</a></li>
      <li>Roediger, H.L., &amp; Karpicke, J.D. (2006). Test-enhanced learning. <em>Psychological Science</em>, 17(3). <a href="https://journals.sagepub.com/doi/10.1111/j.1467-9280.2006.01693.x" target="_blank" rel="noopener">DOI</a></li>
      <li>Deci, E.L., Koestner, R., &amp; Ryan, R.M. (1999). A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation. <em>Psychological Bulletin</em>, 125(6). <a href="https://home.ubalt.edu/tmitch/642/articles%20syllabus/Deci%20Koestner%20Ryan%20meta%20IM%20psy%20bull%2099.pdf" target="_blank" rel="noopener">PDF</a></li>
      <li>Vocabi: <a href="https://vocabi.ca/" target="_blank" rel="noopener">vocabi.ca</a>, <a href="https://vocabi.ca/about" target="_blank" rel="noopener">About</a>, <a href="https://vocabi.ca/features" target="_blank" rel="noopener">Features</a>. Checked November 5, 2026.</li>
    </ul>
  </article>
</template>

<style scoped>
.share-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  min-width: 180px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  border-radius: 8px;
  box-shadow: 0 6px 24px rgba(0,0,0,0.08);
  padding: 0.25rem;
  z-index: 20;
}
.share-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.5rem 0.6rem;
  background: transparent;
  border: none;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  border-radius: 6px;
}
.share-item:hover { background: var(--color-background-soft); }

.disclosure {
  font-size: 0.9rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background-soft);
}
.infographic { margin: 1.5rem 0; }
.infographic img {
  display: block;
  width: 100%;
  max-width: 640px;
  height: auto;
  margin: 0 auto;
  border-radius: 8px;
}
.infographic figcaption {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  text-align: center;
  color: var(--vt-c-text-light-2, #666);
}
.cta {
  margin-top: 1.5rem;
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background-soft);
}
.cta p { margin: 0; }
.sources {
  margin: 0.5rem 0 0 1.1rem;
  padding: 0;
  font-size: 0.84rem;
  line-height: 1.55;
  color: var(--vt-c-text-light-2, #666);
}
.sources li { margin-bottom: 0.4rem; }
</style>
