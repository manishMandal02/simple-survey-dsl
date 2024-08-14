import { Token, BaseValueType, ISurvey, IQuestion } from '../../types/parser.types';

const tokenize = (input: string): Token[] => {
  const tokens: Token[] = [];
  let position = 0;

  while (position < input.length) {
    const char = input[position];

    if (char === '{') {
      tokens.push({ type: 'LEFT_CURLY_BRACKET', value: '{' });
      position++;
    } else if (char === '}') {
      tokens.push({ type: 'RIGHT_CURLY_BRACKET', value: '}' });
      position++;
    } else if (char === '[') {
      tokens.push({ type: 'LEFT_SQUARE_BRACKET', value: '[' });
      position++;
    } else if (char === ']') {
      tokens.push({ type: 'RIGHT_SQUARE_BRACKET', value: ']' });
      position++;
    } else if (char === ':') {
      tokens.push({ type: 'COLON', value: ':' });
      position++;
    } else if (char === ',') {
      tokens.push({ type: 'COMMA', value: ',' });
      position++;
    } else if (char === '"') {
      // string
      let value = '';
      position++;
      while (input[position] !== '"') {
        value += input[position];
        position++;
      }
      tokens.push({ type: 'STRING', value });
      position++;
    } else if (/[0-9]/.test(char)) {
      // number
      let value = '';
      while (/[0-9.]/.test(input[position])) {
        value += input[position];
        position++;
      }
      tokens.push({ type: 'NUMBER', value });
    } else if (char === 't' || char === 'f') {
      // boolean
      const value = input.slice(position, position + 4);
      if (value === 'true' || value === 'false') {
        tokens.push({ type: 'BOOLEAN', value });
        position += value.length;
      } else {
        throw new Error(`Unexpected character at position ${position}`);
      }
    } else if (char === 'n') {
      // null
      const value = input.slice(position, position + 4);
      if (value === 'null') {
        tokens.push({ type: 'NULL', value });
        position += 4;
      } else {
        throw new Error(`Unexpected character at position ${position}`);
      }
    } else if (/\s/.test(char)) {
      // empty space
      position++;
    } else {
      throw new Error(`Unexpected character at position ${position}`);
    }
  }

  return tokens;
};

const parse = (tokens: Token[]): ISurvey => {
  let currentPos = 0;

  const getCurrentToken = () => tokens[currentPos];

  const consume = (type: string, expectedType?: string): Token => {
    if (getCurrentToken().type === type) {
      return tokens[currentPos++];
    }

    throw new Error(`Expected ${expectedType}`);
  };

  const parseSurvey = (): ISurvey => {
    consume('LEFT_CURLY_BRACKET', '{');
    const title = parseKeyValuePair('title');
    consume('COMMA', ',');
    const questions = parseKeyValuePair('questions');
    consume('RIGHT_CURLY_BRACKET', '}');

    if (typeof title !== 'string') {
      throw new Error('Title must be a valid string');
    }

    if (!Array.isArray(questions)) {
      throw new Error('Questions must be an array');
    }

    const survey: ISurvey = {
      title,
      questions: questions as IQuestion[]
    };

    return survey;
  };

  const parseKeyValuePair = (expectedKey: string): BaseValueType => {
    const key = consume('STRING', `"${expectedKey}"`).value;

    if (key !== expectedKey) {
      throw new Error(`key "${expectedKey}", got "${key}"`);
    }
    consume('COLON', ':');
    return parseValue();
  };

  const parseValue = () => {
    const token = getCurrentToken().type;
    switch (token) {
      case 'STRING':
        return consume('STRING', 'string').value;
      case 'NUMBER':
        return parseFloat(consume('NUMBER', 'number').value);
      case 'BOOLEAN':
        return consume('BOOLEAN', 'boolean').value === 'true';
      case 'NULL':
        consume('NULL', 'null');
        return null;
      case 'LEFT_CURLY_BRACKET':
        return parseObject();
      case 'LEFT_SQUARE_BRACKET':
        return parseArray();
      default:
        throw new Error(`Unexpected token: ${token}`);
    }
  };

  const parseObject = () => {
    const obj: Record<string, unknown> = {};

    consume('LEFT_CURLY_BRACKET', '{');

    while (getCurrentToken().type !== 'RIGHT_CURLY_BRACKET') {
      const key = consume('STRING', 'string').value;
      consume('COLON', ':');
      obj[key] = parseValue();
      if (getCurrentToken().type === 'COMMA') {
        consume('COMMA', ',');
      }
    }

    consume('RIGHT_CURLY_BRACKET', '}');
    return obj;
  };

  const parseArray = () => {
    const arr: unknown[] = [];
    consume('LEFT_SQUARE_BRACKET', '[');
    while (getCurrentToken().type !== 'RIGHT_SQUARE_BRACKET') {
      arr.push(parseValue());
      if (getCurrentToken().type === 'COMMA') {
        consume('COMMA', ',');
      }
    }
    consume('RIGHT_SQUARE_BRACKET', ']');
    return arr;
  };

  return parseSurvey();
};

const validateSurvey = (survey: ISurvey) => {
  const questionIds = new Set<string>();

  // validate question's id and name
  for (const question of survey.questions) {
    if (questionIds.has(question.id)) {
      throw new Error(`Duplicate question id: ${question.id}`);
    }
    questionIds.add(question.id);

    if (question.id === 'end') {
      throw new Error('Question id should not be equal to "end"');
    }
  }

  // validate each question
  for (const question of survey.questions) {
    // check: answer rules
    for (const answer of question.answer) {
      if (answer.goto) {
        if (!questionIds.has(answer.goto)) {
          throw new Error(`Invalid goto: ${answer.goto} in question ${question.id}`);
        }
        if (answer.goto === question.id) {
          throw new Error(`Self-referencing goto in question: ${question.id}`);
        }
      }

      if (answer.goto && answer.end) {
        throw new Error(`Route statements should not co-exist in answer: ${question.id}`);
      }
      if (!['option', 'number', 'string'].includes(answer.type)) {
        throw new Error(
          `Answer type in answer ${answer.id} must be either "number", "string" or "option" in question ${question.id}`
        );
      }

      if (answer.type === 'option' && !answer.goto && !answer.end) {
        throw new Error(`Option type in answer ${answer.id} must have route in question ${question.id}`);
      }

      if (answer.type === 'string' && !answer.goto && !answer.end) {
        throw new Error(`String type in answer ${answer.id} must have route in question ${question.id}`);
      }
    }

    // check: multiselect rule
    if (question.multiselect) {
      const gotoRoutes = new Set<string | undefined>();
      let hasEnd = false;
      for (const answer of question.answer) {
        if (answer.goto) gotoRoutes.add(answer.goto);
        if (answer.end) hasEnd = true;
      }

      if (gotoRoutes.size > 1 || (gotoRoutes.size > 0 && hasEnd)) {
        throw new Error(`Multi-select options should have same route statement in question: ${question.id}`);
      }
    }

    // check: condition's rules
    if (question.conditions?.length > 0) {
      for (const answer of question.answer) {
        if (answer.goto || answer.end) {
          throw new Error(
            `Questions with conditional statements must not have route statement in options/answer: ${question.id}`
          );
        }
      }
      for (const condition of question.conditions) {
        if (condition.goto && !questionIds.has(condition.goto)) {
          throw new Error(`Invalid goto ${condition.goto} in condition of question: ${question.id}`);
        }
        if (!condition.goto && !condition.end) {
          throw new Error(`Must have a route in condition of question: ${question.id}`);
        }

        if (condition.goto && condition.end) {
          throw new Error(
            `goto and end statements should not co-exist in condition of question: ${question.id}`
          );
        }
      }
    }
  }
};

export const useRecursiveParse = () => {
  // recursive parser
  const recursiveParser = (surveyData: string): [ISurvey | null, string | null] => {
    const tokens = tokenize(surveyData);

    try {
      const parsedSurvey = parse(tokens);

      // validate the parsed survey data
      // throws error for invalid rules
      validateSurvey(parsedSurvey);

      return [parsedSurvey, null];
    } catch (err) {
      return [null, (err as Error).message];
    }
  };

  return { recursiveParser };
};
