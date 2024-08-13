import { useState } from 'react';

import { SurveyResponse } from './Survey';

type Props = {
  result: SurveyResponse;
  title: string;
};

const SurveyResult = ({ title, result }: Props) => {
  console.log('🚀 ~ file: SurveyResult.tsx:12 ~ SurveyResult ~ result:', result);

  const [showResult, setShowResult] = useState(false);
  const handleShowResult = () => {
    // TODO: show result
    setShowResult(true);
  };
  return (
    <div className='w-full max-h-[80%%] overflow-y-auto'>
      <div className='mt-12 flex flex-col items-center justify-center'>
        {!showResult ? (
          <>
            <h2 className='text-center text-[22px] text-slate-600 flex flex-col'>
              🎉 Survey Completed 🎉
              <span className='text-[16px] font-light mt-2'>Thank you for your time!</span>
            </h2>
            <button
              onClick={handleShowResult}
              className='mt-6 text-slate-800/90 tracking-wide  bg-emerald-400/90 px-6 py-1.5 rounded'
            >
              View Result
            </button>
          </>
        ) : (
          <div className='-mt-14'>
            {/* <h1 className='text-[20px] font-light  text-center'>{title}</h1> */}
            {[...Object.keys(result)].map(res => (
              <div
                key={res}
                className={
                  'text-[16px] mb-3 bg-slate-100/50 min-w-[520px] w-fit px-5 pt-4 pb-4 rounded-md shadow-sm  shadow-slate- 300'
                }
              >
                <p className='mb-2 text-slate-600 '>{res}</p>
                <div className=' flex flex-col gap-y-2'>
                  {result[res].map(answer => (
                    <div
                      key={answer}
                      className='bg-emerald-400/20 mb-px border border-emerald-400/10 rounded-md  w-full text-[16px] text-left px-3 py-2 leading-[1.45rem] max-w-[600px]'
                    >
                      {answer}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyResult;
