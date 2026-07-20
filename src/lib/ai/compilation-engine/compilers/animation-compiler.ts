import { CompilationContext, AnimationBlueprint, ConflictResolution } from "../types";
import { CompilationConfig } from "../config/compilation-config";

export class AnimationCompiler {
  public static compile(
    context: CompilationContext,
    resolutions: ConflictResolution[]
  ): AnimationBlueprint {
    const design = context.designBlueprint;

    const motionRes = resolutions.find((r) => r.field === "animations.motionIntensity");
    const motionIntensity = motionRes ? String(motionRes.resolvedValue) : design?.animations?.motionIntensity || CompilationConfig.defaultAnimations.motionIntensity;

    const isReducedMotion = motionIntensity === "none";

    const pageTransition = design?.animations?.pageTransition || CompilationConfig.defaultAnimations.pageTransition;
    const scrollReveal = design?.animations?.scrollReveal || CompilationConfig.defaultAnimations.scrollReveal;
    const hoverEffects = design?.animations?.hoverEffects || CompilationConfig.defaultAnimations.hoverEffects;

    return {
      pageTransition: {
        type: isReducedMotion ? "none" : pageTransition.type,
        durationMs: isReducedMotion ? 0 : pageTransition.durationMs
      },
      scrollReveal: {
        active: !isReducedMotion && scrollReveal.active,
        effect: isReducedMotion ? "none" : scrollReveal.effect,
        delayMs: scrollReveal.delayMs,
        staggerMs: scrollReveal.staggerMs
      },
      hoverEffects: {
        cards: isReducedMotion ? "none" : hoverEffects.cards,
        buttons: isReducedMotion ? "none" : hoverEffects.buttons
      },
      motionIntensity,
      reducedMotionFallback: true
    };
  }
}
