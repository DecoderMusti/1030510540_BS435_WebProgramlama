import React from 'react';
import type { ImageData } from '../types/game';

interface ImageCardProps {
    image: ImageData;
    onClick: (id: string) => void;
    isDisabled: boolean;
    isRevealed: boolean;
    isSelected: boolean;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onClick, isDisabled, isRevealed, isSelected }) => {

    let classes = 'relative w-full aspect-square rounded-2xl shadow-xl transition-all duration-300 transform border-4 sm:border-8';

    if (isDisabled) classes += ' cursor-not-allowed opacity-60';
    else classes += ' cursor-pointer hover:scale-105 hover:shadow-2xl hover:border-oyun-primary-light';

    if (isRevealed) {
        if (image.isAI) classes += ' border-oyun-yesil';
        else if (isSelected && !image.isAI) classes += ' border-oyun-kirmizi opacity-70';
        else classes += ' border-transparent opacity-40';
    } else if (isSelected) {
        classes += ' border-oyun-primary scale-102';
    } else {
        classes += ' border-oyun-kart-dark-light';
    }

    return (
        <div className={classes} onClick={() => !isDisabled && onClick(image.id)}>
            <img src={image.url} alt="Oyun Görseli" className="w-full h-full object-cover rounded-lg" />
            {isRevealed && (
                <div className={`absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg
                  ${image.isAI ? 'text-oyun-yesil' : 'text-oyun-kirmizi'}`}>
                    {image.isAI ? <span className="text-6xl sm:text-8xl">✅</span> : <span className="text-6xl sm:text-8xl">❌</span>}
                </div>
            )}
        </div>
    );
};

export default ImageCard;