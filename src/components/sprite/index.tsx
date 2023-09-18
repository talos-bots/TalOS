import { getConstruct } from "@/api/dbapi";
import { Construct, Sprite } from "@/classes/Construct";
import { Emotion } from "@/types";
import { useEffect, useState } from "react";

interface SpriteProps {
    constructID: string;
    emotion: Emotion,
    sendPoke: () => void
}
const SpriteDisplay = (props: SpriteProps) => {
    const { constructID, emotion, sendPoke } = props;
    const [construct, setConstruct] = useState<Construct | null>(null);
    const [spriteData, setSprite] = useState<Sprite | null>(null);

    useEffect(() => {
        if (constructID) {
            getConstruct(constructID).then((newConstruct) => {
                setConstruct(newConstruct);
                const foundSprite = newConstruct.sprites.find((sprite) => sprite.emotion === emotion);
                if (foundSprite){
                    setSprite(foundSprite);
                }
           })
        }
    }, [constructID]);

    useEffect(() => {
        if (construct) {
            const foundSprite = construct.sprites.find((sprite) => sprite.emotion === emotion);
            if (foundSprite){
                setSprite(foundSprite);
            }
        }
    }, [emotion]);

    return (
        <div className="flex flex-col h-screen justify-end items-end">
            {spriteData?.image64 !== "" && spriteData?.image64 && (
                <img className="object-scale-down cursor-pointer" src={spriteData?.image64} alt={spriteData?.emotion} onClick={() => sendPoke()}/>
            )}
        </div>
    );    
}
export default SpriteDisplay;