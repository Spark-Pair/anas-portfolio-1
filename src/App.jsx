import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

const bearFrames = Array.from(
  { length: 7 },
  (_, index) => `/images/hero/bear_${index + 1}.png`,
);

function App() {
  const heroRef = useRef(null);
  const bearRef = useRef(null);
  const wordmarkRef = useRef(null);
  const eyebrowRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      syncTouch: true,
    });
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const images = bearFrames.map((src) => {
      const image = new Image();
      image.src = src;
      return image;
    });

    const ctx = gsap.context(() => {
      const playhead = { frame: 0 };

      const renderFrame = () => {
        const image = images[Math.round(playhead.frame)];

        if (image?.complete && bearRef.current) {
          bearRef.current.src = image.src;
        }
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "+=600vh",
          pin: true,
          scrub: 0.8,
        },
      });

      /*
      |--------------------------------------------------------------------------
      | 1. BEAR FRAMES
      | First 300vh of scrolling
      |--------------------------------------------------------------------------
      */
      tl.to(
        playhead,
        {
          frame: images.length - 1,
          ease: "none",
          snap: "frame",
          duration: 300,
          onUpdate: renderFrame,
        },
        0,
      );

      /*
      |--------------------------------------------------------------------------
      | 2. BEAR MOVES OUT
      | Starts AFTER all frames have finished
      |--------------------------------------------------------------------------
      */
      tl.to(
        bearRef.current,
        {
          xPercent: -150,
          ease: "none",
          duration: 300,
        },
        200,
      );

      /*
      |--------------------------------------------------------------------------
      | 3. TEXT
      | Starts at the SAME TIME as bear frame animation
      |--------------------------------------------------------------------------
      */
      tl.to(
        wordmarkRef.current,
        {
          xPercent: -56.7,
          ease: "none",
          duration: 600,
        },
        0,
      );

      /*
      |--------------------------------------------------------------------------
      | 4. EYEBROW
      |--------------------------------------------------------------------------
      */
      // tl.to(
      //   eyebrowRef.current,
      //   {
      //     y: -36,
      //     opacity: 0.35,
      //     ease: "none",
      //     duration: 600,
      //   },
      //   0
      // );

      renderFrame();
    }, heroRef);

    return () => {
      ctx.revert();
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <main>
      <section className="hero-scroll" ref={heroRef}>
        <div className="hero-pin">
          <header className="site-header">
            <a className="brand" href="#top" aria-label="Bike Bear home">
              <img src="/images/logo.gif" alt="Bike Bear" />
            </a>
            <button className="header-actions">
              <div className="menu-button" type="button" aria-label="Open menu">
                <span className="menu-icon"></span>
              </div>
              <div
                className="contact-button"
                type="button"
                aria-label="Start a project"
              >
                <div className="hand">
                  <img src="/images/hand.webp" alt="Menu Hand" />
                </div>
              </div>
            </button>
          </header>

          <div className="hero-wrapper">
            <div className="hero-copy" ref={wordmarkRef}>
              <div className="content">
                <p className="eyebrow" ref={eyebrowRef}>
                  WE ARE BIKE BEAR
                </p>
                <div className="wordmark-wrap" aria-label="Dare to do">
                  <h1 className="wordmark">DARE TO DO</h1>
                </div>
              </div>
              <div className="canvas-container">
                <div id="shape" className="shape">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 200 200"
                    width="200"
                    height="200"
                  >
                    <path
                      d="M 100 10 C 104.950 10 118.635 30.453 118.635 30.453 C 118.635 30.453 140.713 19.583 145 22.058 C 149.287 24.533 150.912 49.088 150.912 49.088 C 150.912 49.088 175.467 50.713 177.942 55 C 180.417 59.287 169.547 81.365 169.547 81.365 C 169.547 81.365 190 95.050 190 100 C 190 104.950 169.547 118.635 169.547 118.635 C 169.547 118.635 180.417 140.713 177.942 145 C 175.467 149.287 150.912 150.912 150.912 150.912 C 150.912 150.912 149.287 175.467 145.000 177.942 C 140.713 180.417 118.635 169.547 118.635 169.547 C 118.635 169.547 104.950 190 100 190 C 95.050 190 81.365 169.547 81.365 169.547 C 81.365 169.547 59.287 180.417 55.000 177.942 C 50.713 175.467 49.088 150.912 49.088 150.912 C 49.088 150.912 24.533 149.287 22.058 145.000 C 19.583 140.713 30.453 118.635 30.453 118.635 C 30.453 118.635 10 104.950 10 100.000 C 10 95.050 30.453 81.365 30.453 81.365 C 30.453 81.365 19.583 59.287 22.058 55.000 C 24.533 50.713 49.088 49.088 49.088 49.088 C 49.088 49.088 50.713 24.533 55.000 22.058 C 59.287 19.583 81.365 30.453 81.365 30.453 C 81.365 30.453 95.050 10 100 10 Z"
                      fill="#000000"
                      stroke="none"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="marquee-band" aria-label="Bike Bear description">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="marquee-line">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Fragment key={index}>
                      <p>
                        WE ARE A <span>“BEARY”</span> CREATIVE DIGITAL AGENCY
                        FOR HOOMANS
                      </p>

                      <MarqueeIcon />
                    </Fragment>
                  ))}
                </div>
              ))}
            </div>

            <div className="bear-stage">
              <img
                className="bear"
                ref={bearRef}
                src={bearFrames[0]}
                alt="Bike Bear character"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="after-hero">
        <p className="section-kicker">01 / THE PACK</p>
        <h2>
          Big ideas.
          <br />
          Bold moves.
        </h2>
        <div>
          <p className="section-text">
            We make brands impossible to ignore. Strategy, design and digital
            experiences with a little more bite.
          </p>
          <a className="text-link" href="#contact">
            MEET THE BEARS <span>↗</span>
          </a>
        </div>
      </section>
    </main>
  );
}

const MarqueeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="34.157"
    height="37.127"
    viewBox="0 0 34.157 37.127"
  >
    <g
      id="Group_34379"
      data-name="Group 34379"
      transform="translate(-1712.866 -382.174)"
    >
      <g
        id="Group_34266"
        data-name="Group 34266"
        transform="translate(1715.598 384.174)"
      >
        <path
          id="Path_29156"
          data-name="Path 29156"
          d="M-10967.61,8533.539v33.127"
          transform="translate(10981.957 -8533.539)"
          fill="none"
          stroke="#3add8a"
          strokeLinecap="round"
          strokeWidth="4"
        />
        <path
          id="Path_29157"
          data-name="Path 29157"
          d="M0,0V33.125"
          transform="translate(28.693 24.846) rotate(120)"
          fill="none"
          stroke="#3add8a"
          strokeLinecap="round"
          strokeWidth="4"
        />
        <path
          id="Path_29158"
          data-name="Path 29158"
          d="M0,0V33.125"
          transform="translate(0 24.846) rotate(-120)"
          fill="none"
          stroke="#3add8a"
          strokeLinecap="round"
          strokeWidth="4"
        />
      </g>
    </g>
  </svg>
);

export default App;
