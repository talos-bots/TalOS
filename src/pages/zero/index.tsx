import React from "react";
import ZeroShot from "@/components/zeroshot/";

const ZeroPage = () => {
  return (
    <div className="zero">
      <div
        className={`relative w-full h-screen overflow-hidden flex flex-col items-center justify-center`}
      >
        <div className="box-border w-[1440px] h-calc(100vh - 70px) overflow-hidden shrink-0 flex flex-col pt-[740px] px-[145px] pb-[47px] items-start justify-end gap-[10px]">
          <ZeroShot />
        </div>
      </div>
    </div>
  );
};

export default ZeroPage;
