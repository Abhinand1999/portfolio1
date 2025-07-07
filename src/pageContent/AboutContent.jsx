import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AboutContent = () => {
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      headingRef.current,
      { x: -100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    gsap.fromTo(
      paragraphRef.current,
      { x: -100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: paragraphRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  return (
    <div className="w-full min-h-screen px-4 md:px-12 py-12 flex flex-col justify-between gap-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="md:w-1/2 px-2">
          <h1
            ref={headingRef}
            className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-snug"
            style={{ color: '#F2613F' }}
          >
            <span style={{ color: '#9B3922' }}>Passionate</span> about web development for over 3 years
          </h1>
        </div>
      </div>

      {/* Description Section */}
      <div className="flex justify-center items-center flex-1">
        <p
          ref={paragraphRef}
          className="w-full md:w-3/4 text-center text-sm md:text-base lg:text-lg leading-relaxed"
          style={{ color: 'white', fontFamily: 'sans-serif' }}
        >
          I'm a Full Stack Developer with 9 months of hands-on experience building dynamic, responsive web applications
          and services. I specialize in creating scalable backend APIs and crafting interactive, user-friendly
          interfaces. My work is driven by a passion for solving complex problems, optimizing performance, and
          delivering robust, modern solutions. Always eager to learn and grow, I thrive in fast-paced environments
          where I can contribute to impactful projects.
        </p>
      </div>
    </div>
  );
};

export default AboutContent;
