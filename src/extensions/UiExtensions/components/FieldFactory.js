import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@contentful/forma-36-react-components';
import FieldProperty from './FieldProperty';

const FieldFactory = ({sdk}) => {
  const [fieldValue, setFieldValue] = useState({});

  return (
    <div>
      <FieldProperty sdk={sdk} />
      <Button
        buttonType="positive"
        isFullWidth={false}
        loading={false}
        onClick={() => {}}
        testId="cf-ui-button"
        type="button">
        +
      </Button>
    </div>
  );
};

FieldFactory.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired
    })
  }).isRequired
};

export default FieldFactory;