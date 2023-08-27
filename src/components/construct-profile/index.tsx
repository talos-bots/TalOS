import { Construct } from "@/classes/Construct";
import React, { useState, useEffect } from "react";

interface Props {
    character: Construct;
    onClick?: (construct: Construct) => void;
}
const ConstructProfile: React.FC<Props> = ({character, onClick}) => {
    const [characterImage, setCharacterImage] = useState<string>(character.avatar);
    const [characterName, setCharacterName] = useState<string>(character.name);
    const [tooltipPosition, setTooltipPosition] = useState<{ x: number, y: number } | null>(null);

    useEffect(() => {
        setCharacterImage(character.avatar);
        setCharacterName(character.name);
    }, [character]);

    
    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const boundingRect = e.currentTarget.getBoundingClientRect();
    
        let tooltipX = clientX - boundingRect.left;
        let tooltipY = clientY - boundingRect.top + 15; // 15 pixels to ensure it's right below the cursor
    
        setTooltipPosition({ x: tooltipX, y: tooltipY });
    };
    
    const tooltipRef = React.useRef<HTMLDivElement | null>(null);
    
    useEffect(() => {
        if (tooltipPosition && tooltipRef.current) {
            const tooltipWidth = tooltipRef.current.offsetWidth;
            const containerWidth = tooltipRef.current.parentElement?.offsetWidth || 0;
            if (tooltipPosition.x + tooltipWidth > containerWidth) {
                setTooltipPosition((prev) => ({ 
                    x: prev ? prev.x - tooltipWidth : 0,
                    y: prev ? prev.y : 0 
                }));
            }
        }
    }, [tooltipPosition]);    

    const tooltipStyles = tooltipPosition ? {
        top: `${tooltipPosition.y}px`,
        left: `${tooltipPosition.x}px`
    } : {};

    return (
        <div 
            className="themed-root-no-padding w-10vw h-full flex flex-col justify-center items-center cursor-pointer relative" 
            onClick={() => {if(onClick !== undefined) onClick(character)}}
            onMouseMove={handleMouseMove}
        >
            <img src={characterImage} alt={characterName} className="object-cover w-full h-full rounded-lg"/>
            <p className="text-xl font-bold z-999 absolute bottom-2 left-2 right-2 text-shadow-xl themed-root-no-padding overflow-y-auto">
                {characterName}
            </p>
            {/* Tooltip JSX with dynamic styles */}
            <div className="tooltip" style={tooltipStyles}>
                <p><strong>Name:</strong> {characterName}</p>
                {/* Add more details about the character as needed */}
            </div>
        </div>
    )

}
export default ConstructProfile;
