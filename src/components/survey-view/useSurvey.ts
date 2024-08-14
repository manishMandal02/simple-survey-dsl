import { SurveyData } from '../survey-json';
import { SurveyResponse } from './SurveyView';
import { Answer } from '../../types/parser.types';

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
  // next question router
  const getNextQuestion = (response: SurveyResponse) => {
    let nextQuestion = '';

    const question = data.questions.find(question => question.id === currentQuestion);

    // user input option
    if (question && question?.answer.length < 2) {
      if (question.answer[0].end) {
        return 'end';
      }
      //   user input type text
      nextQuestion = question.answer[0]?.goto ?? '';

      //    user input type number with condition
      if (!nextQuestion && question.conditions) {
        // check conditions
        for (const condition of question.conditions) {
          const success = validateNumberConditions(condition, Number(response[question.id][0]));

          if (success) {
            nextQuestion = condition.goto ?? 'end';
            break;
          }
        }
      }
    }

    if (question && question?.answer.length >= 2) {
      // options
      const selectedOption = question?.answer.find(option => option.id === response[question.id][0]);

      nextQuestion = selectedOption?.goto ?? 'end';
    }

    return nextQuestion;
  };

  // map response to id (question, answer) to their labels
  const mapResponseToData = (response: SurveyResponse) => {
    const result: SurveyResponse = {};

    for (const res in response) {
      // get question from id
      const qRes = data.questions.find(q => res === q.id);

      const isUserInputRes = (qRes?.answer.length ?? 0) < 2 || false;

      let answersLabel: string[] = response[res];

      if (!isUserInputRes) {
        // get answers from id
        const answers = qRes?.answer.filter(ans => response[res].includes(ans.id)) as Answer[];

        answersLabel = answers?.map(ans => ans.label);
      }

      if (!qRes) continue;

      result[qRes.question] = answersLabel;
    }

    return result;
  };

  return { getNextQuestion, mapResponseToData };
};
