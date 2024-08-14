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

const SurveyView = ({ data }: Props) => {
  const [currentQuestion, setCurrentQuestion] = useState('');

  const [questionNavigation, setQuestionNavigation] = useState<string[]>([]);

  const [questionRes, setQuestionRes] = useState<SurveyResponse>({});

  const handleResetSurvey = () => {
    setCurrentQuestion('');
    setQuestionNavigation([]);
    setQuestionRes({});
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

    setQuestionRes(updatedResponse);

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
    <div className='w-full h-full max-h-[100%] flex flex-col items-center '>
      {/* survey start */}
      <div className=' flex flex-col items-center justify-center w-full sticky top-0 bg-slate-50'>
        <h2 className='text-center text-[20px] text-slate-600 font-light tracking-wide py-5'>{data.title}</h2>
        <hr className='h-[1px]  border-none bg-slate-200/80 rounded-md w-[100%]  mx-auto' />
      </div>
      {!currentQuestion ? <Button label='Start Survey' onClick={handleStartSurvey} classes='mt-16' /> : null}

      {currentQuestion !== 'end' ? (
        <div className='relative mt-20 w-full flex items-center justify-center'>
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
      ) : null}

      {/* survey end */}
      {currentQuestion === 'end' ? (
        <SurveyResult result={mapResponseToData(questionRes)} onRetakeClick={handleResetSurvey} />
      ) : null}
    </div>
  );
};

export default SurveyView;
