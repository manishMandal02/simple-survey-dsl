import { JsonInput } from '@mantine/core';
import { useEffect, useState } from 'react';

import { cn } from '../../utils/cn';
import { isJSON } from '../../utils/validate-json';
import { SurveyData, useSurveyParser } from './useSurveyParser';

const sampleSurveyJSON = {
  title: 'Sample Survey',
  questions: [
    {
      id: 'name',
      question: 'What is your age?',
      answer: [
        {
          id: 'age',
          type: 'number',
          label: '24'
        }
      ],
      conditions: [
        {
          gte: '18',
          goto: 'ai-usage'
        },
        {
          lt: '18',
          goto: 'student'
        }
      ]
    },
    {
      id: 'ai-usage',
      question: 'Does your company use AI for market research?',
      answer: [
        {
          id: 'yes',
          type: 'option',
          label: 'Yes',
          goto: 'ai-apps'
        },
        {
          id: 'no',
          type: 'option',
          label: 'No',
          end: true
        }
      ]
    },
    {
      id: 'student',
      question: 'What is your use case of our product?',
      answer: [
        {
          id: 'research',
          type: 'option',
          label: 'Project Research',
          end: true
        },
        {
          id: 'casual-usage',
          type: 'option',
          label: 'Just wanna try it.',
          end: true
        }
      ]
    },
    {
      id: 'ai-apps',
      question: 'What ai apps do you use at your company?',
      answer: [
        {
          id: 'chatgpt',
          type: 'option',
          label: 'Chat GPT',
          end: true
        },
        {
          id: 'claude',
          type: 'option',
          label: 'Claude',
          end: true
        }
      ]
    }
  ]
};

type Props = {
  loadSurvey: (data: SurveyData) => void;
};
const SurveyJSON = ({ loadSurvey }: Props) => {
  const [jsonInputValue, setJSONInputValue] = useState('');
  const [isValidJSON, setIsValidJSON] = useState<boolean | undefined>();
  const [parserError, setParserError] = useState<string[]>([]);

  useEffect(() => {
    setJSONInputValue(JSON.stringify(sampleSurveyJSON, null, 2));
    console.log(
      '🚀 ~ file: SurveyJSON.tsx:98 ~ useEffect ~ JSON.stringify(sampleSurveyJSON, null, 2):',
      JSON.stringify(sampleSurveyJSON, null, 2)
    );
  }, []);

  const { praseSurveyJSON } = useSurveyParser();

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
    const [data, err] = praseSurveyJSON(JSON.parse(jsonInputValue));

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
        // maxRows={32}
        maxRows={28}
        className='w-full h-fit relative overflow-hidden'
        styles={{
          input: {
            height: '100% !important'
          }
        }}
        classNames={{
          wrapper: '!h-full  peer-[.absolute]:bg-rose-400',
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
          <div className='absolute bottom-14  left-0 w-full'>
            {parserError.map((err, idx) => (
              <div
                key={err}
                className='w-full bg-rose-400/95 text-[14px] text-slate-800/80 flex justify-between items-center mb-1 px-3 py-1.5'
              >
                {err}
                <button
                  onClick={() => {
                    setParserError(parserError.filter((_, i) => i !== idx));
                  }}
                  className='text-[16px] opacity-70 mr-2'
                >
                  X
                </button>
              </div>
            ))}
          </div>
        ) : null}
        <button
          onClick={handleResetJSON}
          className='text-slate-300/70 bg-slate-600 rounded px-6 py-1.5 text-[16px] font-medium hover:opacity-95 transition-colors duration-200'
        >
          Reset
        </button>
        <button
          disabled={isValidJSON === false}
          onClick={handleParseJSON}
          className='text-slate-700/90 bg-emerald-500 rounded px-6 py-1.5 text-[16px] font-medium hover:opacity-95 transition-colors duration-200 disabled:bg-slate-600 disabled:text-slate-300'
        >
          Parse & Load
        </button>
      </div>
    </div>
  );
};

export default SurveyJSON;
