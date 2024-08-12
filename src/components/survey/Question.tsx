import { cn } from '../../utils/cn';
import { SurveyQuestion } from '../survey-json';

type Props = {
  data: SurveyQuestion;
  currentQuestion: number;
  number: number;
  onNextClick: () => void;
  onPrevClick: () => void;
};
const Question = ({ data, number, currentQuestion, onNextClick, onPrevClick }: Props) => {
  return (
    <div
      key={data.id}
      className={cn('text-[18px] text-slate-600 -translate-x-[800px] absolute top-1/2 ', {
        'translate-x-0 bg-slate-100/70 min-w-[500px] w-fit px-3 pt-2.5 pb-4 rounded-md shadow-sm shadow-slate-300/70 ':
          currentQuestion === number
      })}
    >
      <p className='text-[18px] font-medium text-slate-700/90'>
        <span className='font-medium tracking-wider text-slate-700/65'>Q{number}</span>. {data.question}
      </p>
      {/*  options */}
      <div className='mt-4'>
        {data.answer.length < 2 ? (
          <input
            autoFocus
            className='w-full py-2 px-3 bg-slate-200/40 text-slate-800/80 outline-none  rounded-md border border-slate-400/40 focus-within:border-slate-400 transition-colors duration-300 placeholder:text-slate-400/70'
            type='text'
            placeholder={data.answer[0].label}
          />
        ) : null}
      </div>

      {/* action btn */}
      <div className='mt-8 flex items-center justify-center gap-x-3'>
        <button
          onClick={onPrevClick}
          className='bg-gray-400 w-fit px-6 py-1  rounded text-[15px] text-slate-800/90 font-medium tracking-wide hover:opacity-90 transition-opacity duration-300'
        >
          Next
        </button>
        <button
          onClick={onNextClick}
          className='bg-emerald-400 w-fit px-6 py-1  rounded text-[15px] text-slate-800/90 font-medium tracking-wide hover:opacity-90 transition-opacity duration-300'
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Question;
