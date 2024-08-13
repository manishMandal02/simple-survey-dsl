import { useEffect, useState } from 'react';

import { useSurvey } from './useSurvey';
import SurveyResult from './SurveyResult';
import Question from './question/Question';
import { SurveyData } from '../survey-json';

export type SurveyResponse = {
  [key: string]: string[];
};

type Props = {
  data: SurveyData;
};

const Survey = ({ data }: Props) => {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questionNavigation, setQuestionNavigation] = useState<string[]>([]);

  console.log('🚀 ~ file: Survey.tsx:20 ~ Survey ~ questionNavigation:', questionNavigation);

  const [questionRes, setQuestionsRes] = useState<SurveyResponse>({});

  useEffect(() => {
    setCurrentQuestion('');
    setQuestionsRes({});
  }, [data]);

  const { getNextQuestion, mapResponseToData } = useSurvey({ data, currentQuestion });

  const handleStartSurvey = () => {
    setCurrentQuestion(data.questions[0].id);
    setQuestionNavigation([data.questions[0].id]);
  };

  const handleNextQuestion = (response: SurveyResponse) => {
    const updatedResponse = { ...questionRes };

    updatedResponse[currentQuestion] = response[currentQuestion];

    setQuestionsRes(updatedResponse);

    const nextQuestion = getNextQuestion(response);

    setCurrentQuestion(nextQuestion);

    // do nothing is user navigation to same question form prev
    if (questionNavigation[questionNavigation.length - 1] === nextQuestion) return;

    setQuestionNavigation([...questionNavigation, nextQuestion]);
  };

  const handlePreviousQuestion = () => {
    const currentQuestionIndex = questionNavigation.indexOf(currentQuestion) - 1;

    const prevQuestionId = questionNavigation[currentQuestionIndex];

    setCurrentQuestion(prevQuestionId);
  };

  return (
    <div className='w-full h-full max-h-[100%] flex flex-col items-center overflow-y-auto'>
      {/* survey start */}
      <div className='mt-16'>
        <h2 className='text-center text-[20px] text-slate-600 font-light'>{data.title}</h2>
        {!currentQuestion ? (
          <button
            onClick={handleStartSurvey}
            className='bg-emerald-400/90 text-slate-800/90 font-medium mt-12 px-10 py-1.5 rounded transition-opacity duration-200 hover:opacity-95 '
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
            index={idx + 1}
            currentQuestion={currentQuestion}
            onNextClick={handleNextQuestion}
            onPrevClick={handlePreviousQuestion}
          />
        ))}
      </div>

      {/* survey end */}
      {currentQuestion === 'end' ? <SurveyResult result={mapResponseToData(questionRes)} /> : null}
    </div>
  );
};

export default Survey;
