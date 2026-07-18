import { DesignBlueprint, DesignPipelineStatus, DesignContext } from "../types";
import { DesignInputProcessor } from "../services/design-input-processor";
import { ThemeEngine } from "../engines/theme-engine";
import { LayoutEngine } from "../engines/layout-engine";
import { ComponentEngine } from "../engines/component-engine";
import { VisualHierarchyEngine } from "../engines/visual-hierarchy-engine";
import { ResponsiveEngine } from "../engines/responsive-engine";
import { AnimationEngine } from "../engines/animation-engine";
import { AccessibilityEngine } from "../engines/accessibility-engine";
import { ScoringEngine } from "../engines/scoring-engine";
import { DesignValidators } from "../validators/design-validators";
import { DesignAgentLogger } from "../logging/design-agent-logger";
import { DesignPipelineError } from "../errors/design-agent-errors";

export interface DesignPipelineCallbacks {
  onStatusChange?: (status: DesignPipelineStatus) => void;
  onProgress?: (progress: number) => void;
}

export class DesignPipeline {
  private logger = new DesignAgentLogger();

  public async run(
    userId: string,
    builderId: string,
    planId: string,
    rawInput: Record<string, any>,
    contentBlocks: any[] = [],
    callbacks?: DesignPipelineCallbacks
  ): Promise<DesignBlueprint> {
    const totalStartTime = Date.now();
    this.logger.pipelineStarted();
    callbacks?.onStatusChange?.("processing_input");
    callbacks?.onProgress?.(10);

    try {
      // 1. Process Input
      const context = DesignInputProcessor.process({
        userId,
        builderId,
        planId,
        rawInput,
        contentBlocks
      });
      this.logger.info(`Context parsed. ProfessionCategory identified: ${context.professionCategory}`);

      // 2. Resolve Theme
      callbacks?.onStatusChange?.("resolving_theme");
      callbacks?.onProgress?.(25);
      const themeStartTime = Date.now();
      const theme = ThemeEngine.resolve(context);
      this.logger.engineCompleted("ThemeEngine", Date.now() - themeStartTime);

      // 3. Resolve Layouts
      callbacks?.onStatusChange?.("resolving_layout");
      callbacks?.onProgress?.(40);
      const layoutStartTime = Date.now();
      const layouts = LayoutEngine.resolve(context);
      this.logger.engineCompleted("LayoutEngine", Date.now() - layoutStartTime);

      // 4. Resolve Components
      callbacks?.onStatusChange?.("resolving_components");
      callbacks?.onProgress?.(55);
      const compStartTime = Date.now();
      const components = ComponentEngine.resolve(context);
      this.logger.engineCompleted("ComponentEngine", Date.now() - compStartTime);

      // 5. Resolve Visual Hierarchy
      const hierarchy = VisualHierarchyEngine.resolve(context);

      // 6. Resolve Animations
      callbacks?.onStatusChange?.("resolving_animations");
      callbacks?.onProgress?.(70);
      const animations = AnimationEngine.resolve(context);

      // 7. Resolve Responsive Rules
      callbacks?.onStatusChange?.("resolving_responsive");
      callbacks?.onProgress?.(80);
      const responsive = ResponsiveEngine.resolve(context);

      // 8. Resolve Accessibility Rules
      callbacks?.onStatusChange?.("resolving_accessibility");
      callbacks?.onProgress?.(90);
      const accessibility = AccessibilityEngine.resolve(context);

      // 9. Scoring Calculation
      callbacks?.onStatusChange?.("scoring");
      const scores = ScoringEngine.calculate(context, theme, layouts);

      // 10. Assemble and Validate Blueprint
      const blueprintId = `bp-design-${Date.now()}`;
      const blueprint: DesignBlueprint = {
        blueprintId,
        userId,
        builderId,
        planId,
        theme,
        layouts,
        components,
        visualHierarchy: hierarchy,
        responsive,
        animations,
        accessibility,
        scores,
        metadata: {
          compilerVersion: "1.0.0",
          timestamp: new Date().toISOString(),
          designRulesApplied: 42
        }
      };

      const validation = DesignValidators.validateBlueprint(blueprint);
      if (!validation.isValid) {
        this.logger.validationWarning("Blueprint validation issues found", validation.errors);
        throw new DesignPipelineError(`Blueprint compilation failed: ${validation.errors.join(", ")}`);
      }

      callbacks?.onStatusChange?.("completed");
      callbacks?.onProgress?.(100);

      const totalDuration = Date.now() - totalStartTime;
      this.logger.pipelineCompleted({ blueprintId, totalDurationMs: totalDuration });

      return blueprint;
    } catch (err: any) {
      callbacks?.onStatusChange?.("failed");
      this.logger.pipelineFailed(err);
      throw err;
    }
  }
}
