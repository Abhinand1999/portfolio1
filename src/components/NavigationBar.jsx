import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import menuIcon from '../assets/icons/settings.png';
import closeIcon from '../assets/icons/close.png';

gsap.registerPlugin(ScrollTrigger);

const NavigationBar = () => {
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const primaryNavRef = useRef(null);
  const stickyNavRef = useRef(null);
  const navItemsRef = useRef([]);

  const navLinks = ['About', 'Experience', 'Project', 'Contact'];

  const handleScroll = (id) => {
    const section = document.getElementById(id.toLowerCase());
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(primaryNavRef.current.querySelectorAll('li'), {
        duration: 0.8,
        y: -30,
        opacity: 0,
        stagger: 0.15,
        ease: 'back.out(1.7)',
        delay: 0.3,
      });

      navItemsRef.current.forEach((item) => {
        if (!item) return;
        const dot = item.querySelector('span:last-child');

        const onEnter = () => {
          gsap.to(item, { y: -3, duration: 0.3, ease: 'power2.out' });
          gsap.to(dot, { scale: 1.5, opacity: 1, duration: 0.2, ease: 'power2.out' });
        };

        const onLeave = () => {
          gsap.to(item, { y: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
          gsap.to(dot, { scale: 1, opacity: 0, duration: 0.3 });
        };

        item.addEventListener('mouseenter', onEnter);
        item.addEventListener('mouseleave', onLeave);
        item._gsapHandlers = { onEnter, onLeave };
      });

      ScrollTrigger.create({
        start: '100px top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          setShowStickyNav(self.progress > 0);
        },
      });
    }, primaryNavRef);

    return () => {
      ctx.revert();
      navItemsRef.current.forEach((item) => {
        if (item && item._gsapHandlers) {
          item.removeEventListener('mouseenter', item._gsapHandlers.onEnter);
          item.removeEventListener('mouseleave', item._gsapHandlers.onLeave);
        }
      });
    };
  }, []);

  useEffect(() => {
    if (!stickyNavRef.current) return;

    if (showStickyNav) {
      gsap.fromTo(
        stickyNavRef.current,
        { y: -80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)',
          onComplete: () => {
            gsap.to(stickyNavRef.current, {
              scale: 1.02,
              duration: 0.3,
              repeat: 1,
              yoyo: true,
              ease: 'power1.inOut',
            });
          },
        }
      );
    } else {
      gsap.to(stickyNavRef.current, {
        y: -50,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      });
    }
  }, [showStickyNav]);

  return (
    <div className="bg-[#0C0C0C]">
      {/* Primary Navigation */}
      <nav ref={primaryNavRef} className="px-6 py-4 flex justify-end items-center mr-10">
        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-8">
          {navLinks.map((item, index) => (
            <li
              key={item}
              ref={(el) => (navItemsRef.current[index] = el)}
              className="group flex flex-col items-center cursor-pointer"
              onClick={() => handleScroll(item)}
            >
              <span className="relative inline-block text-[#F2613F]">
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brown group-hover:w-full transition-all duration-300 ease-out"></span>
              </span>
              <span className="w-2 h-2 mt-1 rounded-full bg-brown opacity-0 transform scale-0"></span>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button className="md:hidden ml-4" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <img
            src={mobileMenuOpen ? closeIcon : menuIcon}
            alt="Menu Icon"
            className="w-6 h-6 filter invert"
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <ul className="md:hidden px-6 pb-4 space-y-4">
          {navLinks.map((item) => (
            <li
              key={`${item}-mobile`}
              className="text-[#F2613F] cursor-pointer"
              onClick={() => {
                handleScroll(item);
                setMobileMenuOpen(false);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}

      {/* Sticky Navigation */}
      <nav
        ref={stickyNavRef}
        className="hidden md:block fixed top-0 left-0 right-0 max-w-xl mt-3 mx-auto p-3 rounded-2xl z-50 shadow-lg"
        style={{
          opacity: 0,
          transform: 'translateY(-20px)',
          backgroundColor: '#481E14' ,color:'#F2613F'
        }}
      >
        <ul className="flex space-x-8 justify-center">
          {navLinks.map((item) => (
            <li
              key={`${item}-sticky`}
              className="group flex flex-col items-center cursor-pointer px-4 py-1 rounded-lg transition-colors"
              onClick={() => handleScroll(item)}
            >
              <span className="relative inline-block" style={{ backgroundColor: '#481E14' }}>
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-out"></span>
              </span>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default NavigationBar;
