import { Sprite } from "@/classes/Construct"
import { Emotion } from "@/types";
import { useEffect, useState } from "react";
import { RiQuestionMark } from "react-icons/ri";

interface SpriteCrudProps {
    sprite: Sprite | undefined,
    addSprite: (sprite: Sprite, emotion: any) => void,
    emotion: any,
}
const SpriteCrud = (props: SpriteCrudProps) => {
    const { sprite, addSprite, emotion } = props;
    const [spriteImage, setSpriteImage] = useState<string | null>(null);
    const [spriteEmotion, setSpriteEmotion] = useState<Emotion | null>(null);

    useEffect(() => {
        if (sprite) {
            setSpriteImage(sprite.image64);
            setSpriteEmotion(sprite.emotion);
        }
    }, [sprite]);

    const uploadSprite = async (event: React.ChangeEvent<HTMLInputElement>, emotion: Emotion) => {
        const file = event.target.files?.[0];
        const newSprite = new Sprite(emotion);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                newSprite.image64 = reader.result as string;
                addSprite(newSprite, emotion);
                setSpriteImage(newSprite.image64);
            };
            reader.readAsDataURL(file);
        } else {
            // Handle the case where no file was selected, if necessary
        }
    }    

    return (
        <>
            <div key={emotion.value} className="gap-2 themed-box flex-grow flex flex-col justify-center items-center">
                Sprite for {emotion.label}
                <label htmlFor={`emotion-select-${emotion.value}`} className="flex w-fit h-fit cursor-pointer">
                    {spriteImage === null ?
                        <RiQuestionMark className="flex w-36 h-48 themed-root"/> : 
                        <img src={spriteImage} alt={`Sprite for ${emotion.label}`} className="w-36 h-48 object-scale-down"/>
                    }
                    <input
                        id={`emotion-select-${emotion.value}`}
                        className="hidden"
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        onChange={(event) => uploadSprite(event, emotion.value as Emotion)}
                    />
                </label>
            </div>
        </>
    );
}
export default SpriteCrud