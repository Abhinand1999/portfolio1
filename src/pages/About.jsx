import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Scrolle from '../components/Scrolle';
import AboutContent from '../pageContent/AboutContent';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const titleRef = useRef();

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { scale: 0.5, opacity: 0 },
      {
        scale: 1,
        opacity: 1.5,
        duration: 1.5,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 85%',
        },
      }
    );
  }, []);
  return (
    <div style={{ backgroundColor: '#0C0C0C', color: '#F2613F' }}>
      <div className="w-full min-h-screen flex flex-col items-center justify-center text-center px-4 py-8">
        <h1 ref={titleRef} className="text-5xl md:text-7xl lg:text-8xl xl:text-[150px] font-bold">ABOUT US</h1>
        <Scrolle />
      </div>
      <AboutContent />
    </div>
  )
}

export default About
