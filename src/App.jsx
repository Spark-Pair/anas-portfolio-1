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
  const svgRef = useRef(null);
  const canvasRef = useRef(null);
  const maskDefinitionRef = useRef(null);
  const maskStarRef = useRef(null);
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

    const canvas = canvasRef.current;
    const canvasContext = canvas?.getContext("2d");
    const starPath = new Path2D(
      "M111.735,54.571c0,4.046-6.365,7.32-7.225,11.106-.889,3.908,3.4,9.615,1.7,13.141-1.729,3.583-8.885,3.775-11.342,6.855S93.8,95.781,90.7,98.252c-3.078,2.459-9.6-.455-13.19,1.275-3.525,1.7-5.305,8.635-9.213,9.524-3.785.861-8.387-4.6-12.432-4.6s-8.647,5.457-12.432,4.6c-3.908-.889-5.688-7.824-9.215-9.524-3.583-1.73-10.11,1.182-13.188-1.275-3.093-2.471-1.7-9.487-4.168-12.581C14.406,82.593,7.251,82.4,5.523,78.818c-1.7-3.526,2.591-9.234,1.7-13.141C6.365,61.891,0,58.617,0,54.571s6.365-7.32,7.225-11.106c.889-3.908-3.4-9.615-1.7-13.141,1.729-3.583,8.883-3.775,11.342-6.855s1.075-10.108,4.168-12.579c3.078-2.459,9.6.455,13.19-1.275C37.747,7.914,39.528.98,43.435.092c3.785-.861,8.387,4.6,12.432,4.6S64.515-.769,68.3.092c3.908.889,5.688,7.824,9.213,9.524C81.1,11.346,87.625,8.433,90.7,10.89c3.093,2.471,1.7,9.487,4.168,12.581,2.459,3.078,9.613,3.269,11.342,6.853,1.7,3.526-2.591,9.234-1.7,13.141.861,3.785,7.225,7.06,7.225,11.106",
    );
    let gradientFrameId;

    const resizeCanvas = () => {
      if (!canvas || !canvasContext) return;

      const { width, height } = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      maskDefinitionRef.current?.setAttribute(
        "viewBox",
        `0 0 ${window.innerWidth} ${window.innerHeight}`,
      );
      canvas.width = Math.max(1, Math.round(width * pixelRatio));
      canvas.height = Math.max(1, Math.round(height * pixelRatio));
      canvasContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const renderGradient = (time) => {
      if (!canvas || !canvasContext) return;

      const { width, height } = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const progress = time / 4500;
      const star = svgRef.current;
      const starBounds = star?.getBoundingClientRect();

      if (!starBounds) {
        gradientFrameId = requestAnimationFrame(renderGradient);
        return;
      }

      const starScale = Number(gsap.getProperty(star, "scaleX")) || 1;
      const starRotation = Number(gsap.getProperty(star, "rotation")) || 0;
      const starCenterX = starBounds.left + starBounds.width / 2;
      const starCenterY = starBounds.top + starBounds.height / 2;

      maskStarRef.current?.setAttribute(
        "transform",
        `translate(${starCenterX} ${starCenterY}) rotate(${starRotation}) scale(${starScale}) translate(-55.867 -54.571)`,
      );

      canvasContext.setTransform(1, 0, 0, 1, 0, 0);
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      canvasContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      canvasContext.save();
      canvasContext.translate(
        starCenterX,
        starCenterY,
      );
      canvasContext.rotate((starRotation * Math.PI) / 180);
      canvasContext.scale(starScale, starScale);
      canvasContext.translate(-55.867, -54.571);
      canvasContext.clip(starPath);
      canvasContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const gradient = canvasContext.createLinearGradient(
        width * (0.15 + Math.sin(progress) * 0.25),
        height * (0.1 + Math.cos(progress * 0.8) * 0.2),
        width * (0.85 + Math.cos(progress) * 0.2),
        height * (0.9 + Math.sin(progress * 0.7) * 0.2),
      );
      gradient.addColorStop(0, "#3add8a");
      gradient.addColorStop(0.38, "#3f56e8");
      gradient.addColorStop(0.68, "#d65cff");
      gradient.addColorStop(1, "#ffd900");
      canvasContext.fillStyle = gradient;
      canvasContext.fillRect(0, 0, width, height);
      canvasContext.restore();

      gradientFrameId = requestAnimationFrame(renderGradient);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    gradientFrameId = requestAnimationFrame(renderGradient);

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
          end: "+=1200vh",
          pin: true,
          scrub: 0.8,
        },
      });

      tl.to(playhead, {
        frame: images.length - 1,
        duration: 300,
        ease: "none",
        snap: "frame",
        onUpdate: renderFrame,
      }, 0);

      tl.to(bearRef.current, {
        xPercent: -150,
        duration: 300,
        ease: "none",
      }, 300);

      tl.to(wordmarkRef.current, {
        xPercent: -57.5,
        duration: 600,
        ease: "none",
      }, 0);

      tl.to(svgRef.current, {
        scale: 100,
        rotate: 360,
        duration: 600,
        ease: "none",
      }, 600);

      renderFrame();
    }, heroRef);

    return () => {
      ctx.revert();
      lenis.destroy();
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(gradientFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <main>
      <section className="hero-scroll" ref={heroRef}>
        <div className="center-point">
          <div className="x-line" style={{ position: "absolute", top: "25%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1000, width: "100vw", height: "2px", backgroundColor: "#000" }}></div>
          <div className="y-line" style={{ position: "absolute", top: "25%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1000, width: "2px", height: "100vw", backgroundColor: "#000" }}></div>
        </div>
        <div className="hero-pin">
          <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />
          <svg
            ref={maskDefinitionRef}
            className="hero-mask-definitions"
            viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
            aria-hidden="true"
          >
            <defs>
              <mask
                id="hero-page-mask"
                x="0"
                y="0"
                width="100%"
                height="100%"
                maskUnits="userSpaceOnUse"
                maskContentUnits="userSpaceOnUse"
                maskType="luminance"
              >
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                <use ref={maskStarRef} href="#hero-star-source" fill="black" />
              </mask>
            </defs>
          </svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 110" width="110" height="110" aria-hidden="true" ref={svgRef}>
                    <g id="hero-star-source">
                    <path d="M111.735,54.571c0,4.046-6.365,7.32-7.225,11.106-.889,3.908,3.4,9.615,1.7,13.141-1.729,3.583-8.885,3.775-11.342,6.855S93.8,95.781,90.7,98.252c-3.078,2.459-9.6-.455-13.19,1.275-3.525,1.7-5.305,8.635-9.213,9.524-3.785.861-8.387-4.6-12.432-4.6s-8.647,5.457-12.432,4.6c-3.908-.889-5.688-7.824-9.215-9.524-3.583-1.73-10.11 1.182-13.188-1.275-3.093-2.471-1.7-9.487-4.168-12.581C14.406 82.593 7.251 82.4 5.523 78.818c-1.7-3.526 2.591-9.234 1.7-13.141C6.365 61.891 0 58.617 0 54.571s6.365-7.32 7.225-11.106c.889-3.908-3.4-9.615-1.7-13.141 1.729-3.583 8.883-3.775 11.342-6.855s1.075-10.108 4.168-12.579c3.078-2.459 9.6.455 13.19-1.275C37.747 7.914 39.528.98 43.435.092c3.785-.861 8.387,4.6 12.432,4.6S64.515-.769 68.3.092c3.908.889 5.688,7.824 9.213,9.524C81.1 11.346 87.625 8.433 90.7 10.89c3.093,2.471 1.7,9.487 4.168,12.581 2.459,3.078 9.613,3.269 11.342,6.853 1.7,3.526-2.591,9.234-1.7,13.141.861,3.785 7.225,7.06 7.225,11.106" fill="#080808" />
                    </g>
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
                        WE ARE A <span>â€œBEARYâ€</span> CREATIVE DIGITAL AGENCY
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
            MEET THE BEARS <span>â†—</span>
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
