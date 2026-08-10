import { Shield, Eye, Lock, RefreshCcw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';

export default function PrivacyPage() {
  return (
    <PageLayout>
      <PageMeta title="Privacy Policy | ToolTap" description="Privacy policy and local storage details for ToolTap." />
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
            <Shield className="w-3.5 h-3.5" />
            Privacy & Trust
          </div>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-foreground tracking-tight mb-2 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
            Last Updated: July 2026 • We respect your data, privacy, and local device preferences.
          </p>
        </div>

        {/* Core Guarantees Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="flex gap-4 p-5 rounded-2xl bg-[#1E1E24] border border-white/[0.08]">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-xs sm:text-sm text-foreground mb-1">Zero Tracker Cookies</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We do not inject third-party ad networks, trackers, or hidden analytics pixels to monitor your web behavior.
              </p>
            </div>
          </div>
          <div className="flex gap-4 p-5 rounded-2xl bg-[#1E1E24] border border-white/[0.08]">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-xs sm:text-sm text-foreground mb-1">100% Local Storage</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your bookmarks, recently viewed history, and preferences are saved strictly inside your browser&apos;s localStorage.
              </p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-heading font-bold text-foreground">1. Personal Information We Collect</h2>
            <p>
              ToolTap operates as an open-access AI resource directory. We do not require you to create an account, register, or provide personal details like email addresses or phone numbers to use our directory, search tools, filters, or comparison features.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-heading font-bold text-foreground">2. Local Storage and Preferences</h2>
            <p>
              To provide functional features (such as bookmarking saved tools, listing recently viewed tools, or toggling Student Mode), ToolTap utilizes standard web browser technologies like localStorage.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Your bookmarks and search settings remain inside your own web browser.</li>
              <li>None of these preferences are uploaded to external databases or servers.</li>
              <li>You can clear all saved settings at any time by clearing your browser cache.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-heading font-bold text-foreground">3. Outbound Link Navigation</h2>
            <p>
              All links to AI tools in our list are verified direct URLs pointing to the tool&apos;s official domain. Once you exit ToolTap using an outbound link, you are governed by the privacy policy and data collection terms of that specific external provider. We recommend reviewing their privacy statements upon visiting.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-heading font-bold text-foreground">4. Changes to This Privacy Policy</h2>
            <p>
              We may occasionally update this local Privacy Policy. If updates occur, the updated policy will be published here with an updated last-modified date. Your continued use of the website signifies your acceptance of these updated privacy guidelines.
            </p>
          </section>

          {/* Verification Disclaimer */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-3 mt-10">
            <RefreshCcw className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-xs sm:text-sm text-foreground mb-1">Local Control Guarantee</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You possess absolute control over your ToolTap data. Your saved benchmarks, compared history, and filtered states never leave your machine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
