<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import CurlingIceAdCard from '../components/CurlingIceAdCard.vue'
const props = defineProps({ lang: { type: String, default: 'en' }, id: { type: String, default: 'brazil-curling' } })

const TITLES = {
  en: 'Curling Without Winter: The Improbable Rise of Brazil’s National Team',
  pt: 'Curling Sem Inverno: A Ascensão Improvável da Seleção Brasileira'
}
onMounted(() => { document.title = TITLES[props.lang] || TITLES.en })

const canonicalUrl = computed(() => `#/${['article', props.id, props.lang].filter(Boolean).join('/')}`)
const fullUrl = computed(() => window.location.origin + window.location.pathname + canonicalUrl.value)

const shareTitle = computed(() =>
    props.lang==='en' ? 'Curling Without Winter: The Improbable Rise of Brazil’s National Team' :
    'Curling Sem Inverno: A Ascensão Improvável da Seleção Brasileira'
)
const shareText = computed(() =>
    props.lang==='en' ? 'Brazil has one official curling rink, a federation founded by the country’s first bobsledder, and a national team built from a Facebook post, a Quebec exchange program, and a youth program bridging São Paulo’s Morumbi and Real Parque. A researched account of how curling took root in a country with no winter.' :
    'O Brasil tem uma única pista oficial de curling, uma federação fundada pelo primeiro bobsledista do país e uma seleção construída a partir de um post no Facebook, um intercâmbio em Quebec e um programa social que liga o Morumbi ao Real Parque, em São Paulo. Um relato apurado de como o curling criou raízes num país sem inverno.'
)

const UI_STRINGS = {
  en: { share: 'Share', copyLink: 'Copy link', copied: 'Link copied!', promptCopy: 'Copy the link:', email: 'Email' },
  pt: { share: 'Compartilhar', copyLink: 'Copiar link', copied: 'Link copiado!', promptCopy: 'Copie o link:', email: 'Email' }
}
const ui = computed(() => UI_STRINGS[props.lang] || UI_STRINGS.en)

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
      alert(ui.value.copied)
    } else {
      prompt(ui.value.promptCopy, fullUrl.value)
    }
  } catch (e) {
    console.error('Clipboard error', e)
    prompt(ui.value.promptCopy, fullUrl.value)
  }
}

const encodedUrl = computed(() => encodeURIComponent(fullUrl.value))
const encodedTitle = computed(() => encodeURIComponent(shareTitle.value))
const encodedText = computed(() => encodeURIComponent(shareText.value))

const pubDate = new Date('2026-08-06T00:00:00Z')
const isoDate = '2026-08-06'
const LOCALES = {
  en: 'en-US',
  pt: 'pt-BR'
}
const PUBLISHED_LABELS = {
  en: 'Published on',
  pt: 'Publicado em'
}
const formattedDate = computed(() => {
  const locale = LOCALES[props.lang] || 'en-US'
  const fmt = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
  return fmt.format(pubDate)
})
const publishedLabel = computed(() => PUBLISHED_LABELS[props.lang] || PUBLISHED_LABELS.en)
</script>

<template>
  <article class="article">
    <header style="display:flex;align-items:center;justify-content:space-between;gap:1rem; margin-bottom:0.75rem;">
      <div>
        <h1 v-if="props.lang==='en'">Curling Without Winter: The Improbable Rise of Brazil’s National Team</h1>
        <h1 v-else>Curling Sem Inverno: A Ascensão Improvável da Seleção Brasileira</h1>
        <div class="byline">
          <em v-if="props.lang==='en'">Moolytics — Sports History</em>
          <em v-else>Moolytics — Esportes</em>
        </div>
        <div class="pubdate">
          <small>{{ publishedLabel }} <time :datetime="isoDate">{{ formattedDate }}</time></small>
        </div>
      </div>
      <div class="share" ref="shareMenuEl" style="position:relative;">
        <button @click="onShareClick" :aria-expanded="showShareMenu ? 'true' : 'false'" aria-haspopup="menu" title="Share" style="border:1px solid var(--color-border);background:transparent;border-radius:6px;padding:0.35rem 0.5rem;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          <span>{{ ui.share }}</span>
        </button>
        <div v-if="showShareMenu" class="share-menu" role="menu">
          <button class="share-item" role="menuitem" @click="copyLink">{{ ui.copyLink }}</button>
          <a class="share-item" role="menuitem" :href="`mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`" target="_blank" rel="noopener">{{ ui.email }}</a>
          <a class="share-item" role="menuitem" :href="`https://api.whatsapp.com/send?text=${encodedTitle}%20-%20${encodedUrl}`" target="_blank" rel="noopener">WhatsApp</a>
          <a class="share-item" role="menuitem" :href="`https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`" target="_blank" rel="noopener">X / Twitter</a>
          <a class="share-item" role="menuitem" :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`" target="_blank" rel="noopener">LinkedIn</a>
        </div>
      </div>
    </header>

    <template v-if="props.lang === 'en'">
<p>Brazil, a country whose overwhelming majority sits in the tropics, and where an unusually cold night is the kind of thing that makes the local news, is about the least plausible place in the world to go looking for a national curling program. It has one anyway: a federation, a national team, an under-21 pipeline, a wheelchair squad, and, as of a few years ago, a single dedicated rink built inside a converted supermarket warehouse in São Paulo. Almost none of it is old. Most of it happened inside the last two decades, and the more interesting parts happened inside the last five years.</p>
<h2>A Federation Nine Years Ahead of Its Sport</h2>
<p>Long before anyone in Brazil had thrown a stone, the country already had a federation willing to claim curling as its own. The Confederação Brasileira de Desportos no Gelo (CBDG), the Brazilian Ice Sports Federation, was founded in 1996 by Eric Maleson, described in federation histories as Brazil’s first bobsled athlete, a fitting founder for an organization that would spend the next three decades getting Brazilians to compete in winter sports their country has almost no natural way to practice. Two years later, in 1998, the CBDG affiliated with the World Curling Federation. For the next nine years, that affiliation meant essentially nothing. Brazil had a curling federation, on paper, before it had a single curler.</p>
<p>The gap closed almost by accident, the way these things usually do. In 2007, four Brazilian students, Luís Augusto Silva, Marcelo Mello, César Santos and Celso Kossaka, were studying at the Université de Sherbrooke in Quebec, found curling as a way to fill the winter, and liked it enough to organize themselves into something resembling a team and get in touch with the CBDG back home. By 2008 the federation judged them ready to represent the country, and at the end of January 2009, the very new Brazilian national team traveled to the Capital Curling Club in Bismarck, North Dakota, to face the United States in a best-of-five series for a berth at that year’s World Men’s Championship. Brazil lost all three games it played and went home without a qualifying spot. It tried again against the Americans in 2010, and lost again. Both were, essentially, the first real curling Brazil had ever played on the international stage, by a team that had collectively been curling for about two winters.</p>
<h2>Vancouver, By Way of a Facebook Post</h2>
<p>Brazil’s other founding story starts on the opposite side of the continent and has nothing to do with the federation at all. In 2010, a Brazilian named Isis Oliveira watched a curling match on Brazilian television during the Vancouver Winter Olympics and got hooked. She later moved to Vancouver, where curling is closer to a civic institution than a niche pastime, and in 2014 she and a small circle of Brazilian expats, brought together by a Facebook post from a newcomer looking for other Brazilians who curled, formed the Brazilian Curling Club. It was a diaspora club, not a national program: Brazilians in Canada, playing on Canadian ice, mostly coached by Canadian instructors, competing for the country on their passports rather than the country under their feet.</p>
<p>It became more than that anyway. Oliveira began working toward her Level 3 coaching certification through Canada’s national coaching body, the club formally partnered with the Royal City Curling Club in New Westminster, and the CBDG eventually hired her as its junior development manager, putting a Vancouver-based club, run by a woman who fell for the sport watching television, in charge of building Brazil’s next generation of curlers. For most of the 2010s, the Vancouver pipeline and the Sherbrooke-founded national team were, between them, most of what Brazilian curling was.</p>
<h2>Building a Home in a Former Supermarket</h2>
<p>What Brazil didn’t have, for a long time, was ice of its own. The Campeonato Brasileiro de Curling launched in 2015 as a mixed-doubles-only event and, for its first four editions, had to be held in Canada, in Vancouver, Toronto and Delta, because there was nowhere in Brazil to play it. That changed in 2019, when the CBDG announced plans for a dedicated curling facility in São Paulo, backed by roughly R$2.5 million in private investment. Arena Ice Brasil opened on February 8, 2020, in the Morumbi district, built inside a warehouse that had previously housed an Extra hypermarket along the Pinheiros River. It has three curling sheets, the first dedicated curling ice anywhere in Latin America, plus a skating and hockey rink, and it remains, today, the only official curling facility in the country.</p>
<p>The arena changed the growth curve immediately. Sergio Vilela, one of the federation’s own competitive curlers, has put the number at roughly fifty registered curlers before the arena opened and around six hundred fifty two years later. In August 2022, Brazil held its first national championship ever played on Brazilian soil, delayed two years by the pandemic, a fact the CBDG’s curling coordinator, Mariana Baptista, noted pointedly at the time. It ran across categories that would have been unthinkable a decade earlier: mixed doubles, men’s, women’s and mixed teams, junior teams, and, for the first time, wheelchair teams.</p>
<h2>The Cousin, the Tax Lawyer, and the Married Couple</h2>
<p>If Brazilian curling has a public face at the international level, it’s Sergio Vilela, a doctor of international tax law who works in finance in São Paulo and has competed for Brazil since 2015. In September 2022, Vilela was elected to the World Curling Board of Directors, the first South American ever to sit on the governing board of a traditional Winter Olympic sport, and he now chairs the federation’s Finance Commission. Family runs through his own curling career: at the 2023 World Mixed Curling Championship in Aberdeen, his team’s third was his cousin, Fernanda Marques. Both are based in Switzerland and curl there for the Grasshoppers Curling Club, a reminder that a fair amount of competitive Brazilian curling still happens outside Brazil entirely.</p>
<p>What made that 2023 team notable wasn’t the cousins, it was the front end. Fabiana Campos and Felipe Pires, a married couple, discovered the sport at Arena Ice Brasil’s own club championship and became the first players on a Brazilian national team who had learned the game entirely at home, on Brazilian ice, rather than in Canada or Switzerland. “Felipe persuaded me to go to the championship,” Campos has said, “and that was the start.” By 2024 the two of them were Brazil’s national mixed doubles champions; by 2025, Pires was skipping the men’s team to a national title of its own, alongside Ataílson Ribas, Sidinei Sassi and Arnaldo Yamashita. The women’s title that year went to a team skipped by Fernanda Tiemi Marques, with Campos, Elen Naomi Sumi and Andrea Carlana, and an alternate, Giullia Rodriguez, who had picked up a broom for the first time in 2022 and was named alternate to the national team within the same year, one of the faster on-ramps the sport has produced anywhere.</p>
<h2>A Win in South Korea</h2>
<p>For a long time, Brazil’s international record in curling was close to entirely losses, not through lack of effort, but because a national team assembled from a handful of enthusiasts scattered across two continents was never going to beat the sport’s traditional powers. That changed, briefly and memorably, on January 22, 2024, at the Winter Youth Olympic Games in Gangwon, South Korea. It was Brazil’s third Youth Olympic curling appearance, after Lillehammer 2016 and Lausanne 2020, and its junior mixed team, Rafaela Ladeira, 17, Guilherme Melo, 15, Pedro Ribeiro, 14, and Julia Gentile, 16, coached by Isis Oliveira, the woman who had started the whole Vancouver branch of this story fourteen years earlier, beat Germany 6-4 in the preliminary round. It was the first match Brazil had ever won at any Olympic-level curling event, junior or senior, in the sport’s history in the country.</p>
<p>“We basically made history,” Ladeira said afterward. Gentile, more measured, called it “a once-in-a-lifetime experience.” Oliveira, watching four teenagers she had coached do something no Brazilian curling team had managed in fifteen years of trying, put it more simply: “This is just the beginning.” Brazil lost its other nine matches at the Games. The one win still stands as the country’s only Olympic-level curling victory to date.</p>
<h2>The Wheelchair Team’s Comeback</h2>
<p>Brazil’s most dramatic result belongs to its wheelchair program, which had existed on paper since at least February 2010, when an early, unrealized proposal floated a training facility at Campos do Jordão, a mountain town known within Brazil for having something closer to a real winter than almost anywhere else in the country. It took more than a decade for that ambition to turn into a formal partnership between the CBDG and the Brazilian Paralympic Committee. By 2022 the program had around eighteen active wheelchair curlers in development. On March 13, 2025, two of them, Vilma Miranda and Jerônimo Gabriel, both from São Paulo, played Japan at the World Mixed Doubles Wheelchair Curling Championship in Scotland, Brazil’s first appearance at that championship, in a field of twenty-one nations.</p>
<p>Japan led 10-1. Miranda and Gabriel scored six points in a single end, then five more in the next, and beat Japan 13-11, Brazil’s first win, in any wheelchair curling competition, ever. “It’s a relief,” Miranda said afterward, “because we’ve been away from home training for so long to get here and show we’ve improved.” Gabriel put it more bluntly: “We’re far from family, it’s been grueling training days. So this victory washes the soul clean.” Brazil lost its five remaining matches at the championship and finished near the bottom of the standings, which is, in context, roughly what a country with eighteen wheelchair curlers and one rink should expect. Mixed doubles wheelchair curling makes its Paralympic debut at the 2026 Milan-Cortina Games; Brazil, for now, watches that field from outside it, but has a result on the board that did not exist two years ago.</p>
<h2>Real Parque, R$150, and the Long Game</h2>
<p>Arena Ice Brasil sits in Morumbi, one of São Paulo’s wealthier districts, next to Real Parque, one of its poorer ones. The federation built a program bridging the two: a junior “núcleo de excelência,” backed with public support from Brazil’s Ministry of Citizenship, that has run around forty children through the sport, twenty-four of them wheelchair users, in partnership with FAZ, a nonprofit working in the Real Parque community. Ice time at the arena runs around R$150 for eight people, roughly the price of a movie ticket each, a deliberate choice by a federation with no interest in curling becoming, in Brazil, what it can easily become anywhere without a long domestic tradition behind it: an expensive novelty for people who can already afford novelties. “It can be practiced from eight to eighty,” Marcelo Mello, one of the original Sherbrooke four and still involved in the sport nearly two decades later, has said of it, and at Arena Ice Brasil that is closer to literally true than it is almost anywhere else the game is played.</p>
<h2>Where Brazil Actually Stands</h2>
<p>None of this adds up to Brazil being good at curling, and nobody involved in the program pretends otherwise. As of early 2026, Brazil fields roughly three hundred registered curlers, spread across Brazil, Canada and pockets of Europe, still built around a single official rink. The country’s world rankings, as of that same snapshot, were unglamorous: 30th of 47 in women’s, 37th of 61 in men’s, 42nd of 52 in mixed doubles, solidly in curling’s Series C, its third tier internationally. Even the equipment fights back sometimes: during the broadcast window of the 2026 Milan-Cortina Winter Olympics, Arena Ice Brasil’s own ice-resurfacing machine, imported from Canada, broke down. Fernanda Tiemi Marques, by then a CBDG director as well as a national champion skip, has been candid about what all of it means. Olympic qualification, she has said, remains a distant dream for now, and the federation’s real focus is on developing athletes between nine and twenty-one, roughly the age range most of the sport’s current success stories, from the Gangwon teenagers to Giullia Rodriguez, actually came from.</p>
<h2>The Rest of the Neighborhood</h2>
<p>Brazil is not quite alone anymore. In Argentina, a Córdoba-born academic named Ramiro Berardo, who had discovered curling recreationally while living in Columbus, Ohio, crowdfunded a shipment of stones, shoes and brooms back to Buenos Aires and talked his way into ice time at the country’s largest rink, with help from Alejandro Almada, a physical education teacher who happened to be president of the city’s badminton federation. The Argentine Curling Federation launched in June 2025 with about thirty active players; its first competitive team finished runner-up at a club spiel in Fort Wayne, Indiana that September; and on December 20, 2025, World Curling admitted Argentina as its 77th member association, the newest one on the books as of this writing. Mexico has its own small federation too, founded by two friends, Rodrigo Vélez and Mario Noyola, who discovered the sport on a work trip to Spain and brought it home; two-time Olympic gold medalist Kaitlyn Lawes signed on as the federation’s honorary godmother at its launch.</p>
<p>None of these programs will trouble curling’s traditional powers anytime soon, and nobody pretends they will. What they share with Brazil is smaller, and in its way more interesting, than a medal count: in three countries with no winter to speak of, a handful of people who happened to fall for a strange Canadian sport built somewhere for the next person to try it, one Facebook post and one converted supermarket at a time.</p>
<CurlingIceAdCard :lang="props.lang" />
    </template>

    <template v-else>
<p>O Brasil, país cuja imensa maioria do território fica nos trópicos e onde uma noite fria de verdade vira notícia no jornal local, é talvez o lugar menos plausível do mundo para se procurar uma seleção nacional de curling. Mesmo assim, ela existe: federação, seleção principal, categoria de base até os 21 anos, equipe em cadeira de rodas e, desde poucos anos atrás, uma única pista oficial, montada dentro de um antigo supermercado em São Paulo. Quase nada disso é antigo. A maior parte aconteceu nas últimas duas décadas, e as partes mais interessantes aconteceram nos últimos cinco anos.</p>
<h2>Uma Federação Nove Anos à Frente do Próprio Esporte</h2>
<p>Muito antes de qualquer brasileiro arremessar uma pedra, o país já tinha uma federação disposta a reivindicar o curling como seu. A Confederação Brasileira de Desportos no Gelo (CBDG) foi fundada em 1996 por Eric Maleson, apontado nos registros da entidade como o primeiro atleta de bobsled do Brasil — um fundador adequado para uma organização que passaria as três décadas seguintes tentando colocar brasileiros competindo em esportes de inverno que o país, na prática, não tem onde treinar. Dois anos depois, em 1998, a CBDG se filiou à Federação Mundial de Curling. Pelos nove anos seguintes, essa filiação não significou quase nada: o Brasil tinha uma federação de curling, no papel, antes de ter um único jogador.</p>
<p>A lacuna se fechou quase por acaso, como costuma acontecer nesses casos. Em 2007, quatro estudantes brasileiros — Luís Augusto Silva, Marcelo Mello, César Santos e Celso Kossaka — cursavam a Université de Sherbrooke, em Quebec, descobriram o curling como forma de ocupar o inverno canadense e gostaram o suficiente para se organizar como uma espécie de equipe e procurar a CBDG no Brasil. Em 2008 a federação considerou que estavam prontos para representar o país, e no fim de janeiro de 2009 a recém-formada seleção brasileira viajou até o Capital Curling Club, em Bismarck, Dakota do Norte, para enfrentar os Estados Unidos numa série melhor-de-cinco por uma vaga no Mundial masculino daquele ano. O Brasil perdeu as três partidas que disputou e voltou sem vaga. Tentou de novo contra os americanos em 2010, e perdeu outra vez. As duas foram, essencialmente, as primeiras partidas de curling de verdade que o Brasil já havia jogado em nível internacional, disputadas por uma equipe que, somados os dois jogadores mais experientes, tinha pouco mais de dois invernos de prática.</p>
<h2>Vancouver, Via Facebook</h2>
<p>A outra história fundadora do curling brasileiro começa do outro lado do continente e não tem nada a ver com a federação. Em 2010, uma brasileira chamada Isis Oliveira assistiu a uma partida de curling na televisão brasileira, durante os Jogos Olímpicos de Inverno de Vancouver, e ficou fisgada. Depois se mudou para Vancouver, cidade onde o curling é quase uma instituição cívica, e em 2014 ela e um pequeno grupo de brasileiros expatriados — reunidos a partir de uma postagem no Facebook de uma recém-chegada procurando outros brasileiros que jogassem curling — fundaram o Brazilian Curling Club. Era um clube de diáspora, não um programa nacional: brasileiros no Canadá, treinando em gelo canadense, na maior parte das vezes orientados por técnicos canadenses, competindo pelo país do passaporte, e não pelo país sob os pés.</p>
<p>Ainda assim, o clube virou mais do que isso. Oliveira começou a buscar a certificação de treinadora nível 3 pela entidade nacional de formação de técnicos do Canadá, o clube passou a ter parceria formal com o Royal City Curling Club, em New Westminster, e a CBDG acabou contratando-a como gerente de desenvolvimento de base — colocando um clube sediado em Vancouver, comandado por uma mulher que se apaixonou pelo esporte assistindo TV, no comando da formação da próxima geração de curlers brasileiros. Durante boa parte dos anos 2010, o eixo Vancouver e a seleção nascida em Sherbrooke foram, somados, praticamente tudo o que existia de curling brasileiro.</p>
<h2>Construindo uma Casa Dentro de um Supermercado</h2>
<p>O que faltava ao Brasil, por muito tempo, era gelo próprio. O Campeonato Brasileiro de Curling nasceu em 2015, só na categoria de duplas mistas, e em suas quatro primeiras edições precisou ser disputado no Canadá — em Vancouver, Toronto e Delta — porque não havia onde jogá-lo em solo brasileiro. Isso mudou em 2019, quando a CBDG anunciou planos para uma pista dedicada em São Paulo, viabilizada por cerca de R$ 2,5 milhões em investimento privado. A Arena Ice Brasil foi inaugurada em 8 de fevereiro de 2020, no Morumbi, dentro de um galpão que antes abrigava um hipermercado Extra, às margens do Rio Pinheiros. São três pistas oficiais de curling — as primeiras dedicadas ao esporte em toda a América Latina —, além de uma pista de patinação e hóquei no gelo, e a arena segue sendo, até hoje, a única instalação oficial de curling do país.</p>
<p>A arena mudou a curva de crescimento quase imediatamente. Sergio Vilela, um dos próprios curlers competitivos da federação, já colocou o número em cerca de cinquenta jogadores cadastrados antes da inauguração da arena e algo perto de seiscentos e cinquenta dois anos depois. Em agosto de 2022, o Brasil realizou seu primeiro campeonato nacional disputado em solo brasileiro, atrasado dois anos pela pandemia — fato que a coordenadora de curling da CBDG, Mariana Baptista, fez questão de destacar na época. A competição passou a abranger categorias impensáveis uma década antes: duplas mistas, equipes masculinas, femininas e mistas, categorias de base e, pela primeira vez, equipes em cadeira de rodas.</p>
<h2>A Prima, o Advogado Tributarista e o Casal</h2>
<p>Se o curling brasileiro tem um rosto público em nível internacional, esse rosto é Sergio Vilela, doutor em direito tributário internacional que trabalha no mercado financeiro em São Paulo e compete pelo Brasil desde 2015. Em setembro de 2022, Vilela foi eleito para o conselho de diretores da World Curling — o primeiro sul-americano a integrar a diretoria de um esporte olímpico de inverno tradicional — e hoje preside a Comissão de Finanças da entidade. Há um fio familiar em sua própria trajetória: no Mundial Misto de 2023, em Aberdeen, na Escócia, o terceiro de sua equipe era sua prima, Fernanda Marques. Os dois vivem na Suíça e jogam por lá pelo Grasshoppers Curling Club — um lembrete de que boa parte do curling competitivo brasileiro ainda acontece fora do Brasil.</p>
<p>O que tornou aquela equipe de 2023 notável, porém, não foram os primos: foi a dupla da ponta. Fabiana Campos e Felipe Pires, marido e mulher, descobriram o esporte no próprio campeonato interno da Arena Ice Brasil e se tornaram os primeiros jogadores de uma seleção brasileira formados inteiramente em casa, em gelo brasileiro, em vez de no Canadá ou na Suíça. “O Felipe me convenceu a ir ao campeonato”, contou Campos, “e foi aí que tudo começou.” Em 2024 os dois já eram campeões brasileiros de duplas mistas; em 2025, Pires liderava a equipe masculina a um título nacional próprio, ao lado de Ataílson Ribas, Sidinei Sassi e Arnaldo Yamashita. O título feminino daquele ano ficou com uma equipe liderada por Fernanda Tiemi Marques, com Campos, Elen Naomi Sumi e Andrea Carlana, e uma reserva, Giullia Rodriguez, que havia pegado numa vassoura de curling pela primeira vez em 2022 e, no mesmo ano, já havia sido convocada como reserva da seleção — uma das ascensões mais rápidas que o esporte produziu em qualquer lugar.</p>
<h2>Uma Vitória na Coreia do Sul</h2>
<p>Por muito tempo, o retrospecto internacional do Brasil no curling foi quase só derrotas — não por falta de empenho, mas porque uma seleção montada com um punhado de entusiastas espalhados por dois continentes dificilmente venceria as potências tradicionais do esporte. Isso mudou, de forma breve e memorável, em 22 de janeiro de 2024, nos Jogos Olímpicos de Inverno da Juventude em Gangwon, na Coreia do Sul. Era a terceira participação do Brasil em curling em Olimpíadas da Juventude, depois de Lillehammer 2016 e Lausanne 2020, e a equipe mista de base — Rafaela Ladeira, 17 anos, Guilherme Melo, 15, Pedro Ribeiro, 14, e Julia Gentile, 16, comandadas pela técnica Isis Oliveira, a mesma que havia dado início a todo o ramo de Vancouver dessa história catorze anos antes — venceu a Alemanha por 6 a 4 na fase preliminar. Foi a primeira partida que o Brasil já havia vencido em qualquer competição de curling em nível olímpico, de base ou principal, na história do esporte no país.</p>
<p>“Basicamente fizemos história”, disse Ladeira depois do jogo. Gentile, mais comedida, chamou o momento de “uma experiência única na vida”. Oliveira, vendo quatro adolescentes que ela mesma havia treinado conseguir algo que nenhuma equipe brasileira de curling havia conseguido em quinze anos de tentativas, resumiu de forma mais simples: “Isso é só o começo.” O Brasil perdeu as outras nove partidas que disputou nos Jogos. A única vitória segue sendo, até hoje, o único triunfo brasileiro em curling num evento de nível olímpico.</p>
<h2>A Virada da Equipe em Cadeira de Rodas</h2>
<p>O resultado mais dramático do curling brasileiro pertence ao seu programa em cadeira de rodas, que existia no papel desde pelo menos fevereiro de 2010, quando uma proposta inicial — nunca de fato realizada — cogitou montar uma estrutura de treinamento em Campos do Jordão, cidade serrana conhecida no Brasil por ter algo mais próximo de um inverno de verdade do que quase qualquer outro lugar do país. Levou mais de uma década para que essa ambição virasse uma parceria formal entre a CBDG e o Comitê Paralímpico Brasileiro. Em 2022, o programa já contava com cerca de dezoito atletas em cadeira de rodas em desenvolvimento. Em 13 de março de 2025, dois deles, Vilma Miranda e Jerônimo Gabriel, ambos de São Paulo, enfrentaram o Japão no Mundial de duplas mistas de curling em cadeira de rodas, na Escócia — estreia do Brasil na competição, num campo de vinte e um países.</p>
<p>O Japão abriu 10 a 1. Miranda e Gabriel marcaram seis pontos num único set e mais cinco no seguinte, e venceram o Japão por 13 a 11 — a primeira vitória brasileira, em qualquer competição de curling em cadeira de rodas, da história. “É um alívio”, disse Miranda depois da partida, “porque estamos há tanto tempo fora de casa treinando para chegar aqui e poder demonstrar que a gente evoluiu.” Gabriel foi mais direto: “Estamos longe da família, foram dias árduos de treino. Então, essa vitória vem para lavar a alma.” O Brasil perdeu as cinco partidas restantes do Mundial e terminou perto do fim da tabela — o que, dado o contexto, é mais ou menos o que se espera de um país com dezoito curlers em cadeira de rodas e uma única pista. O curling em cadeira de rodas para duplas mistas estreia como modalidade paralímpica nos Jogos de Milão-Cortina, em 2026; o Brasil, por ora, assiste de fora, mas carrega um resultado que, dois anos atrás, simplesmente não existia.</p>
<h2>Real Parque, R$ 150 e o Jogo Longo</h2>
<p>A Arena Ice Brasil fica no Morumbi, um dos bairros mais ricos de São Paulo, colado ao Real Parque, uma de suas comunidades mais pobres. A federação construiu um programa que liga os dois lados: um “núcleo de excelência” de base, com apoio público do Ministério da Cidadania, que já passou cerca de quarenta crianças pelo esporte — vinte e quatro delas cadeirantes —, em parceria com a FAZ, organização sem fins lucrativos que atua na comunidade do Real Parque. Uma hora de gelo na arena custa cerca de R$ 150 para oito pessoas, praticamente o preço de um ingresso de cinema por cabeça — uma escolha deliberada de uma federação sem nenhum interesse em deixar o curling virar, no Brasil, aquilo que ele facilmente vira em qualquer lugar sem tradição doméstica de longa data: uma novidade cara para quem já pode bancar novidades. “Dá para praticar dos 8 aos 80 anos”, já disse Marcelo Mello — um dos quatro fundadores de Sherbrooke, ainda envolvido com o esporte quase duas décadas depois —, e na Arena Ice Brasil essa frase chega mais perto de ser literalmente verdadeira do que em quase qualquer outro lugar onde o jogo é praticado.</p>
<h2>Onde o Brasil Está, de Fato</h2>
<p>Nada disso quer dizer que o Brasil seja bom em curling, e ninguém dentro do programa finge o contrário. No início de 2026, o Brasil tinha cerca de trezentos curlers cadastrados, espalhados entre o país, o Canadá e alguns bolsões da Europa, ainda organizados em torno de uma única pista oficial. O ranking mundial do país, no mesmo retrato, era pouco glamouroso: 30º entre 47 no feminino, 37º entre 61 no masculino, 42º entre 52 em duplas mistas — solidamente na Série C do curling, sua terceira divisão internacional. Até o equipamento se rebela às vezes: durante a janela de transmissão dos Jogos Olímpicos de Inverno de Milão-Cortina, em 2026, a própria máquina de resurfacing da Arena Ice Brasil, importada do Canadá, quebrou. Fernanda Tiemi Marques, já então diretora da CBDG além de skip campeã nacional, tem sido franca sobre o que tudo isso significa: a classificação olímpica, segundo ela, ainda é um sonho distante por ora, e o foco real da federação está em formar atletas entre nove e vinte e um anos — mais ou menos a faixa etária de onde vieram a maioria das histórias de sucesso recentes do esporte no país, das adolescentes de Gangwon a Giullia Rodriguez.</p>
<h2>O Resto da Vizinhança</h2>
<p>O Brasil já não está sozinho. Na Argentina, um acadêmico cordobês chamado Ramiro Berardo, que havia descoberto o curling por acaso enquanto morava em Columbus, Ohio, arrecadou fundos para enviar pedras, sapatos e vassouras até Buenos Aires e conseguiu, na conversa, tempo de gelo na maior pista do país, com a ajuda de Alejandro Almada, professor de educação física que por acaso também presidia a federação de badminton da cidade. A Federação Argentina de Curling foi lançada em junho de 2025, com cerca de trinta jogadores ativos; sua primeira equipe competitiva terminou vice-campeã num torneio de clube em Fort Wayne, nos Estados Unidos, em setembro daquele ano; e em 20 de dezembro de 2025 a World Curling admitiu a Argentina como sua 77ª federação-membro, a mais recente no momento em que este texto foi escrito. O México também tem sua própria federação, pequena, fundada por dois amigos, Rodrigo Vélez e Mario Noyola, que conheceram o esporte numa viagem de trabalho à Espanha e o trouxeram para casa; a bicampeã olímpica Kaitlyn Lawes assumiu como madrinha honorária da federação em seu lançamento.</p>
<p>Nenhum desses programas vai incomodar as potências tradicionais do curling tão cedo, e ninguém finge que vá. O que eles têm em comum com o Brasil é menor, e de certa forma mais interessante, do que uma contagem de medalhas: em três países sem inverno para chamar de seu, um punhado de gente que se apaixonou por um esporte canadense muito estranho construiu, aos poucos, um lugar para a próxima pessoa experimentar — um post de Facebook e um supermercado reformado de cada vez.</p>
<CurlingIceAdCard :lang="props.lang" />
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
