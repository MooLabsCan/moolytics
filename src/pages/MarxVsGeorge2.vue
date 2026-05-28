<script setup>
import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useTTS } from '../composables/useTTS.js'
import { debateV2, debateV2PageStarts, pageQuotes } from '../data/debateScript.js'
const props = defineProps({ lang: { type: String, default: 'en' }, id: { type: String, default: 'marx-vs-george-2' } })

const canonicalUrl = computed(() => `#/article/${props.id}`)
const fullUrl = computed(() => window.location.origin + window.location.pathname + canonicalUrl.value)
const shareTitle = 'The Great Debate: Marx vs. George — Version II: The Historical Record (The Standard, 1887)'
const shareText = 'A second, more historically faithful account of the 1887 debate — Marx as documented: dismissive, unfalsifiable, and finally silent.'

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
  'Round VIII — A Closed System',
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
function listenCurrentPage() { listenFrom(debateV2, debateV2PageStarts[currentPage.value]) }

watch(ttsLineIdx, (idx) => {
  if (ttsState.value === 'idle') return
  for (let p = debateV2PageStarts.length - 1; p >= 0; p--) {
    if (idx >= debateV2PageStarts[p]) {
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
  document.title = 'Marx vs. George: The Great Debate — The Historical Record | Moolytics'
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
        <div class="mast-supp">London Supplement &mdash; Version the Second: The Historical Record</div>
      </div>

      <div class="rule-dbl"></div>

      <!-- ═══ HEADLINE BLOCK (always shown) ═══ -->
      <div class="hl-block">
        <div class="hl-kicker-row">
          <div class="kicker">From Our Special London Correspondent &mdash; A Second Account &mdash; Column {{ currentPage + 1 }} of {{ totalPages }}</div>
          <button v-if="ttsReady" class="hl-listen-btn" :class="{ 'hl-listen-active': ttsState !== 'idle' }" @click="listenCurrentPage">&#9654; Listen</button>
        </div>
        <div class="hl-main">{{ pageLabels[currentPage] }}</div>
        <div class="hl-deck-1">Mr. Karl Marx &amp; Mr. Henry George &mdash; The Historical Record</div>
      </div>

      <!-- Version / nav strip -->
      <div class="ver-strip">
        <a href="#/article/marx-vs-george" class="ver-link-btn">&larr; Version I</a>
        <span class="ver-badge">Version II of II &mdash; The Historical Record</span>
        <a href="#/article/marx-george-intro" class="ver-link-btn">Introduction &rarr;</a>
      </div>

      <div class="rule-sgl"></div>

      <!-- ═══ PAGINATED CONTENT ═══ -->
      <div class="news-body" :class="{ 'is-transitioning': transitioning }">

        <!-- PAGE 0: Correspondent's Dispatch -->
        <div class="page-content" v-show="currentPage === 0">
          <div class="ver-notice">
            <div class="ver-head">&#9758;&ensp;Notice to Readers &mdash; Version II of II&ensp;&#9758;</div>
            <p>This account is the more faithful of the two. Where the first rendering portrays Mr. Marx as an ultimately
            generous interlocutor who concedes common ground at the evening&rsquo;s close, this account follows the
            documented pattern of his intellectual conduct: a man who, once he has categorised an opponent, ceases to
            engage him and begins instead to prosecute him.</p>
            <p class="ver-link"><a href="#/article/marx-vs-george">&larr; Read Version I: The Romanticised Account</a></p>
          </div>
          <p class="dispatch-lead"><span class="drop-cap">L</span><span class="place-date">ondon, Friday Evening.</span> &mdash;
            The Exchange Rooms in Pall Mall were filled to capacity this evening for the first, and one suspects the only,
            public meeting between Mr. Karl Marx and Mr. Henry George. Our first account of the proceedings, published
            alongside this one, presents the debate as it might ideally have unfolded between two men of equal intellectual
            generosity. This account presents it as it did.</p>
          <p>The opening hours were much as our first account describes. The men were sharp, the exchanges brisk, the
            audience attentive. It was after the midpoint of the evening that the character of the debate shifted &mdash;
            not in subject but in something harder to name and more consequential: the posture of the man behind one of the
            lecterns toward the man behind the other.</p>
          <p>What follows is the full transcript. The reader is asked to attend not only to what is said but to what is
            not, and to note when argument gives way to verdict.</p>
          <p class="nav-hint"><em>(Use the arrow keys or the buttons below to turn the page.)</em></p>
        </div>

        <!-- PAGE 1: Opening Statements -->
        <div class="page-content" v-show="currentPage === 1">
          <p class="ex"><span class="spkr">Marx.</span> The condition of the working class under capitalism is not an
            accident, nor a correctable inefficiency. It is the system functioning exactly as designed. The capitalist
            purchases labour power at its market value &mdash; subsistence &mdash; and extracts from it far more value
            than he returns. This surplus value is the engine of accumulation, the source of profit, and the mechanism of
            exploitation. As capital concentrates in fewer hands, as small producers are absorbed into the great industrial
            machine, the contradictions deepen. Crisis follows crisis. Poverty grows alongside wealth not despite progress,
            but because of it. The system cannot be reformed. It must be transcended.</p>
          <p class="ex"><span class="spkr">George.</span> I find myself in partial agreement with my colleague&rsquo;s
            observations about poverty growing alongside wealth &mdash; indeed that paradox is the central question of our
            age. But his diagnosis, I am afraid, mistakes the shadow for the substance. Look at any great city. Who
            captures the lion&rsquo;s share of that increasing wealth? Not the worker. Not the entrepreneur. Not the
            inventor. The landowner &mdash; the man who holds title to ground he did not make, whose value the entire
            community created simply by being there &mdash; that man grows rich in his sleep whilst the labourer grows
            poorer despite his toil. Tax the value of that land &mdash; and only that &mdash; and you remove the great
            siphon that drains progress of its promise.</p>
        </div>

        <!-- PAGE 2: Round 1 -->
        <div class="page-content" v-show="currentPage === 2">
          <p class="ex"><span class="spkr">George.</span> Look at the millions pouring into America from every corner of
            Europe &mdash; Irish fleeing famine, Germans fleeing Prussian bureaucracy, Italians fleeing centuries of
            aristocratic feudalism. What do they seek? Not your revolution, Mr. Marx. They seek land. They seek the right
            to work, build, and keep what they earn without paying tribute to a lord. And when they arrive and clear a
            farm with their own hands, build a small business in their neighbourhood, teach their children to read by
            lamp-light &mdash; that is not class struggle. That is the spontaneous order of free men and women expressing
            their highest nature.</p>
          <p class="ex in">America was the great experiment &mdash; proof that human beings, liberated from feudal
            arrangements, would create prosperity through voluntary co-operation and individual initiative. The tragedy is
            that we imported from the Old World precisely the thing these people were fleeing &mdash; the feudal notion
            that land can be held as private monopoly to extract tribute from all who need it. We took the energy of the
            freest people on earth and quietly installed the same pump that was bleeding them dry in the countries they
            escaped.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(composed, slightly sardonic.)</em> A moving portrait, Mr.
            George. But your immigrant who arrives full of hope quickly discovers the factory, the tenement, and the
            company store. He exchanges the landlord of the Old World for the industrialist of the New. The geography
            changes. The exploitation does not. Your American freedom is freedom for capital &mdash; not for labour.</p>
          <p class="ex"><span class="spkr">George.</span> And why do the tenements exist, Mr. Marx? Because the land
            beneath Manhattan is held off the market by speculators waiting for the labour of others to raise its value.
            Free that land through taxation of its value, and the market mechanisms you despise would themselves produce
            affordable housing, higher wages, and genuine opportunity. The immigrant does not need your revolution. He
            needs us to stop stealing the value he creates the moment he creates it.</p>
          <p class="ex"><span class="spkr">Marx.</span> The problem runs deeper than land tenure &mdash;</p>
          <p class="ex"><span class="spkr">George.</span> It always runs deeper with you. Every practical remedy is
            insufficient. Every concrete reform misses the true depth of the problem. Meanwhile the immigrant family
            sleeps six to a room.</p>
        </div>

        <!-- PAGE 3: Round 2 -->
        <div class="page-content" v-show="currentPage === 3">
          <p class="ex"><span class="spkr">Marx.</span> Let us be precise. My theory of surplus value demonstrates
            that exploitation is embedded in the wage relationship itself &mdash; not merely in land ownership. The worker
            produces, say, ten hours of value. The capitalist pays him for five. The remaining five &mdash; surplus value
            &mdash; is appropriated by the owner of capital. This occurs regardless of land arrangements. Your single tax
            leaves this mechanism entirely untouched.</p>
          <p class="ex"><span class="spkr">George.</span> <em>(nodding slowly.)</em> This is where you make your most
            serious point, and I want to engage it honestly rather than dismiss it. You are correct that the wage
            relationship contains real asymmetries of power. I do not pretend otherwise. Where we differ is in the cause
            and the remedy.</p>
          <p class="ex in">The capitalist&rsquo;s power over labour depends entirely on workers having no alternative.
            A man who must work or starve will accept almost any terms. But why must he work or starve? Because access to
            land &mdash; to the natural resource from which all wealth ultimately derives &mdash; has been monopolised. If
            land were freely accessible, or its rental value returned to the community, workers would have genuine
            alternatives. The bargaining position of labour would transform over-night. The capitalist who tried to pay
            subsistence wages would find his workers had options he could not control.</p>
          <p class="ex in">Your surplus value is real. But it flows from the land monopoly more than from capital itself.
            Fix the foundation, and the structure above it corrects naturally.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(a slight edge entering his voice.)</em> You ask a great deal
            of &ldquo;natural correction.&rdquo;</p>
          <p class="ex"><span class="spkr">George.</span> I ask a great deal less than you do of human nature when you
            hand it absolute power.</p>
        </div>

        <!-- PAGE 4: Round 3 -->
        <div class="page-content" v-show="currentPage === 4">
          <p class="ex"><span class="spkr">Marx.</span> The recurring crises of capitalism &mdash; the panics, the
            depressions, the factories standing idle whilst workers starve &mdash; are inherent contradictions. Capital
            accumulation leads to falling rates of profit. Overproduction becomes chronic. The working class cannot
            purchase what industry produces. These are objective contradictions that no tax can resolve.</p>
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
            without limit, absorbing productivity gains, concentrating in fewer hands, starving the productive
            economy of the purchasing power it need. Install the valve &mdash; tax the land value, return it to
            the community, and the engine runs cleanly. The crises you describe do not disappear because
            capitalism is transcended. They disappear because the design flaw is corrected.</p>
          <p class="ex in">Your observations are correct. Your diagnosis is wrong. And your prescription would kill
            the patient.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(stiffening.)</em> You reduce a systemic analysis of historic
            proportions to a plumbing metaphor &mdash;</p>
          <p class="ex"><span class="spkr">George.</span> I reduce it to something a working man can understand and vote
            for. You reduce it to something only a German philosopher can fully appreciate &mdash; conveniently
            enough.</p>
          <p class="stage">(Mild laughter from the audience. Mr. Marx&rsquo;s jaw tightens. Something shifts behind his
            eyes &mdash; not merely irritation, but the particular coldness of a man beginning to reassess not the
            argument but the arguer.)</p>
        </div>

        <!-- PAGE 5: Round 4 -->
        <div class="page-content" v-show="currentPage === 5">
          <p class="ex"><span class="spkr">Marx.</span> <em>(with controlled intensity.)</em> The capitalist system is
            not a patient with a single correctable ailment. It is diseased to its foundations. We must replace the
            failing organs with rational, collectively owned structures. Half-measures do not cure terminal disease.</p>
          <p class="ex"><span class="spkr">George.</span> You look at a living patient &mdash; imperfect, suffering, but
            breathing, producing, capable of extraordinary things &mdash; and declare the entire organism must be
            dismantled and rebuilt from rational principles, designed by men who have never built a business, grown a
            crop, or employed a neighbour. Your revolution is not surgery. It is execution &mdash; performed with great
            theoretical confidence and complete indifference to whether the patient survives. And the record of men who
            seize absolute power in the name of the people is not one that should inspire confidence in any honest
            observer.</p>
          <p class="ex in">The transition always requires something terrible, does it not? And it is always someone else
            who pays the price. The intellectuals who design the revolution rarely seem to be first against the
            wall.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(sharply.)</em> You are a sentimentalist who cannot see past
            his own provincial American optimism &mdash;</p>
          <p class="ex"><span class="spkr">George.</span> <em>(calmly, allowing the room to feel the outburst.)</em> I
            see that my colleague is growing agitated. I would ask him to note &mdash; for the benefit of the audience
            &mdash; that this is the man who proposes to concentrate all economic and political power in a revolutionary
            state. If the theory cannot survive scrutiny in a London lecture hall without this temperature rising, one
            wonders how it would manage the rather more demanding pressures of actually governing. The question of
            temperament is not entirely separate from the question of governance.</p>
          <p class="stage">(A pause. Mr. Marx says nothing. The reassessment behind his eyes is now complete. Mr. George
            is no longer an opponent to be answered. He is a problem to be categorised.)</p>
        </div>

        <!-- PAGE 6: Round 5 -->
        <div class="page-content" v-show="currentPage === 6">
          <p class="ex"><span class="spkr">George.</span> I believe in private property more fundamentally than most of
            its supposed defenders. A man who builds a house should own that house absolutely. A man who clears a farm
            should own its harvest completely. What I oppose is not property but privilege &mdash; the appropriation of
            value that the individual did not create. The land speculator who buys a city lot and waits for the
            surrounding community to make it valuable has not created that value. He has captured it. That is not property.
            That is a toll-booth erected on a road someone else built.</p>
          <p class="ex in">Your system, Mr. Marx, offers the workers something you call collective ownership &mdash; but a
            worker who cannot sell his stake, transfer it, or direct it according to his own judgement is not an owner. He
            is a serf with better slogans. The state becomes the ultimate landlord &mdash; and unlike the private
            landlord, it has an army.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(with a dismissive wave.)</em> The distinction between land
            and capital that you find so illuminating is a theoretical convenience that dissolves under serious
            examination. You have constructed a system that sounds radical &mdash; taxing the landlord &mdash; whilst
            leaving the factory owner, the financier, the entire apparatus of capital accumulation entirely untouched.</p>
          <p class="ex in">And this talk of property rights &mdash; <em>(a short, contemptuous sound)</em> &mdash; you
            dress feudal categories in liberal language and present it as liberation. Your system functions as a defence
            of capitalism with theatrical objections to its most visible abuses. Intentionally or otherwise &mdash; and I
            leave it to the audience to judge which.</p>
          <p class="stage">(A beat. The shift is now audible &mdash; from engagement to prosecution.)</p>
          <p class="ex"><span class="spkr">George.</span> <em>(quietly.)</em> You have just accused me of either stupidity
            or collaboration without evidence for either. That is a notable move, Mr. Marx. I have seen it before &mdash;
            when the argument becomes difficult, the arguer becomes suspect. I would invite you back to the substance, if
            you are willing.</p>
        </div>

        <!-- PAGE 7: Round 6 -->
        <div class="page-content" v-show="currentPage === 7">
          <p class="ex"><span class="spkr">George.</span> I want to address something that often gets lost in these
            discussions &mdash; the question of proportionality. My system is not a blunt instrument. Those who hold a
            small plot of land pay little. Those who speculate on vast tracts of urban land pay substantially. The farmer
            pays on the unimproved value of the land &mdash; modest in most cases &mdash; not on the value of his labour
            or his improvements. The factory owner pays no tax on his machinery, his inventory, or his profits. Only the
            value of the ground beneath him &mdash; value created by the community &mdash; is recaptured by the
            community.</p>
          <p class="ex in">This is not punishment of success. It is the precise opposite. It is the removal of a system
            that currently punishes success &mdash; taxing the wages of the worker, the profits of the entrepreneur, the
            returns of the investor &mdash; whilst rewarding the passive holder of appreciating land with an entirely
            unearned windfall.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(not engaging the proportionality argument &mdash;
            redirecting instead.)</em> What you describe as precision I would describe as deliberate limitation. You have
            designed a system that a certain class of liberal reformer finds palatable precisely because it does not
            threaten the fundamental relations of production. Capital remains private. Profit remains private. The wage
            relationship remains intact. You tax the landlord and call it a revolution while the mill owner reads your
            book and sleeps soundly.</p>
          <p class="ex in">I note also that you speak of democratic implementation as though the institutions through
            which your reform must pass are neutral arbiters. They are not. They are captured &mdash; thoroughly and
            deliberately &mdash; by the very interests your tax would threaten. The landowners will not legislate
            themselves out of existence. This is not a political obstacle to be overcome. It is a structural feature of
            class society.</p>
          <p class="ex"><span class="spkr">George.</span> That last point is genuinely true and I have said so myself.
            Democratic institutions are imperfect and subject to capture. Where we differ is in the remedy. You propose
            to solve the corruption of existing institutions by building far more powerful ones and trusting them to be
            uncorrupt. I propose a mechanism simple enough that corruption has very little to grip.</p>
          <p class="ex in">But I notice you did not engage the proportionality argument.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(with flat dismissal.)</em> Because it is a detail. I do not
            debate the calibration of a remedy I consider fundamentally misdirected.</p>
          <p class="ex"><span class="spkr">George.</span> <em>(to the audience, almost gently.)</em> He finds the details
            beneath him. This is worth remembering when he describes the society his ideas would build &mdash; a society
            that will consist, in practice, entirely of details administered by men who share his confidence that the
            broad vision excuses them from the specifics.</p>
        </div>

        <!-- PAGE 8: Round 7 -->
        <div class="page-content" v-show="currentPage === 8">
          <p class="ex"><span class="spkr">George.</span> Let me bring into this discussion a name we both know &mdash;
            Mr. Nikola Tesla. Here is a man born in Serbia, son of a clergyman, without inheritance or title or aristocratic
            connection. He came to America with almost nothing. And through the sheer force of his intellect &mdash;
            visualising complete machines in his mind before setting hand to metal &mdash; he is literally illuminating the
            world. Alternating current. The electrical system that lit the Columbian Exposition like a second sun.</p>
          <p class="ex in">This is what liberated human energy produces when it is not being drained by land rent,
            strangled by bureaucracy, or directed by central planners who know better. Tesla needed no commissar to tell
            him what to invent. He needed freedom, an environment that rewarded genius, and capital not wasted on
            speculation that could finance his work. Tax the land, free the capital, and you fund a thousand Teslas.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(with open contempt.)</em> Individual genius is a bourgeois
            myth constructed to justify inequality. Technological progress under capitalism does not liberate &mdash; it
            intensifies exploitation, replaces skilled labour with machinery, and concentrates profit among those who own
            the machines. Tesla&rsquo;s inventions will enrich Morgan and Westinghouse. The worker who installs the wiring
            will remain a wage labourer. You cite the exceptional case and pretend it describes the general condition.</p>
          <p class="ex"><span class="spkr">George.</span> The exceptional case exists precisely because the conditions for
            it existed. My argument is that those conditions should be available to everyone &mdash; not just the fortunate
            few who escape the gravity of land monopoly. You dismiss Tesla as a bourgeois myth. I see in him the proof of
            what becomes possible when a free mind is given a free environment. The tragedy is not Tesla. The tragedy is
            the thousand others whose equivalent potential dissolves into a rent payment every month.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(with rising contempt, an ugliness entering the tone.)</em>
            You are either deeply na&iuml;ve or deliberately obscuring the reality of how capital works. Tesla exists
            because Morgan found him useful. When he ceased to be useful, Morgan destroyed him. This is your free
            environment &mdash; a man&rsquo;s life&rsquo;s work subject to the whims of a financier. And you hold this up
            as the model for human flourishing?</p>
          <p class="ex in">Your entire philosophy is the philosophy of a man who has never had to choose between his rent
            and his dinner. You theorise liberty from a comfortable distance while the working class lives the reality your
            theories ignore.</p>
          <p class="ex"><span class="spkr">George.</span> <em>(with quiet precision, a stillness that commands the
            room.)</em> Mr. Marx. I was a typesetter at fourteen. I nearly starved in San Francisco. I wrote <em>Progress
            and Poverty</em> by lamp-light after my children were in bed because I could not afford a proper desk during
            the day. I have not theorised poverty from a comfortable distance. I have lived it, and I have spent my life
            trying to understand it honestly enough to remedy it.</p>
          <p class="ex in">You have now questioned my motives, my class position, my intelligence, and my honesty. You
            have not, in the last three rounds, engaged a single specific argument I have made.</p>
          <p class="ex in">I think the audience has noticed.</p>
          <p class="stage">(Silence. Mr. Marx&rsquo;s expression is not chastened. It is the expression of a man who has
            reclassified his opponent and considers the reclassification final.)</p>
        </div>

        <!-- PAGE 9: Round 8 -->
        <div class="page-content" v-show="currentPage === 9">
          <p class="ex"><span class="spkr">Marx.</span> <em>(with cold, deliberate control &mdash; the anger compressed
            into ideology.)</em> Capitalism in its final development &mdash; as it concentrates, as competition
            eliminates the small producer, as finance capital subsumes industrial capital &mdash; produces contradictions
            that accumulate beyond any corrective mechanism. The rate of profit falls. Capital seeks ever more desperate
            outlets. Imperialism, militarism, financial speculation &mdash; these are not aberrations. They are
            capitalism&rsquo;s terminal symptoms. No land tax administered by democratic vote will arrest this trajectory.
            The system has its own momentum and it leads where it leads.</p>
          <p class="ex in">Mr. George may dress this diagnosis in his own language. He may call the outflow valve missing.
            The label does not matter. What matters is that the trajectory cannot be corrected from within. And any theory
            that claims otherwise &mdash; however sincerely held &mdash; functions objectively as a defence of the status
            quo regardless of its intentions.</p>
          <p class="ex"><span class="spkr">George.</span> <em>(noting the move with visible clarity.)</em> You just did
            something I want the room to observe carefully. You acknowledged &mdash; indirectly, in the language of
            <em>&ldquo;he may call it&rdquo;</em> &mdash; that the mechanism I describe is real. And then immediately you
            pivoted to the claim that regardless of whether I am correct, my theory <em>functions</em> as a defence of
            capitalism.</p>
          <p class="ex in">Do you hear what that argument is? It is not an engagement with whether I am right. It is a
            verdict on what my being right would mean for your framework. And since your framework cannot accommodate my
            being right, I must be &mdash; whatever my intentions &mdash; in service of the enemy.</p>
          <p class="ex in">This is not analysis. This is a closed system protecting itself from evidence.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(with cold finality.)</em> The objective function of a theory
            is not determined by the intentions of its author. A reform that stabilises capitalism serves capitalism. This
            is not a personal accusation. It is a structural observation.</p>
          <p class="ex"><span class="spkr">George.</span> It is a remarkable intellectual manoeuvre. It means you cannot
            be wrong &mdash; because any evidence against you is reclassified as proof of the corruption of whoever
            presents it. I have seen religious systems with the same architecture. They are very comfortable to inhabit
            and very difficult to reason with from outside.</p>
        </div>

        <!-- PAGE 10: Round 9 -->
        <div class="page-content" v-show="currentPage === 10">
          <p class="ex"><span class="spkr">George.</span> There is a question we have circled all evening. Who knows
            enough to direct a society? Someone must decide how many boots should be produced; where steel should be
            allocated; whether copper belongs in railroads or electrical wire. Under a free market, these decisions emerge
            from millions of independent judgements &mdash; messy, imperfect, but extraordinarily adaptive. Prices
            communicate information no ministry could ever fully gather. Your alternative requires concentrated
            administration on a scale no civilisation has successfully sustained without hardening into bureaucracy, and
            eventually into something considerably worse.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(with the tone of a man who has stopped finding the
            conversation worth having.)</em> You describe capitalism as spontaneous decentralised wisdom. It is not.
            Modern industry is already planned &mdash; internally, deliberately, at enormous scale. The railway plans.
            The trust plans. Standard Oil plans. Your celebrated price system operates at the margins between vast
            organised structures that already resemble, in their internal co-ordination, exactly what you claim is
            impossible.</p>
          <p class="ex in">The difference is that under capitalism these structures serve private accumulation. Under
            socialism they would serve human need. You conflate the question of <em>whether</em> co-ordination is
            possible with the question of <em>whose interests</em> it serves.</p>
          <p class="ex"><span class="spkr">George.</span> That is a real point, and I have engaged it honestly in
            previous rounds. I notice you were not present for those rounds &mdash; or rather, you were present but
            occupied with other concerns. The question of whose interests co-ordination serves is important. But it
            does not answer the question of who decides. Under your system, the decision about human need is made by
            whoever controls the co-ordinating apparatus. You have not solved the problem of power. You have
            concentrated it and renamed it.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(dismissively, barely looking at Mr. George now.)</em> This
            is the standard liberal objection. I have answered it in my published work. I do not propose to rehearse
            three volumes in a single evening for the benefit of an audience that could read them.</p>
          <p class="ex"><span class="spkr">George.</span> <em>(to the audience, with a calm that is now almost
            sorrowful.)</em> He has referred us to his books. This is what happens when the argument runs out &mdash; the
            conversation is closed and the bibliography is opened. I have read the books, Mr. Marx. My questions emerge
            from having read them carefully, not from ignorance of them. But perhaps that is the problem. You are more
            comfortable with readers than with interlocutors.</p>
        </div>

        <!-- PAGE 11: Round 10 -->
        <div class="page-content" v-show="currentPage === 11">
          <p class="ex"><span class="spkr">George.</span> I want to step back from mechanism and speak about something
            more fundamental &mdash; the moral basis of what we each propose. What do human beings owe one another?</p>
          <p class="ex in">My answer is this: we owe each other equal access to the gifts of nature &mdash; the earth,
            which no man made &mdash; and beyond that, we owe each other the full product of our own labour and ingenuity.
            The earth belongs to all generations equally. Its rental value, properly collected, funds the common needs of
            civilisation. Everything above that belongs to whoever creates it. This is not charity. It is not
            redistribution. It is the precise separation of what is legitimately common from what is legitimately
            private.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(with the flat affect of a man delivering a verdict rather
            than making an argument.)</em> The moral foundation you describe is the moral foundation of liberalism &mdash;
            the sanctity of individual property, the neutrality of rules, the fantasy that a corrected market produces
            just outcomes. It is the morality of the bourgeoisie dressed in the language of natural law.</p>
          <p class="ex in">Human beings owe each other freedom from exploitation. Full stop. Not corrected exploitation.
            Not more proportionate exploitation. Freedom from it. Your system delivers neither.</p>
          <p class="ex"><span class="spkr">George.</span> <em>(genuinely.)</em> I agree that human beings owe each other
            freedom from exploitation. We share that conviction entirely. Where we differ is in whether your proposed
            mechanism delivers it or produces something worse under the same name.</p>
          <p class="ex in">You have spent this evening categorising my motives, dismissing my evidence, and retreating to
            your published work when pressed. I do not say this with bitterness. I say it because it is relevant to the
            moral question you just raised. A man who cannot engage disagreement honestly in a lecture hall is not
            describing a different kind of exploitation. He is demonstrating the temperament that makes exploitation
            inevitable regardless of the system&rsquo;s name.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(with cold contempt.)</em> Psychologising the opponent is the
            last refuge of a man who has lost the argument.</p>
          <p class="ex"><span class="spkr">George.</span> <em>(quietly.)</em> And dismissing the observation as
            psychologising is the last refuge of a man who knows it landed.</p>
        </div>

        <!-- PAGE 12: Round 11 -->
        <div class="page-content" v-show="currentPage === 12">
          <p class="ex"><span class="spkr">Marx.</span> Even if your land tax were implemented, workers do not control
            production. They remain subordinate to the capitalist who owns the factory, the machinery, the direction of
            labour. They produce wealth they do not own. This is the irreducible heart of alienation under capitalism
            &mdash; and no tax reform reaches it.</p>
          <p class="ex"><span class="spkr">George.</span> <em>(with quiet intensity.)</em> The man who conceives a great
            improvement &mdash; who organises thousands of moving details in his mind, who risks his reputation and his
            capital &mdash; is not a parasite on labour. He creates the very conditions under which labour becomes vastly
            more productive. And if the worker believes he can do it better, let him do what Mr. Tesla did when Mr. Edison
            refused to see what alternating current could become. Mr. Tesla did not seize Mr. Edison&rsquo;s laboratory.
            He left. He found partners. He competed. And the better idea won.</p>
          <p class="ex in">But here is what transforms the calculus entirely &mdash; and I want the room to understand
            this clearly, because it is the part of my proposal that receives least attention and deserves the most.</p>
          <p class="ex in">The land value tax does not merely fund government in the abstract. Its revenues belong to
            the community that created them &mdash; every citizen, equally, unconditionally, as a matter of right. Not
            charity. Not welfare dispensed by a ministry to the deserving poor after they have satisfied an inspector.
            Every man, woman, and child &mdash; a direct and equal dividend from the value of the common inheritance we
            call land.</p>
          <p class="ex in">The worker trapped in a miserable factory now has a floor beneath him that no employer can
            remove. He can refuse degrading terms. He can save. He can compete. He has material independence &mdash; not
            the theoretical collective ownership you offer, which in practice means he owns everything in name and controls
            nothing in fact.</p>
          <p class="ex in">And notice what this requires. No ministry to determine who deserves assistance. No caseworker.
            No form in triplicate. No bureaucratic apparatus that &mdash; as your own observations about institutional
            capture correctly note &mdash; inevitably becomes a tool of the interests it was designed to constrain. The
            land value is assessed transparently, collected, and distributed equally and directly. A competent clerk could
            administer it. There is nothing for a corrupt official to dispense selectively. Nothing that requires the
            citizen to bow before an administrator to receive what is rightfully his.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(with flat dismissal.)</em> A dividend from land tax revenues
            is a bribe &mdash; sufficient to purchase the worker&rsquo;s political acquiescence whilst leaving the
            structure of his exploitation entirely intact. You have adjusted the amount of the theft. You have not ended
            it.</p>
          <p class="ex"><span class="spkr">George.</span> A worker with a guaranteed income floor and the practical
            ability to exit and compete is not the immiserated proletarian of your analysis. He is a free man making a
            genuine choice. You call his dividend a bribe. I call it the difference between a man who must accept whatever
            he is offered and a man who can walk away.</p>
          <p class="ex in">You do not want him to be able to walk away. Because a worker who can walk away does not need
            your revolution.</p>
          <p class="stage">(Mr. Marx&rsquo;s expression does not change. He has heard nothing in the last four rounds that
            he considers worth answering. The categorisation was made in Round Four and it was final.)</p>
        </div>

        <!-- PAGE 13: Closing Statements -->
        <div class="page-content" v-show="currentPage === 13">
          <p class="ex"><span class="spkr">Marx.</span> Mr. George has spoken this evening with considerable fluency on
            behalf of a position that serves, whatever its intentions, the interests of those who benefit most from the
            current order. His land tax leaves capital untouched. His citizens&rsquo; dividend stabilises the wage
            relationship by making it marginally more tolerable. His faith in democratic reform ignores the structural
            capture of democratic institutions by the class whose power those institutions exist to protect.</p>
          <p class="ex in">He is not a stupid man. He is something more useful to the owning class than a stupid man
            &mdash; he is a sincere one. A sincere reformer who draws the line precisely at the point where genuine
            transformation would begin is more effective at preventing that transformation than any open defender of the
            status quo. The working class that reads George and feels that something has been done on their behalf is a
            working class that will not organise for the change that would actually free them.</p>
          <p class="ex in">I do not expect Mr. George to agree. I do not, at this point, expect him to understand. His
            framework does not permit it.</p>
          <p class="ex in">The working class will be liberated through its own struggle and its own developing
            consciousness &mdash; or it will not be liberated at all. History moves where it moves. No tax reform
            administered by captured institutions will alter its trajectory. What I have proposed this evening is not
            comfortable. It was never meant to be. Genuine transformation never is.</p>
          <p class="stage">(He gathers his papers. He does not look at Mr. George.)</p>
          <p class="ex"><span class="spkr">George.</span> <em>(a long pause before he speaks &mdash; not for effect, but
            because he is choosing his words with unusual care.)</em> My colleague has just delivered a closing statement
            in which he did not engage a single argument I made this evening. He described what my ideas <em>function
            as</em> rather than whether they are correct. He explained my sincerity as a form of usefulness to my supposed
            masters. He ended without looking at me.</p>
          <p class="ex in">I want to name what this is, because I think it matters beyond this evening.</p>
          <p class="ex in">What Mr. Marx has demonstrated to-day &mdash; with increasing clarity as the afternoon wore on
            &mdash; is a system of thought that is impervious to evidence. Not because the evidence does not exist, but
            because the framework converts all contrary evidence into proof of the framework. If you agree with him, you
            are class conscious. If you disagree, you are captured, na&iuml;ve, or complicit. If you point this out, you
            are psychologising. If you persist, you are an objective defender of capitalism regardless of what you
            actually believe or argue.</p>
          <p class="ex in">This is not a political philosophy. It is a closed epistemological system &mdash; and it is
            worth understanding as such, because it is extraordinarily resilient to rational engagement, and
            extraordinarily dangerous when it acquires the power it seeks.</p>
          <p class="ex in">I have spent this evening trying to have an honest conversation with a brilliant man about a
            real problem. I believe the land monopoly is the root of the poverty that surrounds us. I believe the
            Citizens&rsquo; Dividend &mdash; universal, unconditional, administered simply enough that corruption has
            nothing to grip &mdash; would transform the material conditions of every working person in this country within
            a generation. I believe these things on the basis of evidence and reasoning I have presented openly and
            defended honestly.</p>
          <p class="ex in">Mr. Marx believes I am wrong. He may be right. But he has not argued it to-night. He has
            prosecuted it.</p>
          <p class="ex in">I leave the audience to draw their own conclusions &mdash; not about who won a debate, but
            about what it means when a man who cannot tolerate questioning in a London lecture hall proposes to build a
            state with no exits.</p>
          <p class="ex in">Progress and poverty are not natural companions. They walk together only because we have built
            a world that taxes what men create and subsidises what they merely hold. That world is not inevitable. It is
            not natural. It is a choice.</p>
          <p class="ex in">And it can be unchoosen &mdash; through democratic means, imperfect and slow, without a
            vanguard, without a transitional dictatorship, without asking anyone to trust that power will be surrendered
            once it is held.</p>
          <p class="ex in">Simply by being honest about who created what.</p>
          <p class="stage">(He does not look to Mr. Marx for a response. None is forthcoming.)</p>
          <div class="corr-rule"></div>
          <p class="corr-note">The debate ends. Mr. Marx writes to Engels the following week. He describes Mr. George as
            &ldquo;capitalism&rsquo;s last ideological defence dressed in the language of reform.&rdquo; He does not
            mention the arguments Mr. George made. He does not mention the Citizens&rsquo; Dividend. He does not mention
            the moment the room went silent when Mr. George quietly listed his biography. He mentions, briefly, that
            George was more difficult than expected. It is the closest thing to a concession he will ever make.</p>
          <p class="corr-note">Mr. George returns to New York. He will die ten days before the 1897 mayoral election,
            still campaigning, still convinced that democracy can deliver what revolution cannot.</p>
          <p class="corr-note">Mr. Tesla, that evening, is in his laboratory on Houston Street, coaxing electricity from
            the air, aware of neither man, indebted to the conditions both were trying, in their different ways, to
            create.</p>
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
          conceit. The setting and dramatic framing are imagined; the arguments and documented temperaments belong to
          the historical record.</em></p>
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
      <div class="tts-edition">&#9830;&ensp;The Standard &mdash; Audio Edition &mdash; Version II: The Historical Record</div>
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
  background: #9a8060;
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

/* Newspaper — slightly cooler tint than V1 */
.newspaper {
  max-width: 860px; margin: 0 auto;
  background: #f0e4c0; color: #140c00;
  font-family: Georgia, 'Times New Roman', Times, serif;
  padding: 2rem 2.25rem 1.75rem;
  box-shadow: 0 6px 40px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.25);
  background-image: repeating-linear-gradient(
    to bottom, transparent 0px, transparent 24px,
    rgba(80,55,20,0.03) 24px, rgba(80,55,20,0.03) 25px
  );
}

/* Masthead */
.masthead { text-align: center; padding-bottom: 0.6rem; border-bottom: 3px double #3a2008; }
.mast-top-row {
  display: flex; justify-content: space-between; font-size: 0.67rem;
  font-variant: small-caps; letter-spacing: 0.07em; color: #503010; margin-bottom: 0.4rem;
}
.mast-orn { color: #6a4c18; }
.mast-title {
  font-size: clamp(2.2rem, 6vw, 4.2rem); font-weight: 900; letter-spacing: 0.18em;
  text-transform: uppercase; line-height: 1; margin: 0.1rem 0; color: #080400;
}
.mast-founded { font-size: 0.72rem; font-variant: small-caps; letter-spacing: 0.1em; color: #503010; margin: 0.15rem 0; }
.mast-motto { font-size: 0.68rem; font-style: italic; color: #5c3c10; margin: 0.15rem 0; }
.mast-date { font-size: 0.72rem; font-variant: small-caps; letter-spacing: 0.09em; color: #241400; margin: 0.2rem 0; }
.mast-supp {
  font-size: 0.63rem; font-variant: small-caps; letter-spacing: 0.07em; color: #8b3010;
  border-top: 1px solid #9b7d48; border-bottom: 1px solid #9b7d48;
  padding: 0.15rem 0; margin-top: 0.35rem; font-weight: 700;
}

.rule-dbl { border: none; border-top: 3px double #3a2008; margin: 0.5rem 0 0.3rem; }
.rule-sgl { border: none; border-top: 1px solid #9b7d48; margin: 0.4rem 0; }

/* Headline */
.hl-block { text-align: center; padding: 0.5rem 0 0.3rem; }
.hl-kicker-row {
  display: flex; align-items: center; justify-content: center; gap: 0.65rem;
  margin-bottom: 0.25rem;
}
.kicker { font-size: 0.65rem; font-variant: small-caps; letter-spacing: 0.14em; color: #8b3010; }
.hl-listen-btn {
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-variant: small-caps; font-size: 0.63rem; letter-spacing: 0.1em;
  background: transparent; border: 1px solid rgba(58,32,8,0.45); color: #3a2008;
  padding: 0.18rem 0.55rem; cursor: pointer; border-radius: 2px; flex-shrink: 0;
  transition: background 0.15s, border-color 0.15s;
}
.hl-listen-btn:hover, .hl-listen-active { background: rgba(58,32,8,0.12); border-color: #3a2008; }
.hl-main {
  font-size: clamp(1.15rem, 3vw, 1.75rem); font-weight: 700; font-variant: small-caps;
  letter-spacing: 0.09em; line-height: 1.2; color: #080400; margin: 0.1rem 0;
}
.hl-deck-1 { font-size: 0.82rem; font-variant: small-caps; letter-spacing: 0.05em; color: #3a2008; margin: 0.18rem 0 0; }

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
.ver-badge { font-size: 0.65rem; font-variant: small-caps; letter-spacing: 0.08em; color: #3a2008; }
.ver-link-btn {
  font-size: 0.65rem; font-variant: small-caps; letter-spacing: 0.06em;
  color: #3a2008; text-decoration: none; opacity: 0.75;
}
.ver-link-btn:hover { opacity: 1; text-decoration: underline; }

/* News body */
.news-body {
  column-count: 3; column-gap: 1.4rem; column-rule: 1px solid #b09468;
  text-align: justify; hyphens: auto; -webkit-hyphens: auto;
  font-size: 0.8rem; line-height: 1.58; color: #140c00;
  margin-top: 0.6rem; orphans: 3; widows: 3;
  transition: opacity 0.15s ease;
}
.news-body.is-transitioning { opacity: 0; }

/* Version notice on page 0 — spans all columns */
.ver-notice {
  column-span: all;
  border: 2px solid #3a2008; padding: 0.55rem 1rem 0.45rem;
  margin-bottom: 0.8rem; background: rgba(58,32,8,0.05); text-align: center;
}
.ver-head {
  font-variant: small-caps; font-size: 0.72rem; letter-spacing: 0.12em;
  font-weight: 700; color: #3a2008; margin-bottom: 0.25rem;
}
.ver-notice p {
  font-size: 0.73rem; font-style: italic; color: #3a2008;
  margin: 0.15rem 0; text-align: center;
}
.ver-link a {
  color: #3a2008; font-variant: small-caps; letter-spacing: 0.06em;
  font-style: normal; text-decoration: underline;
}

.page-content { min-height: 36rem; }
.page-content p { margin: 0 0 0.4rem; }

.drop-cap { float: left; font-size: 3.6em; line-height: 0.72; margin: 0.06em 0.07em 0 0; font-weight: 900; color: #080400; }
.place-date { font-variant: small-caps; font-weight: 700; letter-spacing: 0.04em; }
.dispatch-lead { margin-bottom: 0.5rem; }
.nav-hint { font-style: italic; font-size: 0.73rem; color: #9b7d48; text-align: center; }

.ex { margin: 0.25rem 0; text-indent: 0.8em; }
.ex.in { text-indent: 1.4em; }
.spkr { font-variant: small-caps; font-weight: 700; letter-spacing: 0.07em; color: #080400; }
.stage { font-style: italic; font-size: 0.74rem; color: #5c3c10; text-align: center; margin: 0.35rem 0; text-indent: 0; }
.corr-rule { border-top: 1px solid #b09468; margin: 0.6rem 0 0.4rem; }
.corr-note { font-style: italic; font-size: 0.76rem; color: #3a2008; text-indent: 0; margin-bottom: 0.4rem; }

/* Page navigation */
.page-nav { margin: 0.75rem 0 0; }
.pn-top-rule { border-top: 2px solid #3a2008; margin-bottom: 0.4rem; }
.pn-bot-rule { border-top: 1px solid #9b7d48; margin-top: 0.4rem; }
.pn-row { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
.pn-btn {
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-variant: small-caps; font-size: 0.7rem; letter-spacing: 0.08em;
  background: transparent; border: 1px solid #9b7d48; color: #3a2008;
  padding: 0.3rem 0.7rem; cursor: pointer; flex-shrink: 0;
  transition: background 0.15s;
}
.pn-btn:hover:not(:disabled) { background: rgba(58,32,8,0.1); }
.pn-btn:disabled { opacity: 0.3; cursor: default; }
.pn-center { text-align: center; flex: 1; }
.pn-label { font-variant: small-caps; font-size: 0.68rem; letter-spacing: 0.09em; color: #3a2008; margin-bottom: 0.3rem; }
.pn-dots { display: flex; justify-content: center; flex-wrap: wrap; gap: 0.3rem; }
.pn-dot {
  width: 7px; height: 7px; border-radius: 50%;
  border: 1px solid #9b7d48; background: transparent; cursor: pointer;
  transition: background 0.15s;
}
.pn-dot.active { background: #3a2008; border-color: #3a2008; }
.pn-dot:hover:not(.active) { background: rgba(58,32,8,0.25); }

/* Verdict strip */
.verdict-strip {
  border-top: 3px double #3a2008; border-bottom: 3px double #3a2008;
  padding: 0.75rem 1rem; margin: 0.8rem 0 0.6rem;
  text-align: center; background: rgba(58,32,8,0.04);
}
.verdict-line { font-size: 0.85rem; font-style: italic; color: #241400; margin: 0.2rem 0; line-height: 1.5; }
.verdict-stark {
  font-variant: small-caps; font-style: normal; font-weight: 700;
  font-size: 0.9rem; letter-spacing: 0.06em; color: #3a2008;
}

/* Pull quotes */
.pull-strip {
  display: flex; align-items: center; gap: 1.25rem;
  border-top: 1px solid #9b7d48; border-bottom: 1px solid #9b7d48;
  padding: 0.65rem 0.5rem; margin-bottom: 0.6rem;
}
.pull-q { flex: 1; font-size: 0.82rem; font-style: italic; color: #241400; text-align: center; line-height: 1.45; }
.attr { display: block; font-style: normal; font-variant: small-caps; font-size: 0.68rem; color: #5c3c10; margin-top: 0.25rem; letter-spacing: 0.07em; }
.pull-rule { width: 1px; height: 56px; background: #9b7d48; flex-shrink: 0; }

/* Footer */
.paper-footer { border-top: 3px double #3a2008; padding-top: 0.65rem; font-size: 0.75rem; color: #3a2008; text-align: center; line-height: 1.5; }
.paper-footer p { margin: 0 0 0.35rem; }
.footer-hr { border: none; border-top: 1px solid #9b7d48; width: 55%; margin: 0.4rem auto; }
.footer-fn { font-style: italic; font-size: 0.68rem; color: #9b7d48; }
.footer-mast { font-variant: small-caps; letter-spacing: 0.1em; font-size: 0.68rem; color: #5c3c10; }

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