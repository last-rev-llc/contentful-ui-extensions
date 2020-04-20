import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Button, TextInput } from '@contentful/forma-36-react-components';
import PropTypes from 'prop-types';

function HelloJustin({ sdk }) {
  
  const jsonValues = [];
  const jsonNames = [];
  const jsonObjects = [];
  // const [fields, setFields] = useState([]);
  // const values = [...fields];
  const [fieldValue, setFieldValue] = useState({});
  

  // Sets the intial state value on component load to the Contentful value
  useEffect(() => {
    if(sdk.field.getValue()) {
      setFieldValue(sdk.field.getValue());
    }
  }, [sdk.field]);

  const setJsonObject = (id) => {
    const name = document.getElementById(`${id}-name`).value;
    const {value} = document.getElementById(`${id}-value`);
    const newValue = {
      ...fieldValue,
      [name]: value,
    };
    sdk.field.setValue(newValue);
    setFieldValue(newValue);
  };
  

  const renderRow = (id, key) => {
    let objectValue = '';
    if(key) {
      objectValue = fieldValue[key];
    }
    return (
      <div id="row">
        <TextInput
          id={`${id}-name`}
          name={key}
          type='text'
          placeholder="Name"
          value={key}/>
        <TextInput
          id={`${id}-value`}
          name={objectValue}
          type='text'
          placeholder="Value"
          value={objectValue || ''}/>
        {(id === 0) ? 
          <Button
            buttonType="primary"
            isFullWidth={false}
            loading={false}
            onClick={() => setJsonObject(id)}
            testId="cf-ui-button"
            type="button">
    +
          </Button> : null
        }
        
      </div>
    );
  };
  
  return (
    <>
      {renderRow(0)}
      {_.keys(fieldValue).map((key, i) => renderRow(i+1, key))}
    </>
  );
  
};


HelloJustin.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired
    }),
  }).isRequired
};

export default HelloJustin;

