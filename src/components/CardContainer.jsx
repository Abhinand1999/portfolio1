import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Asset imports
import Html from "../assets/Skills/html-5_5968267.png";
import Redux from "../assets/Skills/icons8-redux-96.png";
import Mysql from "../assets/Skills/mysql-logo.png";
import Nodejs from "../assets/Skills/icons8-nodejs-96.png";
import Postman from "../assets/Skills/pngwing.com (10).png";
import Tailwind from "../assets/Skills/icons8-tailwindcss-96.png";
import TS from "../assets/Skills/icons8-typescript-96.png";
import JS from "../assets/Skills/icons8-javascript-96.png";
import CSS from "../assets/Skills/css-3_5968242.png";
import git from "../assets/Skills/icons8-git-96.png";
import rt from "../assets/Skills/programing_15484268.png";
import AWS from "../assets/Skills/icons8-awslambda-96.png";

gsap.registerPlugin(ScrollTrigger);

const Card = ({ title, img }) => (
  <div className="shadow-lg rounded-xl p-3 sm:p-4 w-24 sm:w-28 md:w-32 flex-shrink-0 flex flex-col items-center mx-2 bg-[#F2613F] text-[#0C0C0C]">
    <img src={img} alt={title} className="w-12 sm:w-16 h-12 sm:h-16 mb-2 object-contain" />
    <p className="text-xs sm:text-sm font-medium text-center">{title}</p>
  </div>
);

const CardContainer = () => {
  const marqueeRef = useRef();

  useEffect(() => {
    const container = marqueeRef.current;

    const totalWidth = container.scrollWidth / 2;

    const marquee = gsap.to(container, {
      x: `-${totalWidth}px`,
      ease: "none",
      duration: 30,
      repeat: -1,
      paused: true,
    });

    ScrollTrigger.create({
      trigger: container,
      start: "top 80%",
      onEnter: () => marquee.play(),
      onLeaveBack: () => marquee.pause(),
    });

    return () => {
      marquee.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const cards = [
    { title: "HTML5", img: Html },
    { title: "Redux", img: Redux },
    { title: "MySQL", img: Mysql },
    { title: "Node.js", img: Nodejs },
    { title: "Postman", img: Postman },
    { title: "Tailwind CSS", img: Tailwind },
    { title: "TypeScript", img: TS },
    { title: "JavaScript", img: JS },
    { title: "Git", img: git },
    { title: "CSS3", img: CSS },
    { title: "React", img: rt },
    { title: "AWS Lambda", img: AWS },
  ];

  const repeatedCards = [...cards, ...cards]; // Seamless loop

  return (
    <div className="w-full overflow-hidden bg-[#0C0C0C] py-4">
      <div className="flex w-max" ref={marqueeRef}>
        {repeatedCards.map((card, index) => (
          <Card key={index} title={card.title} img={card.img} />
        ))}
      </div>
    </div>
  );
};

export default CardContainer;
