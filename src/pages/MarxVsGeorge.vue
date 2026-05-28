<script setup>
import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useTTS } from '../composables/useTTS.js'
import { debateV1, debateV1PageStarts, pageQuotes } from '../data/debateScript.js'
const props = defineProps({ lang: { type: String, default: 'en' }, id: { type: String, default: 'marx-vs-george' } })

const canonicalUrl = computed(() => `#/article/${props.id}`)
const fullUrl = computed(() => window.location.origin + window.location.pathname + canonicalUrl.value)
const shareTitle = 'The Great Debate: Marx vs. George — Version I (The Standard, 1887)'
const shareText = 'A romanticised 1887 debate transcript: Karl Marx and Henry George on Land, Labour, and the Root of Human Misery — as reported by The Standard.'

const showShareMenu = ref(false)
const shareMenuEl = ref(null)
function onDocumentClick(e) {
  if (!showShareMenu.value) return
  if (shareMenuEl.value && !shareMenuEl.value.contains(e.target)) showShareMenu.value = false
}

// ── Pagination ──
const currentPage = ref(0)
const totalPages = 14
const npRef = ref(null)
const transitioning = ref(false)
let _transitionTimer = null
function startTransition(callback) {
  if (_transitionTimer) clearTimeout(_transitionTimer)
  transitioning.value = true
  _transitionTimer = setTimeout(() => {
    callback()
    nextTick(() => { transitioning.value = false })
  }, 150)
}

const pageLabels = [
  'Correspondent\'s Dispatch',
  'Opening Statements',
  'Round I — The Immigrant Experience',
  'Round II — Surplus Value',
  'Round III — Overproduction',
  'Round IV — The Surgeon & the Executioner',
  'Round V — Liberty & Property',
  'Round VI — Proportionality',
  'Round VII — Genius & Invention',
  'Round VIII — Terminal Contradictions',
  'Round IX — Scale & Bureaucracy',
  'Round X — The Moral Foundation',
  'Round XI — The Citizens\' Dividend',
  'Closing Statements',
]

function goTo(n) {
  if (n < 0 || n >= totalPages) return
  startTransition(() => {
    currentPage.value = n
    npRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

const { ttsReady, ttsState, ttsSpeaker, ttsText, ttsLineIdx, ttsTotal, elError, listenFrom, ttsTogglePause, ttsStop } = useTTS()
function listenCurrentPage() { listenFrom(debateV1, debateV1PageStarts[currentPage.value]) }

watch(ttsLineIdx, (idx) => {
  if (ttsState.value === 'idle') return
  for (let p = debateV1PageStarts.length - 1; p >= 0; p--) {
    if (idx >= debateV1PageStarts[p]) {
      if (p !== currentPage.value) startTransition(() => { currentPage.value = p })
      break
    }
  }
})

function handleKey(e) {
  if (e.key === 'ArrowRight') goTo(currentPage.value + 1)
  if (e.key === 'ArrowLeft') goTo(currentPage.value - 1)
}

onMounted(() => {
  document.title = 'Marx vs. George: The Great Debate — Version I | Moolytics'
  document.addEventListener('click', onDocumentClick)
  window.addEventListener('keydown', handleKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  window.removeEventListener('keydown', handleKey)
  ttsStop()
})

async function onShareClick() {
  try { if (navigator.share) { await navigator.share({ title: shareTitle, text: shareText, url: fullUrl.value }); return } } catch {}
  showShareMenu.value = true
}
async function copyLink() {
  try { await navigator.clipboard.writeText(fullUrl.value); alert('Link copied!') }
  catch { prompt('Copy the link:', fullUrl.value) }
}
const encodedUrl = computed(() => encodeURIComponent(fullUrl.value))
const encodedTitle = encodeURIComponent(shareTitle)
const encodedText = encodeURIComponent(shareText)
</script>

<template>
  <div class="np-wrapper">

    <div class="digital-bar" ref="shareMenuEl">
      <span class="digital-label">Moolytics &mdash; Historical Archive</span>
      <div style="position:relative;">
        <button class="share-btn" @click="onShareClick">Share</button>
        <div v-if="showShareMenu" class="share-menu" role="menu">
          <button class="share-item" role="menuitem" @click="copyLink">Copy link</button>
          <a class="share-item" role="menuitem" :href="`mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`" target="_blank" rel="noopener">Email</a>
          <a class="share-item" role="menuitem" :href="`https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`" target="_blank" rel="noopener">X / Twitter</a>
          <a class="share-item" role="menuitem" :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`" target="_blank" rel="noopener">LinkedIn</a>
        </div>
      </div>
    </div>

    <div class="newspaper" ref="npRef">

      <!-- ═══ MASTHEAD ═══ -->
      <div class="masthead">
        <div class="mast-top-row">
          <span>Vol. I. &mdash; No. 42</span>
          <span class="mast-orn">&#10022; &ensp; &#10022; &ensp; &#10022;</span>
          <span>Price: Two Cents</span>
        </div>
        <div class="mast-title">The Standard</div>
        <div class="mast-founded">Founded &amp; Conducted by Henry George</div>
        <div class="mast-motto">&ldquo;The Earth belongs in usufruct to the living.&rdquo; &mdash; Thomas Jefferson</div>
        <div class="mast-date">New York &amp; London &nbsp;&#9830;&nbsp; Saturday, the 13th of November, 1887</div>
        <div class="mast-supp">London Supplement &mdash; Version the First: The Generous Account</div>
      </div>

      <div class="rule-dbl"></div>

      <!-- ═══ HEADLINE BLOCK (always shown) ═══ -->
      <div class="hl-block">
        <div class="hl-kicker-row">
          <div class="kicker">From Our Special London Correspondent &mdash; Column {{ currentPage + 1 }} of {{ totalPages }}</div>
          <button v-if="ttsReady" class="hl-listen-btn" :class="{ 'hl-listen-active': ttsState !== 'idle' }" @click="listenCurrentPage">&#9654; Listen</button>
        </div>
        <div class="hl-main">{{ pageLabels[currentPage] }}</div>
        <div class="hl-deck-1">Mr. Karl Marx &amp; Mr. Henry George &mdash; London, 1887</div>
      </div>

      <!-- Version / nav strip -->
      <div class="ver-strip">
        <a href="#/article/marx-george-intro" class="ver-link-btn">&larr; Introduction</a>
        <span class="ver-badge">Version I of II &mdash; The Generous Account</span>
        <a href="#/article/marx-vs-george-2" class="ver-link-btn">Version II &rarr;</a>
      </div>

      <div class="rule-sgl"></div>

      <!-- ═══ PAGINATED CONTENT ═══ -->
      <div class="news-body" :class="{ 'is-transitioning': transitioning }">

        <!-- PAGE 0: Preamble -->
        <div class="page-content" v-show="currentPage === 0">
          <p class="dispatch-lead"><span class="drop-cap">L</span><span class="place-date">ondon, Friday Evening.</span> &mdash;
            The Exchange Rooms in Pall Mall were filled to capacity this evening, as they seldom are for any occasion
            short of a royal address or a particularly lurid murder trial. Gas lamps burned with unusual brightness
            &mdash; or perhaps it was merely the intensity of attention in the hall that made them appear so. For the
            occasion was without precedent: the first, and one suspects the only, public meeting between Mr. Karl Marx,
            the German economist and principal author of <em>Das Kapital,</em> and Mr. Henry George, whose
            <em>Progress and Poverty</em> has now sold some two millions of copies in the English-speaking world.</p>
          <p>The men were placed at opposing lecterns. The smell of wool and tobacco hung pleasantly in the warmed air.
            Between the speakers stood a moderator &mdash; a position that proved, by the evening&rsquo;s close,
            largely unnecessary. The audience included members of the Fabian Society, several representatives of the
            trade union movement, and no inconsiderable number of university men who arrived with empty note-books
            and departed with full ones.</p>
          <p>What follows is our correspondent&rsquo;s full transcript, taken in shorthand and here reproduced with
            the minimum of editorial interference. The positions expressed are the men&rsquo;s own. The reader is
            invited to judge them accordingly.</p>
          <p><em>The Standard</em> has never concealed its editorial sympathies in the matter of land value taxation.
            We trust Mr. George&rsquo;s arguments will prove adequate without further assistance from the editors.
            This is the generous account &mdash; the debate as it might ideally have unfolded between two men of equal
            intellectual good faith. A second account, faithful to the historical temperament, is published alongside
            this one.</p>
          <p class="nav-hint"><em>(Use the arrow keys or the buttons below to turn the page.)</em></p>
        </div>

        <!-- PAGE 1: Opening Statements -->
        <div class="page-content" v-show="currentPage === 1">
          <p class="ex"><span class="spkr">Marx.</span> The condition of the working class under capitalism is not
            an accident, nor a correctable inefficiency. It is the system functioning exactly as designed. The
            capitalist purchases labour power at its market value &mdash; subsistence &mdash; and extracts from it
            far more value than he returns. This surplus value is the engine of accumulation, the source of profit,
            and the mechanism of exploitation. As capital concentrates in fewer hands, as small producers are absorbed
            into the great industrial machine, the contradictions deepen. Crisis follows crisis. Poverty grows
            alongside wealth not despite progress, but because of it. The system cannot be reformed. It must be
            transcended.</p>
          <p class="ex"><span class="spkr">George.</span> I find myself in partial agreement with my colleague&rsquo;s
            observations about poverty growing alongside wealth &mdash; indeed that paradox is the central question
            of our age, and I have spent the better part of my life trying to answer it honestly. But his diagnosis,
            I am afraid, mistakes the shadow for the substance.</p>
          <p class="ex in">Look at any great city. As it grows &mdash; as commerce expands, as population increases,
            as industry advances &mdash; who captures the lion&rsquo;s share of that increasing wealth? Not the
            worker who builds the buildings. Not the entrepreneur who risks his capital. Not the inventor who lights
            the streets. The landowner. The man who holds title to the ground beneath it all &mdash; ground he did
            not make, ground whose value the entire community created simply by being there &mdash; that man grows
            rich in his sleep whilst the labourer grows poorer despite his toil.</p>
          <p class="ex in">Tax the value of that land &mdash; and only that &mdash; and you remove the great siphon
            that drains progress of its promise. Free everything else, and watch what free men and women produce.</p>
        </div>

        <!-- PAGE 2: Round 1 -->
        <div class="page-content" v-show="currentPage === 2">
          <p class="ex"><span class="spkr">George.</span> Look at the millions pouring into America from every
            corner of Europe &mdash; Irish fleeing famine, Germans fleeing Prussian bureaucracy, Italians fleeing
            centuries of aristocratic feudalism. What do they seek? Not your revolution, Mr. Marx. They seek land.
            They seek the right to work, build, and keep what they earn without paying tribute to a lord. And when
            they arrive and clear a farm with their own hands, build a small business in their neighbourhood, teach
            their children to read by lamp-light &mdash; that is not class struggle. That is the spontaneous order
            of free men and women expressing their highest nature.</p>
          <p class="ex in">America was the great experiment &mdash; proof that human beings, liberated from feudal
            arrangements, would create prosperity through voluntary co-operation and individual initiative. The tragedy
            is that we imported from the Old World precisely the thing these people were fleeing &mdash; the feudal
            notion that land can be held as private monopoly to extract tribute from all who need it. We took the
            energy of the freest people on earth and quietly installed the same pump that was bleeding them dry in the
            countries they escaped.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(composed, slightly sardonic.)</em> A moving portrait,
            Mr. George. But your immigrant who arrives full of hope quickly discovers the factory, the tenement, and
            the company store. He exchanges the landlord of the Old World for the industrialist of the New. The
            geography changes. The exploitation does not. Your American freedom is freedom for capital &mdash; not
            for labour.</p>
          <p class="ex"><span class="spkr">George.</span> And why do the tenements exist, Mr. Marx? Because the land
            beneath Manhattan is held off the market by speculators waiting for the labour of others to raise its
            value. Free that land through taxation of its value, and the market mechanisms you despise would
            themselves produce affordable housing, higher wages, and genuine opportunity. The immigrant does not need
            your revolution. He needs us to stop stealing the value he creates the moment he creates it.</p>
          <p class="ex"><span class="spkr">Marx.</span> The problem runs deeper than land tenure &mdash;</p>
          <p class="ex"><span class="spkr">George.</span> It always runs deeper with you. Every practical remedy is
            insufficient. Every concrete reform misses the true depth of the problem. Meanwhile the immigrant family
            sleeps six to a room.</p>
        </div>

        <!-- PAGE 3: Round 2 -->
        <div class="page-content" v-show="currentPage === 3">
          <p class="ex"><span class="spkr">Marx.</span> Let us be precise. My theory of surplus value demonstrates
            that exploitation is embedded in the wage relationship itself &mdash; not merely in land ownership. The
            worker produces, say, ten hours of value. The capitalist pays him for five. The remaining five &mdash;
            surplus value &mdash; is appropriated by the owner of capital. This occurs regardless of land
            arrangements. Your single tax leaves this mechanism entirely untouched.</p>
          <p class="ex"><span class="spkr">George.</span> <em>(nodding slowly.)</em> This is where you make your
            most serious point, and I want to engage it honestly rather than dismiss it. You are correct that the
            wage relationship contains real asymmetries of power. I do not pretend otherwise. Where we differ is in
            the cause and the remedy.</p>
          <p class="ex in">The capitalist&rsquo;s power over labour depends entirely on workers having no
            alternative. A man who must work or starve will accept almost any terms. But why must he work or starve?
            Because access to land &mdash; to the natural resource from which all wealth ultimately derives &mdash;
            has been monopolised. If land were freely accessible, or its rental value returned to the community,
            workers would have genuine alternatives. The bargaining position of labour would transform over-night.
            The capitalist who tried to pay subsistence wages would find his workers had options he could not
            control.</p>
          <p class="ex in">Your surplus value is real. But it flows from the land monopoly more than from capital
            itself. Fix the foundation, and the structure above it corrects naturally.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(a slight edge entering his voice.)</em> You ask a great
            deal of &ldquo;natural correction.&rdquo;</p>
          <p class="ex"><span class="spkr">George.</span> I ask a great deal less than you do of human nature when
            you hand it absolute power.</p>
        </div>

        <!-- PAGE 4: Round 3 -->
        <div class="page-content" v-show="currentPage === 4">
          <p class="ex"><span class="spkr">Marx.</span> The recurring crises of capitalism &mdash; the panics, the
            depressions, the factories standing idle while workers starve &mdash; are inherent contradictions.
            Capital accumulation leads to falling rates of profit. Overproduction becomes chronic. The working class,
            systematically impoverished, cannot purchase what industry produces. These are objective contradictions
            that no tax can resolve. Capitalism is consuming itself from within.</p>
          <p class="ex"><span class="spkr">George.</span> Overproduction. <em>(a sharp, genuine laugh.)</em> Mr.
            Marx, what greater absurdity has political economy ever produced? We are told that men go ragged because
            there are too many clothes. That they shiver because there is too much coal. That they starve because
            the granaries are overflowing. How &mdash; how &mdash; can there be overproduction whilst millions still
            lack the most basic necessities of civilised life?</p>
          <p class="ex in">This is not overproduction. It is manufactured scarcity in the midst of abundance. The
            problem is not that we produce too much &mdash; it is that the gains of production are continuously
            siphoned upward by rising land rents. As industry advances and cities grow, the landowner captures an
            ever-larger share of the wealth created by everyone else. This compresses wages, squeezes honest profit,
            chokes purchasing power &mdash; and then you observe the resulting collapse and call it an inherent
            contradiction of capital itself.</p>
          <p class="ex in">Your observations, Mr. Marx, are genuinely acute. The pathology you describe is real.
            But you have stopped one layer too shallow. What you call the terminal contradictions of capitalism I
            would call the predictable consequences of a market with no outflow valve. Land values accumulate
            without limit &mdash; absorbing productivity gains, concentrating in fewer hands, starving the productive
            economy of the purchasing power it needs. Install the valve &mdash; tax the land value, return it to
            the community &mdash; and the engine runs cleanly. The crises you describe do not disappear because
            capitalism is transcended. They disappear because the design flaw is corrected.</p>
          <p class="ex in">Your observations are correct. Your diagnosis is wrong. And your prescription would kill
            the patient.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(stiffening.)</em> You reduce a systemic analysis of
            historic proportions to a plumbing metaphor &mdash;</p>
          <p class="ex"><span class="spkr">George.</span> I reduce it to something a working man can understand and
            vote for. You reduce it to something only a German philosopher can fully appreciate &mdash; conveniently
            enough.</p>
          <p class="stage">(Mild laughter from the audience. Mr. Marx&rsquo;s jaw tightens perceptibly.)</p>
        </div>

        <!-- PAGE 5: Round 4 -->
        <div class="page-content" v-show="currentPage === 5">
          <p class="ex"><span class="spkr">Marx.</span> <em>(with controlled intensity.)</em> The capitalist system
            is not a patient with a single correctable ailment. It is diseased to its foundations. The contradictions
            are structural and fatal. We must replace the failing organs with rational, collectively owned structures.
            Half-measures do not cure terminal disease.</p>
          <p class="ex"><span class="spkr">George.</span> And here is where your metaphor becomes genuinely
            dangerous. You look at a living patient &mdash; imperfect, suffering, but breathing, producing, capable
            of extraordinary things &mdash; and you declare the entire organism must be dismantled and rebuilt from
            rational principles. You propose to remove the vital organs and replace them with cold steel, designed
            by men who have never themselves built a business, grown a crop, or employed a neighbour.</p>
          <p class="ex in">I say the body is largely healthy. The market, free exchange, individual initiative, the
            price system &mdash; these are functional organs that have lifted more people from poverty than any
            collective arrangement in history. The patient suffers from one great parasite: the land monopoly.
            Remove it surgically &mdash; through democratic legislation, through a transparent tax on what the
            community creates &mdash; and the living system will recover and thrive.</p>
          <p class="ex in">Your revolution is not surgery. It is execution &mdash; performed with great theoretical
            confidence and complete indifference to whether the patient survives. And the record of men who seize
            absolute power in the name of the people is not one that should inspire confidence in any honest
            observer.</p>
          <p class="ex"><span class="spkr">Marx.</span> The transition requires &mdash;</p>
          <p class="ex"><span class="spkr">George.</span> The transition always requires something terrible, does it
            not? And it is always someone else who pays the price. The intellectuals who design the revolution
            rarely seem to be first against the wall.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(sharply.)</em> You are a sentimentalist who cannot see
            past his own provincial American optimism &mdash;</p>
          <p class="ex"><span class="spkr">George.</span> <em>(calmly, allowing the room to feel the outburst.)</em>
            I see that my colleague is growing agitated. I would ask him to note &mdash; for the benefit of the
            audience &mdash; that this is the man who proposes to concentrate all economic and political power in a
            revolutionary state. If the theory cannot survive scrutiny in a London lecture hall without this
            temperature rising, one wonders how it would manage the rather more demanding pressures of actually
            governing.</p>
          <p class="stage">(A longer pause. Murmuring throughout the hall.)</p>
          <p class="ex">I mean no personal disrespect. But the question of temperament is not entirely separate
            from the question of governance.</p>
        </div>

        <!-- PAGE 6: Round 5 -->
        <div class="page-content" v-show="currentPage === 6">
          <p class="ex"><span class="spkr">George.</span> Let me say something about property that I suspect will
            surprise those who assume I am a socialist in disguise. I believe in private property more fundamentally
            than most of its supposed defenders. A man who builds a house should own that house absolutely. A man
            who clears a farm should own its harvest completely. A man who builds a business should keep its profits
            entirely. These are not concessions I make grudgingly &mdash; they are the moral foundation of my
            entire system. You earn it, you keep it. Full stop.</p>
          <p class="ex in">What I oppose is not property but privilege &mdash; the appropriation of value that the
            individual did not create. The land speculator who buys a city lot and waits for the surrounding
            community to make it valuable has not created that value. He has captured it. That is not property.
            That is a toll-booth erected on a road someone else built.</p>
          <p class="ex in">Your system, Mr. Marx, offers the workers something you call collective ownership
            &mdash; but a worker who cannot sell his stake, transfer it, direct it, or use it according to his own
            judgement is not an owner. He is a serf with better slogans. The state becomes the ultimate landlord
            &mdash; and unlike the private landlord, it has an army.</p>
          <p class="ex"><span class="spkr">Marx.</span> Collective ownership is fundamentally different from state
            control as currently constituted. The workers themselves &mdash;</p>
          <p class="ex"><span class="spkr">George.</span> It is always different in theory. Always. The guardians
            will be wise. The vanguard will be virtuous. The dictatorship will be temporary. I have read your work
            carefully, Mr. Marx, and I have yet to find the mechanism by which power, once concentrated in the name
            of the people, is voluntarily returned to the people. I have read human history rather carefully as
            well, and I have yet to find an example of it occurring.</p>
          <p class="ex"><span class="spkr">Marx.</span> Your faith in the democratic process is touchingly
            na&iuml;ve given who currently controls it &mdash;</p>
          <p class="ex"><span class="spkr">George.</span> And your faith in revolutionary committees is touching
            given who historically ends up running them. We are both, perhaps, idealists. The difference is that my
            idealism requires only that people vote correctly once. Yours requires that people with absolute power
            behave virtuously forever.</p>
        </div>

        <!-- PAGE 7: Round 6 -->
        <div class="page-content" v-show="currentPage === 7">
          <p class="ex"><span class="spkr">George.</span> I want to address something that often gets lost in
            these discussions &mdash; the question of proportionality. My system is not a blunt instrument. Those
            who hold a small plot of land pay little. Those who speculate on vast tracts of urban land pay
            substantially. The farmer pays on the unimproved value of the land &mdash; modest in most cases &mdash;
            not on the value of his labour or his improvements. The factory owner pays no tax on his machinery, his
            inventory, or his profits. Only the value of the ground beneath him &mdash; value created by the
            community &mdash; is recaptured by the community.</p>
          <p class="ex in">This is not punishment of success. It is the precise opposite. It is the removal of a
            system that currently punishes success &mdash; taxing the wages of the worker, the profits of the
            entrepreneur, the returns of the investor &mdash; whilst rewarding the passive holder of appreciating
            land with an entirely unearned windfall.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(composure partially recovered; making a genuine
            point.)</em> I will grant you that the internal logic is consistent. But you assume that capital, once
            freed from land speculation, would flow toward productive enterprise rather than finding new mechanisms
            of concentration and monopoly. History suggests capital is rather creative in discovering ways to
            accumulate. Standard Oil did not require land speculation to achieve its stranglehold.</p>
          <p class="ex"><span class="spkr">George.</span> <em>(pausing, genuinely considering.)</em> That is your
            strongest point to-day, and I want to give it its due. You are correct that monopoly can arise from
            sources other than land &mdash; network effects, control of resources, predatory pricing. I do not claim
            my remedy is omnipotent. What I claim is that it removes the foundational mechanism that makes all other
            concentrations of power so difficult to dislodge. Land is where every economy is ultimately grounded
            &mdash; literally. Fix that, and you create a genuinely competitive environment in which the Standard
            Oils of the world face real constraints they currently do not. It is not a complete solution. It is the
            necessary first solution, without which all others are built on sand.</p>
          <p class="stage">(Mr. Marx, surprised by the concession, is momentarily uncertain.)</p>
          <p class="ex"><span class="spkr">George.</span> You see, Mr. Marx &mdash; I am capable of acknowledging
            a strong argument. It is a habit I would recommend.</p>
        </div>

        <!-- PAGE 8: Round 7 -->
        <div class="page-content" v-show="currentPage === 8">
          <p class="ex"><span class="spkr">George.</span> Let me bring into this discussion a name we both know
            &mdash; Mr. Nikola Tesla. Here is a man born in Serbia, son of a clergyman, without inheritance or
            title or aristocratic connection. He came to America with almost nothing. And through the sheer force of
            his intellect &mdash; visualising complete machines in his mind before setting hand to metal &mdash; he
            is literally illuminating the world. Alternating current. The electrical system that lit the Columbian
            Exposition like a second sun.</p>
          <p class="ex in">This is what liberated human energy produces when it is not being drained by land rent,
            strangled by bureaucracy, or directed by central planners who know better. Tesla needed no commissar to
            tell him what to invent. He needed freedom, an environment that rewarded genius, and capital not wasted
            on speculation that could finance his work. Tax the land, free the capital, and you fund a thousand
            Teslas &mdash; men and women whose potential currently dissolves into the rent cheque every month.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(with open contempt.)</em> Individual genius is a
            bourgeois myth. Technological progress under capitalism intensifies the misery of those who actually
            build and maintain the machines. Tesla&rsquo;s inventions will enrich Morgan and Westinghouse &mdash;
            not the worker who installs the wiring.</p>
          <p class="ex"><span class="spkr">George.</span> And there it is &mdash; the darkest thread running
            through your entire philosophy. The exceptional individual is a problem to be explained away. Tesla is
            not a triumph to be celebrated but an inconvenience to be categorised. He does not fit your framework
            &mdash; he is not a class, not a product of material forces, not a predetermined outcome of historical
            dialectic. He is a singular man with a singular mind producing something no one else in the world could
            have produced at that moment.</p>
          <p class="ex in">I find that magnificent. You find it inconvenient.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(losing composure.)</em> You are a na&iuml;ve apologist
            for the very system that crushes the thousands of equally brilliant minds born into poverty who never
            get their chance &mdash; you simpleminded &mdash;</p>
          <p class="ex"><span class="spkr">George.</span> <em>(quietly, with precision.)</em> Mr. Marx.</p>
          <p class="stage">(The room falls entirely still.)</p>
          <p class="ex">You have now called me sentimental, provincial, na&iuml;ve, and simpleminded in the course
            of an afternoon. I note that your arguments have grown shorter and your adjectives longer in rough
            proportion to how the debate has proceeded. That is, in my experience, not generally a sign of
            intellectual confidence.</p>
          <p class="ex in">I would also ask the audience to observe something. This man &mdash; who grows furious
            when his ideas are questioned in a London hall with no consequences &mdash; proposes to vest absolute
            economic and political authority in a revolutionary state. If scrutiny produces this, what would
            opposition produce?</p>
          <p class="ex in">I am not your enemy, Mr. Marx. The landowner is our shared enemy. But I will not build
            the gallows you propose to hang him with, because I know perfectly well who ends up on them.</p>
        </div>

        <!-- PAGE 9: Round 8 -->
        <div class="page-content" v-show="currentPage === 9">
          <p class="ex"><span class="spkr">Marx.</span> <em>(cold, deliberate &mdash; the anger compressed into
            precision.)</em> Let me make my strongest case without decoration. Capitalism in its final development
            &mdash; as it concentrates, as competition eliminates the small producer, as finance capital subsumes
            industrial capital &mdash; produces contradictions that accumulate beyond any corrective mechanism. The
            rate of profit falls. Capital seeks ever more desperate outlets. Imperialism, militarism, financial
            speculation &mdash; these are not aberrations. They are capitalism&rsquo;s terminal symptoms. No land
            tax administered by democratic vote will arrest this trajectory. The system has its own momentum and it
            leads where it leads.</p>
          <p class="ex"><span class="spkr">George.</span> <em>(with genuine seriousness.)</em> I want to take this
            seriously, because in one sense you are describing something real. The concentration, the
            financialisation, the desperate search for yield &mdash; these are real phenomena and they are
            worsening. Where I differ is in your identification of the engine driving them.</p>
          <p class="ex in">What you call the terminal contradictions of capitalism I recognise as the predictable
            behaviour of a system in which land value &mdash; the most fundamental form of unearned increment
            &mdash; has no outflow valve. Productivity rises. The gains flow to land. Land concentrates. Capital
            follows land into speculation rather than production. The productive economy starves. Finance fills the
            vacuum. You look at this process and conclude that capital itself is the cancer. I look at the same
            process and see land monopoly as the tumour causing every other system to malfunction.</p>
          <p class="ex in">The tragedy is that we may be running out of time to find out which of us is right. Your
            revolution will not permit the experiment. Mine, if implemented, would answer the question within a
            generation. I would rather be proven wrong by evidence than proven right by catastrophe.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(quietly; his most honest moment.)</em> You are not
            entirely wrong about the mechanism. But you are too optimistic about the willingness of democratic
            institutions &mdash; themselves captured by the very interests you propose to tax &mdash; to implement
            your remedy. The landowners will not vote themselves out of existence.</p>
          <p class="ex"><span class="spkr">George.</span> No. They will not. That is the most honest thing you have
            said to-day, and I respect you for saying it. The political challenge is real and I do not pretend
            otherwise. But your answer to the corruption of democratic institutions is to abolish them in favour of
            a revolutionary authority somehow immune to the same human tendencies that corrupt democracies. I cannot
            follow you there. I would rather spend my life fighting to make democracy work than spend it building the
            machinery of a state that history suggests will be turned against the very people it was built to
            serve.</p>
          <p class="ex in">We agree on more than either of us might like to admit. We disagree on the one question
            that matters most &mdash; how much we are willing to trust concentrated power.</p>
        </div>

        <!-- PAGE 10: Round 9 -->
        <div class="page-content" v-show="currentPage === 10">
          <p class="ex"><span class="spkr">George.</span> There is a question we have circled all evening without
            naming directly, and I think it lies beneath nearly every disagreement between us. It is not merely a
            question of economics. It is a question of knowledge.</p>
          <p class="ex in">Who knows enough to direct a society?</p>
          <p class="ex in">You speak often of rational co-ordination &mdash; of production organised consciously
            rather than through the chaos of markets. Very well. Let us examine what that requires. Somewhere,
            someone must decide: how many boots should be produced; where steel should be allocated; whether copper
            belongs in railroads or electrical wire; whether a thousand experimental ventures deserve financing or
            none at all. Under a free market, these decisions emerge from millions of independent judgements &mdash;
            messy, imperfect, often wasteful &mdash; but extraordinarily adaptive. Prices communicate information
            no ministry could ever fully gather. Failure eliminates bad judgement without requiring the collapse of
            the whole system.</p>
          <p class="ex in">Your alternative requires concentrated administration on a scale no civilisation has
            ever successfully sustained without hardening into bureaucracy.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(measured.)</em> You describe capitalism as though it
            were decentralised spontaneity. It is not. Modern industry is already planned internally. The railway
            company plans. The steel trust plans. Standard Oil plans. The market survives only at the boundaries
            between enormous organised structures. Capitalism itself is increasingly socialised in practice whilst
            remaining privately appropriated in profit.</p>
          <p class="ex in">The difference is that under capitalism these vast productive systems operate blindly
            toward profit rather than consciously toward human need.</p>
          <p class="ex"><span class="spkr">George.</span> That is an intelligent point, and partly true. Large
            organisations do indeed plan internally. But they operate within an external environment of competition,
            price discovery, and risk. A railway that allocates resources foolishly eventually fails. A ministry
            that allocates resources foolishly acquires a larger budget next year to correct the previous
            failure.</p>
          <p class="stage">(Scattered laughter from the audience.)</p>
          <p class="ex">And there is another distinction. A corporation may become powerful, but in principle it
            remains replaceable. New firms emerge. Old firms collapse. Technologies overturn empires. But a state
            granted comprehensive economic authority acquires something no private monopoly possesses: final legal
            force. The bureaucrat need not persuade the customer. He need only issue instructions.</p>
          <p class="ex"><span class="spkr">Marx.</span> Competition is hardly the benign corrective you describe.
            It duplicates effort wastefully, destroys smaller producers, produces periodic crises, and subjects the
            livelihood of millions to blind fluctuations no one controls. You praise adaptation; the worker
            experiences insecurity.</p>
          <p class="ex in">A rational society would not abolish expertise or administration. It would subordinate
            them to collective purpose rather than private accumulation.</p>
          <p class="ex"><span class="spkr">George.</span> And who defines the collective purpose?</p>
          <p class="ex in">That is the question to which every theory of benevolent administration eventually
            returns. The planner? The committee? The party congress? The educated class? Someone must decide &mdash;
            and once they possess the machinery to decide all major economic questions, they possess power far
            beyond anything medieval kings could imagine.</p>
          <p class="ex in">You believe concentrated economic power under private capital threatens liberty. On this
            we agree entirely. What I cannot understand is why you imagine the identical concentration of power
            becomes safe the moment we relabel it collective.</p>
          <p class="ex"><span class="spkr">Marx.</span> Because under socialism the structure itself changes.
            Production ceases to serve capital and begins to serve society as a whole.</p>
          <p class="ex"><span class="spkr">George.</span> That is an aspiration, not a mechanism.</p>
          <p class="stage">(A pause.)</p>
          <p class="ex">I think this may be where our temperaments differ most fundamentally.</p>
          <p class="ex in">You begin with justice and are willing to risk liberty to achieve it.</p>
          <p class="ex in">I begin with liberty because I do not trust any man &mdash; capitalist, landlord,
            bureaucrat, or revolutionary &mdash; with sufficient power to permanently direct the lives of millions
            according to his own conception of justice.</p>
          <p class="ex"><span class="spkr">Marx.</span> Liberty without material security is largely fictional for
            the working class.</p>
          <p class="ex"><span class="spkr">George.</span> True.</p>
          <p class="ex in">But security without liberty has a habit of becoming a prison administered for the
            prisoner&rsquo;s own good.</p>
          <p class="stage">(Silence settles briefly across the hall.)</p>
          <p class="ex">Perhaps this is the deepest disagreement between us. You fear disorder more than
            concentrated authority.</p>
          <p class="ex in">I fear concentrated authority more than disorder.</p>
          <p class="ex in">And history, I suspect, will spend the next century testing both fears to
            destruction.</p>
        </div>

        <!-- PAGE 11: Round 10 -->
        <div class="page-content" v-show="currentPage === 11">
          <p class="ex"><span class="spkr">George.</span> I want to step back from mechanism and speak about
            something more fundamental &mdash; the moral basis of what we each propose. What do human beings owe
            one another?</p>
          <p class="ex in">My answer is this: we owe each other equal access to the gifts of nature &mdash; the
            earth, which no man made &mdash; and beyond that, we owe each other the full product of our own labour
            and ingenuity. The earth belongs to all generations equally. Its rental value, properly collected, funds
            the common needs of civilisation &mdash; roads, schools, courts, the basic infrastructure of a
            functioning society. Everything above that belongs to whoever creates it. This is not charity. It is not
            redistribution. It is the precise separation of what is legitimately common from what is legitimately
            private.</p>
          <p class="ex"><span class="spkr">Marx.</span> The moral foundation of my system is simpler and I think
            more honest &mdash; that human beings should not exploit one another. That a man should not grow rich
            from the labour of others without contributing equivalent value. That the alienation produced by
            capitalism &mdash; the reduction of human beings to units of production, severed from the product of
            their work, from their communities, from their own nature &mdash; is a moral catastrophe that demands a
            moral response.</p>
          <p class="ex"><span class="spkr">George.</span> <em>(genuinely.)</em> On that &mdash; I agree with you
            completely. The alienation is real. The exploitation is real. The reduction of human beings to
            instruments of someone else&rsquo;s accumulation is a genuine moral catastrophe. We share the diagnosis
            entirely.</p>
          <p class="ex in">Where we part is here &mdash; you believe the solution requires the abolition of the
            market, collective ownership of production, and a transitional authority with power sufficient to remake
            the entire social order. I believe it requires one precise correction to the rules under which the
            market operates &mdash; a correction that would make genuine exploitation far harder to sustain whilst
            leaving the creative energy of free individuals entirely intact.</p>
          <p class="ex in">You want to rebuild the house from the foundation up. I want to fix the foundation and
            let the people who live there decide what they want to build.</p>
          <p class="ex"><span class="spkr">Marx.</span> And if the foundation cannot be fixed through the political
            means available to you?</p>
          <p class="ex"><span class="spkr">George.</span> Then I will spend my life trying anyway. Because the
            attempt costs far less than the alternative you propose &mdash; and the people most likely to pay that
            cost are the same workers whose liberation you promise. I would rather die having tried to make
            democracy deliver justice than succeed in making revolution deliver something worse.</p>
          <p class="stage">(A long silence.)</p>
        </div>

        <!-- PAGE 12: Round 11 -->
        <div class="page-content" v-show="currentPage === 12">
          <p class="ex"><span class="spkr">Marx.</span> Even if your land tax were implemented, workers do not
            control production. They remain subordinate to the capitalist who owns the factory, the machinery, the
            direction of labour. They produce wealth they do not own. This is the irreducible heart of alienation
            under capitalism &mdash; and no tax reform reaches it.</p>
          <p class="ex"><span class="spkr">George.</span> <em>(leaning forward, with quiet intensity.)</em> Here
            we reach the sharpest difference in how we view human co-operation &mdash; and I want to be precise,
            because I think you are conflating two very different things. I agree that the innovator and the
            capitalist should not grow rich merely by exploiting the worker. But the reverse is equally true. The
            man who conceives a great improvement &mdash; who organises thousands of moving details in his mind, who
            risks his reputation and his capital to bring a new machine or process into existence &mdash; is not a
            parasite on labour. He creates the very conditions under which labour becomes vastly more productive.
            Without his organisation, his risk, his vision, a hundred workers are a hundred individuals. With it,
            they become a functioning enterprise capable of producing something none of them could produce
            alone.</p>
          <p class="ex in">The worker who joins such an enterprise does not exploit the innovator by receiving
            wages. He benefits from ideas, organisation, and risk-taking he did not provide. And if he believes he
            can do it better &mdash; let him do what Mr. Tesla did when Mr. Edison refused to see what alternating
            current could become. Mr. Tesla did not seize Mr. Edison&rsquo;s laboratory. He left. He found partners.
            He competed. And the better idea won. That is the path of genuine progress &mdash; not collective
            seizure, but free exit and open competition.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(with rising impatience.)</em> This is the classic
            petty-bourgeois fantasy. Every worker a potential capitalist. Every man his own Edison. In practice,
            capital concentrates, workers remain wage labourers with no realistic path to independence, and the few
            Teslas who escape become the new exploiters. Your anecdote proves nothing about the mass condition.</p>
          <p class="ex"><span class="spkr">George.</span> And here is precisely where the Citizens&rsquo; Dividend
            transforms everything &mdash; and I want the room to understand this clearly, because it is the part of
            my proposal that gets least attention and deserves the most.</p>
          <p class="ex in">The land value tax does not merely fund government in the abstract. Its revenues belong
            to the community that created them &mdash; which means every citizen, equally, unconditionally, as a
            matter of right. Not as charity. Not as welfare dispensed by a ministry to the deserving poor after they
            have satisfied an inspector that they are sufficiently miserable. Every man, every woman, every child
            &mdash; a direct and equal dividend from the value of the common inheritance we call land.</p>
          <p class="ex in">Consider what this means in practice. The worker trapped in a miserable factory job now
            has a floor beneath him that no employer can remove. He can afford to refuse degrading terms. He can
            save. He can join with partners and form his own enterprise. He has the material foundation for genuine
            independence &mdash; not the theoretical collective ownership you offer, which in practice means he owns
            everything in name and controls nothing in fact, because the state that holds it in trust has an army
            and he does not.</p>
          <p class="ex"><span class="spkr">Marx.</span> A dividend from land tax revenues would be a pittance
            &mdash; wholly insufficient to liberate workers from wage dependency whilst leaving capital ownership
            entirely untouched. You offer them pocket-money and call it freedom.</p>
          <p class="ex"><span class="spkr">George.</span> <em>(firmly.)</em> The scale of land value in any
            advanced economy is not a pittance, Mr. Marx &mdash; it is enormous, and it grows precisely as
            civilisation grows, which is the entire point. But more importantly, notice what my system does not
            require. It requires no ministry to determine who deserves assistance. No caseworker to assess the
            worthiness of the recipient. No form in triplicate. No bureaucratic apparatus that, as your own
            observation about institutional capture correctly notes, inevitably becomes a tool of the interests it
            was designed to constrain.</p>
          <p class="ex in">The land value is assessed &mdash; transparently, locally, publicly. It is collected.
            It is divided equally among all citizens and distributed directly. A competent clerk could administer
            it. There is nothing for a corrupt official to dispense selectively, nothing for a political party to
            promise and withhold, nothing that requires the citizen to bow before an administrator to receive what
            is rightfully his.</p>
          <p class="ex in">You propose to solve the corruption of existing institutions by creating far more
            powerful institutions and trusting them to be uncorrupt. I propose a mechanism so simple and so
            universal that corruption has almost nothing to grip.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(with cold precision.)</em> And the factory owner who
            pays his land tax and his workers&rsquo; dividend still owns the factory. Still directs the labour.
            Still extracts surplus value from the difference between what labour produces and what labour receives.
            You have given the worker a slightly better hand to play. You have not changed the game.</p>
          <p class="ex"><span class="spkr">George.</span> <em>(meeting this squarely.)</em> You are right that I
            have not abolished the wage relationship. I have transformed its terms so fundamentally that your
            description of it becomes almost unrecognisable. A worker with a guaranteed floor, genuine savings
            capacity, and the practical ability to exit and compete is not the immiserated proletarian of your
            analysis. He is a free man making a choice. The capitalist who wishes to employ him must offer terms
            worth choosing.</p>
          <p class="ex in">And yes &mdash; the worker who believes he can run the operation better may now
            actually do so. Not by seizing the factory at gunpoint with the blessing of a revolutionary committee.
            By saving, by partnering, by building, by competing. Just as thousands of immigrants on these shores
            have done on a smaller scale, and just as Tesla did on a larger one.</p>
          <p class="ex in">Your system offers collective ownership in name whilst delivering state control in fact.
            Mine offers real liberty &mdash; the liberty to rise, to rival, or to remain as one chooses &mdash;
            without the ancient curse of land monopoly holding every choice hostage.</p>
          <p class="ex in">The difference between us, finally, is this. You do not trust free people to make good
            choices, so you propose to remove the choice. I trust that free people, given a genuinely fair
            foundation, will build something no committee could design and no commissar could improve upon.</p>
          <p class="stage">(Mr. Marx says nothing for a moment. It is the closest thing to silence he has produced
            all afternoon.)</p>
        </div>

        <!-- PAGE 13: Closing Statements -->
        <div class="page-content" v-show="currentPage === 13">
          <p class="ex"><span class="spkr">Marx.</span> The elegance of Mr. George&rsquo;s system is precisely its
            fatal weakness. It offers sufficient relief to pacify the worker, sufficient theoretical coherence to
            satisfy the reformer, and sufficient deference to existing property relations to reassure the capitalist
            &mdash; all whilst leaving the fundamental structure of exploitation intact. It is, whatever its
            intentions, a pressure valve designed to prevent the transformation that genuine justice requires.</p>
          <p class="ex in">I will concede &mdash; and I do not concede easily, as this audience has perhaps noticed
            &mdash; that Mr. George has identified a real mechanism. The land monopoly is not an invention. The
            siphon is real. The outflow valve is genuinely missing. On the diagnosis, we are closer than either of
            us would have predicted this morning.</p>
          <p class="ex in">But a correct partial diagnosis is not a cure. And a cure that leaves the deeper wound
            untouched is not liberation &mdash; it is a cleaner bandage.</p>
          <p class="ex in">I do not apologise for the difficulty of what I propose. History does not offer
            comfortable solutions to deep problems. The working class will be liberated &mdash; by its own struggle,
            through its own developing consciousness, on its own terms &mdash; or it will not be liberated at all.
            No benevolent tax reform administered by institutions the owning class controls will accomplish what
            only organised political power can.</p>
          <p class="ex in">I have called Mr. George names to-day that I perhaps should not have. He is not a fool
            and he is not an apologist &mdash; he is an honest man who has looked at real suffering and proposed a
            real remedy, and who has defended it with more composure than I have managed to attack it. That is a
            more formidable opponent than most I encounter, and I will give him that without reservation.</p>
          <p class="ex in">We are both, in the end, men who could not look at the condition of the poor and look
            away. History will judge which of us served them better. I hope, for their sake, that one of us was
            right.</p>
          <p class="ex"><span class="spkr">George.</span> My colleague ends more graciously than he debated, and I
            appreciate it more than he knows.</p>
          <p class="ex in">Here is what I ask of anyone in this room who has listened honestly. Look at the land
            beneath your feet in any great city. Watch who grows rich as that city grows &mdash; not the workers who
            build it, not the entrepreneurs who risk their capital and imagination, not the inventors who illuminate
            its streets. The landowner. The man who holds title to ground he did not make and cannot reproduce,
            whose value the entire community created simply by being there.</p>
          <p class="ex in">Tax that value. Return it to the community that created it. Free everything else
            &mdash; wages, profits, inventions, initiative &mdash; from taxation entirely.</p>
          <p class="ex in">And then &mdash; and this is what I want you to carry home to-night &mdash; do not give
            that returned value to a ministry. Do not route it through a committee or a caseworker or a party
            congress that will dispense it to the deserving after they have proved their misery to the satisfaction
            of an inspector. Give it directly to every man, woman, and child as an equal and unconditional share of
            the common inheritance. Not charity. Not welfare. A birthright. The community created that value &mdash;
            every member of the community receives it, simply for being here, simply for being human, with no form
            to fill and no official to satisfy and no revolutionary vanguard to thank.</p>
          <p class="ex in">The worker who receives that dividend is no longer a man who must accept whatever terms
            his employer dictates. He has a floor that no landlord can raise and no employer can remove. He can
            refuse. He can save. He can compete. He can build. And if he has an idea as luminous as Mr.
            Tesla&rsquo;s &mdash; he now has something to build it with.</p>
          <p class="ex in">Mr. Marx&rsquo;s observations about poverty and concentration are correct. His diagnosis
            of the cause is incomplete. And his prescription requires us to believe that power, once seized in the
            name of justice, will be exercised with justice and eventually surrendered. I have read enough history
            to know what that belief has cost, and will cost again.</p>
          <p class="ex in">I offer something less dramatic. A reform achievable through democratic means &mdash;
            imperfect, contested, slow &mdash; but humane. Not the destruction of the game, but a correction to its
            rules so fundamental that the game becomes, for the first time, genuinely fair.</p>
          <p class="ex in">Progress and poverty are not natural companions. They walk together only because we have
            built a system that taxes what men create and subsidises what they merely hold. That system is not
            inevitable. It is not natural. It is a choice &mdash; and it can be unchoosen.</p>
          <p class="ex in">Change that single thing, honestly and proportionally, and then step back.</p>
          <p class="ex in">Watch what free human beings build when the ground beneath them finally belongs to them
            all.</p>
          <div class="corr-rule"></div>
          <p class="corr-note"><em>The debate ends. Mr. Marx returns to his notes. He will write privately that
            Mr. George is &ldquo;the last attempt to save capitalist domination.&rdquo; He means it as an insult.
            History may judge it differently. Mr. George returns to New York. He will die ten years hence, the
            night before the 1897 mayoral election, still campaigning. Mr. Tesla, that same evening, is in his
            laboratory on Houston Street, coaxing electricity from the air &mdash; neither socialist nor Georgist,
            simply a free mind doing what free minds do when the conditions are right. History will test all three
            visions. The results are, as always, instructive &mdash; and not entirely settled.</em></p>
        </div>

      </div><!-- end .news-body -->

      <!-- ═══ PAGE NAVIGATION ═══ -->
      <div class="page-nav">
        <div class="pn-top-rule"></div>
        <div class="pn-row">
          <button class="pn-btn" @click="goTo(currentPage - 1)" :disabled="currentPage === 0">
            &larr; Prev. Column
          </button>
          <div class="pn-center">
            <div class="pn-label">The Standard &mdash; Column {{ currentPage + 1 }} of {{ totalPages }}</div>
            <div class="pn-dots">
              <span
                v-for="i in totalPages" :key="i"
                class="pn-dot"
                :class="{ active: i - 1 === currentPage }"
                @click="goTo(i - 1)"
                :title="pageLabels[i - 1]"
              ></span>
            </div>
          </div>
          <button class="pn-btn" @click="goTo(currentPage + 1)" :disabled="currentPage === totalPages - 1">
            Next Column &rarr;
          </button>
        </div>
        <div class="pn-bot-rule"></div>
      </div>

      <!-- Pull quotes — keyed to current page/round -->
      <div class="pull-strip">
        <div class="pull-q">
          &ldquo;{{ pageQuotes[currentPage].george }}&rdquo;
          <span class="attr">&mdash; Henry George, <em>{{ pageQuotes[currentPage].georgeSrc }}</em></span>
        </div>
        <div class="pull-rule"></div>
        <div class="pull-q">
          &ldquo;{{ pageQuotes[currentPage].marx }}&rdquo;
          <span class="attr">&mdash; Karl Marx, <em>{{ pageQuotes[currentPage].marxSrc }}</em></span>
        </div>
      </div>

      <div class="paper-footer">
        <p>Both were looking at the same wound. They disagreed about where the knife had entered.</p>
        <div class="footer-hr"></div>
        <p class="footer-fn"><em>This is a work of speculative fiction. The Standard is reproduced here as a literary
          conceit. The arguments belong to the historical record; the dramatic setting is imagined.</em></p>
        <div class="footer-hr"></div>
        <p class="footer-mast">The Standard &mdash; Henry George, Editor &mdash; New York, 1887</p>
      </div>

    </div><!-- end .newspaper -->
  </div>

  <Transition name="tts-slide">
    <div v-if="elError" class="tts-error-toast">
      {{ elError }}
      <button class="tts-err-close" @click="elError = ''">&#10005;</button>
    </div>
  </Transition>
  <Transition name="tts-slide">
    <div v-if="ttsState !== 'idle'" class="tts-player">
      <div class="tts-edition">&#9830;&ensp;The Standard &mdash; Audio Edition &mdash; Version I: The Generous Account</div>
      <div class="tts-now">
        <template v-if="ttsState === 'loading'">
          <span class="tts-loading">Preparing audio&hellip;</span>
        </template>
        <template v-else>
          <span class="tts-spkr" :class="ttsSpeaker">{{ ttsSpeaker === 'george' ? 'Mr. George' : 'Mr. Marx' }}</span>
          <span class="tts-line-text">&#8220;{{ ttsText.length > 100 ? ttsText.slice(0, 100) + '…' : ttsText }}&#8221;</span>
        </template>
      </div>
      <div class="tts-controls">
        <button class="tts-btn" @click="ttsTogglePause" :disabled="ttsState === 'loading'">
          {{ ttsState === 'paused' ? '&#9654; Resume' : ttsState === 'loading' ? '&hellip; Loading' : '&#9646;&#9646; Pause' }}
        </button>
        <button class="tts-btn tts-stop-btn" @click="ttsStop">&#9632; Stop</button>
        <span class="tts-progress">{{ ttsLineIdx + 1 }}&thinsp;/&thinsp;{{ ttsTotal }}</span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.np-wrapper {
  margin: -0.5rem -0.5rem 0;
  background: #b8a282;
  padding: 1rem 0.75rem 2rem;
}
.digital-bar {
  max-width: 860px; margin: 0 auto 0.6rem;
  display: flex; justify-content: space-between; align-items: center;
  font-size: 0.7rem; color: var(--color-text, #888);
}
.digital-label { font-style: italic; opacity: 0.75; }
.share-btn {
  border: 1px solid var(--color-border, #ccc); background: transparent;
  border-radius: 4px; padding: 0.2rem 0.55rem; cursor: pointer;
  font-size: 0.7rem; color: var(--color-text, inherit);
}
.share-menu {
  position: absolute; right: 0; top: calc(100% + 4px); min-width: 150px;
  border: 1px solid var(--color-border, #ccc); background: var(--color-background, #fff);
  border-radius: 6px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); padding: 0.2rem; z-index: 20;
}
.share-item {
  display: block; width: 100%; text-align: left; padding: 0.4rem 0.5rem;
  background: transparent; border: none; color: var(--color-text, inherit);
  text-decoration: none; cursor: pointer; border-radius: 4px; font-size: 0.75rem;
}
.share-item:hover { background: var(--color-background-soft, #f0f0f0); }

.newspaper {
  max-width: 860px; margin: 0 auto;
  background: #f6e9c8; color: #1a0e02;
  font-family: Georgia, 'Times New Roman', Times, serif;
  padding: 2rem 2.25rem 1.75rem;
  box-shadow: 0 6px 40px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.2);
  background-image: repeating-linear-gradient(to bottom, transparent 0px, transparent 24px,
    rgba(100,75,40,0.03) 24px, rgba(100,75,40,0.03) 25px);
}

/* Masthead */
.masthead { text-align: center; padding-bottom: 0.6rem; border-bottom: 3px double #4a3010; }
.mast-top-row {
  display: flex; justify-content: space-between; font-size: 0.67rem;
  font-variant: small-caps; letter-spacing: 0.07em; color: #5c3d10; margin-bottom: 0.4rem;
}
.mast-orn { color: #7a5c28; }
.mast-title {
  font-size: clamp(2.2rem, 6vw, 4.2rem); font-weight: 900; letter-spacing: 0.18em;
  text-transform: uppercase; line-height: 1; margin: 0.1rem 0; color: #0e0800;
}
.mast-founded { font-size: 0.72rem; font-variant: small-caps; letter-spacing: 0.1em; color: #5c3d10; margin: 0.15rem 0; }
.mast-motto { font-size: 0.68rem; font-style: italic; color: #6b4c1a; margin: 0.15rem 0; }
.mast-date { font-size: 0.72rem; font-variant: small-caps; letter-spacing: 0.09em; color: #2e1e06; margin: 0.2rem 0; }
.mast-supp {
  font-size: 0.63rem; font-variant: small-caps; letter-spacing: 0.07em; color: #6b4c1a;
  border-top: 1px solid #9b7d48; border-bottom: 1px solid #9b7d48; padding: 0.15rem 0; margin-top: 0.35rem;
}
.rule-dbl { border: none; border-top: 3px double #4a3010; margin: 0.5rem 0 0.3rem; }
.rule-sgl { border: none; border-top: 1px solid #9b7d48; margin: 0.4rem 0; }

/* Headline */
.hl-block { text-align: center; padding: 0.5rem 0 0.3rem; }
.hl-kicker-row {
  display: flex; align-items: center; justify-content: center; gap: 0.65rem;
  margin-bottom: 0.25rem;
}
.kicker { font-size: 0.65rem; font-variant: small-caps; letter-spacing: 0.14em; color: #6b4c1a; }
.hl-listen-btn {
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-variant: small-caps; font-size: 0.63rem; letter-spacing: 0.1em;
  background: transparent; border: 1px solid rgba(74,48,16,0.45); color: #4a3010;
  padding: 0.18rem 0.55rem; cursor: pointer; border-radius: 2px; flex-shrink: 0;
  transition: background 0.15s, border-color 0.15s;
}
.hl-listen-btn:hover, .hl-listen-active { background: rgba(74,48,16,0.12); border-color: #4a3010; }
.hl-main {
  font-size: clamp(1.15rem, 3vw, 1.75rem); font-weight: 700; font-variant: small-caps;
  letter-spacing: 0.09em; line-height: 1.2; color: #0e0800; margin: 0.1rem 0;
}
.hl-deck-1 { font-size: 0.82rem; font-variant: small-caps; letter-spacing: 0.05em; color: #4a3010; margin: 0.18rem 0 0; }

/* TTS player bar — fixed bottom */
.tts-player {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 1100;
  background: #0f0703; border-top: 2px solid #9b7d48;
  padding: 0.5rem 1.25rem 0.6rem;
  font-family: Georgia, 'Times New Roman', Times, serif;
  display: flex; flex-direction: column; gap: 0.28rem;
  box-shadow: 0 -4px 24px rgba(0,0,0,0.55);
}
.tts-edition { font-size: 0.58rem; font-variant: small-caps; letter-spacing: 0.13em; color: rgba(155,125,72,0.65); text-align: center; }
.tts-now { display: flex; align-items: baseline; gap: 0.55rem; flex-wrap: wrap; min-height: 1.3em; }
.tts-spkr { font-size: 0.68rem; font-variant: small-caps; font-weight: 700; letter-spacing: 0.14em; flex-shrink: 0; }
.tts-spkr.george { color: #c8a86a; }
.tts-spkr.marx   { color: #a06040; }
.tts-line-text { font-size: 0.71rem; font-style: italic; color: rgba(200,168,106,0.75); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
.tts-loading { font-size: 0.68rem; font-style: italic; letter-spacing: 0.08em; color: rgba(200,168,106,0.6); animation: tts-pulse 1.4s ease-in-out infinite; }
@keyframes tts-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
.tts-controls { display: flex; align-items: center; gap: 0.6rem; }
.tts-btn {
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-variant: small-caps; font-size: 0.65rem; letter-spacing: 0.1em;
  background: transparent; border: 1px solid rgba(155,125,72,0.45); color: #c8a86a;
  padding: 0.22rem 0.65rem; cursor: pointer; transition: background 0.15s;
}
.tts-btn:hover { background: rgba(155,125,72,0.12); }
.tts-btn:disabled { opacity: 0.4; cursor: default; }
.tts-stop-btn { border-color: rgba(160,96,64,0.5); color: #a06040; }
.tts-stop-btn:hover { background: rgba(160,96,64,0.12); }
.tts-progress { font-size: 0.6rem; font-variant: small-caps; letter-spacing: 0.08em; color: rgba(155,125,72,0.5); margin-left: auto; }
.tts-error-toast {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 1099;
  background: #3a1208; border-top: 1px solid rgba(160,64,48,0.6);
  color: #e07060; font-family: Georgia, 'Times New Roman', Times, serif;
  font-size: 0.71rem; font-style: italic; padding: 0.5rem 1.25rem;
  display: flex; align-items: center; justify-content: space-between;
}
.tts-err-close { background: transparent; border: none; color: rgba(160,96,80,0.7); font-size: 0.75rem; cursor: pointer; }
.tts-slide-enter-active, .tts-slide-leave-active { transition: transform 0.3s ease, opacity 0.3s ease; }
.tts-slide-enter-from, .tts-slide-leave-to { transform: translateY(100%); opacity: 0; }
@media (min-width: 640px) {
  .tts-player { flex-direction: row; align-items: center; gap: 1.2rem; flex-wrap: wrap; }
  .tts-edition { text-align: left; white-space: nowrap; }
  .tts-now { flex: 1; }
  .tts-controls { flex-shrink: 0; }
  .tts-progress { margin-left: 0; }
}

/* Version strip */
.ver-strip {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.25rem 0; border-top: 1px solid #9b7d48; border-bottom: 1px solid #9b7d48;
  margin: 0.3rem 0;
}
.ver-badge { font-size: 0.65rem; font-variant: small-caps; letter-spacing: 0.08em; color: #4a3010; }
.ver-link-btn {
  font-size: 0.65rem; font-variant: small-caps; letter-spacing: 0.06em;
  color: #4a3010; text-decoration: none; opacity: 0.75;
}
.ver-link-btn:hover { opacity: 1; text-decoration: underline; }

/* News body */
.news-body {
  column-count: 3; column-gap: 1.4rem; column-rule: 1px solid #b09468;
  text-align: justify; hyphens: auto; -webkit-hyphens: auto;
  font-size: 0.8rem; line-height: 1.58; color: #1a0e02;
  margin-top: 0.6rem; orphans: 3; widows: 3;
  transition: opacity 0.15s ease;
}
.news-body.is-transitioning { opacity: 0; }

/* Each page's content block — min-height gives sparse pages breathing room */
.page-content { min-height: 36rem; }
.page-content p { margin: 0 0 0.4rem; }

.drop-cap { float: left; font-size: 3.6em; line-height: 0.72; margin: 0.06em 0.07em 0 0; font-weight: 900; color: #0e0800; }
.place-date { font-variant: small-caps; font-weight: 700; letter-spacing: 0.04em; }
.dispatch-lead { margin-bottom: 0.5rem; }
.nav-hint { font-style: italic; font-size: 0.73rem; color: #9b7d48; text-align: center; }

.ex { margin: 0.25rem 0; text-indent: 0.8em; }
.ex.in { text-indent: 1.4em; }
.spkr { font-variant: small-caps; font-weight: 700; letter-spacing: 0.07em; color: #0e0800; }
.stage { font-style: italic; font-size: 0.74rem; color: #6b4c1a; text-align: center; margin: 0.35rem 0; text-indent: 0; }
.corr-rule { border-top: 1px solid #b09468; margin: 0.6rem 0 0.4rem; }
.corr-note { font-size: 0.76rem; color: #4a3010; text-indent: 0; margin-bottom: 0.4rem; }

/* Page navigation */
.page-nav { margin: 0.75rem 0 0; }
.pn-top-rule { border-top: 2px solid #4a3010; margin-bottom: 0.4rem; }
.pn-bot-rule { border-top: 1px solid #9b7d48; margin-top: 0.4rem; }
.pn-row { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
.pn-btn {
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-variant: small-caps; font-size: 0.7rem; letter-spacing: 0.08em;
  background: transparent; border: 1px solid #9b7d48; color: #4a3010;
  padding: 0.3rem 0.7rem; cursor: pointer; flex-shrink: 0;
  transition: background 0.15s;
}
.pn-btn:hover:not(:disabled) { background: rgba(74,48,16,0.1); }
.pn-btn:disabled { opacity: 0.3; cursor: default; }
.pn-center { text-align: center; flex: 1; }
.pn-label { font-variant: small-caps; font-size: 0.68rem; letter-spacing: 0.09em; color: #4a3010; margin-bottom: 0.3rem; }
.pn-dots { display: flex; justify-content: center; flex-wrap: wrap; gap: 0.3rem; }
.pn-dot {
  width: 7px; height: 7px; border-radius: 50%;
  border: 1px solid #9b7d48; background: transparent; cursor: pointer;
  transition: background 0.15s;
}
.pn-dot.active { background: #4a3010; border-color: #4a3010; }
.pn-dot:hover:not(.active) { background: rgba(74,48,16,0.25); }

/* Pull quotes */
.pull-strip {
  display: flex; align-items: center; gap: 1.25rem;
  border-top: 2px solid #4a3010; border-bottom: 2px solid #4a3010;
  padding: 0.7rem 0.5rem; margin: 0.8rem 0 0.6rem; background: rgba(74,48,16,0.04);
}
.pull-q { flex: 1; font-size: 0.83rem; font-style: italic; color: #2e1e06; text-align: center; line-height: 1.45; }
.attr { display: block; font-style: normal; font-variant: small-caps; font-size: 0.7rem; color: #6b4c1a; margin-top: 0.25rem; letter-spacing: 0.07em; }
.pull-rule { width: 1px; height: 56px; background: #9b7d48; flex-shrink: 0; }

/* Footer */
.paper-footer { border-top: 3px double #4a3010; padding-top: 0.65rem; font-size: 0.75rem; color: #4a3010; text-align: center; line-height: 1.5; }
.paper-footer p { margin: 0 0 0.35rem; }
.footer-hr { border: none; border-top: 1px solid #9b7d48; width: 55%; margin: 0.4rem auto; }
.footer-fn { font-style: italic; font-size: 0.68rem; color: #9b7d48; }
.footer-mast { font-variant: small-caps; letter-spacing: 0.1em; font-size: 0.68rem; color: #6b4c1a; }

@media (max-width: 760px) {
  .news-body { column-count: 2; }
  .newspaper { padding: 1.5rem 1.25rem; }
  .page-content { min-height: 20rem; }
}
@media (max-width: 480px) {
  .news-body { column-count: 1; text-align: left; hyphens: none; }
  .newspaper { padding: 1rem 0.9rem; }
  .np-wrapper { padding: 0.5rem 0.25rem 1.5rem; }
  .pull-strip { flex-direction: column; }
  .pull-rule { width: 55%; height: 1px; }
  .page-content { min-height: 0; }
  .pn-btn { padding: 0.3rem 0.4rem; font-size: 0.65rem; }
}
</style>