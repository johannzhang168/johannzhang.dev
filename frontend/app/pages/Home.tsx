import React from "react";

const Home: React.FC = () => {
  return (
    <div className="min-h-[15vh] flex flex-col gap-5 items-left">
      <p className="text-3xl font-bold text-orange-500">Bio</p>
      <p className="text-lg text-black">
        Hello World! I'm Johann Zhang, an aspiring software engineer studying computer science at Tufts University.
        Currently, I find enjoyment in building projects revolving around machine learning, high performance computing, and web development.
      </p>
      <p className="text-lg text-black">Outside of school, I enjoy going to the gym, swimming, and occasionally full boxing some kids on Fortnite.</p>

      <p className="text-3xl font-bold text-orange-500">Work Experience</p>
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
              Developed and launched Rate My Landlord, allowing users to help each other choose rental accommodations
              by anonymously rating their living situations.
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
