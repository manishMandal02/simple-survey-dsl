import { SurveyResponse } from './Survey';
import { SurveyData } from '../survey-json';

type UseSurveyProps = {
  data: SurveyData;
  currentQuestion: string;
};

const validateNumberConditions = (condition: Record<string, string | boolean>, res: number) => {
  const conditionKeys = Object.keys(condition);

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
    let nextQuestion = '';

    const question = data.questions.find(question => question.id === currentQuestion);

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

          if (success) {
            nextQuestion = condition.goto || 'end';
            break;
          }
        }
      }
    }

    if (question && question?.answer.length >= 2) {
      // options
      const selectedOption = question?.answer.find(option => option.id === response[question.id][0]);

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
