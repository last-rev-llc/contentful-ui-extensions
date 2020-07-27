# Last Rev: RecipeSteps

The Last Rev RecipeSteps extension can be used to create an array of JSON objects consisting of a title and a body. You can add, edit, and/or delete as many JSON objects as you would like.

## Setup Instructions

1. [Click here to deploy](https://app.netlify.com/start/deploy?repository=https://github.com/last-rev-llc/contentful-ui-extensions) to Netlify or deploy this repo to a hosting provider of your choice.
2. Create a new UI Extension in your space and choose these following Options:
    - Name: RecipeSteps
    - Field Types: Object
    - Hosting: Self-hosted(src)
    - Self-Hosted URL: [https://your-extension-domain.netlify.com/recipe-steps](https://your-extension-domain.netlify.com/recipe-steps)
3. Create an Object (JSON) field in your content model where you want to use the RecipeSteps field
4. On the Content Model page, select "Settings" on the new JSON field you added
5. Go to Appearance and select your new UI Extension

## Output Example

```json
[
  {
    "id": 1,
    "title": "Step 1",
    "body": "Step 1"
  }, 
  {
    "id": 2,
    "title": "Step 2",
    "body": "Step 2"
  },
]
```

## Reporting Issues

If you find any bugs or want to suggest a feature, please submit them on the Github repo Issues tab. Thanks!
