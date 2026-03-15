'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    if (shouldReduceMotion) {
      return undefined;
    }

    function handleWindowPointerMove(event: PointerEvent) {
      const normalizedX = event.clientX / window.innerWidth - 0.5;
      const normalizedY = event.clientY / window.innerHeight - 0.5;

      setEyeOffset({
        x: normalizedX * 10,
        y: normalizedY * 6,
      });
    }

    function resetEyeOffset() {
      setEyeOffset({ x: 0, y: 0 });
    }

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerleave', resetEyeOffset);
    window.addEventListener('blur', resetEyeOffset);

    return function cleanup() {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerleave', resetEyeOffset);
      window.removeEventListener('blur', resetEyeOffset);
    };
  }, [shouldReduceMotion]);

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto flex max-w-[1440px] items-end px-0 pt-0">
        <div className="relative aspect-[375/238] w-full sm:aspect-[1440/823]">
          {/* 背景 */}
          <Image
            src="/hero-section/Background-01.png"
            alt="Hero background"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* 人物 */}
          <div className="absolute inset-y-0 left-0 w-full">
            <div className="relative h-full w-full">
              <Image
                src="/hero-section/Character-01-White.png"
                alt="Hero portrait highlight"
                fill
                priority
                className="object-left-bottom object-contain"
                sizes="(min-width: 640px) 1097px, 100vw"
              />
              {/* left eye */}
              <div className="absolute top-[37%] left-[43.8%] w-[3.7%] sm:left-[39%]">
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : { x: eyeOffset.x, y: eyeOffset.y }
                  }
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="w-full"
                >
                  <Image
                    src="/hero-section/LeftEye-01.png"
                    alt=""
                    width={41}
                    height={33}
                    className="h-auto w-full"
                  />
                </motion.div>
              </div>
              {/* right eye */}
              <div className="absolute top-[36.4%] left-[56.1%] w-[3.3%] sm:left-[50.6%]">
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : { x: eyeOffset.x, y: eyeOffset.y }
                  }
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="w-full"
                >
                  <Image
                    src="/hero-section/RightEye-01.png"
                    alt=""
                    width={37}
                    height={30}
                    className="h-auto w-full"
                  />
                </motion.div>
              </div>
              <Image
                src="/hero-section/Character-01.png"
                alt="Hero portrait"
                fill
                priority
                className="object-left-bottom object-contain"
                sizes="(min-width: 640px) 1097px, 100vw"
              />
            </div>
          </div>
          {/* logo */}
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
            className="absolute right-[3%] bottom-[10%] w-[37.5%] min-w-[137px] max-w-[200px] sm:right-[5.8%] sm:bottom-[16.4%] sm:max-w-[540px]"
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
