import { cn } from '@/lib/utils';
import type { AccessType } from '@/types/tool';

const config: Record<AccessType, { label: string; className: string }> = {
  Free: {
    label: 'Free',
    className: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  },
  Freemium: {
    label: 'Freemium',
    className: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  },
  Paid: {
    label: 'Paid',
    className: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  },
  'Open Source': {
    label: 'Open Source',
    className: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  },
};

interface Props {
  access: AccessType;
  className?: string;
  size?: 'sm' | 'md';
}

export default function AccessBadge({ access, className, size = 'sm' }: Props) {
  const { label, className: badgeClass } = config[access] ?? config.Freemium;
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full whitespace-nowrap',
        size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
        badgeClass,
        className
      )}
    >
      {label}
    </span>
  );
}
