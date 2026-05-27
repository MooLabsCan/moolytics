<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
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
  currentPage.value = n
  npRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function handleKey(e) {
  if (e.key === 'ArrowRight') goTo(currentPage.value + 1)
  if (e.key === 'ArrowLeft') goTo(currentPage.value - 1)
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  window.addEventListener('keydown', handleKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  window.removeEventListener('keydown', handleKey)
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
        <div class="kicker">From Our Special London Correspondent &mdash; Column {{ currentPage + 1 }} of {{ totalPages }}</div>
        <div class="hl-main">The Great Debate</div>
        <div class="hl-deck-1">Mr. Karl Marx &amp; Mr. Henry George &mdash; London, 1887</div>
        <div class="hl-rule"></div>
        <div class="hl-deck-2">{{ pageLabels[currentPage] }}</div>
      </div>

      <!-- Version / nav strip -->
      <div class="ver-strip">
        <a href="#/article/marx-george-intro" class="ver-link-btn">&larr; Introduction</a>
        <span class="ver-badge">Version I of II &mdash; The Generous Account</span>
        <a href="#/article/marx-vs-george-2" class="ver-link-btn">Version II &rarr;</a>
      </div>

      <div class="rule-sgl"></div>

      <!-- ═══ PAGINATED CONTENT ═══ -->
      <div class="news-body">

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
            of our age. But his diagnosis, I am afraid, mistakes the shadow for the substance.</p>
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
            is that we imported from the Old World precisely the thing these people were fleeing. We took the energy
            of the freest people on earth and quietly installed the same pump that was bleeding them dry in the
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
            wage relationship contains real asymmetries of power. Where we differ is in the cause and the remedy.</p>
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
            gains of production are continuously siphoned upward by rising land rents. As industry advances and
            cities grow, the landowner captures an ever-larger share of the wealth created by everyone else. This
            compresses wages, squeezes honest profit, chokes purchasing power &mdash; and then you observe the
            resulting collapse and call it an inherent contradiction of capital itself.</p>
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
            governing. The question of temperament is not entirely separate from the question of governance.</p>
          <p class="stage">(A longer pause. Murmuring throughout the hall.)</p>
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
          <p class="ex"><span class="spkr">George.</span> It is always different in theory. The guardians will be
            wise. The vanguard will be virtuous. The dictatorship will be temporary. I have read your work
            carefully, Mr. Marx, and I have yet to find the mechanism by which power, once concentrated in the name
            of the people, is voluntarily returned to the people. I have read human history rather carefully as
            well, and I have yet to find an example of it occurring.</p>
          <p class="ex"><span class="spkr">Marx.</span> Your faith in the democratic process is touchingly
            na&iuml;ve given who currently controls it &mdash;</p>
          <p class="ex"><span class="spkr">George.</span> And your faith in revolutionary committees is touching
            given who historically ends up running them. The difference is that my idealism requires only that
            people vote correctly once. Yours requires that people with absolute power behave virtuously forever.</p>
        </div>

        <!-- PAGE 7: Round 6 -->
        <div class="page-content" v-show="currentPage === 7">
          <p class="ex"><span class="spkr">George.</span> My system is not a blunt instrument. Those who hold a
            small plot of land pay little. Those who speculate on vast tracts of urban land pay substantially. The
            farmer pays on the unimproved value of the land &mdash; not on the value of his labour or his
            improvements. The factory owner pays no tax on his machinery, his inventory, or his profits. Only the
            value of the ground beneath him &mdash; value created by the community &mdash; is recaptured by the
            community. This is not punishment of success. It is the removal of a system that currently punishes
            success whilst rewarding the passive holder of appreciating land with an entirely unearned windfall.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(composure partly recovered.)</em> I will grant you the
            internal logic is consistent. But you assume that capital, once freed from land speculation, would flow
            toward productive enterprise rather than finding new mechanisms of concentration and monopoly. Standard
            Oil did not require land speculation to achieve its stranglehold.</p>
          <p class="ex"><span class="spkr">George.</span> <em>(pausing, genuinely considering.)</em> That is your
            strongest argument to-day, and I want to give it its due. You are correct that monopoly can arise from
            sources other than land. I do not claim my remedy is omnipotent. What I claim is that it removes the
            foundational mechanism that makes all other concentrations of power so difficult to dislodge. It is not
            a complete solution. It is the necessary first solution, without which all others are built on
            sand.</p>
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
          <p class="ex in">Tax the land, free the capital, and you fund a thousand Teslas &mdash; men and women
            whose potential currently dissolves into the rent cheque every month.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(with open contempt.)</em> Individual genius is a
            bourgeois myth. Tesla&rsquo;s inventions will enrich Morgan and Westinghouse &mdash; not the worker who
            installs the wiring.</p>
          <p class="ex"><span class="spkr">George.</span> And there it is &mdash; the darkest thread running
            through your entire philosophy. The exceptional individual is a problem to be explained away. Mr. Tesla
            is a singular man with a singular mind producing something no one else in the world could have produced
            at that moment. I find that magnificent. You find it inconvenient.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(losing composure.)</em> You are a na&iuml;ve apologist
            &mdash; you simpleminded &mdash;</p>
          <p class="ex"><span class="spkr">George.</span> <em>(quietly, with precision.)</em> Mr. Marx.</p>
          <p class="stage">(The room falls entirely still.)</p>
          <p class="ex">You have now called me sentimental, provincial, na&iuml;ve, and simpleminded in the course
            of an afternoon. I note that your arguments have grown shorter and your adjectives longer in rough
            proportion to how the debate has proceeded. This is not generally a sign of intellectual confidence.</p>
          <p class="ex in">I am not your enemy, Mr. Marx. The landowner is our shared enemy. But I will not build
            the gallows you propose to hang him with, because I know perfectly well who ends up on them.</p>
        </div>

        <!-- PAGE 9: Round 8 -->
        <div class="page-content" v-show="currentPage === 9">
          <p class="ex"><span class="spkr">Marx.</span> <em>(cold, deliberate &mdash; the anger compressed into
            precision.)</em> Capitalism in its final development &mdash; as it concentrates, as competition
            eliminates the small producer, as finance capital subsumes industrial capital &mdash; produces
            contradictions that accumulate beyond any corrective mechanism. The rate of profit falls. Capital seeks
            ever more desperate outlets. Imperialism, militarism, financial speculation &mdash; these are not
            aberrations. They are capitalism&rsquo;s terminal symptoms. No land tax administered by democratic vote
            will arrest this trajectory.</p>
          <p class="ex"><span class="spkr">George.</span> <em>(with genuine seriousness.)</em> I want to take this
            seriously, because in one sense you are describing something real. The concentration, the
            financialisation, the desperate search for yield &mdash; these are real phenomena and they are
            worsening. But what you call the terminal contradictions of capitalism I recognise as the predictable
            behaviour of a system in which land value has no outflow valve. Productivity rises. The gains flow to
            land. Land concentrates. Capital follows land into speculation rather than production. The productive
            economy starves. Finance fills the vacuum. You look at this and conclude that capital is the cancer. I
            look at the same process and see land monopoly as the tumour causing every other system to
            malfunction.</p>
          <p class="ex in">The tragedy is that we may be running out of time to find out which of us is right. Your
            revolution will not permit the experiment. Mine, if implemented, would answer the question within a
            generation. I would rather be proven wrong by evidence than proven right by catastrophe.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(quietly; his most honest moment.)</em> You are not
            entirely wrong about the mechanism. But you are too optimistic about the willingness of democratic
            institutions &mdash; themselves captured by the very interests you propose to tax &mdash; to implement
            your remedy. The landowners will not vote themselves out of existence.</p>
          <p class="ex"><span class="spkr">George.</span> No. They will not. That is the most honest thing you have
            said to-day, and I respect you for saying it. But your answer to the corruption of democratic
            institutions is to abolish them in favour of a revolutionary authority somehow immune to the same human
            tendencies. I cannot follow you there. We agree on more than either of us might like to admit. We
            disagree on the one question that matters most &mdash; how much we are willing to trust concentrated
            power.</p>
        </div>

        <!-- PAGE 10: Round 9 -->
        <div class="page-content" v-show="currentPage === 10">
          <p class="ex"><span class="spkr">George.</span> There is a question we have circled all evening without
            naming directly. It is not merely a question of economics. It is a question of knowledge. Who knows
            enough to direct a society? Someone must decide: how many boots should be produced; where steel should
            be allocated; whether copper belongs in railroads or electrical wire; whether a thousand experimental
            ventures deserve financing. Under a free market, these decisions emerge from millions of independent
            judgements &mdash; messy, imperfect, but extraordinarily adaptive. Prices communicate information no
            ministry could ever fully gather. Your alternative requires concentrated administration on a scale no
            civilisation has ever successfully sustained without hardening into bureaucracy.</p>
          <p class="ex"><span class="spkr">Marx.</span> <em>(measured.)</em> Modern industry is already planned
            internally. The railway company plans. The steel trust plans. Standard Oil plans. The market survives
            only at the boundaries between enormous organised structures. The difference is that under capitalism
            these systems operate blindly toward profit rather than consciously toward human need.</p>
          <p class="ex"><span class="spkr">George.</span> That is an intelligent point, and partly true. But large
            organisations operate within an external environment of competition, price discovery, and risk. A
            railway that allocates resources foolishly eventually fails. A ministry that allocates resources
            foolishly acquires a larger budget next year to correct the previous failure.</p>
          <p class="stage">(Scattered laughter from the audience.)</p>
          <p class="ex">And there is another distinction. A corporation may become powerful, but in principle it
            remains replaceable. A state granted comprehensive economic authority acquires something no private
            monopoly possesses: final legal force. The bureaucrat need not persuade the customer. He need only
            issue instructions.</p>
          <p class="ex"><span class="spkr">Marx.</span> Liberty without material security is largely fictional for
            the working class.</p>
          <p class="ex"><span class="spkr">George.</span> True. But security without liberty has a habit of
            becoming a prison administered for the prisoner&rsquo;s own good. You fear disorder more than
            concentrated authority. I fear concentrated authority more than disorder. And history, I suspect, will
            spend the next century testing both fears to destruction.</p>
        </div>

        <!-- PAGE 11: Round 10 -->
        <div class="page-content" v-show="currentPage === 11">
          <p class="ex"><span class="spkr">George.</span> What do human beings owe one another? My answer: we owe
            each other equal access to the gifts of nature &mdash; the earth, which no man made &mdash; and beyond
            that, we owe each other the full product of our own labour and ingenuity. The earth belongs to all
            generations equally. Its rental value, properly collected, funds the common needs of civilisation.
            Everything above that belongs to whoever creates it. This is not charity. It is not redistribution. It
            is the precise separation of what is legitimately common from what is legitimately private.</p>
          <p class="ex"><span class="spkr">Marx.</span> The moral foundation of my system is simpler and I think
            more honest &mdash; that human beings should not exploit one another. That the alienation produced by
            capitalism &mdash; the reduction of human beings to units of production, severed from the product of
            their work, from their communities, from their own nature &mdash; is a moral catastrophe that demands a
            moral response.</p>
          <p class="ex"><span class="spkr">George.</span> <em>(genuinely.)</em> On that &mdash; I agree with you
            completely. The alienation is real. The exploitation is real. We share the diagnosis entirely. Where
            we part is here &mdash; you believe the solution requires the abolition of the market, collective
            ownership of production, and a transitional authority with power sufficient to remake the entire social
            order. I believe it requires one precise correction to the rules under which the market operates &mdash;
            a correction that would make genuine exploitation far harder to sustain whilst leaving the creative
            energy of free individuals entirely intact.</p>
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
            direction of labour. This is the irreducible heart of alienation &mdash; and no tax reform reaches
            it.</p>
          <p class="ex"><span class="spkr">George.</span> <em>(leaning forward, with quiet intensity.)</em> The man
            who conceives a great improvement &mdash; who organises thousands of moving details in his mind, who
            risks his reputation and his capital &mdash; is not a parasite on labour. He creates the very conditions
            under which labour becomes vastly more productive. And if the worker believes he can do it better
            &mdash; let him do what Mr. Tesla did when Mr. Edison refused to see what alternating current could
            become. Mr. Tesla did not seize Mr. Edison&rsquo;s laboratory. He left. He found partners. He competed.
            And the better idea won.</p>
          <p class="ex in">But here is what transforms the calculus entirely &mdash; the Citizens&rsquo; Dividend.
            The land value tax does not merely fund government in the abstract. Its revenues belong to the community
            that created them &mdash; every citizen, equally, unconditionally, as a matter of right. Not charity.
            Not welfare dispensed by a ministry to the deserving poor after they have satisfied an inspector. Every
            man, woman, and child &mdash; a direct and equal dividend.</p>
          <p class="ex in">The worker trapped in a miserable factory now has a floor beneath him that no employer
            can remove. He can refuse degrading terms. He can save. He can compete. And notice what this requires:
            no ministry, no caseworker, no form in triplicate. The land value is assessed transparently, collected,
            and distributed equally and directly. There is nothing for a corrupt official to dispense
            selectively.</p>
          <p class="ex"><span class="spkr">Marx.</span> A dividend from land tax revenues would be a pittance
            &mdash; pocket-money for the working class whilst leaving capital ownership entirely untouched.</p>
          <p class="ex"><span class="spkr">George.</span> A worker with a guaranteed floor, genuine savings
            capacity, and the practical ability to exit and compete is not the immiserated proletarian of your
            analysis. He is a free man making a choice. The capitalist who wishes to employ him must offer terms
            worth choosing. Your system offers collective ownership in name whilst delivering state control in fact.
            Mine offers real liberty &mdash; without the ancient curse of land monopoly holding every choice
            hostage.</p>
          <p class="stage">(Mr. Marx says nothing for a moment. It is the closest thing to silence he has produced
            all afternoon.)</p>
        </div>

        <!-- PAGE 13: Closing Statements -->
        <div class="page-content" v-show="currentPage === 13">
          <p class="ex"><span class="spkr">Marx.</span> The elegance of Mr. George&rsquo;s system is precisely its
            fatal weakness. It offers sufficient relief to pacify the worker, sufficient theoretical coherence to
            satisfy the reformer, and sufficient deference to existing property relations to reassure the capitalist
            &mdash; all whilst leaving the fundamental structure of exploitation intact. A correct partial diagnosis
            is not a cure. And a cure that leaves the deeper wound untouched is not liberation &mdash; it is a
            cleaner bandage.</p>
          <p class="ex in">I have called Mr. George names to-day that I perhaps should not have. He is not a fool
            and he is not an apologist &mdash; he is an honest man who has looked at real suffering and proposed a
            real remedy, and who has defended it with more composure than I have managed to attack it. We are both,
            in the end, men who could not look at the condition of the poor and look away. History will judge which
            of us served them better. I hope, for their sake, that one of us was right.</p>
          <p class="ex"><span class="spkr">George.</span> My colleague ends more graciously than he debated, and I
            appreciate it more than he knows. Here is what I ask of anyone who has listened honestly. Look at the
            land beneath your feet in any great city. Watch who grows rich as that city grows &mdash; not the
            workers who build it, not the entrepreneurs who risk their capital, not the inventors who illuminate its
            streets. The landowner. The man who holds title to ground he did not make and cannot reproduce, whose
            value the entire community created simply by being there.</p>
          <p class="ex in">Tax that value. Return it to the community that created it. Give it directly to every
            man, woman, and child as an equal and unconditional share of the common inheritance. Not charity. Not
            welfare. A birthright.</p>
          <p class="ex in">Progress and poverty are not natural companions. They walk together only because we have
            built a system that taxes what men create and subsidises what they merely hold. That system is not
            inevitable. It is not natural. It is a choice &mdash; and it can be unchoosen. Change that single
            thing, honestly and proportionally, and then step back. Watch what free human beings build when the
            ground beneath them finally belongs to them all.</p>
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

      <!-- Pull quotes — always visible -->
      <div class="pull-strip">
        <div class="pull-q">
          &ldquo;The man who has produced is robbed by the man who has monopolised.&rdquo;
          <span class="attr">&mdash; Henry George</span>
        </div>
        <div class="pull-rule"></div>
        <div class="pull-q">
          &ldquo;The history of all hitherto existing society is the history of class struggles.&rdquo;
          <span class="attr">&mdash; Karl Marx</span>
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
.kicker { font-size: 0.65rem; font-variant: small-caps; letter-spacing: 0.14em; color: #6b4c1a; margin-bottom: 0.25rem; }
.hl-main {
  font-size: clamp(1.8rem, 5vw, 3rem); font-weight: 900; text-transform: uppercase;
  letter-spacing: 0.12em; line-height: 1.05; color: #0e0800; margin: 0.1rem 0;
}
.hl-deck-1 { font-size: 0.95rem; font-variant: small-caps; letter-spacing: 0.05em; font-weight: 700; color: #2e1e06; margin: 0.3rem 0 0.2rem; }
.hl-rule { width: 50%; margin: 0.3rem auto; border-top: 1px solid #9b7d48; }
.hl-deck-2 { font-size: 0.82rem; font-style: italic; color: #3a2608; margin: 0.2rem 0 0; min-height: 1.3em; }

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
}

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