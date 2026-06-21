import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech CSE (AI &amp; ML)</h4>
                <h5>Shri Vishwakarma Skill University</h5>
              </div>
              <h3>2022-2026</h3>
            </div>
            <p>
              Pursuing B.Tech in Computer Science Engineering with specialization in Artificial
              Intelligence &amp; Machine Learning. Maintaining a SGPA of 8.05 while building
              hands-on projects in web development, ML, and systems programming.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>FullStack Developer Intern</h4>
                <h5>Code Codence</h5>
              </div>
              <h3>Feb 2026 – Jun 2026</h3>
            </div>
            <p>
              Shipped 2 production MERN apps within a 4-developer Agile team using Git feature
              branches, sprint planning, and peer code review. Built a 4-tier RBAC system with
              JWT authentication and bcrypt-secured sessions across Admin, Manager, Staff, and
              Customer roles. Developed a real-time booking engine with live slot-availability
              checks and automated Nodemailer email notifications. Built RESTful APIs and
              SQL/MongoDB schemas, integrated Cloudinary for media storage, and hardened
              endpoints with Helmet and rate-limiting.
            </p>
          </div>
        </div>
        <h2>
          Achievements
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Top 5 Finalist — HackHound 3.0</h4>
                <h5>SRM University</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Built HealthBridge, a full-stack healthcare data integration platform.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Co-Organizer</h4>
                <h5>Smart India Hackathon (Internal)</h5>
              </div>
              <h3></h3>
            </div>
            <p>
              Coordinated 50+ participants across team formation and event logistics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
