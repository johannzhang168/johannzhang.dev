import ProjectCard from "@app/components/ProjectCard";
import { useUser } from "@app/context/UserContext";
import React, { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]); 
  const baseurl = import.meta.env.VITE_API_BASE_URL;
  const {currentUser} = useUser();
  const navigate = useNavigate();
  const fetchProjects = async () => {
    try{
      const response = await fetch(`${baseurl}/projects/get`)
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      console.log(data.projects)
      setProjects(data.projects)

    }catch(error){
      console.error("Error fetching projects:", error);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const breakpointColumns = {
    default: 2,
    768: 1,
  };

  return (
    <div className="min-h-[15vh] flex flex-col gap-5 items-left">
      <p className="text-2xl md:lg:text-3xl font-semibold">Bio</p>
      <p className="md:lg:text-lg sm:text-md">
        Hello World! I'm Johann, an aspiring software engineer studying computer science at Tufts University.
        Currently, I find enjoyment in building projects revolving around machine learning, high performance computing, and web development. 
        For those interested, here is my <a href="https://drive.google.com/file/d/1DG9fu_W27yQNaNaf86wdnfAjxULWYB0K/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="underline font-bold">resume</a>, and some <a href="#projects-section" className="underline font-bold">projects</a> I've worked on. 
      </p>
      <p className="md:lg:text-lg sm:text-md">Outside of school, I enjoy going to the gym, swimming, and occasionally full boxing some kids on Fortnite. I'm also trying to get into writing, which is one of the main motives behind this site. Check out some of my <a href="/blog" className="underline font-bold">blogs</a>, if you want. Hopefully they provide some nice insights to things that might interest you.</p>

      <p className="text-2xl md:lg:text-3xl font-semibold">Work Experience {" "} </p>
      <ul className="list-disc md:lg:text-lg sm:text-md ml-[1vw] space-y-[2vh]">
        <li>
          <p>
            <a href="https://www.datadoghq.com/" target="_blank" rel="noopener noreferrer" className="underline hover:font-bold">
              Datadog
            </a>{" "}
            (starting in June 2025): Software Engineer Intern
          </p>
        </li>
        <li className="space-y-[1vh]">
          <p>
            <a href="https://www.subletr.com/" target="_blank" rel="noopener noreferrer" className="underline hover:font-bold">
              Subletr 
            </a>
            {" "} (June 2024 - Present) : Full Stack Developer 
          </p>
          <ul className="list-disc ml-[2vw]">
            <li>
              This is my friend Winston's startup, who I've had the pleasure of working on a really cool product with. 
              Subletr is a nationwide solution for college students who are either struggling to find subletters for their off campus housing, 
              or are struggling to find sublessors for a short term rent. 
              If you are a college student in either of these categories, please do check the our site out!
            </li>
            <li>
              Developed and launched Rate My Landlord, allowing users to help each other choose rental accommodations
              by anonymously rating their living situations. Also helped revamp whole site UI to make it more user-friendly.
            </li>
          </ul>
        </li>
        <li className="space-y-[1vh]">
          <p >
          <span className="underline cursor-pointer hover:font-bold" >
            University of Missouri-Columbia - NSF REU 
          </span> {" "}
          (June 2024 - July 2024): Research Intern
          </p>
          <ul className="list-disc ml-[2vw] space-y-[2vh]">
            <li>
              Developed and wrote a paper about a novel Q-Learning Reinforcement Learning algorithm for safe and effective drone delivery route
              planning in the case of loss of wireless connection with delivery trucks.
            </li>
          </ul>
        </li>
      </ul>
      <div className="flex items-center justify-between mb-4">
        <p
          id="projects-section"
          className="text-3xl font-semibold"
        >
          Projects I've Worked On
        </p>
        {currentUser !== null && currentUser.status === "ADMIN" && (
          <button
            onClick={() => navigate("/create/project")}
            className="bg-orange-500 w-7 h-7 text-white px-3 py-2 rounded-md hover:bg-orange-600 flex items-center justify-center"
          >
            +
          </button>
        )}
      </div>
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex gap-4"
        columnClassName="space-y-4"
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </Masonry> 
    </div>
  );
};

export default Home;
