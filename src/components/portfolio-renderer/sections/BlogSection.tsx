import React from "react";
import { NormalizedSectionNode } from "@/lib/rendering-engine/types";
import { PortfolioCard } from "../ui/PortfolioCard";

export function BlogSection({ node }: { node: NormalizedSectionNode }) {
  const content = node.content || {};
  const posts = content.postsList || [];

  return (
    <section id="blog" className={`py-16 lg:py-24 ${node.responsiveClasses.containerWidthClass}`}>
      <div className="space-y-12">
        <div>
          <h2 className="text-3xl font-black text-foreground sm:text-4xl">{content.title || "Latest Articles & Blog"}</h2>
          <p className="mt-2 text-base text-foreground/80">Thoughts, engineering tutorials, and technology insights.</p>
        </div>

        {posts.length > 0 ? (
          <div className={`grid ${node.responsiveClasses.gridColumnsClass} ${node.responsiveClasses.gridGapClass}`}>
            {posts.map((post: any, idx: number) => (
              <PortfolioCard key={idx} className="flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-xs text-accent font-semibold">{post.date || "Recent"}</span>
                  <h3 className="text-lg font-bold text-foreground">{post.title}</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">{post.snippet}</p>
                </div>
                {post.url && (
                  <a href={post.url} target="_blank" rel="noreferrer" className="inline-block mt-4 text-xs font-bold text-primary hover:underline">
                    Read Article →
                  </a>
                )}
              </PortfolioCard>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No blog posts published.</p>
        )}
      </div>
    </section>
  );
}
