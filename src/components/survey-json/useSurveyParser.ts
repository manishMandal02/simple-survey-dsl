import { z } from 'zod';

const AnswerTypes = ['option', 'number', 'string'] as const;

export const ParserErrorMessage = {
  goto: 'Invalid goto route or missing route to a question',
  condition: 'Invalid condition',
  question: 'Invalid question',
  answer: 'Invalid answer',
  title: 'Invalid title'
};

const AnswerSchema = z
  .object({
    id: z.string().min(1, { message: ParserErrorMessage.answer }),
    type: z.enum(AnswerTypes, { message: 'Invalid answer type' }),
    label: z.string(),
    goto: z.string().optional(),
    end: z.boolean().optional()
  })
  .refine(
    data => {
      // checks that a goto or an end statement is added to each option or user input (string)
      const hasRouteStatement = data?.goto || data?.end;

      if (data.type === 'option' || data.type === 'string') {
        if (!hasRouteStatement) {
          return false;
        }
      }

      // goto/end should not co-exists
      if (data?.goto && data?.end) {
        return false;
      }

      return true;
    },
    { message: ParserErrorMessage.answer }
  );

export const ConditionOperators = ['lt', 'lte', 'gt', 'gte', 'eq'];

const ConditionSchema = z
  .object({
    goto: z.string().optional(),
    end: z.boolean().optional()
  })
  .and(z.record(z.string(), z.string().or(z.boolean())))
  .refine(
    data => {
      const keys = Object.keys(data);
      // checks that 1 conditional operator is used
      const operators = keys.filter(key => ConditionOperators.includes(key));
      // must goto/end statement per conditions
      const hasRouteStatement = keys.includes('goto') || keys.includes('end');

      // goto/end should not co-exists
      if (keys.includes('goto') && keys.includes('end')) {
        return false;
      }

      return operators.length === 1 && hasRouteStatement;
    },

    { message: ParserErrorMessage.condition }
  );

const QuestionSchema = z
  .object({
    id: z
      .string()
      .min(1, { message: ParserErrorMessage.question })
      .refine(id => id !== 'end', { message: ParserErrorMessage.question }),
    multiselect: z.boolean().optional(),
    question: z
      .string({ message: ParserErrorMessage.question })
      .min(3, { message: ParserErrorMessage.question }),
    answer: z.array(AnswerSchema).min(1, { message: ParserErrorMessage.answer }),

    conditions: z.array(ConditionSchema).min(1, { message: ParserErrorMessage.condition }).optional()
  })
  .refine(
    data => {
      // checks that goto does not route to self question
      const allGOTO: string[] = [];

      data.answer.forEach(ans => {
        if (!ans.goto) return;
        allGOTO.push(ans.goto);
      });
      data.conditions?.forEach(cnd => {
        if (!cnd.goto) return;

        allGOTO.push(cnd.goto);
      });

      return !allGOTO.includes(data.id);
    },
    { message: ParserErrorMessage.goto }
  )
  .refine(
    data => {
      // checks that condition statements are only added to user input type number
      if (data?.conditions && data.answer[0].type !== 'number') {
        return false;
      }

      // making sure questions with conditional statement do not have route statement in answer
      if (data.conditions) {
        for (const ans of data.answer) {
          if (ans.goto || ans.end) {
            return false;
          }
        }
      }

      return true;
    },
    {
      message: ParserErrorMessage.condition
    }
  )

  .refine(
    data => {
      // checks that a multiselect questions have same route statement
      if (data.multiselect) {
        const allGOTO = data.answer.filter(ans => ans.goto)?.map(ans => ans.goto);

        console.log('🚀 ~ file: useSurveyParser.ts:99 ~ allGOTO:', allGOTO);

        const allEND = data.answer.filter(ans => ans.end);

        console.log('🚀 ~ file: useSurveyParser.ts:101 ~ allEND:', allEND);

        if (allGOTO.length !== data.answer.length && allEND.length !== data.answer.length) {
          return false;
        }

        // checks if all the goto statement are same
        if (allGOTO.length > 1 && allGOTO.some(v => v !== allGOTO[0])) {
          return false;
        }
      }

      return true;
    },
    { message: ParserErrorMessage.answer }
  );

export type SurveyQuestion = z.infer<typeof QuestionSchema>;

const SurveySchema = z
  .object({
    title: z.string({ message: ParserErrorMessage.title }).min(3, { message: ParserErrorMessage.title }),
    questions: z.array(QuestionSchema)
  })
  .refine(
    data => {
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
        });
      }

      const matchedStatements = data.questions.filter(q => gotoStatements.includes(q.id));

      console.log('🚀 ~ file: useSurveyParser.ts:149 ~ matchedStatements:', matchedStatements);

      if (
        matchedStatements.length === data.questions.length ||
        matchedStatements.length === data.questions.length - 1
      ) {
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
