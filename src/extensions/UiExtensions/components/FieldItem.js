import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@contentful/forma-36-react-components';
import FieldProperty from './FieldProperty';

const FieldItem = ({ sdk }) => {
  
  const [fieldValue, setFieldValue] = useState(null);
  // Sets the intial state value on component load to the Contentful value
  // useEffect(() => {
  //   if(sdk.field.getValue()) {
  //     setFieldValue(sdk.field.getValue());
  //   }
  // }, [sdk.field]);

  return (
    <div>
      <Button
        buttonType="negative"
        isFullWidth={false}
        loading={false}
        onClick={() => {}}
        testId="cf-ui-button"
        type="button">
        -
      </Button>
      <Button
        buttonType="primary"
        isFullWidth={false}
        loading={false}
        onClick={() => {}}
        testId="cf-ui-button"
        type="button">
        Edit
      </Button>
      <FieldProperty sdk={sdk} />
    </div>
  );
};

FieldItem.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired
    }),
  }).isRequired
};

export default FieldItem;