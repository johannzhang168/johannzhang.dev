import { useUser } from "@app/context/UserContext";
import React from "react";
import { useNavigate } from "react-router-dom";

interface ProjectCardProps {
  project: {
    id: string;
    Name: string;
    Image: string;
    Description: string;
    Link: string;
    Tags: string[];
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  return (
    <div className="rounded-lg bg-white hover:bg-gray-200 shadow-md transition flex flex-col max-w-full">
      <div
        className="flex flex-col cursor-pointer flex-grow"
        onClick={(e) => {
          e.preventDefault();
          window.open(project.Link, "_blank", "noopener,noreferrer");
        }}
      >
        <div className="p-4 relative group">
          {currentUser !== null && currentUser.status === "ADMIN" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/projects/edit/${project.id}`);
              }}
              className="absolute top-4 right-4 bg-gray-400 text-black font-bold px-2 py-1 rounded-md cursor-pointer flex items-center justify-center hover:bg-gray-500"
            >
              ...
            </button>
          )}
          <img
            src={project.Image}
            alt={project.Name}
            className="w-full h-auto object-cover rounded-md"
          />
        </div>

        <div className="p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2 truncate">{project.Name}</h3>
          </div>
          <div>
            <p className="text-gray-700 mb-4 text-sm break-words">{project.Description}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.Tags.map((tag, index) => {
              const formattedTag = tag.replace("_", " ");
              let bgColor = "bg-gray-300";
              if (tag === "TYPESCRIPT") bgColor = "bg-blue-600 text-white";
              else if (tag === "REACT") bgColor = "bg-blue-400 text-white";
              else if (tag === "NEXTJS") bgColor = "bg-black text-white";
              else if (tag === "TAILWIND_CSS") bgColor = "bg-teal-500 text-white";
              else if (tag === "MONGODB") bgColor = "bg-green-800 text-white";
              else if (tag === "PRISMA") bgColor = "bg-purple-500 text-white";
              else if (tag === "AMAZON_S3") bgColor = "bg-orange-500 text-white";
              else if (tag === "PYTHON") bgColor = "bg-yellow-400 text-white";
              else if (tag === "SCIKIT-LEARN") bgColor = "bg-yellow-500 text-white";
              else if (tag === "TENSORFLOW") bgColor = "bg-orange-300 text-white";
              else if (tag === "OPENCV") bgColor = "bg-blue-500 text-white";
              else if (tag === "ROS") bgColor = "bg-blue-800 text-white";
              else if (tag === "MEDIAPIPE") bgColor = "bg-blue-300 text-white";
              else if (tag === "GO") bgColor = "bg-teal-300 text-white";
              else if (tag === "FIBER") bgColor = "bg-teal-700 text-white";
              else if (tag === "C") bgColor = "bg-black text-white";
              else if (tag === "C++") bgColor = "bg-black text-white";
              else if (tag === "JAVA") bgColor = "bg-red-500 text-white";
              return (
                <span
                  key={index}
                  className={`rounded-md px-3 py-1 text-xs font-semibold ${bgColor}`}
                >
                  {formattedTag}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
