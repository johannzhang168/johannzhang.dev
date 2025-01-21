import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import BlogCard from "@app/components/BlogCard";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Blog: React.FC = () => {
  const { currentUser } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<"published" | "unpublished">(
    "published"
  );
  const [blogs, setBlogs] = useState<any[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);

  const baseurl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && currentUser.status === "ADMIN") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [currentUser]);

  const fetchBlogs = async (published: boolean) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseurl}/newsletters/get?published=${published}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }
      const data = await response.json();
      setBlogs(data.newsletters);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (isAdmin) {
      fetchBlogs(activeTab === "published");
    } else {
      fetchBlogs(true); 
    }
  }, [isAdmin, activeTab]);


  return (
  <div className="container mx-auto p-4">

    {currentUser && currentUser.status === "ADMIN" && (
      <div className="flex justify-end">
        <button onClick={() => navigate(`/create/blog`)}  className="hover:bg-orange-600  bg-orange-500 rounded-md p-1 text-white">
          Create Blog
        </button>
      </div>
    )}
    {isAdmin && (
    <div className="flex mb-4">
      <button
        className={`py-2 ${
                activeTab === "published" ? "font-bold underline" : "font-normal"
        } hover:underline`}
        onClick={() => setActiveTab("published")}
      >
        Published Blogs
      </button>
      <button
        className={`ml-2 px-4 py-2 ${
                activeTab === "unpublished" ? "font-bold underline" : "font-normal"
        } hover:underline`}
        onClick={() => setActiveTab("unpublished")}
      >
        Unpublished Blogs
      </button>
    </div>
    )}

    <p className="text-3xl font-semibold">Blog</p>
    <p className="text-lg mt-5">Trying out this whole writing thing. I hope to become better at this as time goes on, so please send any feedback you have on <a href="https://www.linkedin.com/in/johann-zhang-269900196/" target="_blank" rel="noopener noreferrer" className="underline font-bold">linkedin</a>!</p>

    <AnimatePresence mode="wait">
    <motion.div
      key={activeTab}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 mt-4"
    >
    {blogs.map((blog) => (
      <BlogCard key={blog.id} blog={blog} isPublished={blog.Published} />
    ))}
    </motion.div>
    </AnimatePresence>
  </div>
  );
      
};

export default Blog;
