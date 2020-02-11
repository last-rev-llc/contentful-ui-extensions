# Last Rev: ColorPicker
The Last Rev Color Picker extension can be used anytime you want to give your users a finite list of colors to chose from. This can help to enforce brand guidelines while giving your content creators the ability to choose different colors. It uses the field validation options to disply the colors available

## Setup Instructions
1. [Click here to deploy](https://app.netlify.com/start/deploy?repository=https://github.com/last-rev-llc/contentful-ui-extensions) to Netlify or deploy this repo to a hosting provider of your choice. 
2. Create a new UI Extension in your space and choose thos following Options:
    - Name: Color Picker
    - Field Types: Symbol
    - Hosting: Self-hosted(src)
    - Self-Hosted URL: https://your-extension-domain.netlify.com/color-picker
3. Create a text field in your content model you want to use the color picker field
4. On the Content Model page, select "Settings" on the new text field you added
5. Go to Appearance and select your new UI Extension
6. Go to the Validations tab and select "Accept only specified values" and enter each color HEX value you want to allow. Be sure to include the # e.g. #FFFFFF or #000000


## Reporting Issues
If you find any bugs or want to suggest a feature, please submit them on the Github repo Issues tab. Thanks!