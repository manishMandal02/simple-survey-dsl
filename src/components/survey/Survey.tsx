import { useState } from 'react';
import { SurveyData } from '../survey-json';
import Question from './Question';

type Props = {
  data: SurveyData;
};

const Survey = ({ data }: Props) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const handleStartSurvey = () => {
    setCurrentQuestion(1);
  };
  return (
    <div className='w-full flex flex-col items-center'>
      {/* survey start */}
      <div className='mt-16'>
        <h2 className='text-center text-[22px] text-slate-600'>{data.title}</h2>
        {currentQuestion < 1 ? (
          <button
            onClick={handleStartSurvey}
            className='bg-emerald-500 text-slate-200 font-medium mt-12 px-10 py-1.5 rounded transition-opacity duration-200 hover:opacity-95 '
          >
            Start Survey
          </button>
        ) : null}
      </div>
      <div className='relative mt-10 w-full flex items-center justify-center'>
        {data.questions.map((question, idx) => (
          <Question
            key={question.id}
            data={question}
            number={idx + 1}
            currentQuestion={currentQuestion}
            onNextClick={() => setCurrentQuestion(currentQuestion + 1)}
            onPrevClick={() => setCurrentQuestion(currentQuestion - 1)}
          />
        ))}
      </div>
    </div>
  );
};

export default Survey;
