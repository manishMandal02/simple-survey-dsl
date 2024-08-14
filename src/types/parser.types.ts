type TokenKey =
  | 'STRING'
  | 'NUMBER'
  | 'BOOLEAN'
  | 'NULL'
  | 'COLON'
  | 'COMMA'
  | 'LEFT_CURLY_BRACKET'
  | 'RIGHT_CURLY_BRACKET'
  | 'LEFT_SQUARE_BRACKET'
  | 'RIGHT_SQUARE_BRACKET';

export interface Token {
  type: TokenKey;
  value: string;
}

export type BaseValueType = string | number | boolean | Record<string, unknown> | unknown[] | null;

export interface Survey {
  title: string;
  questions: Question[];
}

export interface Question {
  id: string;
  multiselect?: boolean;
  question: string;
  answer: Answer[];
  conditions: Condition[];
}

export interface Answer {
  id: string;
  type: 'option' | 'number' | 'string';
  label: string;
  goto?: string;
  end?: boolean;
}

export const ConditionOperators = ['gt', 'gte', 'lt', 'lte', 'eq'] as const;

export type ConditionOperator = (typeof ConditionOperators)[number];

export type Condition = {
  [key in ConditionOperator]?: string;
} & {
  goto?: string;
  end?: boolean;
};
