import React from "react";

const Buttons = () => {
  return (
    <div className="flex flex-col gap-4  w-[900px] mx-auto mt-[100px]">
      <div>
        <button className="py-[6px] px-[12px] text-[#ffffff] bg-[#1D9BF0] rounded-[10px] font-bold text-[14px] hover:bg-[#ffffff] hover:text-[#000000]">
          Small Button
        </button>
      </div>
      <div>
        <button className="py-[10px] px-[20px] text-[#ffffff] bg-[#1D9BF0] rounded-[16px] font-bold text-[16px]">
          Default Button
        </button>
      </div>
      <div>
        <button className="py-[12px] px-[24px] text-[#ffffff] bg-[#1D9BF0] rounded-[16px] font-bold text-[18px]">
          Large Button
        </button>
      </div>
      <div>
        <button className="py-[12px] px-[24px] text-[#ffffff] bg-[#0a0a0a] rounded-[10px] font-bold text-[18px] border-[0.2px] hover:shadow duration-200 border-[#5D5D5D] shadow-[0_0_2px_1px_#434343] drop-shadow">
          Large Button
        </button>
      </div>
    </div>
  );
};

export default Buttons;
