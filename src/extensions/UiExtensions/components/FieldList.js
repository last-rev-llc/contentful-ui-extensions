import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import FieldItem from './FieldItem';

const FieldList = ({ sdk, jsonObject, setJsonObject }) => {
  console.log(sdk);
  console.log(jsonObject);

  const fieldItem = (key, fieldValue) => { 
    return (
      <FieldItem 
        sdk={sdk}
        jsonObject={jsonObject}
        setJsonObject={setJsonObject}
        nameField={key} 
        valueField={fieldValue || ''} />
    );
  };

  // const onDelete = name => {
  //   const newObject = _.omit(jsonObject, [name]);
  //   console.log('new object');
  //   console.log(newObject);

  //   sdk.field.setValue(newObject);
  //   console.log('sdk');
  //   console.log(sdk.field.getValue());

  //   setJsonObject(newObject);
  //   console.log('json object');
  //   console.log(jsonObject);
  // };

  const renderedList = _.keys(jsonObject).map((key, id) => {
    let fieldValue = '';

    if (key) {
      fieldValue = jsonObject[key];
    }
    const divKey = id;

    return (
      <div 
        id="row" 
        key={divKey}>
        {fieldItem(key, fieldValue)}
      </div>
    );
  });

  return (
    <>
      {renderedList}
    </>
  );
};

FieldList.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired
    }),
  }).isRequired,
  jsonObject: PropTypes.object.isRequired,
  setJsonObject: PropTypes.func.isRequired
};

export default FieldList;