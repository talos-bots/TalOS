import { deleteBackground, getBackgrounds, saveBackground } from "@/api/baseapi";
import { getStorageValue, setStorageValue } from "@/api/dbapi";
import { setStyle } from "@/components/menu-theme-loader";
import { Image, Trash } from "lucide-react";
import React, { useState, useEffect, FC } from "react";

const BackgroundSelector = () => {
    const root = document.documentElement;
    const [background, setBackground] = useState<string | null>(null);
    const [backgrounds, setBackgrounds] = useState<string[]>([]);

    useEffect(() => {
        const fetchAndSetBackground = async () => {
            const data = await getStorageValue("background");
            if (data !== null) {
                setBackground(data);
            }
        };
        fetchAndSetBackground();
        const fetchAndSetBackgrounds = async () => {
            const data = await getBackgrounds();
            if (data !== null) {
                setBackgrounds(data);
            }
        };
        fetchAndSetBackgrounds();
    }, []);

    const selectBackground = (filename: string) => {
        setBackground(filename);
        setStorageValue("background", filename);
        setStyle("background-image", `url(./backgrounds/${filename})`);
    }

    const handleBackgroundChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            const result = await saveBackground(file);
            console.log(result);
            if (result) {
                setBackgrounds([...backgrounds, result]);
                selectBackground(result);
            } else {
                console.error("Failed to upload the custom background.");
            }
        }
    };

    const handleBackgroundDelete = async (filename: string) => {
        const result = await deleteBackground(filename);
        if (result) {
            if (background === filename) {
                setBackground(null);
                setStorageValue("background", backgrounds.filter((bg) => bg !== filename)[0]);
                setStyle("background-image", `url(./backgrounds/${backgrounds.filter((bg) => bg !== filename)[0]})`);
            }
            setBackgrounds(backgrounds.filter((bg) => bg !== filename));
        } else {
            console.error("Failed to delete the background.");
        }
    };

    return (
        <div className="themed-box">
            <h1 className="text-xl font-bold mb-4 text-center mx-auto">Background Selector</h1>
            <div className="grid grid-cols-5 gap-4">
                {backgrounds.map((bg) => (
                <div key={bg} className="h-min-fit max-h-fit w-fit relative">
                    <div
                        onClick={() => {selectBackground(bg); }}
                        className={
                            background === bg
                            ? "border-2 border-blue-500 rounded-md"
                            : "border-2 border-transparent rounded-md"
                        }
                    >
                        <img
                            src={`./backgrounds/${bg}`}
                            alt="Background"
                            width={150}
                            className="rounded-md"
                        />
                    </div>
                    <button
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-md"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleBackgroundDelete(bg);
                        }}
                    >
                        <Trash size={12}/>
                    </button>
                </div>
                ))}
                {/* <div>
                    <label htmlFor="backgroundSelector" className="flex items-center themed-root justify-center w-150px h-150px">
                        <Image size={60}/>
                        <input
                            id="backgroundSelector"
                            type="file"
                            name="background"
                            accept=".png,.jpg,.jpeg"
                            className="absolute inset-0 opacity-0 cursor-pointer w-150px h-150px"
                            onChange={handleBackgroundChange}
                        />
                    </label>
                </div> */}
            </div>
        </div>
    );
};

export default BackgroundSelector;
