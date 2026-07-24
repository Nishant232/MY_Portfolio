import {
  FaArrowRight,
  FaCode,
  FaGithub,
  FaLinkedinIn,
  FaLocationDot,
} from "react-icons/fa6";
import { MdArrowOutward, MdMailOutline } from "react-icons/md";
import "./App.css";

const featuredProjects = [
  {
    number: "01",
    title: "GrowthHub",
    type: "Mentorship marketplace",
    image: "/images/projects/growthhub.png",
    imageAlt:
      "GrowthHub homepage showing its mentor marketplace and career acceleration message",
    summary:
      "A production platform for booking 1-on-1 sessions with industry experts, complete with Razorpay payments and real-time availability.",
    impact: ["Live payments", "Production deployment", "PostgreSQL architecture"],
    stack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Razorpay"],
    live: "https://growth-hub-pink.vercel.app",
    code: "https://github.com/Nishant232/GrowthHub",
    tone: "violet",
  },
  {
    number: "02",
    title: "HireFlow",
    type: "AI job-search workspace",
    image: "/images/projects/hireflow.png",
    imageAlt:
      "HireFlow homepage showing its AI job search dashboard and application pipeline",
    summary:
      "An AI-powered career platform that creates ATS-ready content, scores resumes and matches candidates with relevant roles.",
    impact: ["12+ secured APIs", "AI compatibility scoring", "PDF/DOCX parsing"],
    stack: ["React", "Express", "MongoDB", "OpenRouter", "Supabase"],
    live: "https://nishant00-hireflow.hf.space",
    code: "https://github.com/Nishant232/HireFlow",
    tone: "cyan",
  },
  {
    number: "03",
    title: "SyncScribe",
    type: "Real-time collaboration",
    image: "/images/projects/syncscribe.png",
    imageAlt:
      "SyncScribe homepage showing its real-time collaborative document editor",
    summary:
      "A collaborative editor with keystroke-level synchronization, live cursors and role-based document sharing.",
    impact: ["Sub-50ms broadcast", "Row-level security", "Expirable share links"],
    stack: ["Next.js", "Socket.io", "Express", "Supabase", "PostgreSQL"],
    live: "https://nishant00-syncscribe.hf.space/",
    code: "https://github.com/Nishant232/SyncScribe",
    tone: "lime",
  },
];

const additionalProjects = [
  {
    title: "Optimal EV Charging",
    result: "40% coverage improvement across 150+ candidate sites",
    stack: "Python · Scikit-learn · Flask",
    href: "https://github.com/Nishant232/Optimal-EV-Charging-Stations",
  },
  {
    title: "ERA Voice Assistant",
    result: "Hands-free, multi-step desktop workflow automation",
    stack: "Python · NLP · OS Automation",
    href: "https://github.com/Nishant232/ERA-AI",
  },
  {
    title: "Face Attendance",
    result: "83% lower processing latency with 85%+ accuracy",
    stack: "OpenCV · Flask · MongoDB",
    href: "https://github.com/Nishant232/Face-Attendance-detection",
  },
];

const skills = [
  {
    label: "Frontend",
    items: "React, Next.js, TypeScript, responsive UI, accessible interfaces",
  },
  {
    label: "Backend",
    items: "Node.js, Express, REST APIs, JWT, RBAC, WebSockets",
  },
  {
    label: "Data & cloud",
    items: "PostgreSQL, MongoDB, Supabase, Cloudinary, Vercel",
  },
  {
    label: "AI & systems",
    items: "LLM APIs, Python, scikit-learn, OpenCV, automation",
  },
];

function App() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="topbar">
        <a className="brand" href="#top" aria-label="Nishant, home">
          Nishant<span>.</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#about">About</a>
        </nav>
        <a className="nav-cta" href="mailto:nishant75971@gmail.com">
          Let&apos;s talk <MdArrowOutward />
        </a>
      </header>

      <main id="main">
        <section className="hero section" id="top">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" />
              Available for full-time opportunities
            </div>
            <h1>I build digital products that <em>work in the real world.</em></h1>
            <p className="hero-lede">
              I&apos;m Nishant, a full-stack developer turning complex product
              requirements into fast, reliable web applications—from payments
              and booking engines to real-time collaboration and AI tooling.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">
                Explore my work <FaArrowRight />
              </a>
              <a
                className="button button-secondary"
                href="https://drive.google.com/file/d/16D0NQhuRfqT14Pdn2HFDnnverSyYMBhJ/view?usp=sharing"
                target="_blank"
                rel="noreferrer"
              >
                View résumé <MdArrowOutward />
              </a>
            </div>
          </div>

          <aside className="hero-panel" aria-label="Profile highlights">
            <div className="profile-mark">
              <img
                src="/images/nishant-profile.jpg"
                alt="Nishant, full-stack developer"
                decoding="async"
              />
            </div>
            <div className="panel-copy">
              <p>Full-stack developer</p>
              <h2>React × Node × AI</h2>
            </div>
            <div className="panel-meta">
              <span><FaLocationDot /> India</span>
              <span>Open to relocate</span>
            </div>
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
          </aside>
        </section>

        <section className="proof-strip" aria-label="Career highlights">
          <div><strong>3</strong><span>Production apps</span></div>
          <div><strong>5 mo</strong><span>On-site experience</span></div>
          <div><strong>Top 5</strong><span>HackHound 3.0</span></div>
          <div><strong>8.16</strong><span>Engineering SGPA</span></div>
        </section>

        <section className="section work-section" id="work">
          <div className="section-heading">
            <div>
              <p className="kicker">Selected work</p>
              <h2>Projects with proof, not just polish.</h2>
            </div>
            <p>
              Product decisions, technical depth and measurable outcomes—shown
              in the projects I&apos;d want to discuss in an interview.
            </p>
          </div>

          <div className="project-grid">
            {featuredProjects.map((project) => (
              <article className={`project-card project-${project.tone}`} key={project.title}>
                <a
                  className="project-visual"
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open the live ${project.title} project`}
                >
                  <img
                    src={project.image}
                    alt={project.imageAlt}
                    loading={project.number === "01" ? "eager" : "lazy"}
                    decoding="async"
                  />
                  <span>View live product <MdArrowOutward /></span>
                </a>
                <div className="project-content">
                  <div className="project-topline">
                    <span>{project.number}</span><span>{project.type}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p className="project-summary">{project.summary}</p>
                  <ul className="impact-list">
                    {project.impact.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <div className="tag-list">
                    {project.stack.map((item) => <span key={item}>{item}</span>)}
                  </div>
                  <div className="project-links">
                    <a href={project.live} target="_blank" rel="noreferrer">
                      Live product <MdArrowOutward />
                    </a>
                    <a href={project.code} target="_blank" rel="noreferrer">
                      <FaGithub /> Source
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="more-work">
            {additionalProjects.map((project) => (
              <a href={project.href} target="_blank" rel="noreferrer" className="mini-project" key={project.title}>
                <div><h3>{project.title}</h3><p>{project.result}</p></div>
                <span>{project.stack}</span><MdArrowOutward />
              </a>
            ))}
          </div>
        </section>

        <section className="section experience-section" id="experience">
          <div className="section-heading compact">
            <div>
              <p className="kicker">Experience</p>
              <h2>Built in teams. Shipped to users.</h2>
            </div>
          </div>
          <div className="timeline">
            <article className="timeline-item">
              <div className="timeline-date">Feb—Jul 2026</div>
              <div>
                <p className="role-label">Code Codence Private Limited · On-site</p>
                <h3>Full-Stack Developer Intern</h3>
                <p>
                  Shipped two MERN applications in a four-developer Agile team.
                  Built four-tier RBAC, real-time booking with live availability,
                  email automation, secured APIs and production data models.
                </p>
                <div className="tag-list muted">
                  <span>React</span><span>Node.js</span><span>MongoDB</span>
                  <span>JWT</span><span>Agile</span>
                </div>
              </div>
            </article>
            <article className="timeline-item">
              <div className="timeline-date">2022—2026</div>
              <div>
                <p className="role-label">Shri Vishwakarma Skill University</p>
                <h3>B.Tech CSE · AI &amp; Machine Learning</h3>
                <p>
                  Building a foundation across software engineering, machine
                  learning and systems while maintaining an 8.16 SGPA.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="section about-section" id="about">
          <div className="about-copy">
            <p className="kicker">What I bring</p>
            <h2>Product thinking on the frontend. Systems thinking on the backend.</h2>
            <p>
              I enjoy owning features end to end: understanding the user,
              shaping the data model, building the interface, securing the API
              and watching how the product behaves after deployment.
            </p>
            <a className="text-link" href="https://github.com/Nishant232" target="_blank" rel="noreferrer">
              See how I build on GitHub <FaArrowRight />
            </a>
          </div>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <article key={skill.label}>
                <span>0{index + 1}</span><FaCode />
                <h3>{skill.label}</h3><p>{skill.items}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <p className="kicker">Start a conversation</p>
          <h2>Have a role where I can build, learn and ship?</h2>
          <a className="contact-email" href="mailto:nishant75971@gmail.com">
            <MdMailOutline /> nishant75971@gmail.com
          </a>
          <div className="contact-links">
            <a href="https://github.com/Nishant232" target="_blank" rel="noreferrer"><FaGithub /> GitHub</a>
            <a href="https://www.linkedin.com/in/2005nishant/" target="_blank" rel="noreferrer"><FaLinkedinIn /> LinkedIn</a>
          </div>
        </section>
      </main>

      <footer>
        <span>© 2026 Nishant</span>
        <span>Designed and built with intent.</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </div>
  );
}

export default App;
