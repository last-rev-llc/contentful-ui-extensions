import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { TextInput, IconButton, FormLabel, CheckboxField } from '@contentful/forma-36-react-components';

import { ErrorStyle } from '../../StepList/styles';
import { errorOfType, errorTypes } from '../../validate';

const AddButton = styled(IconButton)`
  margin-bottom: 24px;
  width: 24px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;

  > * {
    margin-right: 4px;
  }
`;

const TypeTitle = styled(FormLabel)`
  flex-grow: 1;
  align-self: center;
  justify-self: center;

  font-weight: bold;
  padding-left: 2px;
`;

const AddRowStyle = styled(Row)`
  margin-top: 8px;
`;

// To keep the titles in line with content
const Hidden = styled.div`
  width: 24px;
  opacity: 0;
`;

function Select({ errors, field, updateField, showMultiSelect }) {
  const { options = [], isMulti } = field;

  // State changes
  const updateOptions = (newOptions) => updateField('options', newOptions);
  const removeOption = (indexToReplace) => options.filter((option, index) => index !== indexToReplace);
  const addEmptyOption = () => updateOptions(options.concat({ value: '', label: '' }));
  const replaceOption = (indexToReplace, newOption) =>
    options.map((option, index) => (index === indexToReplace ? newOption : option));

  // Error checking
  const fieldErrors = errors[field.id];
  const valueError = errorOfType(errorTypes.INVALID_VALUE, fieldErrors);

  return (
    <div>
      {showMultiSelect && (
        <CheckboxField
          checked={isMulti}
          onChange={() => updateField('isMulti', !isMulti)}
          labelText="Multiple Select"
        />
      )}
      {options.length > 0 && (
        <Row>
          <TypeTitle htmlFor="label-header">Label</TypeTitle>
          <TypeTitle htmlFor="value-header">Value</TypeTitle>
          <Hidden />
        </Row>
      )}
      {options.map(({ value, label }, index) => (
        // We can't index by ID there is none
        // We can't index by value or label as they will change
        // eslint-disable-next-line react/no-array-index-key
        <Row key={index}>
          <TextInput
            label=""
            value={label}
            onChange={(event) =>
              updateOptions(
                replaceOption(index, {
                  value,
                  label: event.currentTarget.value
                })
              )
            }
          />
          <TextInput
            value={value}
            onChange={(event) =>
              updateOptions(
                replaceOption(index, {
                  label,
                  value: event.currentTarget.value
                })
              )
            }
          />
          <IconButton
            buttonType="negative"
            iconProps={{ icon: 'Delete' }}
            label="Delete option"
            onClick={() => updateOptions(removeOption(index))}
          />
        </Row>
      ))}
      <AddRowStyle onClick={addEmptyOption}>
        <AddButton
          buttonType="primary"
          iconProps={{ icon: 'PlusCircle' }}
          label="Add option"
          onClick={addEmptyOption}
        />
        <span>Add Option</span>
      </AddRowStyle>
      {valueError && <ErrorStyle>{valueError.message}</ErrorStyle>}
    </div>
  );
}

Select.propTypes = {
  updateField: PropTypes.func.isRequired,
  showMultiSelect: PropTypes.bool,
  field: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string.isRequired,
    isMulti: PropTypes.bool.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      })
    )
  }).isRequired,

  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.object
};

Select.defaultProps = {
  errors: {},
  showMultiSelect: true
};

export default Select;
