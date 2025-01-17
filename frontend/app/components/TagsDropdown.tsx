import React, { useState } from "react";

interface TagsDropdownProps {
  selectedTags: string[];
  onChange: (updatedTags: string[]) => void;
}

const TagsDropdown: React.FC<TagsDropdownProps> = ({ selectedTags, onChange }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const allTags = [
    "Typescript",
    "Tailwind CSS",
    "React",
    "NextJS",
    "Amazon S3",
    "MongoDB",
    "Prisma",
    "Python",
    "Scikit-learn",
    "Tensorflow",
    "OpenCV",
    "ROS",
    "MediaPipe",
    "Go",
    "Fiber",
    "C",
    "C++",
    "Java",
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="relative w-64">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 border rounded bg-white flex justify-between items-center"
      >
        Select Tags
        <span className="ml-2">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="absolute mt-1 w-full border rounded bg-white shadow-md max-h-60 overflow-y-auto z-10">
          {allTags.map((tag) => {
            const formattedTag = tag.toUpperCase().replace(/ /g, "_");
            return (
              <label
                key={tag}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
              >
                <input
                  type="checkbox"
                  checked={selectedTags.includes(formattedTag)}
                  onChange={() => toggleTag(formattedTag)}
                  className="mr-2"
                />
                {tag}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TagsDropdown;
