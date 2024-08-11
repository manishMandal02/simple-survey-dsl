import { JsonInput } from '@mantine/core';
import { useEffect, useState } from 'react';

const sampleSurveyJSON = [
  {
    type: 'question',
    question: 'What is your name?',
    options: []
  },
  {
    type: 'question',
    question: 'What is your favorite color?',
    options: ['Red', 'Green', 'Blue']
  },
  {
    type: 'question',
    question: 'What is your favorite animal?',
    options: ['Dog', 'Cat', 'Bird']
  },
  {
    type: 'question',
    question: 'What is your favorite food?',
    options: ['Pizza', 'Burger', 'Sushi']
  },
  {
    type: 'question',
    question: 'What is your favorite movie?',
    options: ['The Shawshank Redemption', 'The Godfather', 'The Dark Knight']
  },
  {
    type: 'question',
    question: 'What is your favorite book?',
    options: ['The Shawshank Redemption', 'The Godfather', 'The Dark Knight']
  }
];

const SurveyInput = () => {
  const [jsonInputValue, setJSONInputValue] = useState('');

  useEffect(() => {
    setJSONInputValue(JSON.stringify(sampleSurveyJSON, null, 2));
  }, []);

  return (
    <div>
      <JsonInput
        placeholder='Enter your survey JSON'
        validationError='Invalid JSON'
        formatOnBlur
        autosize
        minRows={6}
        // maxRows={32}
        maxRows={30.5}
        className='w-full h-full relative overflow-hidden'
        styles={{
          input: {
            height: '100% !important'
          }
        }}
        classNames={{
          wrapper: '!h-full',
          input:
            'w-full py-2 px-3 bg-slate-800 text-slate-300 outline-none border border-slate-700 !h-[100%] peer !overflow-y-auto !resize-none cc-scrollbar',
          error:
            'absolute top-2 right-4 text-[14px] text-slate-800/80 px-2.5 py-1 font-medium rounded-sm bg-rose-400 peer:bg-red-600'
        }}
        // error={<span>Invalid JSON</span>}
        value={jsonInputValue}
        onChange={setJSONInputValue}
      />
    </div>
  );
};

export default SurveyInput;
