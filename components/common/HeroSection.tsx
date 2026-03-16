'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { memo, useEffect, useState } from 'react';

import backgroundImage from '@/public/hero-section/Background-01.png';
import characterWhiteImage from '@/public/hero-section/Character-01-White.png';
import characterImage from '@/public/hero-section/Character-01.png';
import leftEyeImage from '@/public/hero-section/LeftEye-01.png';
import logoImage from '@/public/hero-section/Logo-01.png';
import rightEyeImage from '@/public/hero-section/RightEye-01.png';

interface EyeOffset {
  x: number;
  y: number;
}

function HeroSectionComponent() {
  const shouldReduceMotion = useReducedMotion();
  const [eyeOffset, setEyeOffset] = useState<EyeOffset>({ x: 0, y: 0 });
  const [isInteractiveReady, setIsInteractiveReady] = useState(false);
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);
  const [isCharacterWhiteLoaded, setIsCharacterWhiteLoaded] = useState(false);
  const [isCharacterLoaded, setIsCharacterLoaded] = useState(false);
  const [isLogoEntranceReady, setIsLogoEntranceReady] = useState(false);
  const [hasLogoEntered, setHasLogoEntered] = useState(false);
  const isSceneReady =
    isBackgroundLoaded && isCharacterWhiteLoaded && isCharacterLoaded;

  useEffect(() => {
    if (shouldReduceMotion) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setIsInteractiveReady(true);
    }, 180);

    return function cleanup() {
      window.clearTimeout(timeoutId);
    };
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (!isSceneReady) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setIsLogoEntranceReady(true);
    }, 120);

    return function cleanup() {
      window.clearTimeout(timeoutId);
    };
  }, [isSceneReady]);

  useEffect(() => {
    if (shouldReduceMotion || !isInteractiveReady) {
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
  }, [isInteractiveReady, shouldReduceMotion]);

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto flex max-w-[1440px] items-end px-0 pt-0">
        <div className="relative aspect-[375/238] w-full sm:aspect-[1440/823]">
          {/* 背景 */}
          <Image
            src={backgroundImage}
            alt="Hero background"
            fill
            priority
            placeholder="blur"
            className="object-cover"
            sizes="100vw"
            onLoad={() => {
              setIsBackgroundLoaded(true);
            }}
          />
          {/* 人物 */}
          <div className="absolute inset-y-0 left-0 w-full">
            <div className="relative h-full w-full">
              <Image
                src={characterWhiteImage}
                alt="Hero portrait highlight"
                fill
                priority
                placeholder="blur"
                className="object-left-bottom object-contain"
                sizes="(min-width: 640px) 1097px, 100vw"
                onLoad={() => {
                  setIsCharacterWhiteLoaded(true);
                }}
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
                    src={leftEyeImage}
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
                    src={rightEyeImage}
                    alt=""
                    width={37}
                    height={30}
                    className="h-auto w-full"
                  />
                </motion.div>
              </div>
              <Image
                src={characterImage}
                alt="Hero portrait"
                fill
                priority
                placeholder="blur"
                className="object-left-bottom object-contain"
                sizes="(min-width: 640px) 1097px, 100vw"
                onLoad={() => {
                  setIsCharacterLoaded(true);
                }}
              />
            </div>
          </div>
          {/* logo */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.82 }}
            animate={
              shouldReduceMotion
                ? { opacity: 1, scale: 1 }
                : isLogoEntranceReady
                  ? { opacity: 1, scale: [0.82, 1.12, 0.98, 1] }
                  : { opacity: 0, scale: 0.82 }
            }
            transition={
              shouldReduceMotion || !isLogoEntranceReady
                ? undefined
                : {
                    duration: 0.85,
                    ease: 'easeInOut',
                  }
            }
            onAnimationComplete={() => {
              if (!shouldReduceMotion && isLogoEntranceReady) {
                setHasLogoEntered(true);
              }
            }}
            className="absolute right-[3%] bottom-[10%] w-[37.5%] min-w-[137px] max-w-[200px] sm:right-[5.8%] sm:bottom-[16.4%] sm:max-w-[540px]"
          >
            <motion.div
              animate={
                shouldReduceMotion || !isInteractiveReady || !hasLogoEntered
                  ? undefined
                  : { scale: [1, 1.05, 1] }
              }
              transition={
                shouldReduceMotion || !isInteractiveReady || !hasLogoEntered
                  ? undefined
                  : {
                      duration: 1.5,
                      ease: 'easeInOut',
                      repeat: Number.POSITIVE_INFINITY,
                    }
              }
            >
              <Image
                src={logoImage}
                alt="HeeLoo logo"
                width={540}
                height={323}
                placeholder="blur"
                className="h-auto w-full"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export const HeroSection = memo(HeroSectionComponent);
