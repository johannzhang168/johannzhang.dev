import React from "react";

const NameTab: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md px-[1vw] py-[2vh] flex h-[15vh] w-[50vw]">
      <div className="text-left">
        <a href="/" className="text-4xl font-semibold hover:underline">Johann Zhang</a>
        <p className="text-3xl">张钰檀</p>
      </div>
    </div>
  );
};

export default NameTab;
