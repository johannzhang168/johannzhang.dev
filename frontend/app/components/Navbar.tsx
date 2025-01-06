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
    <div className="bg-white text-black p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="grid grid-cols-4 gap-4">
          <a href="/" className="text-lg hover:underline">
            Home
          </a>
          <a href="/blog" className="text-lg hover:underline">
            Blog
          </a>
          {/* <a href="https://www.subletr.com/" target="_blank" rel="noopeber noreferrer" className="text-lg hover:underline">
            Subletr
          </a> */}
          <a href="https://github.com/johannzhang168" target="_blank" rel="noopener noreferrer" className="text-lg hover:underline">
            Github
          </a>
          <a href="https://linkedin.com/in/johann-zhang-269900196/" target="_blank" rel="noopener noreferrer" className="text-lg hover:underline">
            Linkedin
          </a>
        </div>

        <div>
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <span>Welcome, {currentUser.firstname}!</span>
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
              <a href="/login" className="mr-4 hover:underline">
                Login
              </a>
              <a href="/register" className="hover:underline">Register</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
