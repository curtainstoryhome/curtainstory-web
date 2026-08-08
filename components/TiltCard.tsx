"use client";

import { useEffect, useRef } from "react";

// Leans the card toward the cursor and slides a soft highlight across it, so
// the photo behaves like a physical panel catching the light rather than a
// flat rectangle.
//
// This is the one 3D technique from those showcase sites worth having here.
// It is CSS transforms on the GPU — no WebGL, no three.js, no extra kilobytes
// — so it costs nothing on a phone, where it correctly does nothing at all.
const MAX_TILT_DEG = 9;

export default function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);

  useEffect(
    () => () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    },
    [],
  );

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    // Checked here rather than held in state: no hydration timing to get
    // wrong, and matchMedia is cheap. Touch screens never fire mousemove, and
    // anyone who asked for reduced motion gets a card that stays flat.
    if (
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const { clientX, clientY } = event;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const px = (clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
      const py = (clientY - rect.top) / rect.height - 0.5;

      node.style.transform =
        `perspective(800px) rotateX(${(-py * MAX_TILT_DEG).toFixed(2)}deg) ` +
        `rotateY(${(px * MAX_TILT_DEG).toFixed(2)}deg) scale(1.02)`;

      // The highlight tracks the cursor, which is what actually sells the
      // illusion of a surface tilting under a light source.
      if (glareRef.current) {
        glareRef.current.style.opacity = "1";
        glareRef.current.style.background =
          `radial-gradient(340px circle at ${((px + 0.5) * 100).toFixed(1)}% ` +
          `${((py + 0.5) * 100).toFixed(1)}%, rgba(255,255,255,0.32), transparent 55%)`;
      }
    });
  };

  const handleLeave = () => {
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = 0;
    if (ref.current) ref.current.style.transform = "";
    if (glareRef.current) glareRef.current.style.opacity = "0";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative transform-gpu transition-transform duration-300 ease-out [transform-style:preserve-3d] ${className}`}
    >
      {children}
      <span
        ref={glareRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300"
      />
    </div>
  );
}
