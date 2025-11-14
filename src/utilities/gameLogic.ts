import type { RoundData } from '../types/game';
import { allImages } from './gameData';

/**
 * Yeni tur verisi getiren fonksiyon
 */
export const getNewRoundData = (): RoundData => {
    const aiImages = allImages.filter(img => img.isAI);
    const realImages = allImages.filter(img => !img.isAI);
    const aiImage = aiImages[Math.floor(Math.random() * aiImages.length)];
    const shuffledReal = realImages.sort(() => 0.5 - Math.random());
    const twoRealImages = shuffledReal.slice(0, 2);
    const images = [aiImage, ...twoRealImages].sort(() => 0.5 - Math.random());

    return {
        images,
        aiImageId: aiImage.id,
        hint: aiImage.hint || 'Küçük detaylara dikkat etmeyi dene!',
    };
};