import React from 'react';
import _ from 'lodash';

const updateJson = (json, name, value) => {
  return {
    ...json,
    [name]: value
  };
};

const getError = (error, message, position) => {
  return error ? (
    <div 
      className="alert alert-danger"
      data-test-id={`error-${position}`}>
      {message}
    </div>
  ) : null;
};

const hasDuplicate = (jsonObject, newName, oldName) => {
  return _.keys(jsonObject)
    .filter(key => key !== oldName)
    .some(key => newName.toUpperCase() === key.toUpperCase());
};

export {
  updateJson,
  getError,
  hasDuplicate
};
