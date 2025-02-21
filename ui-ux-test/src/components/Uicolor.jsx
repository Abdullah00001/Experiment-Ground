import React from "react";

const Uicolor = () => {
  return (
    <div className="flex gap-[50px] flex-wrap w-[900px] mx-auto mt-[100px]">
      <div className="w-[400px] h-[200px] bg-[#0a0a0a]">
        <h1 className="text-[#ffffff] text-4xl">hello world</h1>
        <h1 className="text-[#F5212E] text-4xl">hello world</h1>
        <h1 className="text-[#1D9BF0] text-4xl">hello world</h1>
      </div>
      <div className="w-[400px] h-[200px] bg-[#000000]">
        <h1 className="text-[#ffffff] text-4xl">hello world</h1>
        <h1 className="text-[#F5212E] text-4xl">hello world</h1>
        <h1 className="text-[#1D9BF0] text-4xl">hello world</h1>
      </div>
      <div className="w-[400px] h-[200px] bg-[#1D9BF0]"></div>
      <div className="w-[400px] h-[200px] bg-[#FFFFFF]"></div>
      <div className="w-[400px] h-[200px] bg-[#F5212E]"></div>
    </div>
  );
};

export default Uicolor;
