import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import BlogCard from "@app/components/BlogCard";
import { motion, AnimatePresence } from "framer-motion";

const Blog: React.FC = () => {
  const { currentUser } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<"published" | "unpublished">(
    "published"
  );
  const [blogs, setBlogs] = useState<any[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);

  const baseurl = import.meta.env.VITE_API_BASE_URL;

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

  // if (loading) return <p>Loading blogs...</p>;

  return (
  <div className="container mx-auto p-4">
    {/* Tabs for Admin */}
    {isAdmin && (
    <div className="flex mb-4">
      <button
        className={`px-4 py-2 ${
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

    {/* Blog List with Animation */}
    <AnimatePresence mode="wait">
    <motion.div
      key={activeTab} // Triggers re-animation when the tab changes
      initial={{ opacity: 0 }} // Start with 0 opacity
      animate={{ opacity: 1 }} // Fade into full opacity
      exit={{ opacity: 0 }} // Fade out
      transition={{ duration: 0.5 }} // Animation duration
      className="flex flex-col gap-4"
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
