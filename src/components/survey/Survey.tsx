import { useEffect, useState } from 'react';

import { useSurvey } from './useSurvey';
import SurveyResult from './SurveyResult';
import Question from './question/Question';
import { SurveyData } from '../survey-json';
import Button from '../elements';

export type SurveyResponse = {
  [key: string]: string[];
};

type Props = {
  data: SurveyData;
};

const Survey = ({ data }: Props) => {
  const [currentQuestion, setCurrentQuestion] = useState('');

  const [questionNavigation, setQuestionNavigation] = useState<string[]>([]);

  const [questionRes, setQuestionsRes] = useState<SurveyResponse>({});

  const handleResetSurvey = () => {
    setCurrentQuestion('');
    setQuestionNavigation([]);
    setQuestionsRes({});
  };

  useEffect(() => {
    handleResetSurvey();
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
      <div className='mt-12'>
        <h2 className='text-center text-[22px] text-slate-600/80 tracking-wide'>{data.title}</h2>
        <hr className='h-[1px] mt-2 mb-3 border-none bg-slate-200/60 rounded-md w-[100%]  mx-auto' />
        {!currentQuestion ? <Button label='Start Survey' onClick={handleStartSurvey} /> : null}
      </div>
      <div className='relative mt-10 w-full flex items-center justify-center'>
        {data.questions.map((question, idx) => (
          <Question
            key={question.id}
            data={question}
            index={idx + 1}
            response={questionRes[question.id]}
            currentQuestion={currentQuestion}
            onNextClick={handleNextQuestion}
            onPrevClick={handlePreviousQuestion}
          />
        ))}
      </div>

      {/* survey end */}
      {currentQuestion === 'end' ? (
        <SurveyResult result={mapResponseToData(questionRes)} onRetakeClick={handleResetSurvey} />
      ) : null}
    </div>
  );
};

export default Survey;
