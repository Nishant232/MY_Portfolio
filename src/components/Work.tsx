import "./styles/Work.css";
import { useState, useRef } from "react";
import { MdArrowBackIos, MdArrowForwardIos, MdArrowOutward } from "react-icons/md";
import { FaGithub } from "react-icons/fa";

interface Project {
  id: number;
  title: string;
  category: string;
  techs: string;
  description: string;
  github: string;
  live: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "GrowthHub",
    category: "Full-Stack Platform",
    techs: "Next.js, TypeScript, Node.js, Express, PostgreSQL, Supabase, Razorpay",
    description:
      "Built a full-stack mentorship platform connecting mentees with industry experts for 1-on-1 sessions; integrated Razorpay payments, real-time booking, and a scalable PostgreSQL + Supabase backend deployed to production.",
    github: "https://github.com/Nishant232/GrowthHub",
    live: "https://growth-hub-pink.vercel.app",
  },
  {
    id: 2,
    title: "HireFlow",
    category: "AI-Powered Full-Stack Platform",
    techs: "React, TypeScript, Node.js, Express, MongoDB, OpenRouter AI, Adzuna API",
    description:
      "AI-powered job search platform using OpenRouter LLMs (GPT-4o, Llama 3.1) to auto-generate ATS-optimized resume bullets, cover letters, and mock interview Q&A. Built a Resume Studio with PDF/DOCX parsing and ATS scoring, plus an Adzuna API job-matching engine with AI compatibility scoring across 12+ secured MongoDB REST endpoints (Supabase JWT auth, Zod validation, rate-limiting).",
    github: "https://github.com/Nishant232/HireFlow",
    live: "https://nishant00-hireflow.hf.space",
  },
  {
    id: 3,
    title: "SyncScribe",
    category: "Real-Time Collaboration Tool",
    techs: "Next.js, TypeScript, Socket.io, Express, Supabase (PostgreSQL)",
    description:
      "Real-time collaborative document editor with keystroke-level sync, live cursor tracking, and typing indicators via Socket.io WebSockets, achieving sub-50ms broadcast latency. Implemented PostgreSQL Row-Level Security (Supabase) for owner/editor/viewer access control with expirable share tokens; deployed on Hugging Face Spaces.",
    github: "https://github.com/Nishant232/SyncScribe",
    live: "https://nishant00-syncscribe.hf.space/",
  },
  {
    id: 4,
    title: "Optimal EV Charging Stations",
    category: "ML & Optimization",
    techs: "Python, NumPy, Pandas, Scikit-learn, Flask",
    description:
      "Designed a predictive ML framework to evaluate and rank 150+ EV charging sites; applied GWO & GOA metaheuristic algorithms achieving 40% network coverage improvement and 35% reduction in average user travel distance.",
    github: "https://github.com/Nishant232/Optimal-EV-Charging-Stations",
    live: "",
  },
  {
    id: 5,
    title: "ERA-AI Voice Assistant",
    category: "AI & OS Automation",
    techs: "Python, Speech Recognition, OS Automation",
    description:
      "Engineered a real-time NLP voice AI assistant automating PC workflows via OS-level script execution; enabled hands-free control of local applications, custom file management, and multi-step task automation.",
    github: "https://github.com/Nishant232/ERA-AI",
    live: "",
  },
  {
    id: 6,
    title: "Message Spam Detection",
    category: "NLP & Deep Learning",
    techs: "Python, TensorFlow, Scikit-learn, Hugging Face",
    description:
      "Built a transformer-based NLP spam classifier with an end-to-end preprocessing pipeline served via REST API; achieved 90% accuracy and 95% precision, outperforming TF-IDF baselines for automated threat-free message filtering.",
    github: "https://github.com/Nishant232",
    live: "",
  },
  {
    id: 7,
    title: "Face Attendance Detection",
    category: "Computer Vision",
    techs: "Python, OpenCV, NumPy, Flask, MongoDB",
    description:
      "Built a real-time face-recognition pipeline cutting processing latency by 83% (180s → 30s); achieved 85%+ accuracy via vectorized operations, exposed via Flask REST API with MongoDB logging — reducing manual tracking time by 80%.",
    github: "https://github.com/Nishant232/Face-Attendance-detection",
    live: "",
  },
];

const Work = () => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAmount = 620;

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const handleScroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const rawTarget =
        direction === "right"
          ? scrollLeft + scrollAmount
          : scrollLeft - scrollAmount;
      const clampedTarget = Math.max(0, Math.min(rawTarget, maxScroll));
      containerRef.current.scrollTo({ left: clampedTarget, behavior: "smooth" });
      setTimeout(checkScroll, 800);
    }
  };

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>

        <div className="work-slider-wrapper">
          <button
            className={`work-arrow work-arrow-left ${!canScrollLeft ? "disabled" : ""}`}
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            aria-label="Previous work card"
            title="Previous project"
          >
            <MdArrowBackIos />
          </button>

          <div className="work-flex-container" ref={containerRef} onScroll={checkScroll}>
            <div className="work-flex">
              {projects.map((project) => (
                <div className="work-box" key={project.id}>
                  <div className="work-info">
                    <div className="work-title">
                      <h3>{String(project.id).padStart(2, "0")}</h3>
                      <div>
                        <h4>{project.title}</h4>
                        <p>{project.category}</p>
                      </div>
                    </div>
                    <h4>Tools and features</h4>
                    <p>{project.techs}</p>
                    <p className="work-description">{project.description}</p>
                    <div className="work-links">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor="disable"
                          aria-label="GitHub"
                        >
                          <FaGithub />
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor="disable"
                          aria-label="Live site"
                        >
                          <MdArrowOutward />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className={`work-arrow work-arrow-right ${!canScrollRight ? "disabled" : ""}`}
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            aria-label="Next work card"
            title="Next project"
          >
            <MdArrowForwardIos />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Work;
