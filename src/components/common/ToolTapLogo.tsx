import React from 'react';

export type ToolTapLogoProps = {
  variant?: 'navbar' | 'footer' | 'loading' | 'icon';
  className?: string;
  width?: number;
  height?: number;
};

export function ToolTapLogo({
  variant = 'navbar',
  className = '',
  width,
  height,
}: ToolTapLogoProps) {
  if (variant === 'icon') {
    return (
      <img
        src="/branding/tooltap-icon.png"
        alt="ToolTap Icon"
        width={width || 36}
        height={height || 36}
        className={`tooltap-logo tooltap-logo--icon h-8 sm:h-9 w-auto object-contain shrink-0 ${className}`}
        loading="eager"
        decoding="async"
        onError={(event) => {
          event.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  if (variant === 'loading') {
    return (
      <img
        src="/branding/tooltap-logo.png"
        alt="ToolTap"
        width={width || 220}
        height={height || 50}
        className={`tooltap-logo tooltap-logo--loading w-[min(220px,65vw)] h-auto object-contain animate-logo-fade ${className}`}
        loading="eager"
        decoding="async"
        onError={(event) => {
          event.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  const isFooter = variant === 'footer';

  return (
    <picture className={`tooltap-brand inline-flex items-center shrink-0 ${className}`}>
      <source srcSet="/branding/tooltap-logo.svg" type="image/svg+xml" />
      <img
        src="/branding/tooltap-logo.png"
        alt="ToolTap"
        width={width || (isFooter ? 210 : 190)}
        height={height || (isFooter ? 44 : 44)}
        className={`tooltap-navbar-logo ${isFooter ? 'h-11 sm:h-12 max-w-[210px]' : 'h-[44px] max-w-[190px]'} w-auto object-contain object-left shrink-0`}
        loading={variant === 'navbar' ? 'eager' : 'lazy'}
        decoding="async"
        onError={(event) => {
          event.currentTarget.style.display = 'none';
        }}
      />
    </picture>
  );
}

