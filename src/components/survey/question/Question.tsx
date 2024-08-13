import Options from './Options';
import UserInput from './UserInput';
import { cn } from '../../../utils/cn';
import { SurveyResponse } from '../Survey';
import { SurveyQuestion } from '../../survey-json';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  data: SurveyQuestion;
  currentQuestion: string;
  index: number;
  onNextClick: (res: SurveyResponse) => void;
  onPrevClick: () => void;
};
const Question = ({ data, index, currentQuestion, onNextClick, onPrevClick }: Props) => {
  const [useInput, setUserInput] = useState('');
  const [userInputError, setUserInputError] = useState('');

  const [selectedOption, setSelectedOptions] = useState<string[]>([]);

  useEffect(() => {
    setUserInput('');
    setUserInputError('');
    setSelectedOptions([]);
  }, [data]);

  const isAnswerUserInput = useMemo(() => {
    return data.answer.length < 2;
  }, [data.answer]);

  const handleNextClick = () => {
    let response: SurveyResponse | null = null;

    if (isAnswerUserInput) {
      setUserInputError('');

      // validate input type
      if (data.answer[0].type === 'number' && !Number.isInteger(Number(useInput))) {
        setUserInputError('Please enter a number');
        return;
      }

      if (data.answer[0].type === 'string' && useInput.length < 1) {
        setUserInputError('Please enter a valid input');
        return;
      }
      response = {
        [data.id]: [useInput]
      };
    } else {
      response = {
        [data.id]: selectedOption
      };
    }

    onNextClick(response);
  };

  const handleSelectOption = (value: string) => {
    if (!data?.multiselect) {
      setSelectedOptions([value]);
      return;
    }

    const isOptionSelected = selectedOption.includes(value);

    if (isOptionSelected) {
      setSelectedOptions(prev => prev.filter(option => option !== value));
    } else {
      setSelectedOptions(prev => [...prev, value]);
    }
  };

  return (
    <div
      key={data.id}
      className={cn('text-[18px] text-slate-600 -translate-x-[1000px] absolute top-1/2 ', {
        'translate-x-0 bg-slate-100/60- min-w-[520px] w-fit px-5  pt-2.5 pb-4 rounded-md shadow-sm shadow-slate-300/70 ':
          currentQuestion === data.id
      })}
    >
      <p className='text-[18px] font-light text-slate-800'>
        <span className='font-normal tracking-wide text-slate-600/70'>Q{index}</span>. {data.question}
      </p>
      {/*  options */}
      <div className='mt-4'>
        {isAnswerUserInput ? (
          <>
            <UserInput
              placeholder={data.answer[0].label}
              value={useInput}
              onChange={setUserInput}
              error={userInputError}
            />
            {userInputError ? <p className='mt-1 ml-1 text-red-500 text-[14px]'>{userInputError}</p> : null}
          </>
        ) : (
          <Options
            optionList={data.answer.map(ans => ({ value: ans.id, label: ans.label }))}
            onSelect={handleSelectOption}
            selected={selectedOption}
          />
        )}
      </div>

      {/* action btn */}
      <div className='mt-12 flex items-center justify-center gap-x-3'>
        {index > 1 ? (
          <button
            onClick={onPrevClick}
            className='bg-gray-400 w-fit px-6 py-1.5  rounded text-[15px] text-slate-800/90 font-medium tracking-wide hover:opacity-90 transition-opacity duration-300'
          >
            Back
          </button>
        ) : null}
        <button
          disabled={
            (isAnswerUserInput && useInput.length < 1) || (!isAnswerUserInput && selectedOption.length < 1)
          }
          onClick={handleNextClick}
          className='bg-emerald-400/90 w-fit px-6 py-1.5  rounded text-[15px] text-slate-800/80 font-medium tracking-wide hover:opacity-90 transition-opacity duration-300 disabled:bg-slate-500 disabled:text-slate-300 disabled:cursor-default disabled:hover:opacity-100'
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Question;
