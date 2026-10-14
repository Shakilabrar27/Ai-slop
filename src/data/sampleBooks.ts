import { Book } from '../types';

export const INITIAL_SAMPLE_BOOKS: Book[] = [
  {
    id: 'book-frankenstein',
    title: 'Frankenstein; or, The Modern Prometheus',
    author: 'Mary Wollstonecraft Shelley',
    description: 'The iconic gothic masterpiece exploring humanity, creation, and consequence through Victor Frankenstein and his creature.',
    format: 'epub',
    fileSize: 428000,
    dateAdded: Date.now() - 1000 * 60 * 60 * 24 * 3,
    isOfflineCached: true,
    progress: {
      bookId: 'book-frankenstein',
      currentChapterIndex: 1,
      currentPage: 2,
      totalPages: 4,
      percentage: 50,
      lastReadAt: Date.now() - 1000 * 60 * 25,
      secondsRead: 1420,
    },
    chapters: [
      {
        id: 'chap-f-1',
        title: 'Letter 1 — To Mrs. Saville, England',
        pageNumber: 1,
        wordCount: 1140,
        content: `
          <h2 class="text-2xl font-bold mb-4">Letter I</h2>
          <p class="italic text-sky-400/90 mb-6">St. Petersburgh, Dec. 11th, 17—</p>
          <p class="mb-4">You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.</p>
          <p class="mb-4">I am already far north of London, and as I walk in the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight. Do you understand this feeling? This breeze, which has travelled from the regions towards which I am advancing, gives me a foretaste of those icy climes. Inspirited by this wind of promise, my daydreams become more fervent and vivid.</p>
          <p class="mb-4">I try in vain to be persuaded that the pole is the seat of frost and desolation; it ever presents itself to my imagination as the region of beauty and delight. There, Margaret, the sun is for ever visible, its broad disk just skirting the horizon and diffusing a perpetual splendour. There—for with your leave, my sister, I will put some trust in preceding navigators—there snow and frost are banished; and, sailing over a calm sea, we may be wafted to a land surpassing in wonders and in beauty every region hitherto discovered on the habitable globe.</p>
          <p class="mb-4">Its productions and features may be without example, as the phenomena of the heavenly bodies undoubtedly are in those undiscovered solitudes. What may not be expected in a country of eternal light? I may there discover the wondrous power which attracts the needle and may regulate a thousand celestial observations that require only this voyage to render their eccentricities consistent for ever.</p>
        `,
      },
      {
        id: 'chap-f-2',
        title: 'Chapter 1 — Genevese Origin & Youth',
        pageNumber: 2,
        wordCount: 1680,
        content: `
          <h2 class="text-2xl font-bold mb-4">Chapter I</h2>
          <p class="mb-4">I am by birth a Genevese, and my family is one of the most distinguished of that republic. My ancestors had been for many years counsellors and syndics, and my father had filled several public situations with honour and reputation. He was respected by all who knew him for his integrity and indefatigable attention to public business.</p>
          <p class="mb-4">He passed his younger days perpetually occupied by the affairs of his country; and it was not until the decline of life that he thought of marrying, and bestowing on the State sons who might carry his virtues and his name down to posterity.</p>
          <p class="mb-4">As the circumstances of his marriage illustrate his character, I cannot refrain from relating them. One of his most intimate friends was a merchant who, from a flourishing state, fell, through numerous mischances, into poverty. This man, whose name was Beaufort, was of a proud and unbending disposition and could not bear to live in poverty and oblivion in the same country where he had once enjoyed wealth and influence.</p>
          <p class="mb-4">When my father found that his friend had retreated to Lucerne, he sought him out. He discovered him living in wretchedness in an obscure quarter of the city. Beaufort had taken refuge there with his daughter, Caroline. My father took the dying man into his care, and after his death, married the orphaned daughter.</p>
          <p class="mb-4">Much as they were attached to each other, they seemed to draw inexhaustible stores of affection from a very mine of love to bestow them upon me. My mother’s tender caresses and my father’s smile of benevolent pleasure while regarding me are my first recollections. I was their plaything and their idol, and something better—their child, the innocent and helpless creature bestowed on them by heaven.</p>
        `,
      },
      {
        id: 'chap-f-3',
        title: 'Chapter 4 — The Spark of Being',
        pageNumber: 3,
        wordCount: 1820,
        content: `
          <h2 class="text-2xl font-bold mb-4">Chapter IV</h2>
          <p class="mb-4">From this day natural philosophy, and particularly chemistry, in the most comprehensive sense of the term, became nearly my sole occupation. I read with ardour those works, so full of genius and discrimination, which modern inquirers have written on these subjects.</p>
          <p class="mb-4">Two years passed in this manner, during which I paid no visit to Geneva, but was engaged, heart and soul, in the pursuit of some discoveries which I hoped to make. None but those who have experienced them can conceive of the enticements of science. In other studies you go as far as others have gone before you, and there is nothing more to know; but in a scientific pursuit there is continual food for discovery and wonder.</p>
          <p class="mb-4">To examine the causes of life, we must first have recourse to death. I became acquainted with the science of anatomy, but this was not sufficient; I must also observe the natural decay and corruption of the human body. In my education my father had taken the greatest precautions that my mind should be impressed with no supernatural horrors.</p>
          <p class="mb-4">Darkness had no effect upon my fancy, and a churchyard was to me merely the receptacle of bodies deprived of life. Now I was led to examine the cause and progress of this decay and forced to spend days and nights in vaults and charnel-houses.</p>
          <p class="mb-4">After days and nights of incredible labour and fatigue, I succeeded in discovering the cause of generation and life; nay, more, I became myself capable of bestowing animation upon lifeless matter!</p>
        `,
      },
      {
        id: 'chap-f-4',
        title: 'Chapter 5 — The Breath of Life',
        pageNumber: 4,
        wordCount: 1540,
        content: `
          <h2 class="text-2xl font-bold mb-4">Chapter V</h2>
          <p class="mb-4">It was on a dreary night of November that I beheld the accomplishment of my toils. With an anxiety that almost amounted to agony, I collected the instruments of life around me, that I might infuse a spark of being into the lifeless thing that lay at my feet.</p>
          <p class="mb-4">It was already one in the morning; the rain pattered dismally against the panes, and my candle was nearly burnt out, when, by the glimmer of the half-extinguished light, I saw the dull yellow eye of the creature open; it breathed hard, and a convulsive motion agitated its limbs.</p>
          <p class="mb-4">How can I describe my emotions at this catastrophe, or how delineate the wretch whom with such infinite pains and care I had endeavoured to form? His limbs were in proportion, and I had selected his features as beautiful. Beautiful! Great God!</p>
          <p class="mb-4">His yellow skin scarcely covered the work of muscles and arteries beneath; his hair was of a lustrous black, and flowing; his teeth of a pearly whiteness; but these luxuriances only formed a more horrid contrast with his watery eyes, that seemed almost of the same colour as the dun-white sockets in which they were set, his shrivelled complexion and straight black lips.</p>
        `,
      },
    ],
  },
  {
    id: 'book-time-machine',
    title: 'The Time Machine',
    author: 'H. G. Wells',
    description: 'The groundbreaking pioneer of modern science fiction, journeying into the far distant future of year 802,701 AD.',
    format: 'epub',
    fileSize: 312000,
    dateAdded: Date.now() - 1000 * 60 * 60 * 24 * 7,
    isOfflineCached: true,
    progress: {
      bookId: 'book-time-machine',
      currentChapterIndex: 0,
      currentPage: 1,
      totalPages: 2,
      percentage: 50,
      lastReadAt: Date.now() - 1000 * 60 * 60 * 5,
      secondsRead: 680,
    },
    chapters: [
      {
        id: 'chap-tm-1',
        title: 'Chapter 1 — The Fourth Dimension',
        pageNumber: 1,
        wordCount: 1450,
        content: `
          <h2 class="text-2xl font-bold mb-4">Chapter I: Introduction</h2>
          <p class="mb-4">The Time Traveller (for so it will be convenient to speak of him) was expounding a recondite matter to us. His grey eyes shone and twinkled, and his usually pale face was flushed and animated. The fire burnt brightly, and the soft radiance of the incandescent lights in the lilies of silver caught the bubbles that flashed and passed in our glasses.</p>
          <p class="mb-4">"You must follow me carefully," he began. "I shall have to controvert one or two ideas that are almost universally accepted. The geometry, for instance, they taught you at school is founded on a misconception."</p>
          <p class="mb-4">"Is not that rather a large thing to expect us to begin upon?" said Filby, an argumentative person with red hair.</p>
          <p class="mb-4">"I do not mean to ask you to accept anything without reasonable ground for it. You will soon admit as much as I need from you. You know of course that a mathematical line, a line of thickness nil, has no real existence. Nor has a mathematical plane. These things are mere abstractions."</p>
          <p class="mb-4">"Clearly," the Time Traveller proceeded, "any real body must have extension in four directions: it must have Length, Breadth, Thickness, and—Duration. But through a natural infirmity of the flesh, we incline to overlook this fact. There are really four dimensions, three which we call the three planes of Space, and a fourth, Time."</p>
        `,
      },
      {
        id: 'chap-tm-2',
        title: 'Chapter 2 — The Machine in Motion',
        pageNumber: 2,
        wordCount: 1390,
        content: `
          <h2 class="text-2xl font-bold mb-4">Chapter II: The Machine</h2>
          <p class="mb-4">The thing the Time Traveller held in his hand was a glittering metallic framework, scarcely larger than a small clock, and very delicately made. There was ivory in it, and some transparent crystalline substance. And now I must be very plain, for what followed, unless his explanation is to be accepted, is an unaccountable thing.</p>
          <p class="mb-4">He took one of the small octagonal tables that were scattered about the room, and set it in front of the fire, with two legs on the hearthrug. On this table he placed the mechanism. Then he drew up a chair, and sat down.</p>
          <p class="mb-4">"This little affair," said the Time Traveller, resting his elbows upon the table and pressing his hands together above the apparatus, "is only a model. It is my plan for a machine to travel through time. You will notice that it looks singularly askew, and that there is an odd twinkling appearance about this bar, as though it were in some way unreal."</p>
          <p class="mb-4">He pointed to the part with his finger. "Also, here is one little white lever, and here is another."</p>
        `,
      },
    ],
  },
  {
    id: 'book-alice',
    title: "Alice's Adventures in Wonderland",
    author: 'Lewis Carroll',
    description: 'A whimsical journey down the rabbit hole into a world of curious creatures, tea parties, and nonsensical logic.',
    format: 'epub',
    fileSize: 245000,
    dateAdded: Date.now() - 1000 * 60 * 60 * 24 * 12,
    isOfflineCached: true,
    progress: {
      bookId: 'book-alice',
      currentChapterIndex: 0,
      currentPage: 1,
      totalPages: 4,
      percentage: 25,
      lastReadAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
      secondsRead: 320,
    },
    chapters: [
      {
        id: 'chap-a-1',
        title: 'Chapter 1 — Down the Rabbit-Hole',
        pageNumber: 1,
        wordCount: 1350,
        content: `
          <h2 class="text-2xl font-bold mb-4">Chapter I: Down the Rabbit-Hole</h2>
          <p class="mb-4">Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, "and what is the use of a book," thought Alice, "without pictures or conversations?"</p>
          <p class="mb-4">So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.</p>
          <p class="mb-4">There was nothing so very remarkable in that; nor did Alice think it so very much out of the way to hear the Rabbit say to itself, "Oh dear! Oh dear! I shall be late!" But when the Rabbit actually took a watch out of its waistcoat-pocket, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.</p>
          <p class="mb-4">In another moment down went Alice after it, never once considering in the world how in the world she was to get out again.</p>
        `,
      },
      {
        id: 'chap-a-2',
        title: 'Chapter 2 — The Pool of Tears',
        pageNumber: 2,
        wordCount: 1420,
        content: `
          <h2 class="text-2xl font-bold mb-4">Chapter II: The Pool of Tears</h2>
          <p class="mb-4">"Curiouser and curiouser!" cried Alice (she was so much surprised, that for the moment she quite forgot how to speak good English); "now I'm opening out like the largest telescope that ever was! Good-bye, feet!"</p>
          <p class="mb-4">For when she looked down at her feet, they seemed to be almost out of sight, they were getting so far off. "Oh, my poor little feet, I wonder who will put on your shoes and stockings for you now, dears? I'm sure I shan't be able! I shall be a great deal too far off to trouble myself about you: you must manage the best way you can."</p>
          <p class="mb-4">Just at this moment her head struck against the roof of the hall: in fact she was now more than nine feet high, and she at once took up the little golden key and hurried off to the garden door.</p>
          <p class="mb-4">Poor Alice! It was as much as she could do, lying down on one side, to look through into the garden with one eye; but to get through was more hopeless than ever: she sat down and began to cry again.</p>
        `,
      },
      {
        id: 'chap-a-3',
        title: 'Chapter 3 — A Caucus-Race and a Long Tale',
        pageNumber: 3,
        wordCount: 1280,
        content: `
          <h2 class="text-2xl font-bold mb-4">Chapter III: A Caucus-Race and a Long Tale</h2>
          <p class="mb-4">They were indeed a queer-looking party that assembled on the bank—the birds with draggled feathers, the animals with their fur clinging close to them, and all dripping wet, cross, and uncomfortable.</p>
          <p class="mb-4">The first question of course was, how to get dry again: they had a consultation about this, and after a few minutes it seemed quite natural to Alice to find herself talking familiarly with them, as if she had known them all her life.</p>
          <p class="mb-4">"What I was going to say," said the Dodo in an offended tone, "was, that the best thing to get us dry would be a Caucus-race."</p>
          <p class="mb-4">"What is a Caucus-race?" said Alice; not that she wanted much to know, but the Dodo had paused as if it thought that somebody ought to speak, and no one else seemed inclined to say anything.</p>
          <p class="mb-4">"Why," said the Dodo, "the best way to explain it is to do it." First it marked out a race-course, in a sort of circle, and then all the party were placed along the course, here and there.</p>
        `,
      },
      {
        id: 'chap-a-4',
        title: 'Chapter 4 — The Rabbit Sends in a Little Bill',
        pageNumber: 4,
        wordCount: 1510,
        content: `
          <h2 class="text-2xl font-bold mb-4">Chapter IV: The Rabbit Sends in a Little Bill</h2>
          <p class="mb-4">It was the White Rabbit, trotting slowly back again, and looking anxiously about as it went, as if it had lost something; and she heard it muttering to itself "The Duchess! The Duchess! Oh my dear paws! Oh my fur and whiskers! She'll get me executed, as sure as ferrets are ferrets! Where can I have dropped them, I wonder?"</p>
          <p class="mb-4">Alice guessed in a moment that it was looking for the fan and the pair of white kid gloves, and she very good-naturedly began hunting about for them, but they were nowhere to be seen—everything seemed to have changed since her swim in the pool.</p>
          <p class="mb-4">Very soon the Rabbit noticed Alice, as she went hunting about, and called out to her in an angry tone, "Why, Mary Ann, what are you doing out here? Run home this moment, and fetch me a pair of gloves and a fan! Quick, now!"</p>
          <p class="mb-4">And Alice was so much frightened that she ran off at once in the direction it pointed to, without trying to explain the mistake it had made.</p>
        `,
      },
    ],
  },
  {
    id: 'book-guide-pdf',
    title: 'Windows 10 & 11 Lumina Reader Guide',
    author: 'Lumina Systems',
    description: 'Illustrated guide covering Windows shortcuts, Acrylic Frosted Glass settings, offline storage optimization, and cross-device syncing.',
    format: 'pdf',
    fileSize: 185000,
    dateAdded: Date.now() - 1000 * 60 * 60 * 2,
    isOfflineCached: true,
    progress: {
      bookId: 'book-guide-pdf',
      currentChapterIndex: 0,
      currentPage: 1,
      totalPages: 3,
      percentage: 33,
      lastReadAt: Date.now() - 1000 * 60 * 10,
      secondsRead: 450,
    },
    chapters: [
      {
        id: 'pdf-page-1',
        title: 'Page 1 — Overview & Windows Features',
        pageNumber: 1,
        wordCount: 300,
        content: `
          <div class="p-4 border border-sky-500/30 rounded-xl bg-sky-950/20 mb-6">
            <h1 class="text-3xl font-bold text-sky-400 mb-2">Lumina eBook Reader for Windows 10 & 11</h1>
            <p class="text-slate-300">Modern, resource-efficient architecture optimized for fluid reading and cross-device synchronization.</p>
          </div>
          <h2 class="text-xl font-semibold mb-3 text-slate-100">Key Features & Architecture:</h2>
          <ul class="list-disc pl-6 space-y-2 mb-6 text-slate-300">
            <li><strong>Minimal Resource Footprint:</strong> Virtualized DOM rendering, lazy chapter decompression, and low CPU/RAM overhead on battery-powered devices.</li>
            <li><strong>Fluent 2 & Frosted Glass Theme:</strong> Mica & Acrylic translucency with real-time backdrop blur, light/dark adaptation, and customizable glass tinting.</li>
            <li><strong>Cross-Device Cloud Sync:</strong> Seamlessly synchronizes reading progress, bookmarks, and highlights between your Windows PC, Surface, and mobile devices.</li>
            <li><strong>100% Offline Capability:</strong> High-speed IndexedDB caching ensures full uninterrupted offline reading anytime, anywhere.</li>
          </ul>
        `,
      },
      {
        id: 'pdf-page-2',
        title: 'Page 2 — Windows Keyboard Shortcuts',
        pageNumber: 2,
        wordCount: 280,
        content: `
          <h2 class="text-2xl font-bold mb-4 text-slate-100">Windows Keyboard Shortcuts Reference</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div class="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
              <div class="font-mono text-sky-400 font-semibold text-sm">Right Arrow / Space / Page Down</div>
              <div class="text-xs text-slate-400 mt-1">Turn to next page</div>
            </div>
            <div class="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
              <div class="font-mono text-sky-400 font-semibold text-sm">Left Arrow / Page Up / Backspace</div>
              <div class="text-xs text-slate-400 mt-1">Turn to previous page</div>
            </div>
            <div class="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
              <div class="font-mono text-sky-400 font-semibold text-sm">Ctrl + F</div>
              <div class="text-xs text-slate-400 mt-1">Search text in active book</div>
            </div>
            <div class="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
              <div class="font-mono text-sky-400 font-semibold text-sm">Ctrl + B</div>
              <div class="text-xs text-slate-400 mt-1">Add or remove bookmark</div>
            </div>
            <div class="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
              <div class="font-mono text-sky-400 font-semibold text-sm">Ctrl + ,</div>
              <div class="text-xs text-slate-400 mt-1">Open Appearance & Typography settings</div>
            </div>
            <div class="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
              <div class="font-mono text-sky-400 font-semibold text-sm">F11</div>
              <div class="text-xs text-slate-400 mt-1">Toggle Distraction-Free Fullscreen</div>
            </div>
          </div>
        `,
      },
      {
        id: 'pdf-page-3',
        title: 'Page 3 — Cloud Sync & Offline Storage',
        pageNumber: 3,
        wordCount: 310,
        content: `
          <h2 class="text-2xl font-bold mb-4 text-slate-100">Syncing & Offline Cache Management</h2>
          <p class="mb-4 text-slate-300">Lumina includes an intelligent multi-tier synchronization protocol:</p>
          <ul class="list-disc pl-6 space-y-2 mb-4 text-slate-300">
            <li><strong>Local-First Principle:</strong> All books, annotations, and bookmarks are committed to browser-native IndexedDB first for instant, zero-latency access.</li>
            <li><strong>Device Pairing:</strong> Generate a unique Device Pair Key to sync progress with other computers, Surface tablets, or smartphones without mandatory account registration.</li>
            <li><strong>Conflict Resolution:</strong> When two devices update reading progress, the latest timestamp takes priority while keeping all bookmarks and annotations consolidated.</li>
          </ul>
          <p class="text-slate-400 italic text-sm mt-4">Tip: Click the Cloud Sync button in the Windows titlebar to review active connected devices or initiate an immediate manual push/pull.</p>
        `,
      },
    ],
  },
];
