import { AnimationVariantsConfig } from "../types";

export class AnimationRenderer {
  public static computeAnimationVariants(
    blueprintAnimations?: any,
    sectionAnimation?: any
  ): AnimationVariantsConfig {
    const isReduced = sectionAnimation?.reducedMotion === true;
    const effect = sectionAnimation?.reveal || "fade-up";

    let initial = { opacity: 0, y: 20 };
    let animate = { opacity: 1, y: 0 };

    if (effect === "fade-in") {
      initial = { opacity: 0, y: 0 };
    } else if (effect === "scale") {
      initial = { opacity: 0, y: 0 };
    }

    if (isReduced) {
      initial = { opacity: 1, y: 0 };
      animate = { opacity: 1, y: 0 };
    }

    return {
      reducedMotion: isReduced,
      pageTransition: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: isReduced ? 0 : 0.3 }
      },
      scrollReveal: {
        initial,
        whileInView: animate,
        viewport: { once: true, margin: "-50px" },
        transition: { duration: isReduced ? 0 : 0.5, delay: (sectionAnimation?.delayMs || 0) / 1000 }
      },
      hoverEffect: {
        card: isReduced ? {} : { y: -4, transition: { duration: 0.2 } },
        button: isReduced ? {} : { scale: 1.02, transition: { duration: 0.15 } }
      }
    };
  }
}
