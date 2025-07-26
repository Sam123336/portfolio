import React from 'react';
import { Link } from 'react-router-dom';

// Modern Button Component with dark theme support
export const ModernButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  loading = false,
  href,
  icon,
  iconPosition = 'left',
  onClick,
  ...props 
}) => {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-semibold rounded-2xl 
    transition-all duration-300 transform hover:scale-105 active:scale-95 
    focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed
    disabled:transform-none backdrop-blur-xl border shadow-lg
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-blue-500/20
      hover:from-blue-700 hover:to-cyan-600 focus:ring-blue-500/50 shadow-blue-500/25
      hover:shadow-xl hover:shadow-blue-500/40
    `,
    secondary: `
      bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 
      shadow-gray-500/20 hover:shadow-xl hover:shadow-gray-500/30 hover:border-gray-400 dark:hover:border-gray-500
      hover:bg-white/90 dark:hover:bg-gray-700/90 focus:ring-gray-400/50
    `,
    ghost: `
      bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 
      border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:ring-gray-400/50
    `,
    gradient: `
      bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 text-white shadow-purple-500/25
      hover:from-purple-700 hover:via-pink-600 hover:to-cyan-600 focus:ring-purple-500/50 
      border-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40
    `,
    glass: `
      bg-white/10 dark:bg-black/20 backdrop-blur-xl border-white/20 dark:border-gray-700/30 
      text-gray-700 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-black/30
      hover:border-white/30 dark:hover:border-gray-600/40 focus:ring-gray-400/50 
      shadow-black/10 dark:shadow-black/30 hover:shadow-xl hover:shadow-black/20
    `,
    dark: `
      bg-gray-950/90 dark:bg-black/90 text-gray-200 dark:text-gray-100 border-gray-800/60 dark:border-gray-900/60
      hover:bg-black/95 dark:hover:bg-black/95 hover:border-gray-700/70 dark:hover:border-gray-800/70 
      focus:ring-gray-400/50 shadow-black/30 dark:shadow-black/60 hover:shadow-xl hover:shadow-black/50
    `
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const ButtonContent = () => (
    <>
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && iconPosition === 'left' && !loading && icon}
      {children}
      {icon && iconPosition === 'right' && !loading && icon}
    </>
  );

  if (href) {
    return (
      <Link to={href} className={classes} {...props}>
        <ButtonContent />
      </Link>
    );
  }

  return (
    <button 
      className={classes} 
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      <ButtonContent />
    </button>
  );
};

// Modern Card Component with dark theme
export const ModernCard = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  backdrop = true,
  ...props 
}) => {
  const baseClasses = `
    rounded-3xl border transition-all duration-500 overflow-hidden group
  `;

  const variants = {
    default: `
      bg-white/90 dark:bg-gray-900/80 border-gray-200/60 dark:border-gray-700/40 backdrop-blur-xl
      ${hover ? 'hover:shadow-2xl hover:shadow-gray-500/20 dark:hover:shadow-black/60 hover:border-gray-300/70 dark:hover:border-gray-600/60 hover:transform hover:scale-[1.02] hover:bg-white/95 dark:hover:bg-gray-900/90' : ''}
      shadow-xl shadow-gray-500/10 dark:shadow-black/30
    `,
    glass: `
      bg-white/10 dark:bg-black/20 backdrop-blur-xl border-white/20 dark:border-white/5
      ${hover ? 'hover:bg-white/20 dark:hover:bg-black/30 hover:border-white/30 dark:hover:border-white/10 hover:shadow-xl hover:shadow-black/20 dark:hover:shadow-black/40' : ''}
      shadow-xl shadow-black/10 dark:shadow-black/30
    `,
    gradient: `
      bg-gradient-to-br from-white/90 via-gray-50/80 to-white/90 dark:from-gray-900/90 dark:via-gray-800/80 dark:to-gray-900/90 backdrop-blur-xl
      border-gray-200/40 dark:border-gray-700/40
      ${hover ? 'hover:from-white/95 hover:via-gray-50/90 hover:to-white/95 dark:hover:from-gray-900/95 dark:hover:via-gray-800/90 dark:hover:to-gray-900/95 hover:shadow-xl hover:shadow-gray-500/20 dark:hover:shadow-black/50' : ''}
      shadow-xl shadow-gray-500/10 dark:shadow-black/40
    `,
    accent: `
      bg-gradient-to-br from-blue-50/40 to-purple-50/40 dark:from-blue-950/40 dark:to-purple-950/40 backdrop-blur-xl
      border-blue-200/30 dark:border-blue-800/20
      ${hover ? 'hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-950/50 dark:hover:to-purple-950/50 hover:border-blue-300/40 dark:hover:border-blue-700/30 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20' : ''}
      shadow-xl shadow-blue-500/5 dark:shadow-black/30
    `,
    dark: `
      bg-gray-950/80 dark:bg-black/80 backdrop-blur-xl border-gray-800/40 dark:border-gray-900/30
      ${hover ? 'hover:bg-gray-950/90 dark:hover:bg-black/90 hover:border-gray-700/60 dark:hover:border-gray-800/40 hover:shadow-xl hover:shadow-black/60 dark:hover:shadow-black/70' : ''}
      shadow-xl shadow-black/40 dark:shadow-black/50
    `,
    ultraDark: `
      bg-black/90 dark:bg-black/95 backdrop-blur-xl border-gray-950/50 dark:border-gray-950/60
      ${hover ? 'hover:bg-black/95 dark:hover:bg-black/98 hover:border-gray-900/60 dark:hover:border-gray-900/70 hover:shadow-xl hover:shadow-black/70 dark:hover:shadow-black/80' : ''}
      shadow-xl shadow-black/50 dark:shadow-black/60
    `
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// Badge Component with dark theme
export const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '',
  ...props 
}) => {
  const variants = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600',
    primary: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700',
    success: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700',
    warning: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700',
    error: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700',
    gradient: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border border-blue-500/30',
    dark: 'bg-gray-800 dark:bg-black text-gray-200 dark:text-gray-300 border border-gray-700 dark:border-gray-900',
    ultraDark: 'bg-black dark:bg-black text-gray-300 dark:text-gray-400 border border-gray-900 dark:border-black'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const classes = `
    inline-flex items-center rounded-full font-medium transition-all duration-200 backdrop-blur-sm
    ${variants[variant]} ${sizes[size]} ${className}
  `;

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

// Floating Action Button with dark theme
export const FloatingButton = ({ 
  children, 
  className = '', 
  variant = 'primary',
  ...props 
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-blue-500/25',
    secondary: 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-gray-500/20 border border-gray-200 dark:border-gray-700',
    dark: 'bg-gray-950 dark:bg-black hover:bg-black dark:hover:bg-gray-950 shadow-black/60 border border-gray-800 dark:border-gray-900',
    glass: 'bg-black/30 dark:bg-black/40 hover:bg-black/40 dark:hover:bg-black/50 shadow-black/50 border border-white/5 dark:border-white/10 backdrop-blur-xl'
  };

  const textColors = {
    primary: 'text-white',
    secondary: 'text-gray-700 dark:text-gray-200',
    dark: 'text-gray-200 dark:text-gray-300',
    glass: 'text-white'
  };

  return (
    <button
      className={`
        fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl backdrop-blur-xl
        ${variants[variant]} ${textColors[variant]}
        flex items-center justify-center transition-all duration-300
        hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/50
        z-50 ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

// Dark Section Component for portfolio sections
export const DarkSection = ({ 
  children, 
  className = '', 
  variant = 'default',
  ...props 
}) => {
  const variants = {
    default: 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800',
    gradient: 'bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-950 dark:via-black dark:to-gray-950',
    glass: 'bg-white/90 dark:bg-gray-950/90 border-gray-200/50 dark:border-gray-800/30',
    dark: 'bg-gray-950 dark:bg-black border-gray-800 dark:border-gray-900',
    ultraDark: 'bg-black dark:bg-black border-gray-950 dark:border-gray-950',
    accent: 'bg-gradient-to-br from-white via-blue-50 to-white dark:from-gray-950 dark:via-blue-950/20 dark:to-gray-950'
  };

  return (
    <section 
      className={`
        relative py-20 px-6 backdrop-blur-xl border-y transition-all duration-500
        ${variants[variant]} ${className}
      `} 
      {...props}
    >
      {children}
    </section>
  );
};

// Dark Container Component
export const DarkContainer = ({ 
  children, 
  className = '', 
  maxWidth = '7xl',
  ...props 
}) => {
  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div 
      className={`
        mx-auto ${maxWidths[maxWidth]} relative z-10
        ${className}
      `} 
      {...props}
    >
      {children}
    </div>
  );
};

// Dark Header Component
export const DarkHeader = ({ 
  title, 
  subtitle, 
  description,
  className = '',
  ...props 
}) => {
  return (
    <div className={`text-center mb-16 ${className}`} {...props}>
      {subtitle && (
        <Badge variant="gradient" size="md" className="mb-4">
          {subtitle}
        </Badge>
      )}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default ModernButton;