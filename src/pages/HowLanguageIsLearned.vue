<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import VocabiAdCard from '../components/VocabiAdCard.vue'

const props = defineProps({ lang: { type: String, default: 'en' }, id: { type: String, default: 'how-language-is-learned' } })

const TITLES = {
  en: 'How a Language Is Actually Learned: The Arithmetic, the Evidence, and Why So Many Quit',
  pt: 'Como um Idioma é Realmente Aprendido: A Aritmética, a Evidência e Por Que Tantos Desistem'
}
onMounted(() => { document.title = TITLES[props.lang] || TITLES.en })

const canonicalUrl = computed(() => `#/${['article', props.id, props.lang].filter(Boolean).join('/')}`)
const fullUrl = computed(() => window.location.origin + window.location.pathname + canonicalUrl.value)

const shareTitle = computed(() => props.lang === 'pt'
  ? 'Como um Idioma é Realmente Aprendido'
  : 'How a Language Is Actually Learned')
const shareText = computed(() => props.lang === 'pt'
  ? 'Quantas palavras são realmente necessárias, o que a imersão entrega de fato, e por que ofensivas e pontos podem estar atrapalhando.'
  : 'How many words you really need, what immersion actually delivers, and why streaks and points may be working against you.')

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

const pubDate = new Date('2026-08-14T00:00:00Z')
const isoDate = '2026-08-14'
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
        <h1 v-if="props.lang==='en'">How a Language Is Actually Learned: The Arithmetic, the Evidence, and Why So Many Quit</h1>
        <h1 v-else>Como um Idioma é Realmente Aprendido: A Aritmética, a Evidência e Por Que Tantos Desistem</h1>
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
      <p>Ask ten adults why they gave up on a language and you will get ten versions of the same sentence: I just did not stick with it. It sounds like a confession of character. It is closer to a description of arithmetic.</p>
      <p>The gap between what an adult learner is asked to do and what the tools in their pocket actually deliver is large, measurable, and &mdash; this is the uncomfortable part &mdash; largely already known. Four decades of second-language research have produced a reasonably clear picture of how vocabulary accumulates, what exposure does and does not do, and which motivational levers help. Very little of that picture is reflected in the products people actually use.</p>

      <h2>The Arithmetic Nobody Shows You</h2>
      <p>Start with the number that determines everything else: how many words you need.</p>
      <p>Paul Nation&rsquo;s 2006 analysis of a 100-million-word corpus put it at roughly 8,000 to 9,000 word families to read a novel or a newspaper without constant recourse to a dictionary, and 6,000 to 7,000 to follow unscripted speech. A learner sitting at 2,000 word families &mdash; a respectable haul, and more than most app users ever reach &mdash; covers about 88 percent of the running words in a novel. That sounds close. In practice it means roughly one unknown word in every eight, which is not reading. It is decoding.</p>
      <p>Laufer and Ravenhorst-Kalovski, working with 745 learners in 2010, found that 8,000 word families corresponded to what they called the optimal comprehension threshold &mdash; and that only about nine percent of their sample had reached it.</p>
      <p>The famous 98-percent-coverage threshold deserves a caveat, because it is repeated far more confidently than the data support. It originates in a study of 66 learners in which the 98 percent condition was never actually tested; it was extrapolated. The largest study of the question, Schmitt, Jiang and Grabe&rsquo;s 661-learner investigation in 2011, found a broadly linear relationship between words known and comprehension, with no dramatic cliff at all. A 2023 replication of the original could not reproduce it. And for listening, van Zeeland and Schmitt found that most learners followed spoken texts adequately at 90 percent coverage, which would put the requirement nearer 2,000 to 3,000 families than 7,000.</p>
      <p>So the honest version is a range rather than a target: somewhere between three thousand and nine thousand word families, depending on what you want to do with the language. It is still an enormous number, and it is the reason vocabulary, rather than grammar, is the binding constraint for almost every adult learner.</p>

      <h2>Where Words Actually Come From</h2>
      <p>Two mechanisms are on offer. You can pick words up incidentally from exposure, or you can study them deliberately. Both work. They do not work equally.</p>
      <p>The incidental route is well measured. A 2023 meta-analysis by Uchihara, Webb and Yanagisawa pooled 24 studies covering 2,771 learners and found a large overall effect. But when you ask what proportion of target words were actually learned, the numbers deflate quickly: about 18 percent for recognising the form and 9 percent for recalling the meaning. Reading delivered around 17 percent of target words; watching video, 7 percent. The authors put the rate of incidental acquisition at under 0.02 words per minute. At that pace, an hour a day of pleasure reading yields roughly one new word.</p>
      <p>The longitudinal studies are bleaker. Waring and Takaki gave learners a graded reader and tested them three months later: on the strictest measure, one word in 25 survived, and nothing encountered fewer than eight times survived at all. Brown, Waring and Donkaewbua found roughly one word retained per learner after three months from reading, and none from listening alone.</p>
      <p>Deliberate study is a different order of magnitude. Webb, Yanagisawa and Uchihara&rsquo;s 2020 meta-analysis of intentional vocabulary activities &mdash; 100 effect sizes across 2,202 learners &mdash; found immediate gains of about 60 percent of target words on meaning recall, decaying to 39 percent on delayed tests, and 25 percent for productive recall of the form. Decay is real. It is also, at 25 to 39 percent, several times what exposure alone delivers.</p>
      <p>The conclusion is not that reading is useless. It is that reading is how you meet words and deliberate practice is how you keep them, and a product that offers one without the other is offering half a system.</p>

      <h2>The Most Reliable Finding in the Field</h2>
      <p>If second-language research has a single robust engineering result, it is spacing.</p>
      <p>Cepeda and colleagues&rsquo; 2006 synthesis covered 317 experiments and 14,811 participants: spaced practice beat massed practice by about ten percentage points on recall, 47.3 percent against 36.7. Their 2008 follow-up, with 1,354 participants, mapped the shape of the curve. The optimal gap is roughly 20 percent of the interval you need to remember over for delays of a few weeks, falling to about 5 percent at a year. At the optimum the benefit was a 64 percent improvement &mdash; a very large effect for an intervention that costs nothing but scheduling.</p>
      <p>Kim and Webb&rsquo;s 2022 meta-analysis confirmed the effect specifically for second-language learning across 48 experiments and 3,411 learners, and found something the flashcard industry rarely mentions: equal and expanding intervals performed equivalently. The algorithm is not the magic. The gap is.</p>
      <p>The companion finding is retrieval. Roediger and Karpicke&rsquo;s 2006 experiments produced a crossover that ought to be printed on every study app&rsquo;s splash screen. Students who re-read material scored 81 percent after five minutes and 42 percent after a week. Students who tested themselves scored 75 percent and 56 percent. Re-reading feels more productive and is worse.</p>
      <p>Rowland&rsquo;s 2014 meta-analysis of 61 studies puts the testing effect at a moderate size overall, with one crucial condition attached. With feedback the effect was 0.73; without it, 0.39. And when learners were tested on material they mostly did not yet know and received no feedback, the effect collapsed to 0.03 &mdash; statistically nothing. Retrieval practice without correction is not practice. It is guessing.</p>
      <p>One common objection deserves retiring. It is often said that flashcards produce inert recognition knowledge, that you can pass the card and still not have the word. Elgort&rsquo;s 2011 study tested this directly, teaching 48 advanced learners a set of invented words on a spaced card schedule and then measuring them with priming tasks that probe automatic lexical access. The studied items behaved like genuinely known words. Deliberate spaced study does build real lexical representations. What no study in this literature shows is that it produces spoken fluency, because none of them measured that.</p>

      <h2>The Immersion Story Is Half True</h2>
      <p>Immersion is the other half of the folk model: go there, and it happens.</p>
      <p>The meta-analytic answer is a qualified yes. Tseng and colleagues pooled 42 study-abroad studies in 2024 and reported a large overall effect. But most of the underlying research is pre-and-post within a single group, which measures &ldquo;students improved over a semester&rdquo; rather than &ldquo;abroad beat staying home.&rdquo;</p>
      <p>Where studies do make that comparison, they find something more specific. Collentine&rsquo;s 2004 study of 46 learners of Spanish found that the at-home classroom group developed more on discrete grammatical and lexical features, while the study-abroad group returned with better narrative discourse and denser, more fluent output. Immersion buys fluency and confidence. It does not reliably buy accuracy.</p>
      <p>And it does not work for everyone. Sunderman and Kroll documented a threshold effect: learners below a certain level of working-memory resource simply did not convert immersion into production gains. The same pattern shows up in the input meta-analysis, where incidental learning was twice as effective for proficient learners as for basic ones, and twice as effective from materials written for learners as from native-oriented material. Nick Ellis&rsquo;s work on learned attention supplies the mechanism: the entrenched patterns of a first language block adults from noticing certain second-language forms in the stream at all, so frequency never gets a chance to operate on them.</p>
      <p>Which yields the finding that ought to govern any product aimed at beginners. Unmodified immersion is close to worthless at the start. It becomes powerful precisely once you know enough for it to be comprehensible. The learner who most needs immersion is the one it helps least, and telling a beginner to just watch shows in the language is advice that will start working for them in about two years.</p>

      <h2>What the Industry Built Instead</h2>
      <p>Faced with a hard retention problem, the consumer language-app category converged on a solution borrowed from games: points, levels, leaderboards, and above all streaks.</p>
      <p>The literature on that choice is not encouraging. Deci, Koestner and Ryan&rsquo;s meta-analysis of 128 experiments remains the reference. Tangible rewards reduced free-choice intrinsic motivation with an effect of &minus;0.34 overall. Rewards contingent on completing a task &mdash; precisely what &ldquo;finish your lesson, keep your streak&rdquo; is &mdash; came in at &minus;0.36. Rewards contingent on performance, the leaderboard case, at &minus;0.28. Two findings cut the other way, and they matter: unexpected rewards did no damage at all, and verbal reward, meaning informative positive feedback on what you actually did, raised intrinsic motivation by +0.33.</p>
      <p>That distinction is the whole argument. A reward announced in advance for completing an activity displaces the reason for doing it. Feedback about your own growing capability strengthens it. Most language apps are built almost entirely out of the first kind.</p>
      <p>Gamification&rsquo;s own literature is more sympathetic but more fragile than its reputation. Sailer and Homner&rsquo;s 2020 meta-analysis found positive effects on cognitive, motivational and behavioural outcomes. Their caveat is the finding: when the analysis was restricted to high-quality studies, the motivational and behavioural effects disappeared while the cognitive effect survived. Hanus and Fox&rsquo;s semester-long comparison of two sections of the same course, one with leaderboards and badges, found the gamified students ended with less intrinsic motivation, less satisfaction and lower final exam scores &mdash; with the exam effect mediated by the motivation loss.</p>
      <p>Meanwhile, what is actually known about outcomes in this category is remarkably thin. The most-cited efficacy figure, that 34 hours of Duolingo covers a first college semester of Spanish, comes from a 2012 report funded by Duolingo, not peer reviewed, with no control group, in which 196 people started and 88 finished &mdash; and in which no participant was ever followed to the claimed threshold. The 34 hours is an extrapolation from a per-hour rate. A 2024 study in <em>Language Learning &amp; Technology</em>, also financially supported by Duolingo and co-authored by two of its learning scientists, is more careful and less flattering: twelve weeks and about 27 hours moved learners from Novice-Mid to Novice-High. There is, as of this writing, no peer-reviewed study of streaks and retention using platform data at all.</p>

      <h2>Why People Actually Quit</h2>
      <p>The best empirical study of adult language dropout is not about apps, but it is instructive. Evans and Tragant surveyed 260 adult learners at a Barcelona university language school, 154 of whom had dropped out. Their stated reasons, in order: lack of time (26.6 percent), not relevant for work (15.4), personal reasons (14.3), cost (13.9), the method used in class (11.9), and lack of progress (6.1).</p>
      <p>That ordering is a rebuke to a good deal of product thinking. The dominant reasons are opportunity cost &mdash; time, money, relevance. Lack of progress is cited by roughly one dropout in sixteen.</p>
      <p>But the two categories interact in a way worth naming. Time is scarce in proportion to what else it could buy. A learner abandons a language when the hour stops feeling like it purchases anything. And here Roediger and Karpicke&rsquo;s crossover returns with force, because learners&rsquo; subjective sense of progress systematically favours the method that produces less durable learning. Re-reading feels like progress. Retrieval feels like failure. An app that optimises for the feeling of progress and an app that optimises for progress are solving different problems, and the first is much easier to sell.</p>
      <p>The intermediate plateau that everyone reports is real as an experience and thinly evidenced as a phenomenon; there is no rigorous quantitative literature on it. But it has a plausible and well-evidenced mechanism sitting right there in the coverage tables. Word frequency is Zipfian. Going from 2,000 to 3,000 word families buys several percentage points of text coverage. Going from 8,000 to 9,000 buys a fraction of one. The learner&rsquo;s effort is constant; the visible return collapses. The plateau is not a psychological failing. It is a curve.</p>

      <h2>The One Place Games Have Strong Evidence</h2>
      <p>Given all that, the case for language-learning games has to be made carefully, because the experimental literature on digital game-based language learning is weaker than its enthusiasts suggest: small studies, short interventions, and several meta-analyses reporting effect sizes large enough to be implausible.</p>
      <p>The strong evidence is somewhere else entirely, and it is not experimental. Pia Sundqvist and colleagues have spent fifteen years measuring what Swedish adolescents do with English outside school. In one study of 80 fifteen-year-olds, learners who played digital games five or more hours a week scored 22.7 out of 45 on a productive vocabulary test, against 13.7 for non-gamers and 14.4 for moderate gamers, with the same monotonic pattern on a second vocabulary measure &mdash; 71.6 against 55.2 &mdash; and effect sizes large by any standard in education research. The pattern replicated in a cohort of eleven- and twelve-year-olds. Sundqvist&rsquo;s earlier thesis found that the activities predicting vocabulary were the productive, interactive ones &mdash; games, internet, reading &mdash; not the passive ones like music and television.</p>
      <p>The causal caveat is real, and the authors state it: frequent gamers may have been better at English to begin with, which is partly why they chose English-language games. But the mechanism is not mysterious. These learners were accumulating thousands of hours of self-selected, meaningful, moderately comprehensible input, over years, for free, because they wanted to.</p>
      <p>That is the actual finding. Games are not a better teaching method. They are the best-evidenced delivery vehicle for the one thing every model in this literature agrees you need: enormous quantities of voluntary input, sustained over time.</p>

      <h2>What a Design That Took This Seriously Would Look Like</h2>
      <p>Put the findings side by side and a specification falls out, one that looks almost nothing like the current category.</p>
      <p>It would treat vocabulary as the binding constraint, and make word count the thing the system tracks and reflects back, because that is what actually gates comprehension. It would pair input with deliberate spaced retrieval, and give feedback on every retrieval, because retrieval without feedback is worth approximately zero. It would grade its input to the learner rather than dropping beginners into native material, because modified input roughly doubles the acquisition rate. It would derive the learner&rsquo;s level from their behaviour rather than asking them to self-report it, since self-report is exactly the kind of output the system can already measure directly.</p>
      <p>It would remove completion-contingent rewards &mdash; streaks, quotas, daily numbers &mdash; and replace them with informative feedback about demonstrated capability, because the meta-analytic sign flips between the two. It would never punish absence, since punishment is the mechanism by which a missed week becomes a quit. And it would attach the learning to something the learner wants for its own sake and will return to for months, because voluntary input at scale is the only thing in this literature that reliably produces large real-world vocabularies.</p>

      <h2>A Test Case, Currently in Beta</h2>
      <p>One app now in testing matches that specification closely enough to be worth describing &mdash; less as a recommendation than as an existence proof that the design is buildable.</p>
      <p>Vocabi is a language-learning app built as a small open world. You arrive in a birch grove at the edge of a village that has fallen to moss and ruin, and you rebuild it. The mechanics map onto the evidence with unusual directness.</p>
      <p><strong>Practice is the only source of energy</strong>, and energy is what lets you act in the world: dig, chop, gather, build. But running out never stops you. Low energy makes you slow and lethargic; there is no death, no hunger meter, no lockout. Energy drains from absence rather than presence &mdash; leave for several days and the bar empties, but coming back costs nothing and forgives everything.</p>
      <p><strong>Words are literally keys.</strong> Objects in the world carry vocabulary requirements. A rowboat needs six words &mdash; boat, oar, rope, lake, fish, net &mdash; and until you have them it sinks under you, visibly and repeatedly, in a way meant to teach rather than punish. Crucially, the gate opens the moment a word is added to your deck, not once you have mastered it. It is a single tap. The designers call it teach-then-proceed rather than a wall, which is in effect the meet-the-word-attached-to-its-referent mechanism that input theorists have argued for, with the object supplying the meaning.</p>
      <p><strong>Learned words are the building material.</strong> The brick supply is capped by your vocabulary: one word learned, one brick available, where learned means eighty percent correct across at least five attempts. The visible state of your village is a readout of your word count. That is a progress marker tied to demonstrated capability rather than to showing up, which is the distinction the reward literature turns on.</p>
      <p><strong>Level is derived, not asked.</strong> The learner&rsquo;s CEFR band is computed from learned word count &mdash; under 500 words is A1, under 1,000 A2, under 2,000 B1, and upward from there &mdash; and the app quietly serves simpler in-world text to learners lower down the ladder. That is graded input applied automatically, which is the moderator that doubled acquisition rates in the meta-analysis.</p>
      <p><strong>The reading surface and the study surface are the same surface.</strong> Everything in the world is tappable for a translation and addable to a spaced-repetition deck in the same gesture. Folklore fragments, carved stones, songs and torn storybook pages are scattered as physical objects; opening one in the reader teaches a themed word set and a line of the world&rsquo;s mythology at the same time. A slate of word games &mdash; matching, verb conjugation, crosswords, word search, word blocks, and an alphabet trainer for non-Latin scripts &mdash; handles retrieval, with feedback, in short sessions.</p>
      <p>And there are no streaks, no daily quotas and no punishment of any kind. The stated design pillar is curiosity over fear.</p>
      <p>What is not known is whether any of it works, and it would be dishonest to pretend otherwise. There is no published outcome data, the app is in beta with a small tester group, and as this article has laboured to establish, nobody in this industry has demonstrated what keeps a learner studying a year from now. Alignment with the evidence is a reason to expect something. It is not a result.</p>

      <h2>The Honest Summary</h2>
      <p>We know with reasonable confidence what builds vocabulary: spaced retrieval with feedback, input graded to the learner, and volume. We know what erodes motivation: rewards attached to compliance rather than to capability. We know that immersion is a multiplier on existing knowledge rather than a substitute for it. And we know that the largest real-world vocabularies in the research literature belong to teenagers who spent thousands of unsupervised hours doing something they enjoyed in a language that was not theirs.</p>
      <p>What nobody has shown is which product design converts that knowledge into a person who, three years from now, can read a novel in a language they did not have. The design space is wide open, and it is being explored mostly by companies optimising for daily active users. There is room for someone to optimise for the other thing.</p>

      <h2>Sources</h2>
      <ul class="sources">
        <li>Nation, I.S.P. (2006). How large a vocabulary is needed for reading and listening? <em>Canadian Modern Language Review</em>, 63(1). <a href="https://www.lextutor.ca/cover/papers/nation_2006.pdf" target="_blank" rel="noopener">PDF</a></li>
        <li>Laufer, B., &amp; Ravenhorst-Kalovski, G.C. (2010). Lexical text coverage, learners&rsquo; vocabulary size and reading comprehension. <em>Reading in a Foreign Language</em>, 22(1). <a href="https://files.eric.ed.gov/fulltext/EJ887873.pdf" target="_blank" rel="noopener">PDF</a></li>
        <li>Hu, M., &amp; Nation, P. (2000). Unknown vocabulary density and reading comprehension. <em>Reading in a Foreign Language</em>, 13(1). <a href="https://eric.ed.gov/?id=EJ626518" target="_blank" rel="noopener">ERIC</a></li>
        <li>Schmitt, N., Jiang, X., &amp; Grabe, W. (2011). The percentage of words known in a text and reading comprehension. <em>Modern Language Journal</em>, 95(1). <a href="https://eric.ed.gov/?id=EJ928357" target="_blank" rel="noopener">ERIC</a></li>
        <li>Kremmel, B., et al. (2023). Unknown vocabulary density and reading comprehension: Replicating Hu and Nation (2000). <em>Language Learning</em>. <a href="https://onlinelibrary.wiley.com/doi/10.1111/lang.12622" target="_blank" rel="noopener">DOI</a></li>
        <li>van Zeeland, H., &amp; Schmitt, N. (2013). Lexical coverage in L1 and L2 listening comprehension. <em>Applied Linguistics</em>, 34(4). <a href="https://academic.oup.com/applij/article-abstract/34/4/457/199564" target="_blank" rel="noopener">Abstract</a></li>
        <li>Uchihara, T., Webb, S., &amp; Yanagisawa, A. (2023). How effective is second language incidental vocabulary learning? A meta-analysis. <em>Language Teaching</em>. <a href="https://eric.ed.gov/?id=EJ1373102" target="_blank" rel="noopener">ERIC</a></li>
        <li>Webb, S., Yanagisawa, A., &amp; Uchihara, T. (2020). How effective are intentional vocabulary-learning activities? A meta-analysis. <em>Modern Language Journal</em>, 104(4). <a href="https://eric.ed.gov/?id=EJ1277328" target="_blank" rel="noopener">ERIC</a></li>
        <li>Waring, R., &amp; Takaki, M. (2003). At what rate do learners learn and retain new vocabulary from reading a graded reader? <em>Reading in a Foreign Language</em>, 15(2). <a href="https://eric.ed.gov/?id=EJ676380" target="_blank" rel="noopener">ERIC</a></li>
        <li>Brown, R., Waring, R., &amp; Donkaewbua, S. (2008). Incidental vocabulary acquisition from reading, reading-while-listening, and listening to stories. <em>Reading in a Foreign Language</em>, 20(2). <a href="https://files.eric.ed.gov/fulltext/EJ815119.pdf" target="_blank" rel="noopener">PDF</a></li>
        <li>Cepeda, N.J., et al. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. <em>Psychological Bulletin</em>, 132(3). <a href="https://pubmed.ncbi.nlm.nih.gov/16719566/" target="_blank" rel="noopener">PubMed</a></li>
        <li>Cepeda, N.J., et al. (2008). Spacing effects in learning: A temporal ridgeline of optimal retention. <em>Psychological Science</em>, 19(11). <a href="https://files.eric.ed.gov/fulltext/ED505660.pdf" target="_blank" rel="noopener">PDF</a></li>
        <li>Kim, S.K., &amp; Webb, S. (2022). The effects of spaced practice on second language learning: A meta-analysis. <em>Language Learning</em>, 72(1). <a href="https://onlinelibrary.wiley.com/doi/abs/10.1111/lang.12479" target="_blank" rel="noopener">DOI</a></li>
        <li>Roediger, H.L., &amp; Karpicke, J.D. (2006). Test-enhanced learning. <em>Psychological Science</em>, 17(3). <a href="https://journals.sagepub.com/doi/10.1111/j.1467-9280.2006.01693.x" target="_blank" rel="noopener">DOI</a></li>
        <li>Rowland, C.A. (2014). The effect of testing versus restudy on retention: A meta-analytic review. <em>Psychological Bulletin</em>, 140(6). <a href="https://pubmed.ncbi.nlm.nih.gov/25150680/" target="_blank" rel="noopener">PubMed</a></li>
        <li>Elgort, I. (2011). Deliberate learning and vocabulary acquisition in a second language. <em>Language Learning</em>, 61(2). <a href="https://eric.ed.gov/?id=EJ928530" target="_blank" rel="noopener">ERIC</a></li>
        <li>Tseng, W.-T., et al. (2024). Revisiting the effectiveness of study abroad language programs: A multi-level meta-analysis. <em>Language Teaching Research</em>, 28(1). <a href="https://journals.sagepub.com/doi/full/10.1177/1362168820988423" target="_blank" rel="noopener">DOI</a></li>
        <li>Collentine, J. (2004). The effects of learning contexts on morphosyntactic and lexical development. <em>SSLA</em>, 26(2). <a href="https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/abs/effects-of-learning-contexts-on-morphosyntactic-and-lexical-development/555727833FCCE32FFF829ACCE6193C26" target="_blank" rel="noopener">Cambridge</a></li>
        <li>Sunderman, G., &amp; Kroll, J.F. (2009). When study-abroad experience fails to deliver: The internal resources threshold effect. <em>Applied Psycholinguistics</em>, 30(1). <a href="https://www.cambridge.org/core/journals/applied-psycholinguistics/article/abs/when-studyabroad-experience-fails-to-deliver-the-internal-resources-threshold-effect/6FA3E81AAE4316773764788F98FF9AB0" target="_blank" rel="noopener">Cambridge</a></li>
        <li>Ellis, N.C. (2002). Frequency effects in language processing. <em>SSLA</em>, 24(2). <a href="https://www.lextutor.ca/hyp/1/ellis_2002.pdf" target="_blank" rel="noopener">PDF</a></li>
        <li>Deci, E.L., Koestner, R., &amp; Ryan, R.M. (1999). A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation. <em>Psychological Bulletin</em>, 125(6). <a href="https://home.ubalt.edu/tmitch/642/articles%20syllabus/Deci%20Koestner%20Ryan%20meta%20IM%20psy%20bull%2099.pdf" target="_blank" rel="noopener">PDF</a></li>
        <li>Sailer, M., &amp; Homner, L. (2020). The gamification of learning: A meta-analysis. <em>Educational Psychology Review</em>, 32. <a href="https://link.springer.com/article/10.1007/s10648-019-09498-w" target="_blank" rel="noopener">Springer</a></li>
        <li>Hanus, M.D., &amp; Fox, J. (2015). Assessing the effects of gamification in the classroom. <em>Computers &amp; Education</em>, 80. <a href="https://www.sciencedirect.com/science/article/abs/pii/S0360131514002000" target="_blank" rel="noopener">ScienceDirect</a></li>
        <li>Vesselinov, R., &amp; Grego, J. (2012). <em>Duolingo Effectiveness Study: Final Report.</em> <a href="https://theowlapp.health/wp-content/uploads/2022/04/DuolingoReport_Final-1.pdf" target="_blank" rel="noopener">PDF</a></li>
        <li>Smith, B., Jiang, X., &amp; Peters, R. (2024). The effectiveness of Duolingo in developing receptive and productive language knowledge and proficiency. <em>Language Learning &amp; Technology</em>, 28(1). <a href="https://scholarspace.manoa.hawaii.edu/server/api/core/bitstreams/ea47a53e-da6e-4419-bd55-e72b458294f4/content" target="_blank" rel="noopener">PDF</a></li>
        <li>Evans, M., &amp; Tragant, E. (2020). Demotivation and dropout in adult EFL learners. <em>TESL-EJ</em>, 23(4). <a href="https://files.eric.ed.gov/fulltext/EJ1242642.pdf" target="_blank" rel="noopener">PDF</a></li>
        <li>Sundqvist, P., &amp; Wikström, P. (2015). Out-of-school digital gameplay and in-school L2 English vocabulary outcomes. <em>System</em>, 51. <a href="https://www5.kau.se/sites/default/files/Dokument/subpage/2015/05/sundqvist_wikstr_m_2015_out_of_school_digital_g_20892.pdf" target="_blank" rel="noopener">PDF</a></li>
        <li>Sundqvist, P. (2009). <em>Extramural English Matters</em> (doctoral thesis, Karlstad University). <a href="https://www5.kau.se/sites/default/files/Dokument/subpage/2014/01/sundqvist_2009_thesis_extramural_english_matters_p_90876.pdf" target="_blank" rel="noopener">PDF</a></li>
        <li>Lichtman, K., &amp; VanPatten, B. (2021). Was Krashen right? Forty years later. <em>Foreign Language Annals</em>, 54(1). <a href="https://fluencyfast.com/wp-content/uploads/LichtmanVanPatten2021aKrashen.pdf" target="_blank" rel="noopener">PDF</a></li>
      </ul>
    </template>

    <template v-else>
      <p>Pergunte a dez adultos por que desistiram de um idioma e você receberá dez versões da mesma frase: eu simplesmente não mantive a constância. Soa como uma confissão de caráter. Está mais próximo de uma descrição de aritmética.</p>
      <p>A distância entre o que se pede a um aprendiz adulto e o que as ferramentas no bolso dele de fato entregam é grande, mensurável e &mdash; esta é a parte incômoda &mdash; em boa medida já conhecida. Quatro décadas de pesquisa em segunda língua produziram um retrato razoavelmente claro de como o vocabulário se acumula, do que a exposição faz e não faz, e de quais alavancas motivacionais ajudam. Muito pouco desse retrato aparece nos produtos que as pessoas realmente usam.</p>

      <h2>A Aritmética Que Ninguém Mostra</h2>
      <p>Comece pelo número que determina todo o resto: quantas palavras são necessárias.</p>
      <p>A análise de Paul Nation, em 2006, sobre um corpus de 100 milhões de palavras chegou a cerca de 8.000 a 9.000 famílias de palavras para ler um romance ou um jornal sem recorrer constantemente ao dicionário, e 6.000 a 7.000 para acompanhar fala espontânea. Um aprendiz com 2.000 famílias de palavras &mdash; um resultado respeitável, e mais do que a maioria dos usuários de aplicativos jamais alcança &mdash; cobre cerca de 88 por cento das palavras correntes de um romance. Parece perto. Na prática significa aproximadamente uma palavra desconhecida a cada oito, o que não é leitura. É decodificação.</p>
      <p>Laufer e Ravenhorst-Kalovski, trabalhando com 745 aprendizes em 2010, concluíram que 8.000 famílias correspondiam ao que chamaram de limiar ótimo de compreensão &mdash; e que apenas cerca de nove por cento da amostra havia chegado lá.</p>
      <p>O famoso limiar de 98 por cento de cobertura merece uma ressalva, porque é repetido com muito mais confiança do que os dados sustentam. Ele nasce de um estudo com 66 aprendizes no qual a condição de 98 por cento nunca foi de fato testada; foi extrapolada. O maior estudo sobre a questão, a investigação de Schmitt, Jiang e Grabe com 661 aprendizes em 2011, encontrou uma relação amplamente linear entre palavras conhecidas e compreensão, sem nenhum penhasco dramático. Uma replicação de 2023 não conseguiu reproduzir o original. E, para a compreensão oral, van Zeeland e Schmitt verificaram que a maioria dos aprendizes acompanhava textos falados adequadamente com 90 por cento de cobertura, o que colocaria a exigência mais perto de 2.000 a 3.000 famílias do que de 7.000.</p>
      <p>A versão honesta, portanto, é uma faixa e não uma meta: algo entre três mil e nove mil famílias de palavras, dependendo do que você quer fazer com o idioma. Continua sendo um número enorme, e é a razão pela qual o vocabulário, e não a gramática, é a restrição decisiva para quase todo aprendiz adulto.</p>

      <h2>De Onde as Palavras Realmente Vêm</h2>
      <p>Há dois mecanismos disponíveis. Você pode absorver palavras incidentalmente pela exposição, ou pode estudá-las deliberadamente. Ambos funcionam. Não funcionam igualmente.</p>
      <p>A rota incidental é bem medida. Uma meta-análise de 2023 de Uchihara, Webb e Yanagisawa reuniu 24 estudos com 2.771 aprendizes e encontrou um efeito geral grande. Mas quando se pergunta qual proporção das palavras-alvo foi de fato aprendida, os números desinflam rápido: cerca de 18 por cento para reconhecer a forma e 9 por cento para recuperar o significado. A leitura entregou algo em torno de 17 por cento das palavras-alvo; assistir a vídeo, 7 por cento. Os autores estimam a taxa de aquisição incidental em menos de 0,02 palavra por minuto. Nesse ritmo, uma hora diária de leitura por prazer rende cerca de uma palavra nova.</p>
      <p>Os estudos longitudinais são mais duros. Waring e Takaki deram um livro graduado a aprendizes e os testaram três meses depois: na medida mais rigorosa, uma palavra em 25 sobreviveu, e nada encontrado menos de oito vezes sobreviveu. Brown, Waring e Donkaewbua encontraram cerca de uma palavra retida por aprendiz após três meses de leitura, e nenhuma a partir da escuta isolada.</p>
      <p>O estudo deliberado é de outra ordem de grandeza. A meta-análise de 2020 de Webb, Yanagisawa e Uchihara sobre atividades intencionais de vocabulário &mdash; 100 tamanhos de efeito em 2.202 aprendizes &mdash; encontrou ganhos imediatos de cerca de 60 por cento das palavras-alvo na evocação de significado, caindo para 39 por cento em testes adiados, e 25 por cento na evocação produtiva da forma. A perda é real. Também é, entre 25 e 39 por cento, várias vezes o que a exposição sozinha entrega.</p>
      <p>A conclusão não é que ler seja inútil. É que ler é como você encontra as palavras e a prática deliberada é como você as mantém, e um produto que oferece uma sem a outra está oferecendo metade de um sistema.</p>

      <h2>O Achado Mais Confiável da Área</h2>
      <p>Se a pesquisa em segunda língua tem um único resultado robusto de engenharia, é o espaçamento.</p>
      <p>A síntese de Cepeda e colegas, de 2006, cobriu 317 experimentos e 14.811 participantes: a prática espaçada superou a prática concentrada em cerca de dez pontos percentuais na evocação, 47,3 por cento contra 36,7. O estudo de acompanhamento de 2008, com 1.354 participantes, mapeou o formato da curva. O intervalo ótimo é de aproximadamente 20 por cento do período pelo qual você precisa lembrar, para prazos de algumas semanas, caindo para cerca de 5 por cento no horizonte de um ano. No ponto ótimo o ganho foi de 64 por cento &mdash; um efeito muito grande para uma intervenção que não custa nada além de calendário.</p>
      <p>A meta-análise de Kim e Webb, de 2022, confirmou o efeito especificamente para a aprendizagem de segunda língua em 48 experimentos com 3.411 aprendizes, e encontrou algo que a indústria de flashcards raramente menciona: intervalos iguais e intervalos expansivos tiveram desempenho equivalente. O algoritmo não é a mágica. O intervalo é.</p>
      <p>O achado companheiro é a evocação. Os experimentos de Roediger e Karpicke, de 2006, produziram um cruzamento que deveria estar impresso na tela inicial de todo aplicativo de estudo. Estudantes que reliam o material acertaram 81 por cento após cinco minutos e 42 por cento após uma semana. Estudantes que se autotestavam acertaram 75 por cento e 56 por cento. Reler parece mais produtivo e é pior.</p>
      <p>A meta-análise de Rowland, de 2014, com 61 estudos, situa o efeito do teste em magnitude moderada no geral, com uma condição crucial anexada. Com feedback, o efeito foi de 0,73; sem ele, 0,39. E quando os aprendizes eram testados sobre material que em boa parte ainda não conheciam e não recebiam feedback, o efeito desabou para 0,03 &mdash; estatisticamente nada. Prática de evocação sem correção não é prática. É adivinhação.</p>
      <p>Uma objeção comum merece aposentadoria. Diz-se com frequência que flashcards produzem conhecimento de reconhecimento inerte, que você acerta o cartão e ainda assim não tem a palavra. O estudo de Elgort, de 2011, testou isso diretamente, ensinando a 48 aprendizes avançados um conjunto de palavras inventadas em cronograma espaçado e medindo-os depois com tarefas de priming que sondam o acesso lexical automático. Os itens estudados se comportaram como palavras genuinamente conhecidas. O estudo espaçado deliberado constrói representações lexicais reais. O que nenhum estudo dessa literatura mostra é que ele produz fluência oral, porque nenhum deles mediu isso.</p>

      <h2>A História da Imersão É Meia Verdade</h2>
      <p>A imersão é a outra metade do modelo popular: vá para lá, e acontece.</p>
      <p>A resposta meta-analítica é um sim com ressalvas. Tseng e colegas reuniram 42 estudos de intercâmbio em 2024 e relataram um efeito geral grande. Mas a maior parte da pesquisa subjacente é pré e pós dentro de um único grupo, o que mede &ldquo;os estudantes melhoraram ao longo de um semestre&rdquo; e não &ldquo;o intercâmbio superou ficar em casa.&rdquo;</p>
      <p>Onde os estudos fazem essa comparação, encontram algo mais específico. O estudo de Collentine, de 2004, com 46 aprendizes de espanhol, verificou que o grupo em sala de aula no país de origem desenvolveu mais em traços gramaticais e lexicais discretos, enquanto o grupo de intercâmbio voltou com melhor discurso narrativo e produção mais densa e fluente. A imersão compra fluência e confiança. Ela não compra precisão de forma confiável.</p>
      <p>E não funciona para todos. Sunderman e Kroll documentaram um efeito de limiar: aprendizes abaixo de certo nível de recursos de memória de trabalho simplesmente não converteram imersão em ganhos de produção. O mesmo padrão aparece na meta-análise sobre insumo, na qual a aprendizagem incidental foi duas vezes mais eficaz para aprendizes proficientes do que para iniciantes, e duas vezes mais eficaz a partir de materiais escritos para aprendizes do que de materiais voltados a nativos. O trabalho de Nick Ellis sobre atenção aprendida fornece o mecanismo: os padrões entrincheirados da primeira língua impedem que adultos sequer percebam certas formas da segunda língua no fluxo, de modo que a frequência nunca tem a chance de operar sobre elas.</p>
      <p>O que produz o achado que deveria governar qualquer produto voltado a iniciantes. A imersão não modificada é quase inútil no começo. Ela se torna poderosa precisamente quando você já sabe o suficiente para que seja compreensível. O aprendiz que mais precisa de imersão é aquele a quem ela menos ajuda, e dizer a um iniciante para simplesmente assistir a séries no idioma é um conselho que começará a funcionar para ele em cerca de dois anos.</p>

      <h2>O Que a Indústria Construiu no Lugar</h2>
      <p>Diante de um problema difícil de retenção, a categoria de aplicativos de idiomas convergiu para uma solução emprestada dos jogos: pontos, níveis, rankings e, acima de tudo, ofensivas diárias.</p>
      <p>A literatura sobre essa escolha não é animadora. A meta-análise de Deci, Koestner e Ryan sobre 128 experimentos continua sendo a referência. Recompensas tangíveis reduziram a motivação intrínseca em livre escolha com efeito de &minus;0,34 no geral. Recompensas condicionadas à conclusão de uma tarefa &mdash; exatamente o que &ldquo;termine sua lição, mantenha sua ofensiva&rdquo; é &mdash; ficaram em &minus;0,36. Recompensas condicionadas ao desempenho, o caso do ranking, em &minus;0,28. Dois achados vão na direção oposta, e importam: recompensas inesperadas não causaram dano algum, e a recompensa verbal, ou seja, feedback positivo e informativo sobre o que você de fato fez, elevou a motivação intrínseca em +0,33.</p>
      <p>Essa distinção é o argumento inteiro. Uma recompensa anunciada de antemão por concluir uma atividade desloca a razão de fazê-la. O retorno sobre a própria capacidade crescente a fortalece. A maioria dos aplicativos de idiomas é construída quase inteiramente com o primeiro tipo.</p>
      <p>A literatura da própria gamificação é mais simpática, mas mais frágil do que sua reputação. A meta-análise de Sailer e Homner, de 2020, encontrou efeitos positivos em desfechos cognitivos, motivacionais e comportamentais. A ressalva é o achado: quando a análise foi restrita a estudos de alta qualidade, os efeitos motivacionais e comportamentais desapareceram, enquanto o efeito cognitivo sobreviveu. A comparação de um semestre inteiro feita por Hanus e Fox entre duas turmas do mesmo curso, uma delas com rankings e medalhas, encontrou estudantes gamificados terminando com menos motivação intrínseca, menos satisfação e notas finais mais baixas &mdash; com o efeito na prova mediado pela perda de motivação.</p>
      <p>Enquanto isso, o que de fato se sabe sobre resultados nessa categoria é notavelmente escasso. O número de eficácia mais citado, o de que 34 horas de Duolingo cobrem o primeiro semestre universitário de espanhol, vem de um relatório de 2012 financiado pela própria Duolingo, sem revisão por pares, sem grupo de controle, no qual 196 pessoas começaram e 88 terminaram &mdash; e no qual nenhum participante foi de fato acompanhado até o limiar alegado. As 34 horas são uma extrapolação a partir de uma taxa por hora. Um estudo de 2024 em <em>Language Learning &amp; Technology</em>, também apoiado financeiramente pela Duolingo e coassinado por dois de seus cientistas de aprendizagem, é mais cuidadoso e menos lisonjeiro: doze semanas e cerca de 27 horas moveram os aprendizes de Novice-Mid para Novice-High. Até o momento, não existe nenhum estudo revisado por pares sobre ofensivas e retenção usando dados de plataforma.</p>

      <h2>Por Que as Pessoas Realmente Desistem</h2>
      <p>O melhor estudo empírico sobre abandono em aprendizes adultos não é sobre aplicativos, mas é instrutivo. Evans e Tragant pesquisaram 260 aprendizes adultos em uma escola de idiomas universitária de Barcelona, dos quais 154 haviam abandonado. Os motivos declarados, em ordem: falta de tempo (26,6 por cento), não ser relevante para o trabalho (15,4), motivos pessoais (14,3), custo (13,9), o método usado em aula (11,9) e falta de progresso (6,1).</p>
      <p>Essa ordenação é uma reprimenda a boa parte do pensamento de produto. Os motivos dominantes são custo de oportunidade &mdash; tempo, dinheiro, relevância. Falta de progresso é citada por cerca de um desistente em dezesseis.</p>
      <p>Mas as duas categorias interagem de um jeito que vale nomear. O tempo é escasso na proporção do que mais ele poderia comprar. Um aprendiz abandona um idioma quando a hora deixa de parecer que compra alguma coisa. E aqui o cruzamento de Roediger e Karpicke volta com força, porque a sensação subjetiva de progresso dos aprendizes favorece sistematicamente o método que produz aprendizagem menos durável. Reler parece progresso. Evocar parece fracasso. Um aplicativo que otimiza para a sensação de progresso e um aplicativo que otimiza para progresso resolvem problemas diferentes, e o primeiro é muito mais fácil de vender.</p>
      <p>O platô intermediário que todo mundo relata é real como experiência e pouco evidenciado como fenômeno; não há literatura quantitativa rigorosa sobre ele. Mas há um mecanismo plausível e bem evidenciado bem ali nas tabelas de cobertura. A frequência das palavras é zipfiana. Ir de 2.000 para 3.000 famílias compra vários pontos percentuais de cobertura de texto. Ir de 8.000 para 9.000 compra uma fração de um. O esforço do aprendiz é constante; o retorno visível desaba. O platô não é uma falha psicológica. É uma curva.</p>

      <h2>O Único Lugar Onde os Jogos Têm Evidência Forte</h2>
      <p>Diante disso, o argumento a favor de jogos para aprender idiomas precisa ser construído com cuidado, porque a literatura experimental sobre aprendizagem de idiomas baseada em jogos digitais é mais fraca do que seus entusiastas sugerem: estudos pequenos, intervenções curtas e várias meta-análises relatando tamanhos de efeito grandes o bastante para serem implausíveis.</p>
      <p>A evidência forte está em outro lugar, e não é experimental. Pia Sundqvist e colegas passaram quinze anos medindo o que adolescentes suecos fazem com o inglês fora da escola. Em um estudo com 80 jovens de quinze anos, os que jogavam jogos digitais cinco ou mais horas por semana marcaram 22,7 de 45 em um teste de vocabulário produtivo, contra 13,7 dos não jogadores e 14,4 dos jogadores moderados, com o mesmo padrão monotônico em uma segunda medida de vocabulário &mdash; 71,6 contra 55,2 &mdash; e tamanhos de efeito grandes para qualquer padrão da pesquisa em educação. O padrão se replicou em uma coorte de onze e doze anos. A tese anterior de Sundqvist verificou que as atividades que previam vocabulário eram as produtivas e interativas &mdash; jogos, internet, leitura &mdash; e não as passivas, como música e televisão.</p>
      <p>A ressalva causal é real, e os autores a declaram: jogadores frequentes podem já ser melhores em inglês, o que é em parte a razão de terem escolhido jogos em inglês. Mas o mecanismo não é misterioso. Esses aprendizes acumularam milhares de horas de insumo autoescolhido, significativo e moderadamente compreensível, ao longo de anos, de graça, porque queriam.</p>
      <p>Esse é o achado de verdade. Jogos não são um método de ensino melhor. São o veículo de entrega com melhor evidência para a única coisa com que todo modelo dessa literatura concorda: quantidades enormes de insumo voluntário, sustentadas ao longo do tempo.</p>

      <h2>Como Seria um Projeto Que Levasse Isso a Sério</h2>
      <p>Coloque os achados lado a lado e uma especificação se desprende, uma que quase não se parece com a categoria atual.</p>
      <p>Ela trataria o vocabulário como a restrição decisiva e faria da contagem de palavras aquilo que o sistema acompanha e devolve ao usuário, porque é isso que de fato limita a compreensão. Ela combinaria insumo com evocação espaçada deliberada, e daria feedback em toda evocação, porque evocação sem feedback vale aproximadamente zero. Ela graduaria o insumo ao aprendiz em vez de jogar iniciantes em material nativo, porque insumo modificado praticamente dobra a taxa de aquisição. Ela derivaria o nível do aprendiz do comportamento dele em vez de pedir que ele o declare, já que o autorrelato é exatamente o tipo de saída que o sistema já consegue medir diretamente.</p>
      <p>Ela removeria recompensas condicionadas à conclusão &mdash; ofensivas, cotas, números diários &mdash; e as substituiria por retorno informativo sobre capacidade demonstrada, porque o sinal meta-analítico se inverte entre as duas. Ela nunca puniria a ausência, já que a punição é o mecanismo pelo qual uma semana perdida vira uma desistência. E ela ligaria a aprendizagem a algo que o aprendiz queira por si mesmo e ao qual volte por meses, porque insumo voluntário em escala é a única coisa nessa literatura que produz de forma confiável vocabulários grandes no mundo real.</p>

      <h2>Um Caso de Teste, Atualmente em Beta</h2>
      <p>Um aplicativo agora em testes corresponde a essa especificação de perto o bastante para valer a descrição &mdash; menos como recomendação e mais como prova de que o projeto é construível.</p>
      <p>Vocabi é um aplicativo de aprendizado de idiomas construído como um pequeno mundo aberto. Você chega a um bosque de bétulas na borda de uma vila tomada pelo musgo e pela ruína, e a reconstrói. As mecânicas se mapeiam sobre a evidência com clareza incomum.</p>
      <p><strong>A prática é a única fonte de energia</strong>, e a energia é o que permite agir no mundo: cavar, cortar, colher, construir. Mas ficar sem ela nunca te impede. Energia baixa te deixa lento e letárgico; não há morte, não há medidor de fome, não há bloqueio. A energia drena pela ausência, não pela presença &mdash; passe alguns dias fora e a barra esvazia, mas voltar não custa nada e perdoa tudo.</p>
      <p><strong>Palavras são literalmente chaves.</strong> Os objetos do mundo carregam requisitos de vocabulário. Um bote a remo exige seis palavras &mdash; barco, remo, corda, lago, peixe, rede &mdash; e até você tê-las ele afunda sob seus pés, de forma visível e repetida, num gesto pensado para ensinar e não para punir. E o mais importante: o portão se abre no instante em que a palavra entra no seu baralho, não quando você a domina. É um toque só. Os projetistas chamam isso de ensinar-e-seguir em vez de muro, o que é, na prática, o mecanismo de encontrar a palavra colada ao seu referente que os teóricos do insumo defendem, com o objeto fornecendo o significado.</p>
      <p><strong>Palavras aprendidas são o material de construção.</strong> O estoque de tijolos é limitado pelo seu vocabulário: uma palavra aprendida, um tijolo disponível, sendo aprendida definida como oitenta por cento de acerto em pelo menos cinco tentativas. O estado visível da sua vila é uma leitura da sua contagem de palavras. Isso é um marcador de progresso atrelado a capacidade demonstrada, e não a comparecimento, que é justamente a distinção sobre a qual gira a literatura das recompensas.</p>
      <p><strong>O nível é derivado, não perguntado.</strong> A faixa CEFR do aprendiz é calculada a partir da contagem de palavras aprendidas &mdash; abaixo de 500 palavras é A1, abaixo de 1.000 A2, abaixo de 2.000 B1, e assim por diante &mdash; e o aplicativo silenciosamente serve texto mais simples dentro do mundo a quem está mais abaixo na escada. Isso é insumo graduado aplicado automaticamente, que foi o moderador que dobrou as taxas de aquisição na meta-análise.</p>
      <p><strong>A superfície de leitura e a de estudo são a mesma superfície.</strong> Tudo no mundo pode ser tocado para exibir uma tradução e adicionado a um baralho de repetição espaçada no mesmo gesto. Fragmentos de folclore, pedras entalhadas, canções e páginas rasgadas de livros de histórias estão espalhados como objetos físicos; abrir um deles no leitor ensina um conjunto temático de palavras e uma linha da mitologia do mundo ao mesmo tempo. Uma série de jogos de palavras &mdash; pares, conjugação verbal, palavras cruzadas, caça-palavras, blocos de palavras e um treinador de alfabeto para escritas não latinas &mdash; cuida da evocação, com feedback, em sessões curtas.</p>
      <p>E não há ofensivas, cotas diárias nem punição de qualquer tipo. O pilar de projeto declarado é curiosidade acima do medo.</p>
      <p>O que não se sabe é se algo disso funciona, e seria desonesto fingir o contrário. Não há dados publicados de resultado, o aplicativo está em beta com um grupo pequeno de testadores e, como este artigo se esforçou por estabelecer, ninguém nesse setor demonstrou o que mantém um aprendiz estudando daqui a um ano. Alinhamento com a evidência é motivo para esperar algo. Não é um resultado.</p>

      <h2>O Resumo Honesto</h2>
      <p>Sabemos com confiança razoável o que constrói vocabulário: evocação espaçada com feedback, insumo graduado ao aprendiz e volume. Sabemos o que corrói a motivação: recompensas atreladas a obediência em vez de a capacidade. Sabemos que a imersão é um multiplicador de conhecimento existente, e não um substituto dele. E sabemos que os maiores vocabulários reais da literatura de pesquisa pertencem a adolescentes que passaram milhares de horas não supervisionadas fazendo algo de que gostavam num idioma que não era o deles.</p>
      <p>O que ninguém mostrou é qual desenho de produto converte esse conhecimento em uma pessoa que, daqui a três anos, consegue ler um romance num idioma que não tinha. O espaço de projeto está totalmente aberto, e vem sendo explorado sobretudo por empresas que otimizam para usuários ativos diários. Há lugar para alguém otimizar a outra coisa.</p>

      <h2>Fontes</h2>
      <ul class="sources">
        <li>Nation, I.S.P. (2006). How large a vocabulary is needed for reading and listening? <em>Canadian Modern Language Review</em>, 63(1). <a href="https://www.lextutor.ca/cover/papers/nation_2006.pdf" target="_blank" rel="noopener">PDF</a></li>
        <li>Laufer, B., &amp; Ravenhorst-Kalovski, G.C. (2010). Lexical text coverage, learners&rsquo; vocabulary size and reading comprehension. <em>Reading in a Foreign Language</em>, 22(1). <a href="https://files.eric.ed.gov/fulltext/EJ887873.pdf" target="_blank" rel="noopener">PDF</a></li>
        <li>Hu, M., &amp; Nation, P. (2000). Unknown vocabulary density and reading comprehension. <em>Reading in a Foreign Language</em>, 13(1). <a href="https://eric.ed.gov/?id=EJ626518" target="_blank" rel="noopener">ERIC</a></li>
        <li>Schmitt, N., Jiang, X., &amp; Grabe, W. (2011). The percentage of words known in a text and reading comprehension. <em>Modern Language Journal</em>, 95(1). <a href="https://eric.ed.gov/?id=EJ928357" target="_blank" rel="noopener">ERIC</a></li>
        <li>Kremmel, B., et al. (2023). Unknown vocabulary density and reading comprehension: Replicating Hu and Nation (2000). <em>Language Learning</em>. <a href="https://onlinelibrary.wiley.com/doi/10.1111/lang.12622" target="_blank" rel="noopener">DOI</a></li>
        <li>van Zeeland, H., &amp; Schmitt, N. (2013). Lexical coverage in L1 and L2 listening comprehension. <em>Applied Linguistics</em>, 34(4). <a href="https://academic.oup.com/applij/article-abstract/34/4/457/199564" target="_blank" rel="noopener">Abstract</a></li>
        <li>Uchihara, T., Webb, S., &amp; Yanagisawa, A. (2023). How effective is second language incidental vocabulary learning? A meta-analysis. <em>Language Teaching</em>. <a href="https://eric.ed.gov/?id=EJ1373102" target="_blank" rel="noopener">ERIC</a></li>
        <li>Webb, S., Yanagisawa, A., &amp; Uchihara, T. (2020). How effective are intentional vocabulary-learning activities? A meta-analysis. <em>Modern Language Journal</em>, 104(4). <a href="https://eric.ed.gov/?id=EJ1277328" target="_blank" rel="noopener">ERIC</a></li>
        <li>Waring, R., &amp; Takaki, M. (2003). At what rate do learners learn and retain new vocabulary from reading a graded reader? <em>Reading in a Foreign Language</em>, 15(2). <a href="https://eric.ed.gov/?id=EJ676380" target="_blank" rel="noopener">ERIC</a></li>
        <li>Brown, R., Waring, R., &amp; Donkaewbua, S. (2008). Incidental vocabulary acquisition from reading, reading-while-listening, and listening to stories. <em>Reading in a Foreign Language</em>, 20(2). <a href="https://files.eric.ed.gov/fulltext/EJ815119.pdf" target="_blank" rel="noopener">PDF</a></li>
        <li>Cepeda, N.J., et al. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. <em>Psychological Bulletin</em>, 132(3). <a href="https://pubmed.ncbi.nlm.nih.gov/16719566/" target="_blank" rel="noopener">PubMed</a></li>
        <li>Cepeda, N.J., et al. (2008). Spacing effects in learning: A temporal ridgeline of optimal retention. <em>Psychological Science</em>, 19(11). <a href="https://files.eric.ed.gov/fulltext/ED505660.pdf" target="_blank" rel="noopener">PDF</a></li>
        <li>Kim, S.K., &amp; Webb, S. (2022). The effects of spaced practice on second language learning: A meta-analysis. <em>Language Learning</em>, 72(1). <a href="https://onlinelibrary.wiley.com/doi/abs/10.1111/lang.12479" target="_blank" rel="noopener">DOI</a></li>
        <li>Roediger, H.L., &amp; Karpicke, J.D. (2006). Test-enhanced learning. <em>Psychological Science</em>, 17(3). <a href="https://journals.sagepub.com/doi/10.1111/j.1467-9280.2006.01693.x" target="_blank" rel="noopener">DOI</a></li>
        <li>Rowland, C.A. (2014). The effect of testing versus restudy on retention: A meta-analytic review. <em>Psychological Bulletin</em>, 140(6). <a href="https://pubmed.ncbi.nlm.nih.gov/25150680/" target="_blank" rel="noopener">PubMed</a></li>
        <li>Elgort, I. (2011). Deliberate learning and vocabulary acquisition in a second language. <em>Language Learning</em>, 61(2). <a href="https://eric.ed.gov/?id=EJ928530" target="_blank" rel="noopener">ERIC</a></li>
        <li>Tseng, W.-T., et al. (2024). Revisiting the effectiveness of study abroad language programs: A multi-level meta-analysis. <em>Language Teaching Research</em>, 28(1). <a href="https://journals.sagepub.com/doi/full/10.1177/1362168820988423" target="_blank" rel="noopener">DOI</a></li>
        <li>Collentine, J. (2004). The effects of learning contexts on morphosyntactic and lexical development. <em>SSLA</em>, 26(2). <a href="https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/abs/effects-of-learning-contexts-on-morphosyntactic-and-lexical-development/555727833FCCE32FFF829ACCE6193C26" target="_blank" rel="noopener">Cambridge</a></li>
        <li>Sunderman, G., &amp; Kroll, J.F. (2009). When study-abroad experience fails to deliver: The internal resources threshold effect. <em>Applied Psycholinguistics</em>, 30(1). <a href="https://www.cambridge.org/core/journals/applied-psycholinguistics/article/abs/when-studyabroad-experience-fails-to-deliver-the-internal-resources-threshold-effect/6FA3E81AAE4316773764788F98FF9AB0" target="_blank" rel="noopener">Cambridge</a></li>
        <li>Ellis, N.C. (2002). Frequency effects in language processing. <em>SSLA</em>, 24(2). <a href="https://www.lextutor.ca/hyp/1/ellis_2002.pdf" target="_blank" rel="noopener">PDF</a></li>
        <li>Deci, E.L., Koestner, R., &amp; Ryan, R.M. (1999). A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation. <em>Psychological Bulletin</em>, 125(6). <a href="https://home.ubalt.edu/tmitch/642/articles%20syllabus/Deci%20Koestner%20Ryan%20meta%20IM%20psy%20bull%2099.pdf" target="_blank" rel="noopener">PDF</a></li>
        <li>Sailer, M., &amp; Homner, L. (2020). The gamification of learning: A meta-analysis. <em>Educational Psychology Review</em>, 32. <a href="https://link.springer.com/article/10.1007/s10648-019-09498-w" target="_blank" rel="noopener">Springer</a></li>
        <li>Hanus, M.D., &amp; Fox, J. (2015). Assessing the effects of gamification in the classroom. <em>Computers &amp; Education</em>, 80. <a href="https://www.sciencedirect.com/science/article/abs/pii/S0360131514002000" target="_blank" rel="noopener">ScienceDirect</a></li>
        <li>Vesselinov, R., &amp; Grego, J. (2012). <em>Duolingo Effectiveness Study: Final Report.</em> <a href="https://theowlapp.health/wp-content/uploads/2022/04/DuolingoReport_Final-1.pdf" target="_blank" rel="noopener">PDF</a></li>
        <li>Smith, B., Jiang, X., &amp; Peters, R. (2024). The effectiveness of Duolingo in developing receptive and productive language knowledge and proficiency. <em>Language Learning &amp; Technology</em>, 28(1). <a href="https://scholarspace.manoa.hawaii.edu/server/api/core/bitstreams/ea47a53e-da6e-4419-bd55-e72b458294f4/content" target="_blank" rel="noopener">PDF</a></li>
        <li>Evans, M., &amp; Tragant, E. (2020). Demotivation and dropout in adult EFL learners. <em>TESL-EJ</em>, 23(4). <a href="https://files.eric.ed.gov/fulltext/EJ1242642.pdf" target="_blank" rel="noopener">PDF</a></li>
        <li>Sundqvist, P., &amp; Wikström, P. (2015). Out-of-school digital gameplay and in-school L2 English vocabulary outcomes. <em>System</em>, 51. <a href="https://www5.kau.se/sites/default/files/Dokument/subpage/2015/05/sundqvist_wikstr_m_2015_out_of_school_digital_g_20892.pdf" target="_blank" rel="noopener">PDF</a></li>
        <li>Sundqvist, P. (2009). <em>Extramural English Matters</em> (tese de doutorado, Universidade de Karlstad). <a href="https://www5.kau.se/sites/default/files/Dokument/subpage/2014/01/sundqvist_2009_thesis_extramural_english_matters_p_90876.pdf" target="_blank" rel="noopener">PDF</a></li>
        <li>Lichtman, K., &amp; VanPatten, B. (2021). Was Krashen right? Forty years later. <em>Foreign Language Annals</em>, 54(1). <a href="https://fluencyfast.com/wp-content/uploads/LichtmanVanPatten2021aKrashen.pdf" target="_blank" rel="noopener">PDF</a></li>
      </ul>
    </template>

    <VocabiAdCard :lang="props.lang" />
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

.sources {
  margin: 0.5rem 0 0 1.1rem;
  padding: 0;
  font-size: 0.84rem;
  line-height: 1.55;
  color: var(--vt-c-text-light-2, #666);
}
.sources li { margin-bottom: 0.4rem; }
</style>
