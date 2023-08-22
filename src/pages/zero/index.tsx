import ZeroShotResponse from "@/components/zero-shot";
import React from "react";

const ZeroPage = () => {
  return (
    <div className="zero">
      <div
        className={`relative w-full h-[calc(100vh-70px)] overflow-hidden flex flex-col items-center justify-center`}
      >
        <ZeroShotResponse />
      </div>
    </div>
  );
};

export default ZeroPage;
