import Options from './Options';
import UserInput from './UserInput';
import { cn } from '../../../utils/cn';
import { SurveyResponse } from '../SurveyView';
import { SurveyQuestion } from '../../survey-json';
import { useEffect, useMemo, useState } from 'react';
import Button from '../../elements';

type Props = {
  data: SurveyQuestion;
  currentQuestion: string;
  index: number;
  response: string[];
  onNextClick: (res: SurveyResponse) => void;
  onPrevClick: () => void;
};
const Question = ({ data, index, currentQuestion, onNextClick, onPrevClick, response }: Props) => {
  const [userInput, setUserInput] = useState('');
  const [userInputError, setUserInputError] = useState('');

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const isAnswerUserInput = useMemo(() => data.answer.length < 2, [data.answer]);

  useEffect(() => {
    if (!response) {
      setUserInput('');
      setUserInputError('');
      setSelectedOptions([]);
      return;
    }

    if (isAnswerUserInput) {
      setUserInput(response[0]);
      return;
    }

    setSelectedOptions(response);
  }, [currentQuestion, response, isAnswerUserInput]);

  const handleNextClick = () => {
    let newResponse: SurveyResponse | null = null;

    if (isAnswerUserInput) {
      setUserInputError('');

      // validate input type
      if (data.answer[0].type === 'number' && !Number.isInteger(Number(userInput))) {
        setUserInputError('Please enter a number');
        return;
      }

      if (data.answer[0].type === 'string' && userInput.length < 1) {
        setUserInputError('Please enter a valid input');
        return;
      }
      newResponse = {
        [data.id]: [userInput]
      };
    } else {
      newResponse = {
        [data.id]: selectedOptions
      };
    }

    onNextClick(newResponse);
  };

  const handleSelectOption = (value: string) => {
    if (!data?.multiselect) {
      setSelectedOptions([value]);
      return;
    }

    const isOptionSelected = selectedOptions.includes(value);

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
        'translate-x-0 bg-slate-100/60- min-w-[560px] 2xl:min-w-[580 w-fit px-7  pt-3 pb-4 rounded-md shadow-sm shadow-slate-300 border border-slate-200/50':
          currentQuestion === data.id
      })}
    >
      <p className='text-[16px] font-light text-slate-800'>
        <span className='font-normal tracking-wide text-slate-600/70'>Q{index}</span>. {data.question}
      </p>
      {/*  options */}
      <div className='mt-4'>
        {isAnswerUserInput ? (
          <>
            <UserInput
              placeholder={data.answer[0].label}
              value={userInput}
              onChange={setUserInput}
              error={userInputError}
            />
            {userInputError ? <p className='mt-1 ml-1 text-red-500 text-[14px]'>{userInputError}</p> : null}
          </>
        ) : (
          <Options
            optionList={data.answer.map(ans => ({ value: ans.id, label: ans.label }))}
            onSelect={handleSelectOption}
            selected={selectedOptions}
          />
        )}
      </div>

      {/* action btn */}
      <div className='mt-12 flex items-center justify-center gap-x-3'>
        {index > 1 ? <Button type='secondary' label='Back' onClick={onPrevClick} /> : null}

        <Button
          label='Next'
          onClick={handleNextClick}
          disabled={
            (isAnswerUserInput && userInput.length < 1) || (!isAnswerUserInput && selectedOptions.length < 1)
          }
        />
      </div>
    </div>
  );
};

export default Question;
