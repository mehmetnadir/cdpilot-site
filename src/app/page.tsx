import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { TerminalDemo } from "@/components/terminal-demo";
import { Metrics } from "@/components/metrics";
import { Features } from "@/components/features";
import { Comparison } from "@/components/comparison";
import { AiSection } from "@/components/ai-section";
import { Pricing } from "@/components/pricing";
import { Faq } from "@/components/faq";
import { BlogLatestPosts } from "@/components/blog-latest-posts";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <TerminalDemo />
        <Metrics />
        <Features />
        <Comparison />
        <AiSection />
        <Pricing />
        <Faq />
        <BlogLatestPosts />
      </main>
      <Footer />
    </>
  );
}
