import { useState } from 'react';

import { SurveyResponse } from './SurveyView';
import Button from '../elements';

type Props = {
  result: SurveyResponse;
  onRetakeClick: () => void;
};

const SurveyResult = ({ result, onRetakeClick }: Props) => {
  const [showResult, setShowResult] = useState(false);
  const handleShowResult = () => {
    setShowResult(true);
  };
  return (
    <div className=' w-full h-full mt-2 flex flex-col items-center justify-start overflow-y-auto'>
      {!showResult ? (
        <>
          <h2 className='mt-20 text-center text-[22px] text-slate-600 flex flex-col'>
            {'🎉 Survey Completed 🎉'}
            <span className='text-[16px] font-light mt-2'>Thank you for your time!</span>
          </h2>
          <Button onClick={handleShowResult} label='View Result' classes='mt-10' />
        </>
      ) : (
        <div className=' flex flex-col pt-2 pb-4'>
          <p className='text-center text-[18px] font-light text-slate-700/80'>Result</p>
          <hr className='h-[1px] mt-1 mb-3 border-none bg-slate-200/80 rounded-md w-[65%]  mx-auto' />
          {Object.keys(result).map((res, idx) => (
            <div
              key={res}
              className={
                ' mb-3 bg-slate-100/50 min-w-[500px] w-fit px-4 pt-4 pb-4 rounded-md shadow-sm  shadow-slate-400/70 max-w-[550px]'
              }
            >
              <p className='mb-2 text-[16px] text-slate-700 '>
                <span className='mr-[2.5px] text-slate-500'>Q{idx + 1}.</span>
                {res}
              </p>
              <div className=' flex flex-col gap-y-2'>
                {result[res].map(answer => (
                  <div
                    key={answer}
                    className={`bg-emerald-400/20 mb-px border border-emerald-400/10 rounded-md  w-full text-[16px]
                                   text-slate-800/90 text-left px-3 py-[7px] leading-[1.45rem] max-w-[600px]`}
                  >
                    {answer}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Button onClick={onRetakeClick} label='Try Again' classes='mx-auto' />
        </div>
      )}
    </div>
  );
};

export default SurveyResult;
