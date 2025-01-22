import React from "react";

const NameTab: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md px-[1vw] py-[10px] flex w-[50vw] h-[75px] sm:h-[100px] md:h-[100px] lg:h-[100px] overflow-hidden">
      <div className="text-left">
        <a
          href="/"
          className="text-lg sm:text-4xl md:text-4xl lg:text-4xl font-semibold hover:underline truncate"
        >
          Johann Zhang
        </a>
        <p className="text-md sm:text-3xl md:text-3xl lg:text-3xl truncate">
          张钰檀
        </p>
      </div>
    </div>
  );
};

export default NameTab;
