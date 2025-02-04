import React from "react";

const NameTab: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md px-[1vw] py-[10px] flex w-[75vw] sm:md:lg:w-[50vw] max-w-[750px] h-[100px] overflow-hidden">
      <div className="text-left">
        <a
          href="/"
          className=" text-3xl sm:md:lg:text-4xl font-semibold hover:underline truncate"
        >
          Johann Zhang
        </a>
        <p className="text-2xl sm:md:lg:text-3xl truncate">
          张钰檀
        </p>
      </div>
    </div>
  );
};

export default NameTab;
