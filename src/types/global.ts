export interface ISurveyAnswer {
  id: string;
  type: 'option' | 'number' | 'string';
  label: string;
  goto?: string;
  end?: boolean;
}

export type ConditionOperators = 'lt' | 'lte' | 'gt' | 'gte' | 'eq' | 'contains';

export type ISurveyCondition = {
  [key in ConditionOperators]?: string;
} & {
  goto: string;
  end?: boolean;
};

export interface ISurveyQuestion {
  id: string;
  question: string;
  answer: ISurveyAnswer[];
  conditions?: ISurveyCondition[];
}

export interface ISurvey {
  questions: ISurveyQuestion[];
}
