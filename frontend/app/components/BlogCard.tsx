import React from "react";
import { Link } from "react-router-dom";

interface BlogCardProps {
  blog: {
    id: string;
    Title: string;
    DatePublished: string;
    Description: string;
    created_at: string;
    ImageURLs: string[]

  };
  isPublished: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, isPublished }) => {
  return (
    <div>
      <Link
        to={isPublished ? `/blog/${blog.id}` : `/blog/edit/${blog.id}`}
        className="flex"
      >
        <div className="bg-white p-4 rounded-lg w-full shadow-md grid grid-cols-3 gap-4 hover:bg-gray-200 transition">
          <div className="col-span-2 flex flex-col space-y-2">

            <h2 className="text-lg font-semibold">{blog.Title}</h2>
            {blog.Description && (
              <p className="text-sm text-gray-700 break-words max-w-3/4">
                {blog.Description}
              </p>
            )}
    

            <p className="text-sm text-gray-400">
              {new Date(blog.DatePublished || blog.created_at).toLocaleDateString()}
            </p>
          </div>
    
          {blog.ImageURLs && blog.ImageURLs.length > 0 && (
            <div className="flex items-center justify-end">
              <img
                src={blog.ImageURLs[0]}
                alt="Blog Thumbnail"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
