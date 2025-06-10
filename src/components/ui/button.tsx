import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isNightTime?: boolean;
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    isNightTime = false,
    className,
    ...props 
  }, ref) => {
    const baseStyles = "rounded-full transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group backdrop-blur-md";
    
    const variants = {
      primary: isNightTime 
        ? "bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-700/90 hover:to-blue-700/90 text-white border border-white/20 shadow-lg shadow-purple-500/20"
        : "bg-gradient-to-r from-orange-500/80 to-red-500/80 hover:from-orange-600/90 hover:to-red-600/90 text-white border border-white/20 shadow-lg shadow-orange-500/20",
      outline: "border-2 border-white/30 bg-black/20 backdrop-blur-md hover:bg-white/10 text-white shadow-lg shadow-black/20",
      ghost: "bg-transparent hover:bg-white/10 text-white backdrop-blur-sm"
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2",
      lg: "px-6 py-3 text-lg",
      icon: "p-2"
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
