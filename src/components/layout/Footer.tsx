import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, ShieldCheck, RefreshCcw, GraduationCap, Search, Mail, ExternalLink } from 'lucide-react';
import { ToolTapLogo } from '@/components/common/ToolTapLogo';
import { toast } from 'sonner';

const stats = [
  { icon: Sparkles, label: '500+ AI Tools' },
  { icon: Search, label: '25 Categories' },
  { icon: ShieldCheck, label: 'Official Links Only' },
  { icon: RefreshCcw, label: 'Updated 2026' },
  { icon: Zap, label: 'Fast Search' },
  { icon: GraduationCap, label: 'Student Friendly' },
];

const platformLinks = [
  { label: 'Home', path: '/' },
  { label: 'Categories', path: '/categories' },
  { label: 'Collections', path: '/collections' },
  { label: 'Compare', path: '/compare' },
  { label: 'Saved Tools', path: '/saved-tools' },
];

const resourceLinks = [
  { label: 'How to Use', path: '/how-to-use' },
  { label: 'Documentation', path: '/documentation' },
  { label: 'About ToolTap', path: '/about' },
];

export default function Footer() {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <footer className="mt-20 border-t border-white/[0.08] bg-[#121212]">
      {/* Stats bar */}
      <div className="bg-[#18191E] border-b border-white/[0.06]">
        <div className="page-container py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {stats.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs sm:text-sm text-med-emphasis font-medium">
                <Icon className="w-4 h-4 text-primary shrink-0" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="md:col-span-5 lg:col-span-5 space-y-3">
            <Link to="/" aria-label="ToolTap home" className="inline-block">
              <ToolTapLogo variant="footer" />
            </Link>
            <p className="text-sm text-med-emphasis leading-relaxed max-w-sm">
              ToolTap helps students, creators, developers, and professionals discover, compare, and choose the right AI tools for every task.
            </p>
            <p className="text-xs text-low-emphasis leading-normal">
              Pricing and free-plan limits may change. Always verify details on the tool&apos;s official website.
            </p>
          </div>

          {/* Platform Links */}
          <div className="md:col-span-3 lg:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-high-emphasis mb-3 font-heading">
              Platform
            </p>
            <ul className="space-y-2.5">
              {platformLinks.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-sm text-med-emphasis hover:text-high-emphasis hover:text-primary transition-colors inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Support Links */}
          <div className="md:col-span-4 lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-high-emphasis mb-3 font-heading">
              Resources & Legal
            </p>
            <ul className="space-y-2.5">
              {resourceLinks.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-sm text-med-emphasis hover:text-high-emphasis hover:text-primary transition-colors inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-med-emphasis hover:text-high-emphasis hover:text-primary transition-colors inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-med-emphasis hover:text-high-emphasis hover:text-primary transition-colors inline-block"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@tooltap.ai"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.success('Contact us at support@tooltap.ai or feedback@tooltap.ai', { duration: 5000 });
                  }}
                  className="text-sm text-med-emphasis hover:text-high-emphasis transition-colors inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-primary" /> Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-low-emphasis">
          <p>© 2026 ToolTap. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>500+ AI tools</span>
            <span>•</span>
            <span>25 categories</span>
            <span>•</span>
            <span>0 sponsored biases</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
