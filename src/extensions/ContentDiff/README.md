# Last Rev: Content Diff

The Last Rev Content Diff extension can be used to show changes between content model versions one level deep in certain field types.

Working Field Types:
RichText,
Symbol,
Array,
Text,
Link

Non-Working Field Types:
Object

## Setup Instructions

1. [Click here to deploy](https://app.netlify.com/start/deploy?repository=https://github.com/last-rev-llc/contentful-ui-extensions) to Netlify or deploy this repo to a hosting provider of your choice.
2. Create a new UI Extension in your space and choose these following Options:
    - Name: Content Diff
    - Field Types: Object
    - Hosting: Self-hosted(src)
    - Self-Hosted URL: [https://your-extension-domain.netlify.com/seo](https://your-extension-domain.netlify.com/content-diff)
3. Go to an existing content model and select the Sidebar tab
4. On the Sidebar configuration page, select "Use custom sidebar" and add the Content Diff UI Extension

## Reporting Issues

If you find any bugs or want to suggest a feature, please submit them on the Github repo Issues tab. Thanks!
