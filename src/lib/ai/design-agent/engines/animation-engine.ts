import { AnimationDecision, DesignContext } from "../types";

export class AnimationEngine {
  
  public static resolve(context: DesignContext): AnimationDecision {
    const themePreference = context.themePreference.toLowerCase();

    // Default configuration set
    let pageTransitionType: AnimationDecision["pageTransition"]["type"] = "fade";
    let motionIntensity: AnimationDecision["motionIntensity"] = "medium";
    let cardsHoverEffect: AnimationDecision["hoverEffects"]["cards"] = "lift";
    let scrollRevealEffect: AnimationDecision["scrollReveal"]["effect"] = "fade-up";

    // Customize motion levels based on preference themes
    if (themePreference.includes("minimal") || themePreference.includes("executive")) {
      pageTransitionType = "none";
      motionIntensity = "low";
      cardsHoverEffect = "none";
      scrollRevealEffect = "fade-in";
    } else if (themePreference.includes("creative") || themePreference.includes("glass")) {
      pageTransitionType = "zoom";
      motionIntensity = "high";
      cardsHoverEffect = "glow";
      scrollRevealEffect = "zoom-in";
    }

    return {
      pageTransition: {
        type: pageTransitionType,
        durationMs: motionIntensity === "high" ? 400 : motionIntensity === "medium" ? 300 : 0
      },
      scrollReveal: {
        active: (motionIntensity as string) !== "none",
        effect: scrollRevealEffect,
        delayMs: 100,
        staggerMs: 50
      },
      hoverEffects: {
        cards: cardsHoverEffect,
        buttons: (motionIntensity as string) === "none" ? "none" : "scale-up"
      },
      motionIntensity,
      reducedMotionFallback: true
    };
  }
}
