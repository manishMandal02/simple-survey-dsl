### Simple Survey DSL

#### Sample JSON

```json
[
  {
    "id": "name",
    "question": "What is your age?",
    "answer": [
      {
        "id": "age",
        "type": "number",
        "label": "25"
      }
    ],
    "conditions": [
      {
        "gte": "18",
        "goto": "ai-usage"
      },
      {
        "lt": "18",
        "goto": "student"
      }
    ]
  },
  {
    "id": "ai-usage",
    "question": "Does your company use AI for market research?",
    "multiselect": true,
    "answer": [
      {
        "id": "yes",
        "type": "option",
        "label": "Yes",
        "goto": "ai-apps"
      },
      {
        "id": "no",
        "type": "option",
        "label": "No",
        "end": "true"
      }
    ]
  }
]
```
