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
      className="relative overflow-hidden bg-[linear-gradient(180deg,var(--color-gray-700)_0%,var(--color-gray-1000)_100%)]"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="mx-auto flex min-h-[260px] max-w-[1440px] items-end px-3 pt-4 sm:min-h-[823px] sm:px-0 sm:pt-0">
        <div className="relative h-[220px] w-full sm:h-[823px]">
          <Image
            src="/hero-section/Background-01.png"
            alt="Hero background"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-y-0 left-0 w-[76.18%]">
            <div className="relative h-full w-full">
              <Image
                src="/hero-section/Character-01-White.png"
                alt="Hero portrait highlight"
                fill
                priority
                className="object-contain object-left-top"
                sizes="(min-width: 640px) 1097px, 100vw"
              />
              <div className="absolute top-[37.4%] left-[52.96%] hidden sm:block">
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : { x: eyeOffset.x, y: eyeOffset.y }
                  }
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  <Image
                    src="/hero-section/LeftEye-01.png"
                    alt=""
                    width={41}
                    height={33}
                    className="h-[33px] w-[41px]"
                  />
                </motion.div>
              </div>
              <div className="absolute top-[36.7%] left-[66.45%] hidden sm:block">
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : { x: eyeOffset.x, y: eyeOffset.y }
                  }
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  <Image
                    src="/hero-section/RightEye-01.png"
                    alt=""
                    width={37}
                    height={30}
                    className="h-[30px] w-[37px]"
                  />
                </motion.div>
              </div>
              <Image
                src="/hero-section/Character-01.png"
                alt="Hero portrait"
                fill
                priority
                className="object-contain object-left-top"
                sizes="(min-width: 640px) 1097px, 100vw"
              />
            </div>
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
            className="absolute right-[4%] bottom-[13%] w-[42%] max-w-[240px] sm:right-[3.4%] sm:bottom-[16.4%] sm:w-[37.5%] sm:max-w-[540px]"
          >
            <Image
              src={logoSrc}
              alt="HeeLoo logo"
              width={540}
              height={323}
              priority
              className="h-auto w-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
