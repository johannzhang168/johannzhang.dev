import React from "react";
import Navbar from "./components/Navbar";
import NameTab from "./components/NameTab";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center gap-5">
          <NameTab />
          <main className="w-[45vw]">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
