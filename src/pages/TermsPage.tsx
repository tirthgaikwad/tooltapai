import { FileText, GraduationCap, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';

export default function TermsPage() {
  return (
    <PageLayout>
      <PageMeta title="Terms of Service | ToolTap" description="Terms of service and usage conditions for ToolTap." />
      <div className="py-6 sm:py-8 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group font-medium"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        {/* Hero */}
        <div className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-4">
            <FileText className="w-3.5 h-3.5" />
            Platform Terms
          </div>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-foreground tracking-tight mb-2 leading-tight">
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
            Last Updated: July 2026 • Welcome to our community-focused, zero-sponsored AI directory.
          </p>
        </div>

        {/* Highlight Banner */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-3 mb-10">
          <GraduationCap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-xs sm:text-sm text-foreground mb-1">Educational & Informational Usage</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              ToolTap is designed purely as an open search directory and utility tool for students, developers, researchers, and professional creators to compare educational options.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-heading font-bold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, or using ToolTap, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any portion of these terms, you should discontinue using our website.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-heading font-bold text-foreground">2. Description of Service and Disclaimer</h2>
            <p>
              ToolTap serves as a curated catalog indexing software, services, and applications belonging to third parties. 
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Our reviews, classifications, feature lists, and pricing tier descriptions (such as &quot;Free&quot;, &quot;Freemium&quot;, &quot;Paid&quot;, or &quot;Open Source&quot;) are compiled for general educational purposes.</li>
              <li>External software providers modify their terms, features, limits, and pricing structures frequently. We do not guarantee the completeness or accuracy of any pricing tier or free plan limit displayed.</li>
              <li>Always check and verify pricing, license restrictions, and storage boundaries on the provider&apos;s official website prior to purchasing any subscription.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-heading font-bold text-foreground">3. Fair Use & Scraping Policy</h2>
            <p>
              You agree to use ToolTap fairly and in accordance with standard web use conventions. Scraping, indexing, or pulling our structured tool catalog database via automated scripts for the purpose of creating competing applications is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-heading font-bold text-foreground">4. Limitation of Liability</h2>
            <p>
              ToolTap and its creators shall not be held liable for any damages, security incidents, loss of data, billing discrepancies, or technical service failures resulting from your subsequent signup, download, or use of any third-party tool listed in this directory.
            </p>
          </section>

          {/* Warning Card */}
          <div className="p-5 rounded-2xl bg-[#1E1E24] border border-white/[0.08] flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-xs sm:text-sm text-foreground mb-1">Contact Support</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                If you are a software developer who wants to request an update, update a link, or adjust the details of your tool featured on ToolTap, please reach out to us at <strong className="text-foreground">support@tooltap.ai</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
