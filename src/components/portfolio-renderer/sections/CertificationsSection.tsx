import React from "react";
import { NormalizedSectionNode } from "@/lib/rendering-engine/types";
import { PortfolioCard } from "../ui/PortfolioCard";
import { PortfolioBadge } from "../ui/PortfolioBadge";

export function CertificationsSection({ node }: { node: NormalizedSectionNode }) {
  const content = node.content || {};
  const certs = content.certificationsList || [];

  return (
    <section id="certifications" className={`py-16 lg:py-24 ${node.responsiveClasses.containerWidthClass}`}>
      <div className="space-y-12">
        <div>
          <h2 className="text-3xl font-black text-foreground sm:text-4xl">{content.title || "Certifications & Credentials"}</h2>
          <p className="mt-2 text-base text-foreground/80">Verified industry accreditations and professional certifications.</p>
        </div>

        <div className={`grid ${node.responsiveClasses.gridColumnsClass} ${node.responsiveClasses.gridGapClass}`}>
          {certs.map((cert: any, idx: number) => (
            <PortfolioCard key={idx}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-foreground">{cert.name || cert.title}</h3>
                  <PortfolioBadge label="Certified" variant="primary" />
                </div>
                <p className="text-xs font-semibold text-muted-foreground">Issued by {cert.issuer || "Accreditation Board"}</p>
                {cert.issueDate && <p className="text-xs text-foreground/70">Date: {cert.issueDate}</p>}
                {cert.credentialUrl && (
                  <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="inline-block mt-2 text-xs font-bold text-primary hover:underline">
                    Verify Credential →
                  </a>
                )}
              </div>
            </PortfolioCard>
          ))}
        </div>
      </div>
    </section>
  );
}
