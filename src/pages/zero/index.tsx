import React from "react";
import ZeroShot from "@/components/zeroshot/";

const ZeroPage = () => {
  return (
    <div className="zero">
      <div
        className={`relative w-full h-screen overflow-hidden flex flex-col items-center justify-center`}
      >
        <ZeroShot />
      </div>
    </div>
  );
};

export default ZeroPage;
