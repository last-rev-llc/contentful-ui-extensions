/* eslint-disable react/forbid-prop-types */

import React, { useState } from 'react';
import { pick, prop } from 'lodash/fp';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import ReactSelect from 'react-select';
import { Button, Switch, TextField } from '@contentful/forma-36-react-components';

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

const ValueInputStyle = styled(Row)`
  margin-top: 1rem;
  justify-content: flex-end;
`;

const DependencyStyle = styled(Col)`
  padding-bottom: 1rem;
`;

const DependencyWrapper = styled(Col)`
  padding-bottom: 1rem;

  ${DependencyStyle} {
    margin-left: ${({ count }) => (count > 0 ? '1rem' : '0')};
  }
`;

const DependsOnWrapper = styled.div`
  h3,
  h4,
  h5,
  h6 {
    font-family: ;
  }
`;

const Select = styled(ReactSelect)`
  flex-grow: 1;
  margin-right: 1rem;

  &:last-of-type {
    margin-right: 0;
  }
`;

function labelFor({ name, label }) {
  return name || label || 'unlabelled';
}

function buildConfig(steps) {
  const toReturn = {};

  steps
    .map(({ fields: fieldsForStep }) => fieldsForStep)
    .reduce((acc, fieldArray) => acc.concat(fieldArray), [])
    .forEach((field) => {
      toReturn[field.id] = {
        ...field,
        label: labelFor(field)
      };
    });

  return toReturn;
}

const DEPEND_TYPES = [
  { value: '==', label: 'is' },
  { value: '!!', label: 'exists' },
  { value: '!', label: 'does not exist' },
  { value: '!=', label: 'does not equal' },
  { value: 'in', label: 'in' }
];

function isBoolean(value) {
  return [true, false].includes(value);
}

function isEqualityCheck(value) {
  return ['==', '!='].includes(value);
}

function ValueInputArea({ config, item, updateItem }) {
  const selectedFormItem = config[item.var];
  if (!selectedFormItem) return null;

  switch (item.type) {
    case '!!':
    case '!':
      return null;

    default:
      break;
  }

  // In some cases (such as select) we want to fill out the
  // available options to the user so they can choose from a
  // set list of items rather than giving them a direct text entry
  switch (selectedFormItem.type) {
    case 'select':
      return (
        <Select
          isMulti={item.type === 'in'}
          onChange={(option) => {
            // Support multiselect
            if (option instanceof Array) {
              return updateItem({ ...item, value: option.map(prop('value')) });
            }
            return updateItem({ ...item, value: option.value });
          }}
          options={selectedFormItem.options}
        />
      );

    default:
      if (isEqualityCheck(item.type)) {
        break;
      }

      return null;
  }

  /** Show a switch button if our value from the form is boolean (hidden field etc) */
  if (isBoolean(selectedFormItem.value)) {
    return (
      <Switch
        isChecked={item.value}
        labelText={item.value ? 'Enabled' : 'Disabled'}
        onToggle={(isChecked) => updateItem({ ...item, value: isChecked })}
      />
    );
  }

  /** Show a default text entry so the user can update the equals to whatever they need */
  return <TextField onChange={(event) => updateItem({ ...item, value: event.currentTarget.value })} />;
}

function getDependsTypesForItem(item, config) {
  const currentConfigItem = config[item.var];
  if (!currentConfigItem) return DEPEND_TYPES;

  switch (currentConfigItem.type) {
    case 'select':
      return DEPEND_TYPES;

    default:
      return DEPEND_TYPES.filter(({ value }) => value !== 'in');
  }
}

function DependencySelector({ config, item, updateItem }) {
  return (
    <DependencyStyle>
      <Row>
        <Select
          onChange={(option) => updateItem({ ...item, var: option.id })}
          options={Object.values(config).map(pick(['id', 'label']))}
        />
        <Select
          onChange={(option) => updateItem({ ...item, type: option.value })}
          options={getDependsTypesForItem(item, config)}
        />
      </Row>
      <ValueInputStyle>
        <ValueInputArea config={config} item={item} updateItem={updateItem} />
      </ValueInputStyle>
    </DependencyStyle>
  );
}

function buildDependency(extra = {}) {
  return {
    id: uuidv4(),
    var: undefined,
    ...extra
  };
}

function buildDepends(dependsOn, config) {
  const toReturn = [];

  // Default to AND type comparison every time
  const { and = dependsOn } = dependsOn;

  Object.values(and).map((logic) => {
    Object.entries(logic).forEach(([key, value]) => {
      switch (key) {
        case '!':
        case '!!':
          return toReturn.push(buildDependency({ type: key, var: value.var }));

        case '<':
        case '>':
        case '>=':
        case '<=':
        case 'in':
          return toReturn.push(buildDependency({ type: key, var: value[0]?.var, value: value[1] }));

        default:
          return false;
      }
    });
  });

  console.log(toReturn);

  return toReturn;
}

function DependsOn({ steps, dependsOn, onChange }) {
  const config = buildConfig(steps);
  const [depends, setDepends] = useState(buildDepends(dependsOn, config));

  const addDepend = () => setDepends(depends.concat(buildDependency()));
  const updateItem = (newItem) => setDepends(depends.map((item) => (item.id === newItem.id ? newItem : item)));

  return (
    <div>
      <h4>Dependencies</h4>
      <DependencyWrapper count={depends.length}>
        <h5>AND</h5>
        {depends.map((item) => (
          <DependencySelector key={item.id} config={config} item={item} updateItem={updateItem} />
        ))}
      </DependencyWrapper>
      <Button onClick={addDepend}>Add Dependency</Button>
    </div>
  );
}

DependsOn.propTypes = {
  // our dependsOn object (jsonLogic)

  steps: PropTypes.arrayOf(PropTypes.object),
  dependsOn: PropTypes.object,
  onChange: PropTypes.func.isRequired
};

DependsOn.defaultProps = {
  dependsOn: {}
};

export default DependsOn;
