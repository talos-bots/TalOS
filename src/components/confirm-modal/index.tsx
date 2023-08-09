import React from 'react';

interface ConfirmModalProps {
    message: string;
    note?: string | null;
    setOpenConfirm: (open: boolean) => void;
    doThing: () => void;
}
const ConfirmModal = (props: ConfirmModalProps) => {
    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="themed-root flex flex-col justify-center items-center p-4 rounded-lg backdrop-blur-theme-blur">
            <h1 className="text-2xl">Are you sure you want to {props.message}?</h1>
            {props.note && <p className="text-sm">{props.note}</p>}
            <div className="flex flex-row gap-4 mt-4">
                <button className="themed-button-pos" onClick={() => props.doThing()}>Yes</button>
                <button className="themed-button-neg" onClick={() => props.setOpenConfirm(false)}>No</button>
            </div>
        </div>
    </div>
    );
}

export default ConfirmModal;