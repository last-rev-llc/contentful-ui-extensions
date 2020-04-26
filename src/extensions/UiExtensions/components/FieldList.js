import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import FieldItem from './FieldItem';

const FieldList = ({ jsonObject }) => {
  console.log(jsonObject);
  const renderedList = _.keys(jsonObject).map((key, id) => {
    let fieldValue = '';

    if (key) {
      fieldValue = jsonObject[key];
    }
    return (
      <div id="row">
        <FieldItem 
          nameField={key} 
          valueField={fieldValue || ''} />
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
  jsonObject: PropTypes.object.isRequired
};

export default FieldList;