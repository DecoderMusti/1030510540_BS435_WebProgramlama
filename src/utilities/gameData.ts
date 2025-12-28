import type { GameImage, RoundData } from '../types/game';
// Tüm resim havuzu
export const allImages: GameImage[] = [
    // --- KATEGORİ: GİTARLAR ---
    {
        id: 'real_gitar_1',
        url: '/images/RealGitar1.jpeg',
        isAI: false,
        hint: null
    },
    {
        id: 'real_gitar_2',
        url: '/images/RealGitar2.jpeg',
        isAI: false,
        hint: null
    },
    {
        id: 'real_gitar_3',
        url: '/images/6telligitar.jpeg',
        isAI: false,
        hint: null
    },
    {
        id: 'real_gitar_4',
        url: '/images/akustikgitar2.jpg',
        isAI: false,
        hint: null
    },
    {
        id: 'ai_gitar_1',
        url: '/images/ai7telligitar.jpeg',
        isAI: true,
        hint: 'Gitarın tellerini saymayı denedin mi? Standart bir akustik gitar kaç telli olur?'
    },
    {
        id: 'ai_gitar_2',
        url: '/images/AiGitar.jpeg',
        isAI: true,
        hint: 'Bileklere ve parmakların eklem yerlerine dikkat et. Tutuş pozisyonu anatomik mi?'
    },

    // --- KATEGORİ: SOKAK & YAZILAR ---
    {
        id: 'real_sokak_1',
        url: '/images/japonsokak1.jpeg',
        isAI: false,
        hint: null
    },
    {
        id: 'real_sokak_2',
        url: '/images/japonsokak2.jpeg',
        isAI: false,
        hint: null
    },
    {
        id: 'ai_sokak_1',
        url: '/images/çincemio.jpeg',
        isAI: true,
        hint: 'Tabelalardaki karakterleri okumaya çalış. Gerçek bir dil mi yoksa anlamsız semboller mi?'
    },

    // --- KATEGORİ: KONSER & KALABALIK ---
    {
        id: 'real_konser_1',
        url: '/images/konser1.jpeg',
        isAI: false,
        hint: null
    },
    {
        id: 'real_konser_2',
        url: '/images/konser2.jpeg',
        isAI: false,
        hint: null
    },
    {
        id: 'ai_konser_1',
        url: '/images/konseralanı.jpeg', // Tahminen AI olan bu
        isAI: true,
        hint: 'Arka plandaki kalabalığa odaklan. Yüz hatları belirgin mi yoksa erimiş gibi mi duruyor?'
    },

    // --- KATEGORİ: AYNALAR & YANSIMA ---
    {
        id: 'real_ayna_1',
        url: '/images/aynalı1.jpeg',
        isAI: false,
        hint: null
    },
    {
        id: 'ai_ayna_1', // Bunu AI varsaydım, kontrol et!
        url: '/images/aynalı2.jpeg',
        isAI: false,
        hint: 'Aynadaki yansımayı kontrol et. Gerçek nesne ile yansıması fizik kurallarına uyuyor mu?'
    },

    // --- KATEGORİ: NESNELER (Diş Fırçası) ---
    {
        id: 'ai_firca',
        url: '/images/çiftbaşlıdişfırcası.jpeg',
        isAI: true,
        hint: 'Nesnenin tasarımına mantıksal bak. Çift başlı bir diş fırçası günlük hayatta kullanışlı olur muydu?'
    }
];

// --- OYUN MANTIĞI: Rastgele Tur Oluşturma ---
// Not: Diş fırçası tek başına olduğu için onu manuel gruplara dahil etmiyorum,
// otomatik mantık onu bazen dışarıda bırakabilir.
// İleride "real_firca" eklersen onu da kullanırız.

 export const getNewRoundData = (): RoundData => {
    const aiImages = allImages.filter(img => img.isAI);
    const randomAI = aiImages[Math.floor(Math.random() * aiImages.length)];

    const realImages = allImages.filter(img => !img.isAI);
    const shuffledReal = [...realImages].sort(() => 0.5 - Math.random());
    const selectedReal = shuffledReal.slice(0, 2);

    const roundImages = [randomAI, ...selectedReal].sort(() => 0.5 - Math.random());

    return {
        images: roundImages,
        aiImageId: randomAI.id,
        hint: randomAI.hint || 'Bu resimde bir gariplik var...'
    };
};