import type { ImageData } from '../types/game';



export const allImages: ImageData[] = [
    {
        id: 'r1',
        url: '/images/RealGitar1.jpeg',
        isAI: false,
        hint: null
    },
    {
        id: 'r2',
        url: '/images/RealGitar2.jpeg',
        isAI: false,
        hint: null
    },
    {
        id:"ai1",
        url: "/images/AiGitar.jpeg",
        isAI:true,
        hint: "Bileklere dikkat et"
    },
    {
        id:"ai2",
        url:"/images/ai7telligitar.jpeg",
        isAI:true,
        hint:"Akustik gitar 6 telli değil miydi"
    },
    {
        id:"ai3",
        url:"/images/konseralanı.jpeg",
        isAI:true,
        hint:"Arkadakiler sanki hepsi tek yöne bakan robotlar gibi değil mi :D"

    },
    {
        id:"ai4",
        url:"/images/çiftbaşlıdişfırçası.jpeg",
        isAI:true,
        hint:"Ne zamandan beri diş fırçaları çift başlı"

    },
    {
        id:"ai5",
        url:"/images/çincemio.jpeg",
        isAI:true,
        hint:"O Çince falan değil kendimizi kandırmayalım"

    },

];