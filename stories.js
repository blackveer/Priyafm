// ================= CATEGORIES =================
const CATEGORIES = [
    "Dark Romance",
    "Hot Romance",
    "Lust",
    "Forbidden",
    "Billionaire",
    "Vampire Romance"
];
// ================= STORIES DATA =================
const INITIAL_STORIES = [
    {
        id: "story_1",
        title: "Lust Warrior",
        category: "Dark Romance",
        plays: 128450,
        cover: "https://files.catbox.moe/brz2pd.png",
        description: "Ek ordinary ladke ko milta hai dark system. Ab woh ban gaya hai Lust Warrior – har raat nayi victims, nayi limits.",
        episodes: [
            { epNumber: 1, title: "Ep 1: मैदान की जीत और दिल की धड़कनें ", duration: "13:26", audioUrl: "https://files.catbox.moe/jb8dat.mp3" },
            { epNumber: 2, title: "Ep 2: बंद कमरे की हदें ", duration: "13:24", audioUrl: "https://files.catbox.moe/wfps9j.mp3" },
            { epNumber: 3, title: "Ep 3: नियंत्रण के पार ", duration: "11:47", audioUrl: "https://files.catbox.moe/87n76v.mp3" },
            { epNumber: 4, title: "Ep 4: हवस की आग और टूटी हुई मर्यादा ", duration: "15:26", audioUrl: "https://files.catbox.moe/7em269.mp3" },
            { epNumber: 5, title: "Ep 5: सुबह की रोशनी में छिपे काले सच ", duration: "12:12", audioUrl: "https://files.catbox.moe/msg714.mp3" },
            { epNumber: 6, title: "Ep 6: नया शिकार और हवस का नया खेल ", duration: "14:22", audioUrl: "https://files.catbox.moe/s9g0i4.mp3" },
            { epNumber: 7, title: "Ep 7: प्रोफेसर की प्यास और एक अधूरी ख्वाहिश ", duration: "13:11", audioUrl: "https://files.catbox.moe/0kg1xc.mp3" },
            { epNumber: 8, title: "Ep 8: हवस का नया रास्ता और मैदान का सिकंदर ", duration: "13:08", audioUrl: "https://files.catbox.moe/i6ikhj.mp3" },
            { epNumber: 9, title: "Ep 9: टूटते विश्वास और आंसुओं का सैलाब ", duration: "12:04", audioUrl: "https://files.catbox.moe/2t1b4b.mp3" },
            { epNumber: 10, title: "Ep 10: टूटे धागे और एक नया प्रलोभन", duration: "12:09", audioUrl: "https://files.catbox.moe/jmea2u.mp3" } ,
            { epNumber: 11, title: "Ep 11: साबुन के झाग और एक हसीन निमंत्रण ", duration: "14:10", audioUrl: "https://files.catbox.moe/cq414r.mp3" },
            { epNumber: 12, title: "Ep 12: पानी में उफनती आग और जन्नत का रास्ता ", duration: "17:25", audioUrl: "https://files.catbox.moe/qw3bwg.mp3" }
        ]
    },
    {
        id: "story_2",
        title: "Meine Drei Vampir-Kriegerinnen",
        category: "Vampire Romance",
        plays: 98400,
        cover: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80",
        description: "Teen deadly vampire warriors. Unka master. Aur unke beech ki forbidden dark romance jo blood se bhi gehri hai.",
        episodes: [
            { epNumber: 1, title: "E1. Erwachen", duration: "05:30", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
        ]
    },
    {
        id: "story_3",
        title: "Forbidden Desire",
        category: "Forbidden",
        plays: 76200,
        cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80",
        description: "Jo relationship society allow nahi karti. Raaton ki chhupi mulakaatein, intensity jo control se bahar nikal jaati hai.",
        episodes: [
            { epNumber: 1, title: "Ep 1: Pehli Raat", duration: "08:15", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" }
        ]
    },
    {
        id: "story_4",
        title: "Billionaire's Obsession",
        category: "Billionaire",
        plays: 54300,
        cover: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80",
        description: "Woh usse chahta hai. Poori tarah. Dark, possessive aur dangerous obsession ki kahani.",
        episodes: [
            { epNumber: 1, title: "Ep 1: Claimed", duration: "07:40", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" }
        ]
    },
    {
        id: "story_5",
        title: "Night of Lust",
        category: "Lust",
        plays: 42100,
        cover: "https://files.catbox.moe/brz2pd.png",
        description: "Ek raat. Koi rules nahi. Sirf pure lust aur unfiltered desire.",
        episodes: [
            { epNumber: 1, title: "Ep 1: No Limits", duration: "09:20", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" }
        ]
    },
    {
        id: "story_6",
        title: "Dark Possession",
        category: "Dark Romance",
        plays: 31500,
        cover: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&q=80",
        description: "Woh uski hai. Body, mind aur soul. Dark romance jahan love aur control ek saath chalte hain.",
        episodes: [
            { epNumber: 1, title: "Ep 1: Mine", duration: "06:55", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" }
        ]
    }
];