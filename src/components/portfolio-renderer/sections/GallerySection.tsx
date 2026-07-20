import React from "react";
import { NormalizedSectionNode } from "@/lib/rendering-engine/types";
import { PortfolioImage } from "../ui/PortfolioImage";

export function GallerySection({ node }: { node: NormalizedSectionNode }) {
  const content = node.content || {};
  const images = content.imagesList || [];

  return (
    <section id="gallery" className={`py-16 lg:py-24 ${node.responsiveClasses.containerWidthClass}`}>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black text-foreground sm:text-4xl">{content.title || "Portfolio Gallery"}</h2>
          <p className="mt-2 text-base text-foreground/80">Visual showcases, UI mockups, and creative screenshots.</p>
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img: any, idx: number) => (
              <div key={idx} className="group relative h-64 rounded-2xl overflow-hidden border border-border shadow-sm">
                <PortfolioImage src={img.url} alt={img.caption || "Gallery item"} className="h-full w-full object-cover group-hover:scale-105 transition-all duration-300" />
                {img.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white text-xs font-semibold">
                    {img.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No gallery images uploaded.</p>
        )}
      </div>
    </section>
  );
}
