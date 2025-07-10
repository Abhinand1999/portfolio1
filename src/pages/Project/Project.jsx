import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import "../../App.css";
import { cardsData } from "./ProjectData";

gsap.registerPlugin(ScrollTrigger);

const startRotations = [-10, -5, 10, 5];
const endRotations = [0, 5, 0, -5];
const progressColors = ["#ecb74c", "#7dd8cd", "#e0ff57", "#7dd8cd"];

const Project = () => {
  const pinnedRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const progressRef = useRef(null);
  const progressContainerRef = useRef(null);
  const indicesRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const lenis = new Lenis();
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);

      const cardCount = cardsRef.current.length;
      const pinnedHeight = window.innerHeight * (cardCount + 1);

      cardsRef.current.forEach((card, i) =>
        gsap.set(card, { rotation: startRotations[i] })
      );

      ScrollTrigger.create({
        trigger: pinnedRef.current,
        start: "top top",
        end: `+=${pinnedHeight}`,
        pin: true,
        pinSpacing: true,
        onLeave: () => toggleUI(false),
        onEnterBack: () => toggleUI(true),
        onUpdate: ({ progress }) => {
          const scaledProgress = progress * (cardCount + 1);
          const currentCard = Math.floor(scaledProgress);

          updateHeaderOpacity(scaledProgress);
          if (scaledProgress > 1) {
            updateProgress(scaledProgress, cardCount);
          } else {
            resetProgress();
          }

          animateCards(scaledProgress, currentCard);
        }
      });
    }, pinnedRef);

    return () => {
      ctx.revert();
      ScrollTrigger.killAll();
      gsap.ticker.remove(() => {});
    };
  }, []);

  const toggleUI = (show) => {
    gsap.to([progressContainerRef.current, indicesRef.current], {
      opacity: show ? 1 : 0,
      duration: 0.5,
      ease: "power2.out"
    });
    if (!show) setActiveIndex(-1);
  };

  const updateHeaderOpacity = (progress) => {
    gsap.to(headerRef.current, {
      opacity: progress <= 1 ? 1 - progress : 0,
      duration: 0.1
    });
  };

  const updateProgress = (progress, count) => {
    const relativeProgress = progress - 1;
    const height = (relativeProgress / count) * 100;
    const index = Math.min(Math.floor(relativeProgress), count - 1);

    gsap.to(progressRef.current, {
      height: `${height}%`,
      backgroundColor: progressColors[index],
      duration: 0.3
    });

    setActiveIndex(index);
  };

  const resetProgress = () => {
    gsap.to(progressRef.current, { height: "0%" });
    setActiveIndex(-1);
  };

  const animateCards = (progress, currentCard) => {
    cardsRef.current.forEach((card, i) => {
      if (i < currentCard) {
        gsap.set(card, { top: "50%", rotation: endRotations[i] });
      } else if (i === currentCard) {
        const cardProgress = progress - currentCard;
        gsap.set(card, {
          top: `${gsap.utils.interpolate(150, 50, cardProgress)}%`,
          rotation: gsap.utils.interpolate(startRotations[i], endRotations[i], cardProgress)
        });
      } else {
        gsap.set(card, { top: "150%", rotation: startRotations[i] });
      }
    });
  };

  return (
    <section className="project_pinned" ref={pinnedRef}>
      <div className="project_progress-bar" ref={progressContainerRef}>
        <div className="project_progress" ref={progressRef} />
      </div>

      <div
  className="w-screen h-screen flex flex-col items-center justify-center text-center"
  ref={headerRef}
  style={{ color: '#F2613F' }}
>
  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[150px] 2xl:text-[200px] font-bold leading-none">
    PROJECTS
  </h1>
</div>


      {cardsData.map((card, idx) => {
        const [firstWord, ...rest] = card.title.split(" ");
        return (
          <a
  key={card.id}
  href={card.url}
  target="_blank" // optional: opens in new tab
  rel="noopener noreferrer"
  className="project_card"
  ref={(el) => (cardsRef.current[idx] = el)}
  style={{
    backgroundImage: `url(${card.bg})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    border: `2px solid ${card.borderColor}80`,
    cursor: "pointer" // gives visual feedback
  }}
>
  <div className="project_card-phase" />
  <div className="project_card-title" style={{ alignItems: "center" }}>
    <h1
      style={{
        fontFamily: "sans-serif",
        textShadow: `2px 2px #000000`,
        color: "white",
        fontSize: `50px`,
        fontWeight: `bold`,
        lineHeight: `90%`
      }}
    >
      {card.title}
    </h1>
  </div>
</a>

        );
      })}
    </section>
  );
};

export default Project;
