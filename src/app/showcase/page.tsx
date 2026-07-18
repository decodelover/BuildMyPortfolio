import ShowcaseClient from "./ShowcaseClient";
import { constructMetadata } from "@/lib/seo/config";

export const metadata = constructMetadata({
  title: "Showcase - Live Developer Portfolios",
  description: "Browse live portfolio websites built by real-world technology professionals, software engineers, and designers.",
});

export default function ShowcasePage() {
  return <ShowcaseClient />;
}
