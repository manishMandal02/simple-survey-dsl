import { HTMLProps } from 'react';
import { cn } from '../../utils/cn';

type Props = {
  label: string;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
  type?: 'primary' | 'secondary';
  classes?: HTMLProps<HTMLElement>['className'];
  disabled?: boolean;
};

const Button = ({ label, onClick, classes, disabled = false, type = 'primary', size = 'md' }: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-fit mt-6 text-slate-800/80  tracking-wide  font-medium rounded-sm shadow-sm hover:opacity-90 transition-opacity duration-300 shadow-slate-400 disabled:cursor-default ',
        { 'bg-emerald-400/90 disabled:bg-slate-400/80 disabled:text-slate-700': type === 'primary' },
        { 'bg-gray-300': type === 'secondary' },
        { 'text-[12px] px-4 py-1': size === 'sm' },
        { 'text-[14px] px-7 py-1.5': size === 'md' },
        { 'text-[16px] px-10 py-2.5': size === 'lg' },
        classes
      )}
    >
      {label}
    </button>
  );
};

export default Button;
