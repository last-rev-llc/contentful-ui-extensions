import React, { useState, useEffect } from "react";
import cx from "classnames";
import {
  TextField,
  HelpText,
  Select as ContentfulSelect,
  Option
} from "@contentful/forma-36-react-components";

import PropTypes from "prop-types";
import styles from "./DynamicFields.module.scss";

function ErrorText({ children }) {
  if (!children) return null;

  return (
    <span className={styles.errorText}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
      {children}
    </span>
  );
}

function ContentSection({ children, hasError, title, about, name, required }) {
  return (
    <div className={cx(styles.contentSection, { [styles.hasError]: hasError })}>
      {title && <label>{title}</label>}
      {required && <label className={styles.required}>(required)</label>}
      {children}
      <HelpText className={styles.helpText}>{about}</HelpText>
    </div>
  );
}

function Text({ about, title, name, onChange, values, maxLen, ...extraProps }) {
  const currentValue = values[name] || "";

  let errorText = false;
  if (currentValue.length > 256) {
    errorText = "Please shorten the text so it's no longer than 256 characters";
  }

  return (
    <ContentSection hasError={errorText} about={about}>
      <TextField
        id={name}
        key={name}
        name={name}
        value={currentValue}
        labelText={title}
        textInputProps={{ onChange }}
        {...extraProps}
      />
      <p className={styles.validationPrompt}>
        <span>{currentValue.length} characters</span>
        <span>Maximum 256 characters</span>
      </p>
      <ErrorText>{errorText}</ErrorText>
    </ContentSection>
  );
}

function Select({
  about,
  name,
  onChange,
  values,
  options = [],
  ...extraProps
}) {
  return (
    <ContentSection about={about}>
      <ContentfulSelect
        id="optionSelect"
        name="optionSelect"
        onChange={onChange}
        value={values[name]}
        {...extraProps}
      >
        {options.map(({ value, label = value }) => (
          <Option key={value} value={value} onClick={onChange}>
            {label}
          </Option>
        ))}
      </ContentfulSelect>
    </ContentSection>
  );
}

function DynamicFields({ sdk }) {
  const [fieldValues, setFieldValues] = useState({});

  useEffect(() => {
    if (sdk.field.getValue()) {
      setFieldValues(sdk.field.getValue());
    } else {
      setFieldValues({});
    }
  }, [sdk.field]);

  const handleFieldChange = fieldName => e => {
    fieldValues[fieldName] = e.currentTarget.value;

    sdk.field.setValue(fieldValues);

    // Copy values to ensure we render again
    setFieldValues({ ...fieldValues });
  };

  return (
    <div>
      <Text
        required
        name="internalTitle"
        title="Internal title"
        about="To help reference this page within Contentful."
        values={fieldValues}
        onChange={handleFieldChange("internalTitle")}
      />
      <Text
        name="linkText"
        about="The text to be displayed."
        title="Link text"
        values={fieldValues}
        onChange={handleFieldChange("linkText")}
      />
      <Select
        name="action"
        values={fieldValues}
        required
        title="Action"
        about="What will this CTA do?"
        onChange={handleFieldChange("action")}
        options={[
          { value: "window_same", label: "Open in same window" },
          { value: "window_new", label: "Open in a new window" },
          { value: "window_modal", label: "Open in a modal" },
          { value: "download", label: "Download content" }
        ]}
      />
      <Select
        required
        title="Destination type"
        about="What content does the link point to?"
        name="destination"
        values={fieldValues}
        onChange={handleFieldChange("destination")}
        options={[
          { value: "manual_text", label: "Manual text entry" },
          { value: "reference_content", label: "Content reference" },
          { value: "reference_asset", label: "Asset reference" }
        ]}
      />
      {fieldValues.destination === "manual_text" && (
        <Text
          required
          title="Manual url input"
          about="If the CTA links to page outside of the impossiblfoods.com domain, please specify the entire URL here."
          name="manualUrl"
          values={fieldValues}
          onChange={handleFieldChange("manualUrl")}
        />
      )}
      <Select
        required
        title="Target"
        sabout="How should the browser open the link destination? _blank = opens the link in a new window _self = opens the link content in the same frame as the link _parent = opens the link content in the parent frame of the link _top = opens the link in the full body of the window"
        name="target"
        values={fieldValues}
        onChange={handleFieldChange("target")}
        options={[
          { value: "_blank" },
          { value: "_parent" },
          { value: "_self" },
          { value: "_top" }
        ]}
      />
    </div>
  );
}

DynamicFields.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired
    })
  }).isRequired
};

export default DynamicFields;
