import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FieldFactory from './FieldFactory';
import FieldList from './FieldList';

const mockData = {
  "headerRegistrationSuccessful": "Registration Successful Header",
  "headerRegisteredLiveCourses": "Registered Live Courses",
  "headerEnterRegistrationInfo": "Enter Registration Info",
  "headerRegistrationSuccessful": "Registration Successful",
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
};
const UiExtensions = ({ sdk }) => {
  const [jsonObject, setJsonObject] = useState({});
  const [nameField, setNameField] = useState('');
  const [valueField, setValueField] = useState('');

  // sdk.field.setValue({});
  // Sets the intial state value on component load to the Contentful value
  useEffect(() => {
    if(sdk.field.getValue()) {
      setJsonObject(sdk.field.getValue());
    }
  }, [sdk.field]);

  const addProperty = (name, value) => {
    const newValue = {
      ...jsonObject,
      [name]: value
    };
    sdk.field.setValue(newValue);
    setJsonObject(newValue);
  };

  const onNameChange = event => {
    setNameField(event.currentTarget.value);
  };

  const onValueChange = event => {
    setValueField(event.currentTarget.value);
  };

  return (
    <>
      <FieldFactory 
        nameField={nameField}
        valueField={valueField}
        onNameChange={onNameChange}
        onValueChange={onValueChange}
        addProperty={addProperty} />
      <FieldList 
        sdk={sdk}
        jsonObject={jsonObject}
        setJsonObject={setJsonObject} />
    </>
  );
  
};

UiExtensions.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired
    }),
  }).isRequired
};

export default UiExtensions;

