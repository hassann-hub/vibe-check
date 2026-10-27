export interface QuizOption {
  id: string;
  emoji: string;
  text: string;
  vibeTag: string;
}

export interface QuizQuestion {
  id: number;
  category: string;
  kicker: string;
  question: string;
  options: QuizOption[];
}

export const VIBE_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: "Late Night Scene",
    kicker: "2 AM Vibe Check",
    question: "Raat ke 2 baje tum typically kya kar rahe hote ho?",
    options: [
      {
        id: "1a",
        emoji: "🧠",
        text: "Ceiling ghoor ke 5 saal puraani embarrassing baatein recall karna",
        vibeTag: "overthinker"
      },
      {
        id: "1b",
        emoji: "📱",
        text: "Reels pe reels... 'Bas 1 reel aur' bolte bolte 4 bajj jaana",
        vibeTag: "reels_addict"
      },
      {
        id: "1c",
        emoji: "🍕",
        text: "Zomato cart mein 800 ka food add karke delivery fee dekh ke ro padna",
        vibeTag: "swiggy_lurker"
      },
      {
        id: "1d",
        emoji: "😴",
        text: "10:30 baje so chuke the, phone DND pe hai (Total alien behavior)",
        vibeTag: "npc_energy"
      }
    ]
  },
  {
    id: 2,
    category: "Squad Dynamics",
    kicker: "Group Chat Role",
    question: "WhatsApp group chat mein tumhara main role kya hai?",
    options: [
      {
        id: "2a",
        emoji: "🕵️‍♂️",
        text: "Silent CBI Officer: Kalesh silently observe karna with zero messages",
        vibeTag: "cbi_lurker"
      },
      {
        id: "2b",
        emoji: "🎭",
        text: "Meme/Sticker Spammer: Serious discussion mein bhi cursed sticker daalna",
        vibeTag: "meme_lord"
      },
      {
        id: "2c",
        emoji: "🎙️",
        text: "Podcast Host: Seedha 4 minute ka unfiltered voice note drop karna",
        vibeTag: "main_character"
      },
      {
        id: "2d",
        emoji: "👻",
        text: "Seen Ghost: Read receipts ON hain, par reply agle janam mein aayega",
        vibeTag: "ghost_vibe"
      }
    ]
  },
  {
    id: 3,
    category: "Communication",
    kicker: "Reply Style",
    question: "Dost ka urgent text aata hai 'Bhai bohot bada scene ho gaya!', tumhara move?",
    options: [
      {
        id: "3a",
        emoji: "🚨",
        text: "'BATA KYA HUA???' (Typed within 0.4 seconds with pure adrenaline)",
        vibeTag: "kalesh_lover"
      },
      {
        id: "3b",
        emoji: "👀",
        text: "Notification bar se preview dekh ke 20 min baad calm 'kya hua?' likhna",
        vibeTag: "cool_pretender"
      },
      {
        id: "3c",
        emoji: "📞",
        text: "Seedha direct call milana kyunki chat mein gossip slow hoti hai",
        vibeTag: "gossip_queen"
      },
      {
        id: "3d",
        emoji: "💀",
        text: "Instagram reel share kar dena jaise kuch hua hi nahi",
        vibeTag: "delulu_peace"
      }
    ]
  },
  {
    id: 4,
    category: "Punctuality & Plans",
    kicker: "Late Reality",
    question: "Jab plan ke liye late ho rahe hote ho aur dost poochta hai 'Kahan hai?', kya bolte ho?",
    options: [
      {
        id: "4a",
        emoji: "🛵",
        text: "'Bas 2 min bhai, auto mein hoon' (Abhi towel mein ghoom rahe ho)",
        vibeTag: "time_criminal"
      },
      {
        id: "4b",
        emoji: "🚗",
        text: "'Yaar traffic itna ganda hai kya bataun' (Ghar ka gate bhi paar nahi kiya)",
        vibeTag: "traffic_excuse"
      },
      {
        id: "4c",
        emoji: "⚡",
        text: "Always on time, dost late aate hain toh unki 7 pushton ko kosna",
        vibeTag: "scheduler"
      },
      {
        id: "4d",
        emoji: "✈️",
        text: "Phone silently flight mode pe daal ke bhagwan ke bharose chal padna",
        vibeTag: "chaos_agent"
      }
    ]
  },
  {
    id: 5,
    category: "Food & Wallet",
    kicker: "Hunger Games",
    question: "Swiggy / Zomato khola hai dinner ke liye, asli strategy kya hoti hai?",
    options: [
      {
        id: "5a",
        emoji: "🍜",
        text: "45 minutes tak reviews scroll karke end mein Maggi bana lena",
        vibeTag: "indecisive"
      },
      {
        id: "5b",
        emoji: "🏷️",
        text: "Discount coupon lagane ke chakkar mein extra 3 items add kar lena",
        vibeTag: "finance_disaster"
      },
      {
        id: "5c",
        emoji: "🛵",
        text: "Order karne ke 3 second baad rider ki location GPS pe continuously track karna",
        vibeTag: "impatient"
      },
      {
        id: "5d",
        emoji: "🤫",
        text: "Ghar waalon se chhupa kar society gate pe spy ki tarah parcel collect karna",
        vibeTag: "sneaky_eater"
      }
    ]
  },
  {
    id: 6,
    category: "Relatives & Drama",
    kicker: "Family Inquisition",
    question: "Door ke rishtedaar puchte hain: 'Beta aage life ka kya plan hai?'",
    options: [
      {
        id: "6a",
        emoji: "💼",
        text: "'Uncle bas thoda market research chal rahi hai' (Pure din bed pe reels)",
        vibeTag: "corporate_liar"
      },
      {
        id: "6b",
        emoji: "🔄",
        text: "'Aapke bete Sharma ji ke laadle ka kya scene hai?' (Uno reverse card)",
        vibeTag: "savage_counter"
      },
      {
        id: "6c",
        emoji: "🏃‍♂️",
        text: "Achanak phone pe fake call acting: 'Hello boss? Haan aa raha hoon'",
        vibeTag: "escape_artist"
      },
      {
        id: "6d",
        emoji: "🚀",
        text: "'AI startup build kar rahe hain' (Instagram page bio mein Founder likha hai)",
        vibeTag: "delulu_founder"
      }
    ]
  },
  {
    id: 7,
    category: "Weekend Reality",
    kicker: "Plan vs Reality",
    question: "Friday evening ka grand plan vs Sunday raat ki reality?",
    options: [
      {
        id: "7a",
        emoji: "🛌",
        text: "Plan: 'Puri city explore karenge'. Reality: 18 ghante AC mein blanket wrap",
        vibeTag: "sloth_supreme"
      },
      {
        id: "7b",
        emoji: "📚",
        text: "Plan: 'Poora syllabus/backlog khatam'. Reality: 6 episode murder mystery",
        vibeTag: "binge_watcher"
      },
      {
        id: "7c",
        emoji: "🏖️",
        text: "Goa trip ka WhatsApp group banaya aur 2 ghante baad admin ne khud leave kar diya",
        vibeTag: "goa_delusional"
      },
      {
        id: "7d",
        emoji: "☕",
        text: "Tapri pe baith ke dosto ke sath 3 ghante tak deep existential discussion",
        vibeTag: "chai_philosopher"
      }
    ]
  },
  {
    id: 8,
    category: "Social Presence",
    kicker: "Instagram Psychology",
    question: "Instagram pe nayi photo ya story upload karne ke baad kya hota hai?",
    options: [
      {
        id: "8a",
        emoji: "🔍",
        text: "Har 45 seconds baad viewer list refresh karke ek specific crush ko dhoondhna",
        vibeTag: "stalker_delulu"
      },
      {
        id: "8b",
        emoji: "🗑️",
        text: "Aesthetic lag rahi thi, par 12 minutes baad cringe feel hua aur archive kardi",
        vibeTag: "self_doubter"
      },
      {
        id: "8c",
        emoji: "🟢",
        text: "Close Friends list mein 4 bando ko daal ke unhinged kaleshi rants post karna",
        vibeTag: "chaos_poster"
      },
      {
        id: "8d",
        emoji: "💅",
        text: "Post karke app close karna aur pretend karna jaise validation ki parwah nahi",
        vibeTag: "mysterious_facade"
      }
    ]
  }
];

export const DAILY_QUESTIONS = [
  {
    id: "d1",
    question: "Aaj subah uth ke sabse pehla thought kya aaya?",
    options: [
      { text: "Bhai thoda aur so leta hoon, 5 min mein kya hi hoga", aura: "Snorlax Energy", emoji: "😴" },
      { text: "Phone kahan hai mera? Notification check karni hai", aura: "Dopamine Dependent", emoji: "📱" },
      { text: "Aaj sab kuch time pe karunga (Narrator: He didn't)", aura: "Optimistic Delulu", emoji: "✨" },
      { text: "Seedha chai chahiye, warna system crash ho jaayega", aura: "Chai Powered Human", emoji: "☕" }
    ]
  },
  {
    id: "d2",
    question: "Agar aaj achanak bank account mein ₹1,00,000 aate hain, pehla kharcha?",
    options: [
      { text: "Goa/Manali tickets book without telling anyone", aura: "Wanderlust Broke", emoji: "✈️" },
      { text: "Gadgets aur accessories ka wishlist order", aura: "Tech Ka Deewana", emoji: "💻" },
      { text: "FD ya Mutual Fund mein daal dunga (Sharma Ji mode)", aura: "Inner Uncle Energy", emoji: "📈" },
      { text: "Dosto ko grand party, kal jo hoga dekha jaayega", aura: "Robin Hood of Canteen", emoji: "🍕" }
    ]
  },
  {
    id: "d3",
    question: "Aapke dimaag mein aaj sabse zyada kya chal raha hai?",
    options: [
      { text: "Lunch/Dinner mein kya mangwana hai", aura: "Foodie Soul", emoji: "🥘" },
      { text: "Career kahan ja raha hai aur main kahan ja raha hoon", aura: "24/7 Overthinker", emoji: "🤯" },
      { text: "Woh insaan reply karega ya self-respect sacrifice karun", aura: "Down Bad Romantic", emoji: "💌" },
      { text: "Bas jaldi sham ho aur main bed pe letun", aura: "Horizontal Living Icon", emoji: "🛌" }
    ]
  },
  {
    id: "d4",
    question: "Agar koi unknown number se call kare, tumhara reaction?",
    options: [
      { text: "Truecaller pe naam dekh ke cut kar dena", aura: "Anti-Social Pro", emoji: "📵" },
      { text: "Ringing phone ko stare karte rehna jab tak chup na ho", aura: "Silent Bystander", emoji: "👀" },
      { text: "Pick karke fake formal voice mein 'Yes who is this?'", aura: "Corporate Pretender", emoji: "👔" },
      { text: "Call kaat ke text karna: 'Who is this?'", aura: "Text Superiority", emoji: "💬" }
    ]
  },
  {
    id: "d5",
    question: "Aaj tumhari current social battery kitne percent pe hai?",
    options: [
      { text: "1% - Kisi ne hello bola toh rona aa jaayega", aura: "Dead Battery Ghost", emoji: "🪫" },
      { text: "40% - Bas group chat memes tak theek hai", aura: "Lurker Mode", emoji: "🔋" },
      { text: "85% - Gossip sunao toh 100% ho jaayegi", aura: "Gossip Fuelled", emoji: "⚡" },
      { text: "120% - Aaj kisi se bhi kalesh karwa lo", aura: "Unchecked Menace", emoji: "🔥" }
    ]
  },
  {
    id: "d6",
    question: "Zomato ya Swiggy cart mein kitne items saalo se pade hain?",
    options: [
      { text: "Zero, main seedha order click kar deta hoon", aura: "Impulsive Spender", emoji: "💸" },
      { text: "3-4 items, discount coupon aane ka intezaar hai", aura: "Coupon Hunter", emoji: "🏷️" },
      { text: "Poora restaurant cart mein add karke app close kardiya", aura: "Digital Window Shopper", emoji: "🛒" },
      { text: "Mummy ke hath ki daal-roti supremacy", aura: "Ghar Ka Laadla", emoji: "🍲" }
    ]
  },
  {
    id: "d7",
    question: "Aapki life ka current background music kaisa lag raha hai?",
    options: [
      { text: "Sad acoustic song on repeat", aura: "Melancholic Main Character", emoji: "🎸" },
      { text: "Cursed meme sound effect / flute version", aura: "Brainrot Victim", emoji: "🪈" },
      { text: "Punjabi beat on 100% volume", aura: "High Energy Vibing", emoji: "🕺" },
      { text: "Pin-drop silence accompanied by existential dread", aura: "Void Wanderer", emoji: "🌌" }
    ]
  }
];

export const FRIEND_QUESTIONS = [
  {
    id: "f1",
    question: "Tum dono mein se sabse bada kaleshi / drama creator kaun hai?",
    options: [
      { label: "Main hoon (Proudly accepts)", score: 1 },
      { label: "Mera dost (100% certified trouble)", score: 2 },
      { label: "Dono milkar duniya mein aag lagate hain", score: 3 },
      { label: "Hum dono shareef hain (Sabse bada jhooth)", score: 4 }
    ]
  },
  {
    id: "f2",
    question: "Bahar tapri ya cafe pe bill pay karne ka dynamic kya hai?",
    options: [
      { label: "Ek banda hamesha UPI karta hai aur doosra 'bhejta hoon' bolke bhool jaata hai", score: 1 },
      { label: "Ekdum 50-50 exact paisa split (₹1.50 bhi nahi chhodte)", score: 2 },
      { label: "'Agli baar main dunga' infinite loop policy", score: 3 },
      { label: "Jo sabse pehle pocket se phone nikal le wohi balidaan deta hai", score: 4 }
    ]
  },
  {
    id: "f3",
    question: "Agar raat ko kisi kalesh mein police pakad le toh kiska fault hoga?",
    options: [
      { label: "Dost ka, uski stupid harkat ki wajah se hi fasenge", score: 1 },
      { label: "Mera, overconfidence mein hero ban raha tha", score: 2 },
      { label: "Dono ka equal contribution in chaos", score: 3 },
      { label: "Hum toh bas bystander the, frame kar diya", score: 4 }
    ]
  },
  {
    id: "f4",
    question: "Instagram reels sharing ki frequency kya hai?",
    options: [
      { label: "Daily 25-50 dark humor & brainrot reels", score: 1 },
      { label: "Haal-chaal nahi puchte, bas reels pe 'haha' aur 'so us' bhejte hain", score: 2 },
      { label: "Ek doosre ko cringe rishtedaar reel bhej kar roast karna", score: 3 },
      { label: "Important gossip screenshots only", score: 4 }
    ]
  },
  {
    id: "f5",
    question: "Bina bole ek doosre ke looks / outfit ko kaise judge karte ho?",
    options: [
      { label: "Seedha muh pe: 'Bhai clown lag raha hai, change kar'", score: 1 },
      { label: "Bas ek aankh ka ishare se samajh jaate hain ki disaster hai", score: 2 },
      { label: "100 photos click karke bolte hain: 'Sab bekaar aayi hain'", score: 3 },
      { label: "Hypeman ban jaate hain: 'Bhai aag laga di!'", score: 4 }
    ]
  }
];
