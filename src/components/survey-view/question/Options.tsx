import { cn } from '../../../utils/cn';

type Props = {
  optionList: { value: string; label: string }[];
  onSelect: (value: string) => void;
  selected: string[];
};

const Options = ({ optionList, selected, onSelect }: Props) => {
  return (
    <div className='flex flex-col justify-start items-start gap-y-2 '>
      {optionList.map((option, idx) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={cn(
            'bg-slate-200/50  border border-slate-400/80 rounded-md  w-full text-[16px] text-left px-3 py-2 transition-colors duration-300 hover:bg-slate-200/70 leading-[1.45rem] max-w-[600px]',
            {
              'bg-emerald-400/15 border-emerald-400 hover:bg-emerald-400/5': selected.includes(option.value)
            }
          )}
        >
          <span className='mr-[2px] text-slate-500'>{idx + 1}. </span> {option.label}
        </button>
      ))}
    </div>
  );
};

export default Options;
