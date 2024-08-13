import { cn } from '../../../utils/cn';

type Props = {
  placeholder: string;
  value: string;
  error: string;
  onChange: (value: string) => void;
};
const UserInput = ({ placeholder, value, onChange, error }: Props) => {
  return (
    <input
      autoFocus
      className={cn(
        'w-full py-2 px-3 bg-slate-200/40 text-slate-800/80 outline-none  rounded-md border border-slate-400/40 focus-within:border-slate-400 transition-colors duration-300 placeholder:text-slate-400/70',
        { 'border-rose-200/40': error }
      )}
      type='text'
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
};

export default UserInput;
