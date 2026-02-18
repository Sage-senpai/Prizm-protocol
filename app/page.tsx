import { Navigation } from '@/components/navigation';
import { Hero } from '@/components/hero';
import { Features } from '@/components/features';
import { CTASection } from '@/components/cta-section';
import { Footer } from '@/components/footer';
import { LandingStats } from '@/components/landing-stats';
import { Phases } from '@/components/phases';
import { SecuritySection } from '@/components/security-section';

export default function Page() {
  return (
    <main className="relative min-h-screen">
      <Navigation />
      <section id="home">
        <Hero />
      </section>
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="text-xs uppercase tracking-[0.32em] text-white/50">Superteam-inspired clarity</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white">
            A quiet interface for decisive capital.
          </h2>
          <p className="text-white/60 text-lg">
            Every surface is pared back so data, identity and risk can speak without noise.
          </p>
        </div>
      </section>
      <LandingStats />
      <Phases />
      <Features />
      <SecuritySection />
      <section id="cta">
        <CTASection />
      </section>
      <Footer />
    </main>
  );
}
