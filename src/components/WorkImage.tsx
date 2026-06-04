import { useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import { FaGithub } from "react-icons/fa";

interface Props {
  image: string;
  alt?: string;
  video?: string;
  link?: string;
  github?: string;
}

const WorkImage = (props: Props) => {
  const [isVideo, setIsVideo] = useState(false);
  const [video, setVideo] = useState("");
  const handleMouseEnter = async () => {
    if (props.video) {
      setIsVideo(true);
      const response = await fetch(`src/assets/${props.video}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setVideo(blobUrl);
    }
  };

  // Determine which link to use: GitHub if available, otherwise live link
  const primaryLink = props.github || props.link;
  const linkIcon = props.github ? <FaGithub /> : <MdArrowOutward />;

  return (
    <div className="work-image">
      <a
        className="work-image-in"
        href={primaryLink}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVideo(false)}
        target="_blank"
        data-cursor={"disable"}
      >
        {primaryLink && (
          <div className="work-link">
            {linkIcon}
          </div>
        )}
        <img src={props.image} alt={props.alt} />
        {isVideo && <video src={video} autoPlay muted playsInline loop></video>}
      </a>
    </div>
  );
};

export default WorkImage;
