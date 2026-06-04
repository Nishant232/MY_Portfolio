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
              Intelligence &amp; Machine Learning. Maintaining a SGPA of 8.04 while building
              hands-on projects in web development, ML, and systems programming.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>FullStack Developer Intern</h4>
                <h5>CodeCodence</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Code Codence & MERN Tech Developed multiple client-facing web applications using 
              MongoDB, Express.js, React, and Node.js. Key builds include an 
              EdTech learning platform and a Cloud Kitchen ordering site — both 
              designed for real users with full backend integration.
            </p>
          </div>
          {/* <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Position In Company</h4>
                <h5>Company Name</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim
              labore sit non ipsum temporibus quidem, deserunt eaque officiis
              mollitia ratione suscipit repellat.
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Career;
