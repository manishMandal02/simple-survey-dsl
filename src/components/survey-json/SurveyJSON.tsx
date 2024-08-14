import { JsonInput } from '@mantine/core';
import { useEffect, useState } from 'react';

import { cn } from '../../utils/cn';
import { isJSON } from '../../utils/validate-json';
import sampleSurveyJSON from '../../../public/sample-survey.json';
import { SurveyData, useSurveyParser } from './useSurveyParser';
import { useRecursiveParse } from './useRecursiveParser';

type Props = {
  loadSurvey: (data: SurveyData) => void;
};

const CloseIcon = (
  <svg width='15' height='15' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z'
      fill='currentColor'
      fillRule='evenodd'
      clipRule='evenodd'
    ></path>
  </svg>
);

const SurveyJSON = ({ loadSurvey }: Props) => {
  const [jsonInputValue, setJSONInputValue] = useState('');
  const [isValidJSON, setIsValidJSON] = useState<boolean | undefined>();
  const [parserError, setParserError] = useState<string[]>([]);

  useEffect(() => {
    setJSONInputValue(JSON.stringify(sampleSurveyJSON, null, 2));
  }, []);

  const { praseSurveyJSON } = useSurveyParser();
  const { recursiveParser } = useRecursiveParse();

  const handleJSONInputChange = (value: string) => {
    setJSONInputValue(value);

    if (isJSON(value)) {
      setIsValidJSON(true);
    } else {
      setIsValidJSON(false);
    }

    setParserError([]);
  };

  const handleResetJSON = () => {
    setJSONInputValue(JSON.stringify(sampleSurveyJSON, null, 2));
  };

  const handleParseJSON = () => {
    // const [data, err] = praseSurveyJSON(JSON.parse(jsonInputValue));
    const [data, err] = recursiveParser(jsonInputValue);

    if (err) {
      setParserError(err);
      return;
    }
    if (!data) {
      setParserError(['Invalid Survey JSON']);
    }

    loadSurvey(data as SurveyData);

    // clear error
    setParserError([]);
  };

  return (
    <div className='h-full flex flex-col'>
      <JsonInput
        placeholder='Enter your survey JSON'
        // validationError='Invalid JSON'
        formatOnBlur
        autosize
        minRows={6}
        maxRows={28}
        className='w-full h-[90%] relative overflow-hidden'
        styles={{
          input: {
            height: '100% !important'
          }
        }}
        classNames={{
          wrapper: '!h-full',
          input: cn(
            'w-full py-2 px-3 bg-slate-800 text-slate-300 outline-none border border-slate-700 !h-[100%] !overflow-y-auto !resize-none cc-scrollbar',
            {
              '!border-rose-400/70': isValidJSON === false
            }
          )
        }}
        // error={<span>Invalid JSON</span>}
        value={jsonInputValue}
        onChange={handleJSONInputChange}
      />

      {/* actions */}
      <div className='relative flex items-center justify-center w-full flex-grow gap-x-4'>
        {/* parser errors */}
        {parserError.length > 0 ? (
          <div className='absolute bottom-[4.4rem]  left-[2.5px] w-[96.5%] '>
            {parserError.map((err, idx) => (
              <div
                key={err}
                className='w-full bg-red-300 text-[14px] rounded-md border border-rose-500/80 text-rose-800 flex justify-between items-center mb-1 px-3 py-2 leading-[1.2rem]'
              >
                {err}
                <button
                  onClick={() => {
                    setParserError(parserError.filter((_, i) => i !== idx));
                  }}
                  className='scale-[1.25] opacity-70 mr-2'
                >
                  {CloseIcon}
                </button>
              </div>
            ))}
          </div>
        ) : null}
        <button
          onClick={handleResetJSON}
          className='text-slate-300/70 bg-slate-600 rounded px-6 py-2 text-[12.5px] font-medium hover:opacity-95 transition-colors duration-200'
        >
          Load Sample JSON
        </button>
        <button
          disabled={isValidJSON === false}
          onClick={handleParseJSON}
          className='text-slate-700/90 bg-emerald-500 rounded px-6 py-2 text-[12.5px] font-medium hover:opacity-95 transition-colors duration-200 disabled:bg-slate-600 disabled:text-slate-300'
        >
          Parse & Load Survey
        </button>
      </div>
    </div>
  );
};

export default SurveyJSON;
