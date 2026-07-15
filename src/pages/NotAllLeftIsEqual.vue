<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
const props = defineProps({ lang: { type: String, default: 'en' }, id: { type: String, default: 'not-all-left-is-equal' } })

onMounted(() => {
  document.title = props.lang === 'pt'
    ? 'Nem Toda "Esquerda" é Igual, e a Diferença Determina se a Classe Trabalhadora Realmente Ascende'
    : 'Not All "Left" Is the Same, And the Difference Determines Whether the Working Class Actually Rises'
})

const canonicalUrl = computed(() => `#/${['article', props.id, props.lang].filter(Boolean).join('/')}`)
const fullUrl = computed(() => window.location.origin + window.location.pathname + canonicalUrl.value)

const shareTitle = computed(() => props.lang === 'pt'
  ? 'Nem Toda "Esquerda" é Igual'
  : 'Not All "Left" Is the Same')
const shareText = computed(() => props.lang === 'pt'
  ? 'Por que o modelo nórdico e o roteiro redistribuição-e-monopólio não são a mesma "social-democracia".'
  : 'Why the Nordic model and the redistribution-and-monopoly roadmap are not the same "social democracy".')

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

const pubDate = new Date('2026-07-15T00:00:00Z')
const isoDate = '2026-07-15'
const formattedDate = computed(() => {
  const locale = props.lang === 'pt' ? 'pt-BR' : 'en-US'
  const fmt = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
  return fmt.format(pubDate)
})
</script>

<template>
  <article class="article">
    <header style="display:flex;align-items:center;justify-content:space-between;gap:1rem; margin-bottom:0.75rem;">
      <div>
        <h1 v-if="props.lang==='en'">Not All &ldquo;Left&rdquo; Is the Same, And the Difference Determines Whether the Working Class Actually Rises</h1>
        <h1 v-else>Nem Toda &ldquo;Esquerda&rdquo; é Igual, e a Diferença Determina se a Classe Trabalhadora Realmente Ascende</h1>
        <div class="byline">
          <em v-if="props.lang==='en'">By Moolytics — Economic Geography</em>
          <em v-else>Por Moolytics — Geografia Econômica</em>
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
      <p>Too many on the Brazilian left invoke the Nordic model as their North Star while pursuing policies that guarantee they will never reach it. They call both &ldquo;social democracy.&rdquo; One delivers broad prosperity, high wages, and real mobility. The other entrenches stagnation, informality, and transfers funded by squeezing the formal sector or commodity rents. The results are not equivalent. One roadmap works; the other leads to the same middle-income trap Brazil has known for decades.</p>

      <h2>Two Opposing Visions Masquerading as One</h2>
      <p>The growth-and-mobility left (visible in post-reform Nordics like Denmark and Sweden, Switzerland, Estonia, and other Baltic/reformed Eastern European successes) treats competitive markets, low barriers to entrepreneurship, and efficient taxation of rents as prerequisites for funding generous public goods. It invests heavily in human capital, keeps product markets open, tolerates creative destruction, and pairs safety nets with flexibility (&ldquo;flexicurity&rdquo;). The goal is higher productivity so wages can sustainably rise and the tax base can support services without choking the economy.</p>
      <p>The redistribution-and-monopoly left (dominant in much of Brazil&rsquo;s PT tradition and similar Latin American currents) prioritizes immediate transfers, state direction of the economy, and protected rents or oligopolies whose proceeds finance spending. It layers heavy payroll taxes and regulatory friction on formal employment, tolerates (or creates) barriers to entry, and often romanticizes state ownership or &ldquo;strategic&rdquo; sectors. Redistribution comes first; growth is hoped for as a byproduct, or blamed on external forces when it fails.</p>
      <p>These are not tactical variants. The Marxist pro-monopoly left and the Georgist anti-monopoly center are enemies. One expands the pie and broad opportunity. The other fights over slices while the pie grows slowly, or not at all.</p>

      <h2>The Roadmap Mismatch</h2>
      <p>Brazilian progressives admire Nordic welfare outcomes but implement something closer to the opposite in key respects. High formal-sector payroll burdens (often 30-45%+ on top of wages), rigid labor rules, and a complex tax code push vast swaths of the economy into informality. Meanwhile, established players and financial rentiers often enjoy lighter effective taxation on dividends and capital income (even after recent modest reforms). High real interest rates (Selic frequently in double digits) enrich bondholders while crowding out productive investment.</p>
      <p>Contrast this with Estonia, a small post-Soviet state that adopted radical simplicity: flat personal income tax, no tax on reinvested corporate profits, and a property tax focused on land value. It has topped OECD tax competitiveness rankings for over a decade. Or Sweden, which, despite high taxes, maintains one of Europe&rsquo;s most dynamic IPO and venture startup ecosystems, producing hundreds of new listings in recent decades &mdash; far outpacing larger peers.</p>
      <p>Brazil, with a population roughly 20 times Sweden&rsquo;s, has managed only a trickle of IPOs in most recent years, often just a handful, many years zero. This is not bad luck. It is the predictable outcome of policies that raise the cost of formal scaling and deter patient capital. Sweden&rsquo;s workers benefit from real wage growth rooted in productivity; Brazil&rsquo;s formal sector is squeezed while informality persists.</p>
      <p>Denmark and Switzerland are the high-income champions in Europe. What do they have in common? No friction to employment. No payroll taxes.</p>
      <p>In a workforce drowning in payroll tax, when workers bargain for a raise, the employer can easily deflect it with &ldquo;but that also means a bigger bill to the state.&rdquo; When the marginal cost of hiring or rewarding talent stays closer to the actual wage &mdash; as in Denmark&rsquo;s famous &ldquo;flexicurity&rdquo; model, which combines easy hiring/firing with strong unemployment support and active retraining &mdash; workers have security without locking employers into rigidity. Switzerland&rsquo;s decentralized, apprenticeship-heavy system delivers one of the world&rsquo;s most skilled workforces with flexible contracts and low barriers. Both avoid the heavy employer payroll taxes common across low-income countries that drive up the cost of formal labor and blunt wage pressure.</p>
      <p>Henry George, the great 19th-century critic of unearned rents, would recognize the pattern. He supported unions tactically but saw land and monopoly rents as the deeper problem. The solution is to put the friction on &ldquo;passive&rdquo; income, not punish the workers and those who employ them. He opposed income taxes that punish production and favored capturing location rents efficiently instead. Estonia&rsquo;s land-value emphasis and simplified code are closer in spirit to that logic than Brazil&rsquo;s heavy labor taxation paired with protected rents. One saw record wage growth. The other saw increased inequality.</p>

      <h2>Populist Myths vs. Reality</h2>
      <p>The Brazilian left&rsquo;s version is laced with comforting myths: that &ldquo;neoliberalism&rdquo; caused the problems, that stronger state control and transfers will create Nordic outcomes without the hard parts (flexible markets, low barriers, competitive discipline), and that monopoly power or commodity rents can sustainably fund development. History says otherwise. Commodity booms and Keynesian stimulus delivered temporary gains under Lula 1.0, but structural productivity and mobility remained elusive. Persistent high inequality, low IPO activity, capital flight risks, and informality are features of this roadmap, not bugs.</p>
      <p>The growth-and-mobility left accepts that you cannot redistribute what you do not first produce efficiently. It delivers higher real wages, more startups, and broader opportunity &mdash; the only durable path out of the middle-income trap. The monopoly-and-transfers left delivers visible checks and political loyalty in the short term, at the cost of dynamism and long-term gains for the working class it claims to champion.</p>
      <p>Aspiring to Nordic living standards is admirable. Copying the label while rejecting the competitive foundations is self-defeating. Until Brazilian policymakers choose the former over the latter &mdash; simpler taxes, lower formal-employment friction, genuine anti-rentier measures, and openness to new entrants &mdash; the working class will continue to face the same disappointing results, no matter how often &ldquo;social democracy&rdquo; is invoked. The politicians are the champion rentier class. Their income comes from your back. They will not reform unless the people <strong>demand</strong> that they do so. The evidence from successful reformers is clear: rhetoric does not scale companies or raise productivity. Policies do.</p>
    </template>

    <template v-else>
      <p>Muitos na esquerda brasileira invocam o modelo nórdico como sua estrela-guia enquanto perseguem políticas que garantem que jamais o alcançarão. Chamam ambas as coisas de &ldquo;social-democracia.&rdquo; Uma entrega prosperidade ampla, salários altos e mobilidade real. A outra perpetua estagnação, informalidade e transferências financiadas pela sangria do setor formal ou por rendas de commodities. Os resultados não são equivalentes. Um roteiro funciona; o outro leva à mesma armadilha da renda média que o Brasil conhece há décadas.</p>

      <h2>Duas Visões Opostas Disfarçadas de Uma Só</h2>
      <p>A esquerda do crescimento-e-mobilidade (visível nos países nórdicos pós-reforma como Dinamarca e Suécia, na Suíça, na Estônia e em outros sucessos bálticos/da Europa Oriental reformada) trata mercados competitivos, baixas barreiras ao empreendedorismo e tributação eficiente de rendas como pré-requisitos para financiar bens públicos generosos. Investe pesadamente em capital humano, mantém mercados de produtos abertos, tolera destruição criativa e combina redes de proteção social com flexibilidade (&ldquo;flexisegurança&rdquo;). O objetivo é maior produtividade, para que os salários possam subir de forma sustentável e a base tributária possa sustentar serviços sem sufocar a economia.</p>
      <p>A esquerda da redistribuição-e-monopólio (dominante em boa parte da tradição petista brasileira e em correntes latino-americanas similares) prioriza transferências imediatas, direção estatal da economia e rendas ou oligopólios protegidos cujos lucros financiam o gasto público. Sobrepõe pesados encargos sobre a folha de pagamento e atrito regulatório ao emprego formal, tolera (ou cria) barreiras de entrada e frequentemente romantiza a propriedade estatal ou setores &ldquo;estratégicos.&rdquo; A redistribuição vem primeiro; o crescimento é esperado como subproduto, ou culpado em forças externas quando falha.</p>
      <p>Essas não são variantes táticas. A esquerda marxista pró-monopólio e o centro georgista antimonopólio são inimigos. Uma expande o bolo e a oportunidade ampla. A outra briga por fatias enquanto o bolo cresce devagar, ou nem cresce.</p>

      <h2>O Descompasso do Roteiro</h2>
      <p>Os progressistas brasileiros admiram os resultados do bem-estar nórdico, mas implementam algo próximo do oposto em pontos-chave. Encargos elevados sobre a folha do setor formal (frequentemente 30-45%+ sobre os salários), regras trabalhistas rígidas e um código tributário complexo empurram vastas parcelas da economia para a informalidade. Enquanto isso, agentes estabelecidos e rentistas financeiros muitas vezes gozam de tributação efetiva mais leve sobre dividendos e renda de capital (mesmo após reformas recentes modestas). Juros reais elevados (Selic frequentemente em dois dígitos) enriquecem os detentores de títulos enquanto afastam o investimento produtivo.</p>
      <p>Contraste isso com a Estônia, um pequeno estado pós-soviético que adotou uma simplicidade radical: imposto de renda pessoal fixo (flat tax), nenhum imposto sobre lucros corporativos reinvestidos e um imposto sobre a propriedade focado no valor da terra. O país lidera os rankings de competitividade tributária da OCDE há mais de uma década. Ou a Suécia, que, apesar dos impostos altos, mantém um dos ecossistemas de IPOs e startups de risco mais dinâmicos da Europa, produzindo centenas de novas listagens nas últimas décadas &mdash; superando de longe pares maiores.</p>
      <p>O Brasil, com uma população cerca de 20 vezes maior que a da Suécia, conseguiu apenas um gotejamento de IPOs na maioria dos anos recentes, muitas vezes uns poucos, em vários anos zero. Isso não é azar. É o resultado previsível de políticas que elevam o custo de escalar formalmente e afastam o capital paciente. Os trabalhadores suecos se beneficiam de crescimento real do salário enraizado em produtividade; o setor formal brasileiro é espremido enquanto a informalidade persiste.</p>
      <p>Dinamarca e Suíça são as campeãs de alta renda na Europa &mdash; o que elas têm em comum? Nenhum atrito ao emprego. Nenhum imposto sobre a folha de pagamento.</p>
      <p>Numa força de trabalho afogada em impostos sobre a folha, quando os trabalhadores negociam um aumento, o empregador pode facilmente desviar com &ldquo;mas isso também significa uma conta maior para o estado.&rdquo; Quando o custo marginal de contratar ou recompensar talento fica mais próximo do salário real, como no famoso modelo de &ldquo;flexisegurança&rdquo; dinamarquês, que combina contratação/demissão fácil com forte seguro-desemprego e requalificação ativa, os trabalhadores têm segurança sem prender os empregadores à rigidez. O sistema suíço, descentralizado e centrado em aprendizagem prática, entrega uma das forças de trabalho mais qualificadas do mundo com contratos flexíveis e baixas barreiras. Ambos evitam os pesados impostos sobre a folha comuns em países de baixa renda, que encarecem o trabalho formal e amortecem a pressão salarial.</p>
      <p>Henry George, o grande crítico do século XIX das rendas não ganhas, reconheceria o padrão. Ele apoiava sindicatos taticamente, mas via a terra e as rendas de monopólio como o problema mais profundo. A solução é colocar o atrito sobre a renda &ldquo;passiva&rdquo;, não punir os trabalhadores e quem os emprega. Ele se opunha a impostos de renda que punem a produção e defendia capturar eficientemente as rendas de localização. A ênfase estoniana no valor da terra e seu código simplificado estão mais próximos, em espírito, dessa lógica do que a pesada tributação do trabalho brasileira combinada com rendas protegidas. Um viu crescimento salarial recorde. O outro viu desigualdade crescente.</p>

      <h2>Mitos Populistas vs. Realidade</h2>
      <p>A versão da esquerda brasileira vem recheada de mitos reconfortantes: que o &ldquo;neoliberalismo&rdquo; causou os problemas, que mais controle estatal e transferências criarão resultados nórdicos sem as partes difíceis (mercados flexíveis, baixas barreiras, disciplina competitiva), e que o poder de monopólio ou as rendas de commodities podem financiar desenvolvimento de forma sustentável. A história diz o contrário. O boom de commodities e o estímulo keynesiano trouxeram ganhos temporários sob o Lula 1.0, mas a produtividade estrutural e a mobilidade permaneceram elusivas. Desigualdade persistentemente alta, baixa atividade de IPOs, riscos de fuga de capital e informalidade são características desse roteiro, não falhas acidentais.</p>
      <p>A esquerda do crescimento-e-mobilidade aceita que não se pode redistribuir o que não se produziu antes com eficiência. Ela entrega salários reais mais altos, mais startups e oportunidade mais ampla &mdash; o único caminho durável para sair da armadilha da renda média. A esquerda do monopólio-e-transferências entrega cheques visíveis e lealdade política no curto prazo, ao custo do dinamismo e dos ganhos de longo prazo para a própria classe trabalhadora que alega defender.</p>
      <p>Aspirar ao padrão de vida nórdico é admirável. Copiar o rótulo enquanto se rejeitam os fundamentos competitivos é autodestrutivo. Até que os formuladores de políticas brasileiros escolham o primeiro caminho em vez do segundo &mdash; impostos mais simples, menor atrito no emprego formal, medidas genuínas antirrentistas e abertura a novos entrantes &mdash; a classe trabalhadora continuará enfrentando os mesmos resultados decepcionantes, não importa quantas vezes se invoque a &ldquo;social-democracia.&rdquo; Os políticos são a classe rentista campeã. A renda deles vem das suas costas. Eles não vão se reformar a menos que o povo exija que o façam. A evidência dos reformadores bem-sucedidos é clara: retórica não escala empresas nem eleva produtividade. Políticas escalam.</p>
    </template>
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
</style>