import React from "react";

const Home: React.FC = () => {
  return (
    <div className="min-h-[15vh] flex flex-col gap-5 items-left">
      <p className="text-3xl font-bold text-orange-500">Bio</p>
      <p className="text-lg text-black">
        Hello World! I'm Johann Zhang, an aspiring software engineer studying computer science at Tufts University.
        Currently, I find enjoyment in building projects revolving around machine learning, high performance computing, and web development. 
        For recruiters, please view my <a href="https://drive.google.com/file/d/1DG9fu_W27yQNaNaf86wdnfAjxULWYB0K/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="underline font-bold">resume</a> here. 
      </p>
      <p className="text-lg text-black">Outside of school, I enjoy going to the gym, swimming, and occasionally full boxing some kids on Fortnite. I'm also trying to get into writing, which is one of the main motives behind this site. Check out some of my <a href="/blog" className="underline font-bold">blogs</a>, if you want. Hopefully they provide some nice insights to things that might interest you.</p>

      <p className="text-3xl font-bold text-orange-500">Work Experience {" "} </p>
      <ul className="list-disc text-lg ml-[1vw] text-black space-y-[2vh]">
        <li>
          <p>
            <a href="https://www.datadoghq.com/" target="_blank" rel="noopener noreferrer" className="underline">
              Datadog
            </a>{" "}
            (starting in June 2025): Software Engineer Intern
          </p>
        </li>
        <li className="space-y-[1vh]">
          <p>
            <a href="https://www.subletr.com/" target="_blank" rel="noopener noreferrer" className="underline">
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
          <span className="underline">
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


    </div>
  );
};

export default Home;
