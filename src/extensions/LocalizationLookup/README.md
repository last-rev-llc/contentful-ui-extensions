# Last Rev: LocalizationLookup

The Last Rev LocalizationLookup extension can be used to create a simple JSON object. You can add, edit, and/or delete as many JSON fields as you would like.

## Setup Instructions

1. [Click here to deploy](https://app.netlify.com/start/deploy?repository=https://github.com/last-rev-llc/contentful-ui-extensions) to Netlify or deploy this repo to a hosting provider of your choice.
2. Create a new UI Extension in your space and choose these following Options:
    - Name: LocalizationLookup
    - Field Types: Object
    - Hosting: Self-hosted(src)
    - Self-Hosted URL: [https://your-extension-domain.netlify.com/localizationLookup](https://your-extension-domain.netlify.com/localizationLookup)
3. Create an Object (JSON) field in your content model where you want to use the LocalizationLookup field
4. On the Content Model page, select "Settings" on the new JSON field you added
5. Go to Appearance and select your new UI Extension

## Output Example

```json
{
  "headerRegistrationSuccessful": "Registration Successful Header",
  "headerRegisteredLiveCourses": "Registered Live Courses",
  "headerEnterRegistrationInfo": "Enter Registration Info",
  "headerAccountInfo": "Account Info",
  "headerEventDescription": "Event Description",
  "headerLiveCourseHighlightsHeader": "This virtual instructor-led class will help you:",
  "headerDuration": "Duration",
  "headerPersonalInfo": "Personal Info",
  "headerSuggestedTopics": "Suggested Topics",
  "breadcrumbTextRegistration": "Registration",
  "formInputLabelPickLanguage": "Pick your language",
  "formInputLabelSelectTime": "Select a Time",
  "formInputLabelSelectDate": "Select a Date",
  "formInputLabelFirstName": "First Name",
  "formInputLabelLastName": "Last Name",
  "formInputLabelEmail": "Email",
  "accountLabelFirst": "First",
  "accountLabelLast": "Last",
  "accountLabelEmail": "Email",
  "formInputLabelAttendee": "Attendee",
  "formInputLabelSelectDateBreadcrumb": "Select Date Breadcrumb",
  "formInputLabelCourse": "Course",
  "formInputLabelDate": "Date",
  "formInputLabelSessionLink": "Session Link",
  "formInputLabelGeneralRegistration": "General Registration",
  "ctaTextCompleteRegistration": "Complete Registration",
  "ctaTextReschedule": "Reschedule",
  "ctaTextCancelClass": "Cancel Class",
  "ctaTextRegister": "Register",
  "ctaTextSignIn": "Sign In",
  "ctaTextProfile": "Profile",
  "ctaTextLogout": "Logout",
  "ctaTextBack": "Back",
  "globalTextCopyright": "Copyright Text",
  "textMinutes": "minutes"
}
```

## Reporting Issues

If you find any bugs or want to suggest a feature, please submit them on the Github repo Issues tab. Thanks!
