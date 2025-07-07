import Resume from '../assets/Resume/Abhinand.pdf';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const titleRef = useRef();
  const linksRef = useRef([]);

  useEffect(() => {
    // Zoom-in animation for the main title
    gsap.fromTo(
      titleRef.current,
      { scale: 0.5, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 85%',
        },
      }
    );

    // Slide-up + fade-in for each <a> link
    linksRef.current.forEach((el, index) => {
      gsap.fromTo(
        el,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: index * 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
          },
        }
      );
    });
  }, []);

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center text-center px-4 py-10"
      style={{ backgroundColor: '#0C0C0C' }}
    >
      <h1
        ref={titleRef}
        className="text-[60px] sm:text-[80px] md:text-[120px] lg:text-[160px] xl:text-[200px] font-bold"
        style={{ color: '#F2613F' }}
      >
        Contact
      </h1>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mt-8 w-full max-w-4xl text-white text-lg sm:text-xl md:text-2xl">
        {[
          { label: 'Resume', href: Resume, isExternal: true },
          { label: 'Email', href: 'mailto:abhinandhari999@gmail.com' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/in/abhinand-h-85b56a229', isExternal: true },
          { label: 'GitHub', href: 'https://github.com/Abhinand1999', isExternal: true },
        ].map((link, index) => (
          <a
            key={index}
            href={link.href}
            target={link.isExternal ? '_blank' : undefined}
            rel={link.isExternal ? 'noopener noreferrer' : undefined}
            className="hover:underline cursor-pointer"
            ref={(el) => (linksRef.current[index] = el)}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Contact;
