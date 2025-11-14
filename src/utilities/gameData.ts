import type { ImageData } from '../types/game';

// SAHTE VERİ (MOCK DATA)
export const allImages: ImageData[] = [
    { id: 'r1', url: 'https://placehold.co/600x600/FFD166/333333?text=Gerçek+Çiçek', isAI: false, hint: null },
    { id: 'r2', url: 'https://placehold.co/600x600/06D6A0/333333?text=Gerçek+Hayvan', isAI: false, hint: null },
    { id: 'r3', url: 'https://placehold.co/600x600/FF6B6B/333333?text=Gerçek+Oyuncak', isAI: false, hint: null },
    { id: 'r4', url: 'https://placehold.co/600x600/4ECDC4/333333?text=Gerçek+Manzara', isAI: false, hint: null },
    { id: 'a1', url: 'https://placehold.co/600x600/EE7B7B/FFFFFF?text=AI+Makyajlı+Yüz', isAI: true, hint: 'Gözler ve dudaklar biraz fazla simetrik mi?' },
    { id: 'a2', url: 'https://placehold.co/600x600/FF9F1C/FFFFFF?text=AI+Fantastik+Hayvan', isAI: true, hint: 'Vücut uzuvları veya tüylerin geçişleri doğal değil.' },
    { id: 'a3', url: 'https://placehold.co/600x600/A0D8B3/FFFFFF?text=AI+Rüya+Evi', isAI: true, hint: 'Pencerelerin veya kapıların konumları gerçekçi olmayabilir.' },
];//düzenlenecektir