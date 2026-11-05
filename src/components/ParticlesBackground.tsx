import React, { useMemo } from 'react';

export const ParticlesBackground: React.FC = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      left: `${(i * 3.7 + 2) % 100}%`,
      delay: `${(i * 0.35) % 8}s`,
      duration: `${6 + (i * 0.4) % 6}s`,
      size: `${2 + (i % 3)}px`,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Radial glows */}
      <div className="fixed -top-48 -right-48 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(163,230,53,0.08)_0%,transparent_70%)] animate-pulse-glow" />
      <div className="fixed -bottom-64 -left-48 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(101,163,13,0.06)_0%,transparent_70%)] animate-pulse-glow-reverse" />
      <div
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(163,230,53,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(163,230,53,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-[#b4fc78] opacity-30"
          style={{
            left: p.left,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            animation: `particleFloat ${p.duration} infinite ease-in-out`,
            animationDelay: p.delay,
          }}
        />
      ))}

      <style>{`
        @keyframes particleFloat {
          0% {
            opacity: 0;
            transform: translateY(0vh) scale(0.3);
          }
          15% {
            opacity: 0.5;
          }
          85% {
            opacity: 0.2;
          }
          100% {
            opacity: 0;
            transform: translateY(-105vh) scale(1);
          }
        }
      `}</style>
    </div>
  );
};
