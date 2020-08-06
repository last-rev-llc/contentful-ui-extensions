import React, {useState, useEffect } from "react";
import PropTypes from "prop-types";
import { get } from "lodash";

import { TextInput } from "@contentful/forma-36-react-components";
import "@contentful/forma-36-react-components/dist/styles.css";
import "./BynderImage.scss";

export function setIfEmpty(sdk, fieldId, value) {
  const field = sdk.entry.fields[fieldId];
  const currentValue = field.getValue();
  if (!currentValue || currentValue === "") {
    field.setValue(value);
  }
}

const BynderImage = ({ sdk }) => {
  const [value, setValue] = useState(sdk.field.getValue() || "");
  const {fields} = sdk.entry;

  const onBynderImageChange = useEffect(value => {
    if (!Array.isArray(value)) return;
    if (value.length === 0) {
      fields.bynderId.setValue("");
      fields.imageName.setValue("");
      fields.altText.setValue("");
    } else {
      const bynderData = get(value, "[0]", {});
      const description = get(bynderData, "description", "");
      const title = get(bynderData, "name", "");
      fields.bynderId.setValue(get(bynderData, "id", ""));
      fields.imageName.setValue(title);
      fields.altText.setValue(description);
      setIfEmpty(sdk, "internalTitle", title);
      setIfEmpty(sdk, "altTextOverride", description);
    }}, [value, fields.altText, fields.bynderId, fields.imageName,sdk]);


  const onExternalChange = value => {
    setValue(value);
  };

  const onChange = e => {
    const {value} = e.currentTarget;
    setValue(value);
    if (value) {
      sdk.field.setValue(value);
    } else {
      sdk.field.removeValue();
    }
  };

  useEffect(() => {
    sdk.window.startAutoResizer();
    const bynderField = get(sdk, 'entry.fields["bynderData"]', null);
    if (bynderField) {
      bynderField.onValueChanged(onBynderImageChange);
    }
    sdk.field.onValueChanged(onExternalChange);
  }, [sdk,onBynderImageChange]);

  return (
    <>
      <TextInput
        width="large"
        type="text"
        id="bynderImageId"
        data-testid="bynderImageTestId"
        value={value}
        onChange={onChange}/>
    </>
  );
};

BynderImage.propTypes = {
  sdk: PropTypes.object.isRequired
};

// init(sdk => {
//   ReactDOM.render(<BynderImage sdk={sdk} />, document.getElementById("root"));
// });

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }

export default BynderImage;
