import TemplatesClient from "./TemplatesClient";
import { constructMetadata } from "@/lib/seo/config";

export const metadata = constructMetadata({
  title: "Themes & Layout Templates",
  description: "Explore our collection of responsive, AI-ready website templates tailored for software engineers and designers.",
});

export default function TemplatesPage() {
  return <TemplatesClient />;
}
