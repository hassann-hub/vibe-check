import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini SDK with User-Agent header as required
const rawKey = process.env.GEMINI_API_KEY || "";
const hasValidApiKey = Boolean(
  rawKey &&
  rawKey !== "MY_GEMINI_API_KEY" &&
  rawKey.trim().length > 15 &&
  !rawKey.includes("MY_GEMINI")
);

const ai = hasValidApiKey
  ? new GoogleGenAI({
      apiKey: rawKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

function withTimeout<T>(promise: Promise<T>, ms: number = 2500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('AI generation timeout')), ms)
    )
  ]);
}

// Fallback pools for offline / quick generation
export const FALLBACK_VIBE_TYPES = [
  {
    vibeType: "3 AM Overthinker Pro Max",
    emoji: "🧠",
    themeGradient: "purple-neon",
    roast: [
      "Raat ko 3 baje ceiling ghoorte hue pure universe ki philosophical problems solve karte ho.",
      "10 saal pehle school assembly mein jo embarrassing mistake ki thi, aaj bhi uska guilt trip chal raha hai.",
      "Dost bolte hain 'chill kar bhai', lekin tumhara brain 144Hz pe overthinking chala raha hai."
    ],
    traits: [
      "Sleep schedule is purely imaginary",
      "Drafts folder mein 47 unposted rants hain",
      "Reel dekh kar existential crisis mein chale jaate ho"
    ],
    redFlag: "Message seen karke dimaag mein reply de dete ho aur phir 4 din baad yaad aata hai.",
    greenFlag: "Group chat mein 2 baje koi ro raha ho toh instantly therapist ban jaate ho.",
    vibeQuote: "Neend nahi aa rahi, bas trauma yaad aa raha hai."
  },
  {
    vibeType: "Main Character Energy (2% Battery)",
    emoji: "💅",
    themeGradient: "sunset-pink",
    roast: [
      "Metro mein earphone lagakar sad song sunte hue window se bahar aise dekhte ho jaise Imtiaz Ali ki movie shoot ho rahi ho.",
      "Story daal ke 2 second baad check karte ho ki kis-kis ne dekh li (khas kar us ek insaan ne).",
      "Aesthetic reel banana aati hai, par bank account dekh kar dil baith jaata hai."
    ],
    traits: [
      "Outfits are 10/10, social battery is 2%",
      "Swiggy cart mein 4 desserts add karke cancel kar dete ho",
      "Har problem ka ek hi solution: 'I need a solo trip to mountains'"
    ],
    redFlag: "Fight hone pe 50-second ki emotional voice note bhejte ho background music ke sath.",
    greenFlag: "Outfit check aur candid photos lene mein tumse badhiya dost koi nahi hai.",
    vibeQuote: "Main apni favourite hoon... jab tak credit card statement nahi aati."
  },
  {
    vibeType: "Silent Group Chat CBI Officer",
    emoji: "🕵️‍♂️",
    themeGradient: "electric-cyan",
    roast: [
      "Group chat mein 500 messages hote hain aur tum ek word nahi bolte, par har single kalesh ki detailed timeline yaad hai.",
      "Kisi ka username dekh kar uski 2017 tak ki Facebook profile aur ex ki current story nikal lete ho.",
      "Online ho, active now ka green dot chamak raha hai, par message ka reply do business days baad aayega."
    ],
    traits: [
      "Screenshot folder iCloud ka 80% space leta hai",
      "Mute on notifications since 2021",
      "Har fight mein popcorn lekar neutral spectator bane rehte ho"
    ],
    redFlag: "Ek baar galti se kisi ki 42 weeks purani photo double tap kardi thi.",
    greenFlag: "Secret keep karne mein tumhari loyality FBI se bhi upar hai.",
    vibeQuote: "Main bolta kam hoon, par mujhe pata sab kuch hai."
  },
  {
    vibeType: "Swiggy Cart Collector & Procrastinator",
    emoji: "🍕",
    themeGradient: "toxic-lime",
    roast: [
      "Padhai ya kaam shuru karne se pehle 'pehle mast kuch order kar leta hoon' mindset chalta hai.",
      "Cart mein 800 rupaye ka food add karke delivery fee dekh kar 15 minute contemplate karte ho.",
      "'Kal subah 6 baje uthunga' bolkar subah 11 baje snooze button se ladai hoti hai."
    ],
    traits: [
      "Zomato delivery boy ko tumhara room number ratta hua hai",
      "10 alarms set hain with 5 minute intervals",
      "Har new year resolution 3 January ko khatam ho jaata hai"
    ],
    redFlag: "'Bas 5 minute mein nikal raha hoon' bol kar bistar se pairo ko neeche bhi nahi utara hota.",
    greenFlag: "Food spots aur sasta khana dhoondhne ke maamle mein tum Google Maps se aage ho.",
    vibeQuote: "Diet kal se, gym agle Monday se, sleep abhi se."
  },
  {
    vibeType: "Delulu Is The Only Solulu CEO",
    emoji: "🦄",
    themeGradient: "cyber-violet",
    roast: [
      "Usne bas 'Haha' bhej diya aur tumne dimaag mein wedding playlist aur 2 bachho ke naam decide kar liye.",
      "Reality se tumhara connection utna hi weak hai jitna BSNL ka 4G network train mein.",
      "Horoscope mein likha tha 'New beginnings', aur tumne bina soche ex ko unblock kar diya."
    ],
    traits: [
      "Signs from universe dhoondhne mein PhD hai",
      "Pinterest boards full of dream life while living in pajamas",
      "Spotify wrap mein depressing breakup songs jabki single ho"
    ],
    redFlag: "Red flags ko carnival lights samajh kar party shuru kar dete ho.",
    greenFlag: "Tumhara optimism itna contagious hai ki dost depression se seedha laughter club pahunch jaate hain.",
    vibeQuote: "If not real, why so cinematic in my head?"
  }
];

export async function generateVibeResult(name: string, answersSummary: string) {
  if (!ai || !hasValidApiKey) {
    // Return curated fallback
    const pick = FALLBACK_VIBE_TYPES[Math.floor(Math.random() * FALLBACK_VIBE_TYPES.length)];
    return {
      ...pick,
      userName: name || "Dost",
      isAiGenerated: false
    };
  }

  try {
    const prompt = `
User's Name: ${name || "Dost"}
Quiz Answers Summary:
${answersSummary}

Task:
Generate a hilarious, viral Gen Z personality card and roast in casual HINGLISH (Hindi written in Roman English script mixed with colloquial Indian English, like young people chat on Instagram DMs and WhatsApp).
Tone: Super witty, relatable, funny Indian Gen Z slang (kalesh, delulu, scene, jugaad, overthinking, seen pe chhodna, Swiggy, reels, 2 AM thoughts).
SAFETY RULE (CRITICAL): Playful and never offensive. DO NOT mention religion, caste, body shaming, politics, sexual content, or hurtful personal attacks. Keep it friendly and wholesome roast like college friends taunting each other.

Return JSON matching this exact structure:
{
  "vibeType": "A hilarious Gen Z title (e.g. 3 AM Overthinker Pro Max, Main Character Energy (2% Battery), Silent Kaleshi Lurker)",
  "emoji": "One relevant expressive emoji",
  "themeGradient": "one of: purple-neon, sunset-pink, electric-cyan, toxic-lime, cyber-violet",
  "roast": [
    "Punchy line 1 in Hinglish teasing their specific answer habit",
    "Punchy line 2 in Hinglish with funny relatable Indian scenario",
    "Punchy line 3 in Hinglish closing with a funny reality check"
  ],
  "traits": [
    "Funny trait 1 in Hinglish/English (under 7 words)",
    "Funny trait 2 in Hinglish/English (under 7 words)",
    "Funny trait 3 in Hinglish/English (under 7 words)"
  ],
  "redFlag": "1 hilarious relatable red flag in Hinglish",
  "greenFlag": "1 sweet or funny green flag in Hinglish",
  "vibeQuote": "A 1-liner viral motto in Hinglish"
}
`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.95,
          systemInstruction: "You are VibeCheck AI, India's most viral Gen Z roast bot. You speak fluent casual Hinglish with desi pop culture references (Swiggy, metro, reels, group chat kalesh, overthinking, Chai). You are witty, savage yet harmless and wholesome. Never be offensive."
        }
      }),
      2500
    );

    const text = response.text || "";
    const parsed = JSON.parse(text);
    return {
      ...parsed,
      userName: name || "Dost",
      isAiGenerated: true
    };
  } catch (error) {
    console.error("Gemini API error, falling back:", error);
    const pick = FALLBACK_VIBE_TYPES[Math.floor(Math.random() * FALLBACK_VIBE_TYPES.length)];
    return {
      ...pick,
      userName: name || "Dost",
      isAiGenerated: false
    };
  }
}

export async function generateRoastMe(name: string, habit: string, hobby: string, randomFact: string, savageLevel: "mild" | "medium" | "extra-spicy") {
  const levelDescriptions = {
    "mild": "Sweet & playful, halka-phulka mazaak, friendly teasing.",
    "medium": "Proper college canteen level roast, savage desi taunts, brutal but funny.",
    "extra-spicy": "Maximum savage roast, full dramatic Bollywood and Gen Z burn, leaves them in stitches laughing. Still strictly safe: NO religion, caste, body shaming, politics, or abuse."
  };

  if (!ai || !hasValidApiKey) {
    const defaultRoasts = {
      mild: {
        title: "Bholu with Wi-Fi",
        emoji: "🐣",
        punchline: "Innocent dikhte ho, par harkatein suspicious hain.",
        roastLines: [
          `"${habit}"? Bhai itna dedication agar padhai ya career mein lagaya hota toh Forbes 30 under 30 mein photo hoti.`,
          `Hobby "${hobby}" batate ho, par sach yeh hai ki bed se uthne mein bhi motivational speech sunni padti hai.`,
          `"${randomFact}" sunke lagta hai universe ne tumhe specifically group chat ka entertainment banakar bheja hai.`
        ],
        diagnosis: "Mild Case of Reel Addiction & Comfort Zone Syndrome",
        prescribedRemedy: "Thoda dhoop lo aur phone ko 10 minute ke liye doosre kamre mein rakho."
      },
      medium: {
        title: "Certified Drama Creator",
        emoji: "🍿",
        punchline: "Life chal nahi rahi, bas dharne pe baithi hai.",
        roastLines: [
          `Kehte ho "${habit}" tumhari habit hai... Bhai yeh habit nahi, self-sabotage ka free subscription hai.`,
          `"${hobby}" karne ka time hai tumhare paas, par dost ka 2-word message reply karne mein 3 business days lagte hain.`,
          `Aur yeh jo random fact diya hai: "${randomFact}"... Bro, even CID wouldn't be able to solve why you behave like this.`
        ],
        diagnosis: "Chronic Procrastination with Delusional Ambitions",
        prescribedRemedy: "Ek cup kadak chai piyo aur apni Zomato order history dekh kar sharam karo."
      },
      "extra-spicy": {
        title: "Chief Kalesh Officer (CKO)",
        emoji: "🔥",
        punchline: "Duniya aage badh gayi, tum abhi bhi drafts dekh rahe ho.",
        roastLines: [
          `"${habit}"? Agar overconfidence aur aalas ka koi combined startup hota, tum uske angel investor hote!`,
          `"${hobby}" hobby nahi, bas reel scroll karte karte paida hua temporary obsession hai jo agle hafte OLX pe bikega.`,
          `"${randomFact}" sunke tumhare rishtedaar bhi keh rahe honge: 'Hamara beta aage chalkar family group mein kalesh karwayega'.`
        ],
        diagnosis: "Acute Delulu Syndrome & Terminal Late-Night Overthinking",
        prescribedRemedy: "Flight mode on karo, 8 ghante so jao aur kal subah se sudhar jao (jo tum nahi karoge)."
      }
    };
    return {
      ...defaultRoasts[savageLevel],
      name: name || "Dost",
      savageLevel,
      isAiGenerated: false
    };
  }

  try {
    const prompt = `
User name: ${name || "Dost"}
Habit: ${habit}
Hobby / Obsession: ${hobby}
Random Fact / Weird Habit: ${randomFact}
Savage Level: ${savageLevel} (${levelDescriptions[savageLevel]})

Task:
Write a savage, viral, laugh-out-loud roast in casual Hinglish based directly on their inputs.
Language: Authentic Indian Gen Z Hinglish (WhatsApp/Insta slang).
SAFETY: Strict! NEVER attack body, weight, looks, religion, caste, politics, gender identity, or family background. All roasts must target their funny habits, phone addiction, procrastination, laziness, drama, and relatable quirks.

Return JSON in this format:
{
  "title": "A funny 2-4 word savage title (e.g. Certified Kalesh Director, Wi-Fi pe Zinda Prani)",
  "emoji": "1 funny emoji",
  "punchline": "A killer 1-liner roast hook in Hinglish",
  "roastLines": [
    "Roast line 1 targeting their habit in Hinglish",
    "Roast line 2 targeting their hobby in Hinglish",
    "Roast line 3 targeting their weird fact in Hinglish"
  ],
  "diagnosis": "Funny medical-sounding Gen Z diagnosis in English/Hinglish",
  "prescribedRemedy": "A funny desi remedy in Hinglish"
}
`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 1.0,
          systemInstruction: "You are the ultimate Indian Gen Z Roast King. You deliver devastatingly witty, viral Hinglish roasts that friends screenshot and post on Instagram stories. Safe, wholesome, but zero mercy on their lazy habits."
        }
      }),
      2500
    );

    const parsed = JSON.parse(response.text || "");
    return {
      ...parsed,
      name: name || "Dost",
      savageLevel,
      isAiGenerated: true
    };
  } catch (error) {
    console.error("Roast Gemini API error:", error);
    return {
      title: "Certified Procrastinator Pro",
      emoji: "💀",
      punchline: "Tumhara screen time dekh kar phone ki battery bhi depression mein chali jaati hai.",
      roastLines: [
        `"${habit}" bol rahe ho? Bhai tumhari aalas itni supreme hai ki alarm bhi khud snooze ho jaata hai.`,
        `"${hobby}" ka plan har Sunday banta hai aur phir Monday aate hi disappear ho jaata hai.`,
        `"${randomFact}"... Yeh sunne ke baad universe bhi soch raha hai ki tumhe kis category mein daale.`
      ],
      diagnosis: "Terminal Procrastination with Ph.D. in Overthinking",
      prescribedRemedy: "Phone charging se nikalo aur life charge karo dost.",
      name: name || "Dost",
      savageLevel,
      isAiGenerated: false
    };
  }
}

export async function generateFriendCompatibility(user1Name: string, user2Name: string, answersSummary: string) {
  const fallbacks = [
    {
      compatibilityScore: 94,
      duoTitle: "Chai & Samosa Duo",
      emoji: "☕",
      summaryRoast: "Tum dono ka relation bilkul tapri ki chai aur garam samosa jaisa hai - unhealthy hai, daily chahiye, aur bina iske din poora nahi hota.",
      strongestBond: "Dono milkar kisi teesre bande ki 2 ghante tak bina break bitching kar sakte hain.",
      futurePrediction: "Dono ek dusre ki shaadi mein sabse zyada naachenge aur phir rasgulle ki quality pe judge karenge."
    },
    {
      compatibilityScore: 78,
      duoTitle: "Kalesh & Damage Control",
      emoji: "🚨",
      summaryRoast: "Ek insaan aag lagata hai aur doosra bucket lekar bhagte hue bolta hai 'Sorry bhaiya galti se ho gaya'. Ekdum classic tom and jerry dynamic!",
      strongestBond: "Swiggy order share karna aur bill split karte time 3 rupaye ke liye ladna.",
      futurePrediction: "Agle trip ka plan 50 baar banayenge, Goa ki jagah colony ke park mein ice cream kha rahe honge."
    },
    {
      compatibilityScore: 89,
      duoTitle: "One Shared Brain Cell",
      emoji: "🧬",
      summaryRoast: "Dono ke paas milkar bas ek brain cell hai jo alternate days pe rotate hota hai. Jab dono sath hote ho toh decision making capacity zero ho jaati hai.",
      strongestBond: "Bina bole bas ek aankh ke ishare se samajh jaate ho ki yahan se nikalna hai.",
      futurePrediction: "Budhaape mein bhi hospital bed se ek doosre ko reels bhej rahe honge."
    }
  ];

  if (!ai || !hasValidApiKey) {
    const pick = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    return {
      ...pick,
      user1Name: user1Name || "Player 1",
      user2Name: user2Name || "Player 2",
      isAiGenerated: false
    };
  }

  try {
    const prompt = `
Friend 1 Name: ${user1Name}
Friend 2 Name: ${user2Name}
Quiz Answers & Choices:
${answersSummary}

Task:
Calculate a realistic/funny compatibility percentage (between 65% and 98%) and write a hilarious, viral Friendship Roast card in casual Hinglish.
Tone: Warm, funny, savage friendship humor (like Indian college besties / WhatsApp gang).
SAFETY: 100% wholesome roast, no religion, caste, body shaming, politics, sexual remarks.

Return JSON in this format:
{
  "compatibilityScore": 88,
  "duoTitle": "A funny 2-4 word friendship archetype in Hinglish/English (e.g. Chai Samosa Duo, One Brain Cell Squad, Toxic But Inseparable, Kaleshi Partners)",
  "emoji": "1 expressive emoji",
  "summaryRoast": "A 2-3 sentence hilarious Hinglish roast of why they are friends and how they irritate each other",
  "strongestBond": "What truly holds them together (funny Hinglish observation, 1 sentence)",
  "futurePrediction": "Funny prediction about their friendship 5 years from now (1 sentence in Hinglish)"
}
`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.9,
          systemInstruction: "You are the VibeCheck BFF Compatibility engine. You roast friendships with utmost love, nostalgia, and hilarious desi memes in natural Hinglish."
        }
      }),
      2500
    );

    const parsed = JSON.parse(response.text || "");
    return {
      ...parsed,
      user1Name: user1Name || "Player 1",
      user2Name: user2Name || "Player 2",
      isAiGenerated: true
    };
  } catch (err) {
    console.error("Compatibility AI error:", err);
    const pick = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    return {
      ...pick,
      user1Name: user1Name || "Player 1",
      user2Name: user2Name || "Player 2",
      isAiGenerated: false
    };
  }
}
