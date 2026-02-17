import { Navigation } from '@/components/navigation';
import { Hero } from '@/components/hero';
import { Features } from '@/components/features';
import { CTASection } from '@/components/cta-section';
import { Footer } from '@/components/footer';
import { Landing3DBackground } from '@/components/landing-3d';
import { LandingStats } from '@/components/landing-stats';
import { Phases } from '@/components/phases';
import { SecuritySection } from '@/components/security-section';

export default function Page() {
  return (
    <main className="relative min-h-screen">
      <Landing3DBackground />
      <Navigation />
      <section id="home">
        <Hero />
      </section>
      <LandingStats />
      <Phases />
      <section id="benefits">
        <Features />
      </section>
      <SecuritySection />
      <section id="cta">
        <CTASection />
      </section>
      <Footer />
    </main>
  );
}
