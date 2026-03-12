<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
const props = defineProps({ lang: { type: String, default: 'en' }, id: { type: String, default: 'canadasabatage' } })

const canonicalUrl = computed(() => {
  return `#/${['article', props.id, props.lang].filter(Boolean).join('/')}`
})

const fullUrl = computed(() => window.location.origin + window.location.pathname + canonicalUrl.value)

const shareTitle = computed(() => props.lang === 'pt' ? 'Canadá — Como a Regulação Sabotou sua Classe Média (rascunho)' : 'Canada — How Regulation Sabotaged Its Own Middle Class')
const shareText = computed(() => props.lang === 'pt' ? 'Rascunho de artigo: a virada regulatória que expulsou o varejo dos mercados de risco iniciais no Canadá.' : 'Draft article: How regulation pushed retail investors out of early-stage markets in Canada.')

const showShareMenu = ref(false)
const shareMenuEl = ref(null)

function toggleShareMenu() { showShareMenu.value = !showShareMenu.value }
function closeShareMenu() { showShareMenu.value = false }

function onDocumentClick(e) {
  if (!showShareMenu.value) return
  const el = shareMenuEl.value
  if (el && !el.contains(e.target)) {
    showShareMenu.value = false
  }
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

// Publication date (fixed to March 12, 2026), localized per language
const pubDate = new Date('2026-03-12T00:00:00Z')
const isoDate = '2026-03-12'
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
        <h1 v-if="props.lang==='en'">Canada’s Venture “Protection”: How Regulation Sabotaged Its Own Middle Class</h1>
        <h1 v-else>Canadá — Como a Regulação Sabotou sua Própria Classe Média</h1>
        <div class="byline">
          <em v-if="props.lang==='en'">Matt Headley</em>
          <em v-else>Matt Headley</em>
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
      <p>Canada once had a vibrant retail‑driven venture ecosystem. For decades, ordinary Canadians could invest directly in early‑stage companies through public junior markets like the TSX Venture Exchange. That participation helped fund exploration, tech innovation, and growth companies long before institutional capital arrived.</p>

      <p>In the 1970’s Canada was the most free market economy in the world. Through the 80’s and 90’s our middle class grew to become the global envy of the world’s largest middle class. We were an innovation hub. With more listed companies per capita than any other country in the world. We were a hybrid society where the average person was both worker and capitalist. Working for a salary while also funding your neighbour’s startup.</p>

      <h2>The Regulatory Death Blow</h2>
      <p>Then came the regulatory death blow. Today, participation in Canadian private equity is closed to retail investors, making up most of the middle class. The root of this change lies in a shift toward accredited‑investor‑centric rules, most centrally National Instrument 45‑106, implemented in 2005, and tightened to a deathgrip ever since. That shift didn’t come from a public vote. It didn’t appear after any specific wave of scandal or ponzi scheme. It came from regulatory technocrats and industry insiders with no meaningful public consultation from the people who were being excluded.</p>

      <h3>Accredited… or Excluded</h3>
      <p>Do you have a net worth of $1 million? Excluding your house of course. That would be far too inclusive. Then congratulations, you are an ‘accredited investor’. You can buy whatever you want. Not a millionaire yet? Tough. You are an unsophisticated retail investor, restricted to public listed exchanges; regardless of whether you fully understand the risk or not, you are not allowed to buy private equity with few exceptions.</p>

      <h2>Well‑Intentioned Protection Has Heavy Costs</h2>
      <p>Regulators framed the change as investor protection: private offerings are risky; retail investors supposedly lack sophistication. On its surface, that’s a plausible goal. Or just a well‑marketed excuse. The outcome has been a contraction of Canada’s early‑stage public markets at exactly the time when entrepreneurial capital formation was becoming more important globally. Retail Canadians didn’t necessarily need protection, but they did need access to opportunity — both to support local innovation and to raise capital for their own ambitions.</p>

      <h2>How Early‑Stage Capital Formation Worked — Then vs Now</h2>
      <p>To start a company in Canada of the past, you would go to everyone you knew. Raise capital at $1,000 a piece, and they’d get their certificate of shares. No longer. Today, when you go, you may only raise capital from those directly involved, or our underdeveloped and sparse venture capital market (think CBC’s Dragon’s Den).</p>

      <p>The highly liberal, open Canadian venture market was strong. But tightening regulatory reform put it under pressure, reducing its ability to adapt by restricting retail participation in early capital formation.</p>

      <p>In 1995, a founder could raise capital from their community. Two hundred investors chipping in $500 apiece could provide $100,000 in seed capital — enough to get operations off the ground. From there, the founder could prepare a modest prospectus and list the company on a junior exchange, giving retail investors a real stake in early‑stage innovation. The system was messy and risky, but it worked: anyone with ambition and a good idea could participate, and ordinary Canadians could back local entrepreneurs.</p>

      <p>Today, the landscape is unrecognizable. Regulatory compliance and prescriptive exemptions have carved out nearly all retail participation. Unless you are a founder, an insider, a close family member, or an accredited investor, your chance to invest in early‑stage Canadian companies is effectively zero. Not already a millionaire? You’re not “certified.” You don’t get to risk your own money on your friend’s startup. Maybe you should try the Ontario Lottery and Gaming Corporation instead? Even if you defy the odds and make it past step 1, you’ll be crushed at step 2. The junior markets are collapsing.</p>

      <h2>The Strangling of Junior Exchanges</h2>
      <p>Listing on a junior exchange today is a far cry from the days when a founder could turn $100,000 from local investors into a public company. Now, audited financials, multi‑page disclosure documents, and mandatory exchange sponsorship can cost hundreds of thousands of dollars and take months or even years to complete. Junior exchanges were never meant to be mainstream regulated blue‑chip markets like the TSX. If you are a pension fund, you go to the TSX. The venture exchange was the high‑risk cousin; today the TSXV has been strangled by fees and compliance rules — no longer the vibrant venture capital market it once was.</p>

      <h3>TSXV Listed Issuers (approximate)</h3>
      <pre class="chart-block">2005 | ██████████████████████ 2,350
2010 | ████████████████████ 2,200
2012 | ███████████████████  2,258
2015 | ████████████████     2,100
2020 | █████████████        1,850
2025 | ██████████           1,530</pre>
      <p class="caption"><em>Sources: TMX Group limited data on TSXV issuer counts; CEIC Data.</em></p>

      <h2>The Vanishing Listings</h2>
      <p>According to the Fraser Institute, around 800 company listings have disappeared since 2008, representing a roughly 35% decline in the number of listed issuers. All of them to be replaced by nothing.</p>

      <p>The community of junior exchanges has been replaced by our scarce and exclusive network of venture capital funds, angel networks, and private equity groups. Canada once led the world in retail participation and public venture formation. Today, the country’s venture capital pool is smaller and more institutionally concentrated than countries with more liberal retail pathways. Meanwhile, U.S. reforms such as the Jumpstart Our Business Startups Act (JOBS Act) expanded ways for non‑wealthy investors to access certain private markets — a direction opposite to Canada’s increasing tightening.</p>

      <p>That trajectory highlights a disconnect: the stated intent of protecting investors has morphed into exclusion that cedes competitiveness to other markets.</p>

      <h2>What Are We Protecting, Exactly?</h2>
      <p>The logic behind accredited investor rules is understandable in isolation — protect the unsophisticated. But the net effect has been to shut average Canadians out of exactly the kinds of opportunities that once defined Canadian venture capital. Instead of cultivating a broad, participatory market, regulators have engineered a system that funnels early‑stage returns up to the already affluent. The opposite of what Canada was designed to be.</p>

      <p>If the price of protection is dinged competitiveness, fewer listings, and capital migration abroad, then it’s worth asking: Whose safety are we really prioritizing? We adopted a regulation considered to bring us up to global standards. But the world’s largest middle class wasn’t created by following global standards. Our registered accounts are now better protected than ever before — all it took was the lobotomy of our capital markets. Let’s all buy shares in the same 12 companies and see if our middle class keeps growing. (Doubt it).</p>
    </template>

    <template v-else-if="props.lang === 'fr'">
        <p>Le Canada avait autrefois un écosystème de capital-risque dynamique, porté par les investisseurs particuliers. Pendant des décennies, les Canadiens ordinaires pouvaient investir directement dans des entreprises en phase de démarrage via des marchés publics pour petites entreprises, comme la TSX Venture Exchange. Cette participation finançait l’exploration, l’innovation technologique et les entreprises en croissance bien avant l’arrivée du capital institutionnel.</p>

        <p>Dans les années 1970, le Canada était l’économie de marché la plus libre du monde. Dans les années 1980 et 1990, notre classe moyenne est devenue l’envie du monde — la plus grande classe moyenne du monde. Nous étions un centre d’innovation, avec plus d’entreprises cotées par habitant que tout autre pays. Nous étions une société hybride où la personne moyenne était à la fois travailleur et capitaliste, travaillant pour un salaire tout en finançant la startup de son voisin.</p>

        <h2>Le Coup Mortel Réglementaire</h2>
        <p>Puis est venu le coup mortel réglementaire. Aujourd’hui, la participation au capital-investissement canadien est fermée aux investisseurs particuliers, qui constituent la majeure partie de la classe moyenne. La racine de ce changement réside dans une orientation vers des règles centrées sur les investisseurs accrédités, principalement le National Instrument 45-106, mis en œuvre en 2005 et renforcé depuis de façon rigide. Ce changement n’est pas le fruit d’un vote public. Il n’est pas apparu après une vague spécifique de scandale ou de système de Ponzi. Il a été imposé par des technocrates réglementaires et des acteurs de l’industrie, sans consultation significative du public qui était exclu.</p>

        <h3>Accrédité… ou Exclu</h3>
        <p>Vous avez une valeur nette de 1 million de dollars ? Hors de votre résidence principale, bien sûr — cela serait trop inclusif. Alors félicitations, vous êtes un “investisseur accrédité”. Vous pouvez acheter ce que vous voulez. Pas encore millionnaire ? Tough. Vous êtes un investisseur de détail non sophistiqué, limité aux bourses publiques cotées ; que vous compreniez ou non les risques, vous n’êtes pas autorisé à acheter du capital-investissement, sauf quelques exceptions.</p>

        <h2>La Protection Bien-Intentionnée a un Coût Élevé</h2>
        <p>Les régulateurs ont présenté ce changement comme une protection des investisseurs : les offres privées sont risquées ; les investisseurs particuliers manquent prétendument de sophistication. En surface, c’est un objectif plausible. Ou juste une excuse bien vendue. Le résultat a été une contraction des marchés publics d’entreprises en phase de démarrage au Canada exactement au moment où la formation de capital entrepreneurial devenait plus importante à l’échelle mondiale. Les Canadiens particuliers n’avaient pas nécessairement besoin de protection, mais ils avaient besoin d’accès aux opportunités — à la fois pour soutenir l’innovation locale et lever des fonds pour leurs propres ambitions.</p>

        <h2>Comment Fonctionnait la Formation de Capital en Phase de Démarrage — Avant vs Maintenant</h2>
        <p>Pour créer une entreprise au Canada autrefois, vous sollicitiez tous ceux que vous connaissiez. Lever du capital à 1 000 $ par personne, et ils recevaient leur certificat d’actions. Ce n’est plus le cas. Aujourd’hui, vous ne pouvez lever des fonds que auprès des personnes directement impliquées ou de notre marché du capital-risque sous-développé et clairsemé (pensez à Dragon’s Den de la CBC).</p>

        <p>Le marché canadien du capital-risque, très libéral et ouvert, était solide. Mais le resserrement réglementaire l’a mis sous pression, réduisant sa capacité d’adaptation en limitant la participation des particuliers dans la formation initiale de capital.</p>

        <p>En 1995, un fondateur pouvait lever des fonds auprès de sa communauté. Deux cents investisseurs contribuant chacun 500 $ pouvaient fournir 100 000 $ de capital d’amorçage — suffisant pour démarrer les opérations. De là, le fondateur pouvait préparer un prospectus modeste et inscrire l’entreprise sur une bourse pour petites entreprises, donnant aux investisseurs particuliers une participation réelle dans l’innovation en phase de démarrage. Le système était désordonné et risqué, mais il fonctionnait : toute personne ambitieuse et ayant une bonne idée pouvait participer, et les Canadiens ordinaires pouvaient soutenir les entrepreneurs locaux.</p>

        <p>Aujourd’hui, le paysage est méconnaissable. La conformité réglementaire et les exemptions prescriptives ont éliminé presque toute participation des investisseurs particuliers. À moins d’être fondateur, insider, membre proche de la famille ou investisseur accrédité, vos chances d’investir dans des entreprises canadiennes en phase de démarrage sont pratiquement nulles. Pas encore millionnaire ? Vous n’êtes pas “certifié”. Vous ne pouvez pas risquer votre argent sur la startup d’un ami. Peut-être devriez-vous plutôt tenter la Ontario Lottery and Gaming Corporation ? Même si vous défiez les probabilités et passez l’étape 1, vous serez écrasé à l’étape 2. Les marchés pour petites entreprises s’effondrent.</p>

        <h2>L’Étranglement des Bourses de Petites Entreprises</h2>
        <p>Inscrire une entreprise sur une bourse pour petites entreprises aujourd’hui est très différent de l’époque où un fondateur pouvait transformer 100 000 $ d’investisseurs locaux en entreprise publique. Aujourd’hui, les états financiers audités, les documents de divulgation de plusieurs pages et le parrainage obligatoire par la bourse peuvent coûter **des centaines de milliers de dollars** et prendre des mois, voire des années, à compléter. Les bourses pour petites entreprises n’ont jamais été destinées à devenir des marchés de type blue-chip régulés comme la TSX. Si vous êtes un fonds de pension, vous allez à la TSX. La bourse de venture capital était le cousin à haut risque ; aujourd’hui, la TSXV est étranglée par les frais et les règles de conformité — elle n’est plus le marché de venture capital vibrant qu’elle fut autrefois.</p>

        <h3>Émetteurs Cotés sur la TSXV (approximatif)</h3>
        <pre class="chart-block">2005 | ██████████████████████ 2,350
2010 | ████████████████████ 2,200
2012 | ███████████████████  2,258
2015 | ████████████████     2,100
2020 | █████████████        1,850
2025 | ██████████           1,530</pre>
        <p class="caption"><em>Sources : données limitées de TMX Group sur le nombre d’émetteurs TSXV ; données CEIC.</em></p>

        <h2>La Disparition des Listages</h2>
        <p>Selon le Fraser Institute, environ 800 inscriptions d’entreprises ont disparu depuis 2008, représentant une baisse d’environ 35 % du nombre d’émetteurs cotés. Tous remplacés par… rien.</p>

        <p>La communauté des bourses pour petites entreprises a été remplacée par notre réseau rare et exclusif de fonds de capital-risque, de réseaux d’anges investisseurs et de groupes de private equity. Le Canada a autrefois mené le monde en participation des particuliers et en formation publique de capital-risque. Aujourd’hui, le pool de capital-risque du pays est plus petit et plus concentré institutionnellement que dans des pays offrant des voies de participation particulières plus libérales. Pendant ce temps, des réformes aux États-Unis, comme le Jumpstart Our Business Startups Act (JOBS Act), ont élargi les moyens pour les investisseurs non fortunés d’accéder à certains marchés privés — une direction opposée au renforcement des règles canadiennes.</p>

        <p>Cette trajectoire met en évidence un décalage : l’intention déclarée de protéger les investisseurs s’est transformée en exclusion, cédant la compétitivité à d’autres marchés.</p>

        <h2>Que Protégeons-Nous, Exactement ?</h2>
        <p>La logique derrière les règles pour investisseurs accrédités est compréhensible isolément — protéger les non sophistiqués. Mais l’effet net a été d’exclure les Canadiens moyens des opportunités qui définissaient autrefois le capital-risque canadien. Au lieu de cultiver un marché large et participatif, les régulateurs ont conçu un système qui canalise les rendements des premières étapes vers les déjà aisés. Le contraire de ce que le Canada était censé être.</p>

        <p>Si le prix de la protection est une baisse de compétitivité, moins d’inscriptions et une migration de capital à l’étranger, il convient de se demander : de qui la sécurité est-elle réellement priorisée ? Nous avons adopté une réglementation censée nous aligner sur les standards mondiaux. Mais la plus grande classe moyenne du monde n’a pas été créée en suivant ces standards. Nos comptes enregistrés sont désormais mieux protégés que jamais — tout cela grâce à la lobotomie de nos marchés financiers. Achetons tous des actions dans les mêmes 12 entreprises et voyons si notre classe moyenne continue de croître. (J’en doute).</p>
    </template>
    <template v-else>
        <p>O Canadá já teve um ecossistema de venture capital voltado para investidores de varejo vibrante. Por décadas, canadenses comuns podiam investir diretamente em empresas em estágio inicial por meio de mercados públicos de pequenas empresas, como a TSX Venture Exchange. Essa participação ajudava a financiar exploração, inovação tecnológica e empresas em crescimento muito antes da chegada do capital institucional.</p>

        <p>Na década de 1970, o Canadá era a economia de mercado mais livre do mundo. Durante as décadas de 80 e 90, nossa classe média cresceu para se tornar a inveja global — a maior classe média do mundo. Fomos um polo de inovação, com mais empresas listadas per capita do que qualquer outro país. Éramos uma sociedade híbrida, onde a pessoa comum era tanto trabalhador quanto capitalista, trabalhando por um salário enquanto também financiava a startup do vizinho.</p>

        <h2>O Golpe Regulatório Mortal</h2>
        <p>Então veio o golpe regulatório mortal. Hoje, a participação em private equity canadense está fechada para investidores de varejo, que compõem a maior parte da classe média. A raiz dessa mudança está em uma virada para regras centradas em investidores credenciados, principalmente o National Instrument 45-106, implementado em 2005 e reforçado rigidamente desde então. Essa mudança não veio de um voto público. Não surgiu após nenhuma onda específica de escândalo ou esquema Ponzi. Veio de tecnocratas regulatórios e insiders da indústria, sem qualquer consulta significativa do público que estava sendo excluído.</p>

        <h3>Credenciado… ou Excluído</h3>
        <p>Você tem um patrimônio líquido de $1 milhão? Sem contar sua casa, é claro — isso seria inclusivo demais. Então, parabéns, você é um “investidor credenciado”. Pode comprar o que quiser. Ainda não é milionário? Difícil. Você é um investidor de varejo não sofisticado, restrito a bolsas públicas listadas; independentemente de entender totalmente o risco ou não, não tem permissão para comprar private equity, com poucas exceções.</p>

        <h2>Proteção Bem-Intencionada Tem Custos Pesados</h2>
        <p>Os reguladores apresentaram a mudança como proteção ao investidor: ofertas privadas são arriscadas; investidores de varejo supostamente carecem de sofisticação. Na superfície, é um objetivo plausível. Ou apenas uma desculpa bem vendida. O resultado foi uma contração dos mercados públicos de empresas em estágio inicial do Canadá exatamente no momento em que a formação de capital empreendedor se tornava mais importante globalmente. Os canadenses de varejo não precisavam necessariamente de proteção, mas precisavam de acesso a oportunidades — tanto para apoiar a inovação local quanto para levantar capital para suas próprias ambições.</p>

        <h2>Como Funciona a Formação de Capital em Estágio Inicial — Antes vs Agora</h2>
        <p>Para iniciar uma empresa no Canadá do passado, você recorria a todos que conhecia. Levantava capital a $1.000 cada, e eles recebiam seu certificado de ações. Não mais. Hoje, ao buscar capital, você só pode captar de pessoas diretamente envolvidas ou do nosso mercado de venture capital subdesenvolvido e escasso (pense no Dragon’s Den da CBC).</p>

        <p>O mercado canadense de venture capital, altamente liberal e aberto, era forte. Mas o aperto regulatório colocou-o sob pressão, reduzindo sua capacidade de adaptação ao restringir a participação de varejo na formação de capital inicial.</p>

        <p>Em 1995, um fundador podia levantar capital de sua comunidade. Duzentos investidores contribuindo com $500 cada poderiam fornecer $100.000 em capital semente — suficiente para iniciar operações. A partir daí, o fundador poderia preparar um prospecto modesto e listar a empresa em uma bolsa de pequenas empresas, dando aos investidores de varejo uma participação real na inovação em estágio inicial. O sistema era desorganizado e arriscado, mas funcionava: qualquer pessoa com ambição e uma boa ideia podia participar, e canadenses comuns podiam apoiar empreendedores locais.</p>

        <p>Hoje, o cenário é irreconhecível. O cumprimento regulatório e as isenções prescritivas eliminaram quase toda a participação de varejo. A menos que você seja fundador, insider, membro próximo da família ou investidor credenciado, sua chance de investir em empresas canadenses em estágio inicial é praticamente zero. Ainda não é milionário? Você não está “certificado”. Não pode arriscar seu próprio dinheiro na startup de um amigo. Talvez devesse tentar a Ontario Lottery and Gaming Corporation em vez disso? Mesmo que desafie as probabilidades e passe do primeiro passo, será esmagado no segundo. Os mercados de pequenas empresas estão colapsando.</p>

        <h2>O Estrangulamento das Bolsas de Pequenas Empresas</h2>
        <p>Listar uma empresa em uma bolsa de pequenas empresas hoje está muito longe dos dias em que um fundador podia transformar $100.000 de investidores locais em uma empresa pública. Agora, demonstrações financeiras auditadas, documentos de divulgação de várias páginas e patrocínio obrigatório da bolsa podem custar **centenas de milhares de dólares** e levar meses ou até anos para serem concluídos. As bolsas de pequenas empresas nunca foram destinadas a mercados de blue-chip regulados e mainstream como a TSX. Se você é um fundo de pensão, vai à TSX. A bolsa de venture capital era o primo de alto risco; hoje, a TSXV foi estrangulada por taxas e regras de conformidade — deixando de ser o mercado de venture capital vibrante que já foi.</p>

        <h3>Emissores Listados na TSXV (aproximado)</h3>
        <pre class="chart-block">2005 | ██████████████████████ 2,350
2010 | ████████████████████ 2,200
2012 | ███████████████████  2,258
2015 | ████████████████     2,100
2020 | █████████████        1,850
2025 | ██████████           1,530</pre>
        <p class="caption"><em>Fontes: dados limitados do TMX Group sobre contagem de emissores TSXV; CEIC Data.</em></p>

        <h2>O Desaparecimento das Listagens</h2>
        <p>Segundo o Fraser Institute, cerca de 800 listagens de empresas desapareceram desde 2008, representando uma queda de aproximadamente 35% no número de emissores listados. Todos eles para ser substituídos por nada.</p>

        <p>A comunidade das bolsas de pequenas empresas foi substituída por nossa rede escassa e exclusiva de fundos de venture capital, redes de anjos e grupos de private equity. O Canadá já liderou o mundo em participação de varejo e formação pública de venture capital. Hoje, o pool de venture capital do país é menor e mais concentrado institucionalmente do que países com caminhos de varejo mais liberais. Enquanto isso, reformas nos EUA, como o Jumpstart Our Business Startups Act (JOBS Act), expandiram formas de investidores não-ricos acessarem certos mercados privados — uma direção oposta ao aumento do rigor canadense.</p>

        <p>Essa trajetória evidencia um desalinhamento: a intenção declarada de proteger investidores transformou-se em exclusão que cede competitividade a outros mercados.</p>

        <h2>O Que Estamos Protegendo, Exatamente?</h2>
        <p>A lógica por trás das regras de investidores credenciados é compreensível isoladamente — proteger os não sofisticados. Mas o efeito líquido foi excluir os canadenses comuns exatamente das oportunidades que antes definiam o venture capital canadense. Em vez de cultivar um mercado amplo e participativo, os reguladores arquitetaram um sistema que canaliza retornos de estágio inicial para os já afluentes. O oposto do que o Canadá foi projetado para ser.</p>

        <p>Se o preço da proteção é reduzir a competitividade, menos listagens e migração de capital para o exterior, então vale perguntar: cuja segurança estamos realmente priorizando? Adotamos uma regulamentação considerada para nos alinhar aos padrões globais. Mas a maior classe média do mundo não foi criada seguindo padrões globais. Nossas contas registradas agora estão mais protegidas do que nunca — tudo graças à lobotomia de nossos mercados de capitais. Vamos comprar ações nas mesmas 12 empresas e ver se nossa classe média continua crescendo. (Duvido).</p>
    </template>
  </article>
</template>

<style scoped>
.article table { border-collapse: collapse; width: 100%; }
.article th, .article td { border: 1px solid var(--color-border); padding: 0.5rem; text-align: left; }
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
.chart-block {
  white-space: pre-wrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.75rem;
}
.caption { color: var(--vt-c-text-light-2); font-size: 0.9rem; }

/* Section spacing: add a small line break feel between sections */
.article h2 { margin-top: 1.1rem; margin-bottom: 0.4rem; }
.article h3 { margin-top: 0.9rem; margin-bottom: 0.3rem; }
.article h2 + p, .article h3 + p { margin-top: 0.45rem; }
.article p + h2, .article p + h3 { margin-top: 1rem; }
</style>
