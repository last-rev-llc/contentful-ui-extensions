import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { TextInput, IconButton, FormLabel } from '@contentful/forma-36-react-components';

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

function Select({ field, updateField }) {
  const { options = [] } = field;

  const updateOptions = (newOptions) => updateField('options')(newOptions);

  const replaceOption = (indexToReplace, newOption) =>
    options.map((option, index) => (index === indexToReplace ? newOption : option));

  const removeOption = (indexToReplace) => options.filter((option, index) => index !== indexToReplace);

  const addEmptyOption = () => updateOptions(options.concat({ value: '', label: '' }));

  return (
    <div>
      {options.length > 0 && (
        <Row>
          <TypeTitle>Label</TypeTitle>
          <TypeTitle>Value</TypeTitle>
          <Hidden />
        </Row>
      )}
      {options.map(({ value, label }, index) => (
        // We can't index by ID there is none
        // We can't index by value or label as they will change
        // eslint-disable-next-line react/no-array-index-key
        <Row key={index}>
          <TextInput
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
    </div>
  );
}

Select.propTypes = {
  updateField: PropTypes.func.isRequired,
  field: PropTypes.shape({
    type: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      })
    )
  }).isRequired
};

export default Select;
