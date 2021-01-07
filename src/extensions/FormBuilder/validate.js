/* eslint-disable no-unused-vars */

import { curry, filter, flatten, identity, isEmpty, map, merge, negate, pipe, pickBy } from 'lodash/fp';

/** Types of error that can be generated by this validator */
export const errorTypes = {
  CONFLICT_NAME: 'NAME_CONFLICT',
  UNDEFINED_NAME: 'NAME_UNDEFINED',
  UNDEFINED_TYPE: 'UNDEFINED_TYPE',
  UNDEFINED_ID: 'UNDEFINED_ID',
  INVALID_VALUE: 'INVALID_VALUE'
};

export const errorLevels = {
  WARN: 'WARN',
  ERROR: 'ERROR'
};

/** Levels for each type of error above, allows later filtering of levels */
const errorLevelsMapping = {
  [errorTypes.CONFLICT_NAME]: errorLevels.WARN,
  [errorTypes.INVALID_VALUE]: errorLevels.ERROR,
  [errorTypes.UNDEFINED_NAME]: errorLevels.ERROR,
  [errorTypes.UNDEFINED_TYPE]: errorLevels.ERROR,
  [errorTypes.UNDEFINED_ID]: errorLevels.ERROR
};

function stepError(extra = {}) {
  return { itemType: 'step', ...extra };
}

function fieldError(extra = {}) {
  return { itemType: 'field', ...extra };
}

/**
 * Validate a single field by missing or incorrect properties
 * */
function validateField(field) {
  const toReturn = [];
  const { id, name, stepId } = field;

  // All fields must have a name
  if (!id) {
    toReturn.push(
      fieldError({
        name,
        stepId,
        id: null,
        type: errorTypes.UNDEFINED_ID,
        message: 'Fields require an id'
      })
    );
  }

  // All fields must have a name
  if (!field.name) {
    toReturn.push(
      fieldError({
        id,
        stepId,
        type: errorTypes.UNDEFINED_NAME,
        message: 'Fields require a name'
      })
    );
  }

  // All fields must have a type
  if (!field.type) {
    toReturn.push(
      fieldError({
        id,
        stepId,
        type: errorTypes.UNDEFINED_TYPE,
        message: 'Fields require a type'
      })
    );
  }

  switch (field.type) {
    case 'hidden': {
      const { value } = field;
      if (value === undefined) {
        toReturn.push(
          fieldError({
            id,
            name,
            stepId,
            type: errorTypes.INVALID_VALUE,
            message: 'Hidden fields require a value'
          })
        );
      }
      break;
    }

    case 'select': {
      const { options = [] } = field;

      if (!options.length) {
        toReturn.push(
          fieldError({
            id,
            name,
            stepId,
            type: errorTypes.INVALID_VALUE,
            message: 'Select fields require at least 2 options'
          })
        );
      }
      break;
    }

    default:
      break;
  }

  return toReturn.filter(identity);
}

/**
 * Validate multiple fields based on default
 * criteria such as missing or incorrect fields
 * */
function validateFields(fields) {
  return flatten(fields.map((field) => validateField(field)));
}

/**
 * Return the number of fields which use the same
 * name between all of the steps
 *
 * { [field.name]: { count, ids: [...] } }
 * */
function getFieldNameCounts(steps) {
  const allFields = steps.reduce((acc, { fields = [] }) => acc.concat(fields), []);

  const fieldNames = [];

  allFields.forEach(({ id, name }) => {
    if (!fieldNames[name]) {
      fieldNames[name] = {
        count: 0,
        ids: [id]
      };
    }

    fieldNames[name].count += 1;
  });

  return fieldNames;
}

/**
 * Each field should have a unique name
 * In some cases this may not be true, as names
 * can be duplicated between steps
 * */
function validateFieldNames(steps) {
  const fieldNameCounts = getFieldNameCounts(steps);

  return Object.entries(fieldNameCounts)
    .filter(([name, { count }]) => count > 1)
    .map(([name, { ids }]) =>
      ids.map((id) => {
        const stepForField = steps.find(({ fields }) => fields.find(({ id: fieldId }) => fieldId === id));

        return fieldError({
          id,
          name,
          stepId: stepForField.id,
          type: errorTypes.CONFLICT_NAME,
          message: 'This name is in conflict with another'
        });
      })
    );
}

/** Index an array of objects into an object of id => [error, error, ...] */
function idIndexer(errors) {
  const toReturn = {};

  errors.forEach((error) => {
    if (!toReturn[error.id]) {
      toReturn[error.id] = [];
    }

    toReturn[error.id].push(error);
  });

  return toReturn;
}

/**
 * Pass me an array of steps and I'll give you
 * back an object of `fieldId` => error
 * */
export function validateSteps(steps) {
  const toReturn = steps
    .map((step) => {
      const { id, fields = [] } = step;
      return validateFields(fields.map((field) => ({ ...field, stepId: id })));
    })
    .concat(validateFieldNames(steps));

  return pipe(
    // Flatten to a single array
    flatten,

    // Remove all empty values
    filter(negate(isEmpty)),

    // Add error levels to each item, these levels can then be used to later
    // filter errors or warnings specifically
    map((error) => merge({ level: errorLevelsMapping[error.type] }, error)),

    // Transform from array of objects to object of indexed { [id]: object }
    idIndexer
  )(toReturn);
}

/** Helpers for filtering out errors and warnings */
export const onlyErrors = pickBy((items) => items.filter(({ level }) => level === errorLevels.ERROR).length > 0);

export const onlyWarnings = pickBy((items) => items.filter(({ level }) => level === errorLevels.WARN).length > 0);

/* Find first error of type */
export const errorOfType = curry((errorType, errors = []) => errors.find(({ type }) => type === errorType));

export default { validateSteps, errorTypes, errorLevels, onlyErrors, onlyWarnings };
