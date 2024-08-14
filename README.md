### Simple Survey DSL

Sample JSON survey file => [public/sample-survey.json](https://github.com/manishMandal02/simple-survey-dsl/blob/main/public/sample-survey.json)

### Parser Rules

---

- All `goto` statements must route to a valid question id
- Question `id` should not be equal to `end`
- `goto` statements should not route to self (question)
- `route` statements should not co-exists in
- Must `route` statement for conditions
- Must `route` statement for option type as `string`
- Must `route` `(goto/end)` statement for options with option type as `option`
- Condition statement only allowed for option type as `number`
- `Multi-select` options should have either `route` statements
- Questions with `conditional statements` must not have route statement in options/answer

### Types

---

- Survey (root)

```ts
{
  title: string;
  questions: Question[];
}
```

- Question

```ts
      {
        id: string;
        multiselect?: boolean;
        question: string;
        answer: Answer[];
        conditions: Condition[];
      }
```

- Answer

```ts
{
  id: string;
  label: string;
  goto?: string;
  end?: boolean;
  type: 'option' | 'number' | 'string';
}
```

- Condition

```ts
{
  [key in 'gt' | 'gte'|'lt'| 'lte'|'eq']: string;
  goto?: string;
  end?: boolean
}
```

### Run app locally

---

```bash
git clone manishMandal02/simple-survey-dsl
cd simple-survey-dsl
pnpm install
pnpm run dev
```

### How to use web app?

---

1. Go to [simple-survey-dsl.vercel.app](https://simple-survey-dsl.vercel.app/)
2. Write a json that implements all the rules and types.
3. Parse the json
4. Take your survey

### Tech

---

- core: `React + Vite + Typescript + Tailwind CSS`
- others:
  - `zod` used for building a zod parser
  - `@mantine/core` used for text area with json support
  - `clsx` + `tailwind-merge` to merge tailwind classes and better readability
  -

### Folder Structure

---

```
└── 📁 simple-survey-dsl
    └── 📁 public
            └── sample-survey.json
    └── src
        └── 📁 components
            └── 📁 home        # home/index page
            └── 📁 survey-view
                └── 📁 question  # components for question
                └── useSurvey.ts  # logics for response, routing, etc.
                └── SurveyResult.tsx  # survey result
                └── SurveyView.tsx  # entry point t survey UI
            └── 📁 survey-json
                └── SurveyJSON.tsx  # json textarea UI
                └── useZodParser.ts  # zod parser
                └── useRecursiveParser.ts  # recursive descent parser
        └── 📁 utils
            └── cn.ts
            └── validate-json.ts
            └── parse-json-file.ts

        └── App.tsx # entry point

```

<hr style="height:3px; border:none; background-color:#2e2e2e;" />

> [manishmandal.com](https://manishmandal.com) • <span style="opacity:0.6;">GitHub </span> [@manishMandal02](https://github.com/manishMandal02) • <span style="opacity:0.6;">X</span> [@manishMandalJ](https://twitter.com/manishMandalJ) • [LinkedIn](https://www.linkedin.com/in/manish-mandal/)
