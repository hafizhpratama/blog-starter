"use client";

import React from "react";
import Image from "next/image";

interface SkyObjectProps {
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}

const Cloud: React.FC<SkyObjectProps> = ({ className = "", delay = 0 }) => (
  <svg
    viewBox="0 0 100 40"
    className={className}
    style={{ animationDelay: `${delay}s` }}
    fill="currentColor"
  >
    <path d="M10 30 Q15 20 30 25 Q35 15 45 20 Q50 10 60 15 Q70 5 80 15 Q85 10 90 20 Q95 15 95 25 Q100 20 90 30 Q80 35 70 30 Q60 35 50 30 Q40 35 30 30 Q20 35 10 30" />
  </svg>
);

const Star: React.FC<SkyObjectProps> = ({ className = "", style }) => (
  <div className={className} style={style}>
    <div className="w-1 h-1 bg-white rounded-full animate-twinkle" />
  </div>
);

const Bird: React.FC<SkyObjectProps> = ({ className = "", delay = 0 }) => (
  <svg
    viewBox="0 0 50 20"
    className={className}
    style={{ animationDelay: `${delay}s` }}
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
  >
    <path d="M0 10 Q12.5 0 25 10 Q37.5 20 50 10" />
  </svg>
);

const STAR_POSITIONS = [
  { right: "10%", top: "15%" },
  { right: "20%", top: "25%" },
  { right: "30%", top: "10%" },
  { right: "40%", top: "30%" },
  { right: "50%", top: "20%" },
  { right: "60%", top: "15%" },
  { right: "70%", top: "25%" },
  { right: "80%", top: "10%" },
  { right: "15%", top: "35%" },
  { right: "25%", top: "40%" },
  { right: "35%", top: "15%" },
  { right: "45%", top: "20%" },
  { right: "55%", top: "30%" },
  { right: "65%", top: "25%" },
  { right: "75%", top: "35%" },
  { right: "85%", top: "20%" },
  { right: "90%", top: "15%" },
  { right: "95%", top: "25%" },
  { right: "5%", top: "30%" },
  { right: "82%", top: "18%" },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-blue-900 via-blue-600 to-blue-400 relative overflow-hidden min-h-[300px]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        {/* Stars */}
        {STAR_POSITIONS.map((pos, i) => (
          <Star
            key={i}
            className="absolute"
            style={{
              right: pos.right,
              top: pos.top,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}

        {/* Birds */}
        <Bird
          className="absolute w-12 text-white right-[20%] top-[30%] animate-fly"
          delay={0}
        />
        <Bird
          className="absolute w-8 text-white right-[40%] top-[20%] animate-fly"
          delay={1.5}
        />
        <Bird
          className="absolute w-10 text-white right-[60%] top-[25%] animate-fly"
          delay={0.8}
        />

        {/* Clouds */}
        <Cloud
          className="absolute w-48 text-white/10 right-[10%] top-[10%] animate-float-slow"
          delay={0}
        />
        <Cloud
          className="absolute w-32 text-white/10 right-[30%] top-[25%] animate-float"
          delay={2}
        />
        <Cloud
          className="absolute w-40 text-white/10 right-[50%] top-[15%] animate-float-slower"
          delay={1}
        />
      </div>

      {/* Content Container with Glassmorphism */}
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative`}
      >
        <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-8 shadow-xl">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1">
            {/* Brand Column */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <a
                  href="/"
                  className="transform hover:scale-105 transition-transform"
                >
                  <Image
                    src="/logo.png"
                    width={66}
                    height={48}
                    alt={"Cloud Hej"}
                    className="h-10 drop-shadow-lg"
                  />
                </a>
              </div>
              <p className="text-white/90 mb-6 text-shadow">
                Building Tomorrow&apos;s Digital Solutions Today.
                <br />
                We transform bold ideas into powerful digital experiences.
              </p>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/80 text-sm text-shadow">
              &copy; {new Date().getFullYear()} Cloud Hej. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-20px, -10px) scale(1.05);
          }
        }

        @keyframes fly {
          0%,
          100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          50% {
            transform: translate(-100px, -20px) scale(1.1) rotate(-5deg);
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(0.7);
          }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float 25s ease-in-out infinite;
        }

        .animate-float-slower {
          animation: float 30s ease-in-out infinite;
        }

        .animate-fly {
          animation: fly 15s ease-in-out infinite;
        }

        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }

        .text-shadow {
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
