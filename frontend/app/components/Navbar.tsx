import React, { useState } from "react";
import { useUser } from "@app/context/UserContext";

async function handleLogout(setCurrentUser: React.Dispatch<React.SetStateAction<any>>) {
  localStorage.removeItem("token");
  setCurrentUser(null);
  window.location.href = "/";
}

const Navbar: React.FC = () => {
  const { currentUser, setCurrentUser } = useUser();
  const [loading, setLoading] = useState(false);

  return (
    <div className="bg-white text-black p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center overflow-x-auto whitespace-nowrap">
        <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm md:text-base lg:text-lg">
          <a href="/" className="hover:underline flex-shrink-0">
            Home
          </a>
          <a href="/blog" className="hover:underline flex-shrink-0">
            Blog
          </a>
          <a
            href="https://www.subletr.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex-shrink-0"
          >
            Subletr
          </a>
          <a
            href="https://linkedin.com/in/johann-zhang-269900196/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex-shrink-0"
          >
            Linkedin
          </a>
          <a
            href="https://github.com/johannzhang168"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex-shrink-0"
          >
            Github
          </a>
          <a
            href="https://drive.google.com/file/d/1DG9fu_W27yQNaNaf86wdnfAjxULWYB0K/view"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex-shrink-0"
          >
            Resume
          </a>
        </div>

        <div className="flex items-center space-x-4">
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <span className="text-xs sm:text-sm md:text-base lg:text-lg">
                Welcome, {currentUser.firstname}!
              </span>
              <button
                className={`bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600 ${
                  loading && "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => {
                  setLoading(true);
                  handleLogout(setCurrentUser);
                }}
                disabled={loading}
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            </div>
          ) : (
            <div>
              <a href="/login" className="hover:underline text-xs sm:text-sm md:text-base lg:text-lg">
                Login
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
