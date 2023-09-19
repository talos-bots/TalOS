import React, { useState } from 'react';
import ReactDOM from 'react-dom';

interface ConfirmModalProps {
  message: string;
  note?: string | null;
}

const ConfirmModal = ({ message, note }: ConfirmModalProps) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    isVisible && (
      <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="themed-root flex flex-col justify-center items-center p-4 rounded-lg backdrop-blur-theme-blur">
          <h1 className="text-2xl">{message}</h1>
          {note && <p className="text-sm">{note}</p>}
          <div className="flex flex-row gap-4 mt-4">
            <button
              className="themed-button-pos"
              onClick={() => {
                setIsVisible(false);
                confirmModalPromiseResolver(true);
              }}
            >
              Yes
            </button>
            <button
              className="themed-button-neg"
              onClick={() => {
                setIsVisible(false);
                confirmModalPromiseResolver(false);
              }}
            >
              No
            </button>
          </div>
        </div>
      </div>
    )
  );
};

let confirmModalPromiseResolver: (value: boolean) => void;

export function confirmModal(message: string, note?: string): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    confirmModalPromiseResolver = resolve;
    const div = document.createElement('div');
    document.body.appendChild(div);
    ReactDOM.render(<ConfirmModal message={message} note={note} />, div);
  });
}