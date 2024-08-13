import { z } from 'zod';

const AnswerTypes = ['option', 'number', 'string'] as const;

export const ParserErrorMessage = {
  goto: 'All goto statements must route to a valid question',
  condition: 'Invalid condition',
  question: 'Invalid question',
  answer: 'Invalid answer',
  title: 'Invalid title'
};

const AnswerSchema = z.object({
  id: z.string().min(1, { message: ParserErrorMessage.answer }),
  type: z.enum(AnswerTypes, { message: 'Invalid answer type' }),
  label: z.string(),
  goto: z.string().optional(),
  end: z.boolean().optional()
});

export const ConditionOperators = ['lt', 'lte', 'gt', 'gte', 'eq'];

const ConditionSchema = z
  .object({
    goto: z.string(),
    end: z.boolean().optional()
  })
  .and(z.record(z.string()))
  .refine(
    data => {
      const operators = Object.keys(data).filter(key => ConditionOperators.includes(key));

      return operators.length === 1;
    },

    { message: ParserErrorMessage.condition }
  );

const QuestionSchema = z.object({
  id: z.string().min(1, { message: ParserErrorMessage.question }),
  multiselect: z.boolean().optional(),
  question: z
    .string({ message: ParserErrorMessage.question })
    .min(3, { message: ParserErrorMessage.question }),
  answer: z.array(AnswerSchema).min(1, { message: ParserErrorMessage.answer }),
  conditions: z.array(ConditionSchema).min(1, { message: ParserErrorMessage.condition }).optional()
});

export type SurveyQuestion = z.infer<typeof QuestionSchema>;

const SurveySchema = z
  .object({
    title: z.string({ message: ParserErrorMessage.title }).min(3, { message: ParserErrorMessage.title }),
    questions: z.array(QuestionSchema)
  })
  .refine(
    data => {
      // TODO - must goto statement for options
      // TODO - must goto statement for user input string option
      //TODO -  condition statement only allowed for user input number
      // TODO - condition check only against number
      // TODO - must goto statement for conditions (number input)
      // TODO - multi select options should have same goto route
      // TODO - goto and end statements should not co-exists
      // TODO - question name should not be equal "end"

      // match all goto routes
      const gotoStatements: string[] = [];

      for (const question of data.questions) {
        // find goto in answers
        question.answer.forEach(ans => {
          if (ans.goto) {
            gotoStatements.push(ans.goto);
          }
        });
        // find goto in conditions
        question.conditions?.forEach(c => {
          if (c.goto) {
            gotoStatements.push(c.goto);
          }
          // TODO - match conditional statements for (string and array data.questions type)
        });
      }

      const matchedStatements = data.questions.filter(q => gotoStatements.includes(q.id));

      if (matchedStatements.length === gotoStatements.length) {
        return true;
      } else {
        return false;
      }
    },
    { message: ParserErrorMessage.goto }
  );

export type SurveyData = z.infer<typeof SurveySchema>;

export const useSurveyParser = () => {
  const praseSurveyJSON = (surveyData: JSON): [SurveyData | null, string[] | null] => {
    const res = SurveySchema.safeParse(surveyData);

    if (res.success) {
      console.log('parsed success ✅', res.data);
      return [res.data, null];
    } else {
      console.log('parsed failed ❌', res.error.issues);

      // get all errors/issues
      let issues = res.error.issues.map(err => err.message);
      // remove duplicate issues
      issues = [...new Set(issues)].splice(0, 3);
      return [null, issues];
    }
  };
  return { praseSurveyJSON };
};
