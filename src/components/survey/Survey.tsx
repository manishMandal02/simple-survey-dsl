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
  const [response, setResponse] = useState<SurveyResponse>({});

  useEffect(() => {
    setCurrentQuestion('');
    setResponse({});
  }, [data]);

  const { getNextQuestion, mapResponseToData } = useSurvey({ data, currentQuestion });

  const handleStartSurvey = () => {
    setCurrentQuestion(data.questions[0].id);
  };

  const handleNextQuestion = (response: SurveyResponse) => {
    const updatedResponse = response;

    updatedResponse[currentQuestion] = response[currentQuestion];

    setResponse(updatedResponse);

    const nextQuestion = getNextQuestion(response);

    setCurrentQuestion(nextQuestion);
    setQuestionNavigation([...questionNavigation, nextQuestion]);
  };

  const handlePreviousQuestion = () => {
    const prevQuestionId = questionNavigation[questionNavigation.length - 2];
    setCurrentQuestion(prevQuestionId);
  };

  return (
    <div className='w-full flex flex-col items-center'>
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
      {currentQuestion === 'end' ? (
        <SurveyResult title={data.title} result={mapResponseToData(response)} />
      ) : null}
    </div>
  );
};

export default Survey;
