import { Color, Variant } from '@wua/components/app-colors.ts';
import React from 'react';
import { twMerge } from 'tailwind-merge';

export type ButtonProps<As extends React.ElementType> =
  React.ComponentPropsWithoutRef<As> & {
    as?: As;
    block?: boolean;
    fullWidth?: boolean;
    color?: Color;
    variant?: Variant;
    className?: string;
  };

const filledButtonColors: Record<Color, string> = {
  primary: 'bg-primary text-white hover:bg-primary-content focus:ring-primary',
  secondary:
    'bg-secondary text-white hover:bg-secondary-content focus:ring-secondary',
  neutral: 'bg-neutral text-white hover:bg-neutral-content focus:ring-neutral',
  danger: 'bg-danger text-white hover:bg-danger-content focus:ring-danger',
  success: 'bg-success text-white hover:bg-success-content focus:ring-success',
};
const outlinedButtonColors: Record<Color, string> = {
  primary:
    'border-2 border-primary-light text-primary-content hover:bg-primary-light',
  secondary:
    'border-2 border-secondary-light text-secondary-content hover:bg-secondary-light',
  neutral:
    'border-2 border-neutral-light text-neutral-content hover:bg-neutral-light',
  danger:
    'border-2 border-danger-light text-danger-content hover:bg-danger-light',
  success:
    'border-2 border-success-light text-success-content hover:bg-success-light',
};
const softButtonColors: Record<Color, string> = {
  primary: 'bg-primary-light text-primary-content hover:bg-primary',
  secondary: 'bg-secondary-light text-secondary-content hover:bg-secondary',
  neutral: 'bg-neutral-light text-neutral-content hover:bg-neutral',
  danger: 'bg-danger-light text-danger-content hover:bg-danger',
  success: 'bg-success-light text-success-content hover:bg-success',
};

export function Button<As extends React.ElementType = 'button'>({
  as,
  block = false,
  color = 'neutral',
  variant = 'soft',
  fullWidth,
  ...rest
}: ButtonProps<As>) {
  const Component = as ?? 'button';
  return (
    <Component
      {...rest}
      className={twMerge(
        'w-full py-4 px-6 rounded-lg transition-all duration-200 font-medium transform focus:outline-none focus:ring-2 focus:ring-opacity-50',
        [
          variant === 'outlined' && [
            outlinedButtonColors[color],
            'backdrop-blur-md',
          ],
          variant === 'soft' && [softButtonColors[color], 'backdrop-blur-md'],
          variant === 'filled' && [
            filledButtonColors[color],
            'hover:-translate-y-1 shadow-md hover:shadow-lg backdrop-blur-md',
          ],
          block && 'block',
          fullWidth && 'w-full',
          rest.className,
        ],
      )}>
      Start Account Creation
    </Component>
  );
}
