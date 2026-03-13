'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface HeroSectionProps {
  logoSrc: string;
}

interface EyeOffset {
  x: number;
  y: number;
}

export function HeroSection({ logoSrc }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [eyeOffset, setEyeOffset] = useState<EyeOffset>({ x: 0, y: 0 });

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    if (shouldReduceMotion) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5;

    setEyeOffset({
      x: normalizedX * 10,
      y: normalizedY * 6,
    });
  }

  function handlePointerLeave() {
    setEyeOffset({ x: 0, y: 0 });
  }

  return (
    <section
      className="relative overflow-hidden bg-[linear-gradient(180deg,var(--color-gray-300)_0%,var(--color-gray-100)_48%,var(--color-gray-100)_100%)]"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="mx-auto flex min-h-[220px] max-w-[1440px] items-end px-4 pt-6 sm:min-h-[420px] sm:px-8 sm:pt-10 lg:px-12">
        <div className="relative h-[190px] w-full sm:h-[340px] lg:h-[400px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.85),transparent_46%)]" />
          <Image
            src="/window.svg"
            alt="Hero background"
            fill
            priority
            className="object-cover opacity-15"
            sizes="100vw"
          />
          <div className="absolute inset-y-4 left-0 w-[58%] overflow-hidden rounded-r-[20px] border-r border-white/40 bg-[linear-gradient(180deg,var(--color-gray-1000)_0%,var(--color-gray-1500)_100%)] sm:inset-y-0 sm:w-[55%]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,0.18),transparent_28%)]" />
            <div className="absolute inset-y-0 left-[20%] w-[1px] bg-white/10" />
            <div className="absolute inset-y-0 left-[48%] w-[1px] bg-white/10" />
            <div className="absolute inset-x-0 top-[36%] h-[1px] bg-white/10" />
            <div className="absolute inset-x-0 top-[64%] h-[1px] bg-white/10" />
            <div className="absolute inset-y-0 right-[-18%] w-[68%] rounded-full bg-[radial-gradient(circle,var(--color-gray-100)_0%,var(--color-gray-300)_45%,var(--color-gray-700)_75%,transparent_100%)] opacity-90" />
            <div className="absolute inset-y-[10%] left-[55%] w-[28%] rounded-full border-[10px] border-black bg-white opacity-95" />
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : { x: eyeOffset.x, y: eyeOffset.y }
              }
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute top-[34%] left-[58%] hidden h-3 w-6 rounded-full bg-black sm:block"
            />
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : { x: eyeOffset.x, y: eyeOffset.y }
              }
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute top-[34%] left-[70%] hidden h-3 w-6 rounded-full bg-black sm:block"
            />
          </div>
          <motion.div
            animate={shouldReduceMotion ? undefined : { scale: [1, 1.05, 1] }}
            transition={
              shouldReduceMotion
                ? undefined
                : {
                    duration: 1.5,
                    ease: 'easeInOut',
                    repeat: Number.POSITIVE_INFINITY,
                  }
            }
            className="absolute right-[4%] bottom-[10%] w-[44%] max-w-[360px] sm:right-[7%] sm:bottom-[14%] sm:w-[34%]"
          >
            <Image
              src={logoSrc}
              alt="HeeLoo logo"
              width={640}
              height={300}
              priority
              className="h-auto w-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
