import { Metadata } from "next";

interface MetadataOptions {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}

export function constructMetadata({
  title = "BuildMyPortfolio - AI-Powered Developer Portfolio Builder",
  description = "Create, customize, and deploy complete, production-ready developer portfolio websites in minutes with the power of AI.",
  image = "/images/og-image.png",
  noIndex = false,
}: MetadataOptions = {}): Metadata {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://buildmyportfolio.com";

  return {
    title: {
      default: title,
      template: `%s | BuildMyPortfolio`,
    },
    description,
    keywords: [
      "portfolio builder",
      "developer portfolio",
      "AI website builder",
      "portfolio generator",
      "software engineer portfolio",
      "deploy portfolio",
      "SaaS",
    ],
    authors: [
      {
        name: "BuildMyPortfolio Team",
        url: appUrl,
      },
    ],
    creator: "BuildMyPortfolio Team",
    metadataBase: new URL(appUrl),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: appUrl,
      title,
      description,
      siteName: "BuildMyPortfolio",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@BuildMyPortfolio",
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-icon.png",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
