import { SurveyResponse } from './Survey';
import { SurveyData } from '../survey-json';

type UseSurveyProps = {
  data: SurveyData;
  currentQuestion: string;
};

const validateNumberConditions = (condition: Record<string, string>, res: number) => {
  console.log('🚀 ~ file: useSurvey.ts:11 ~ validateNumberConditions ~ res:', res);

  const conditionKeys = Object.keys(condition);

  console.log('🚀 ~ file: useSurvey.ts:12 ~ validateNumberConditions ~ conditionKeys:', conditionKeys);

  switch (true) {
    case conditionKeys.includes('lt'):
      return res < Number(condition['lt']);

    case conditionKeys.includes('lte'):
      return res <= Number(condition['lte']);

    case conditionKeys.includes('ge'):
      return res > Number(condition['ge']);

    case conditionKeys.includes('gte'):
      return res >= Number(condition['gte']);

    case conditionKeys.includes('eq'):
      return res === Number(condition['eq']);
  }

  return false;
};

export const useSurvey = ({ data, currentQuestion }: UseSurveyProps) => {
  const getNextQuestion = (response: SurveyResponse) => {
    console.log('🚀 ~ file: useSurvey.ts:35 ~ getNextQuestion ~ response:', response);

    let nextQuestion = '';

    const question = data.questions.find(question => question.id === currentQuestion);

    console.log('🚀 ~ file: useSurvey.ts:38 ~ getNextQuestion ~ question:', question);

    // user input option
    if (question && question?.answer.length < 2) {
      if (question.answer[0].end) {
        return 'end';
      }
      //   user input type text
      nextQuestion = question.answer[0]?.goto || '';

      //    user input type number with condition
      if (!nextQuestion && question.conditions) {
        // check conditions
        for (const condition of question.conditions) {
          const success = validateNumberConditions(condition, Number(response[question.id][0]));

          console.log('🚀 ~ file: useSurvey.ts:73 ~ getNextQuestion ~ success:', success);

          if (success) {
            nextQuestion = condition?.end ? 'end' : condition.goto;
            break;
          }
        }
      }
    }

    if (question && question?.answer.length >= 2) {
      // options
      const selectedOption = question?.answer.find(option => option.id === response[question.id][0]);

      console.log('🚀 ~ file: useSurvey.ts:62 ~ getNextQuestion ~ selectedOption:', selectedOption);

      nextQuestion = selectedOption?.goto || 'end';
    }

    return nextQuestion;
  };

  const mapResponseToData = (response: SurveyResponse) => {
    const result: SurveyResponse = {};

    for (const res in response) {
      const qRes = data.questions.find(q => res === q.id);

      if (!qRes) continue;

      result[qRes.question] = response[res];
    }

    return result;
  };

  return { getNextQuestion, mapResponseToData };
};
