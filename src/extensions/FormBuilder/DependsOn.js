/* eslint-disable react/forbid-prop-types */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Query, Builder, Utils as QbUtils } from 'react-awesome-query-builder';

import MaterialConfig from 'react-awesome-query-builder/lib/config/material';

import 'react-awesome-query-builder/lib/css/styles.css';

const BuilderWrapper = styled.div`
  .group {
    background: whitesmoke;
    border: 1px solid whitesmoke;
  }

  .query-builder {
    margin: 0;

    .group-or-rule-container {
      padding-right: 0;
      width: 98%;
      overflow: hidden;
    }

    .MuiInput-input {
      max-width: 98%;
    }
  }
`;

function prefererredWidgetsFor({ type }) {
  switch (type) {
    case 'time':
      return ['time'];
    case 'number':
      return ['number'];
    case 'datetime':
      return ['datetime'];

    case 'hidden':
    case 'password':
    case 'color':
    case 'email':
    case 'file':
    case 'image':
    case 'month':
    case 'radio':
    case 'range':
    case 'required':
    case 'search':
    case 'string':
    case 'submit':
    case 'tel':
    case 'text':
    case 'week':
    case 'url':
    case 'button':
    case 'reset':
    default:
      return ['text'];
  }
}

function propsFor({ type, ...field }) {
  switch (type) {
    case 'select': {
      const { options } = field;
      return {
        fieldSettings: {
          listValues: options.map(({ label, value }) => ({ title: label, value }))
        }
      };
    }

    case 'time':
    case 'number':
    case 'datetime':
    case 'hidden':
    case 'password':
    case 'color':
    case 'email':
    case 'file':
    case 'image':
    case 'month':
    case 'radio':
    case 'range':
    case 'required':
    case 'search':
    case 'string':
    case 'submit':
    case 'tel':
    case 'text':
    case 'week':
    case 'url':
    case 'button':
    case 'reset':
    default:
      return {};
  }
}

function typeFor({ type, value }) {
  switch (type) {
    case 'select':
      return 'select';

    case 'number':
      return 'number';

    case 'hidden':
      if ([true, false].includes(value)) {
        return 'boolean';
      }

      return 'text';

    default:
      return 'text';
  }
}

function labelFor({ name, label }) {
  return name || label || 'unlabelled';
}

function buildConfig(steps) {
  const toReturn = { ...MaterialConfig, fields: {} };

  steps
    .map(({ fields: fieldsForStep }) => fieldsForStep)
    .reduce((acc, fieldArray) => acc.concat(fieldArray), [])
    .forEach((field) => {
      toReturn.fields[field.name] = {
        label: labelFor(field),
        type: typeFor(field),
        valueSources: ['value'],
        preferWidgets: prefererredWidgetsFor(field),
        ...propsFor(field)
      };
    });

  return toReturn;
}

function getValue(value) {
  if (typeof value === 'string') {
    return JSON.parse(value);
  }

  return value;
}

function DependsOn({ steps, value, onChange }) {
  const config = buildConfig(steps);

  const [state, setState] = useState({
    config,
    tree: QbUtils.checkTree(QbUtils.loadFromJsonLogic(getValue(value), config), config)
  });

  const handleChange = (immutableTree, config) => {
    // Tip: for better performance you can apply `throttle` - see `examples/demo`
    setState({ tree: immutableTree, config: buildConfig(steps) });

    const { logic } = QbUtils.jsonLogicFormat(immutableTree, config);
    console.log(logic);
    onChange(logic);
  };

  return (
    <Query
      {...state.config}
      value={state.tree}
      onChange={handleChange}
      renderBuilder={(props) => (
        <BuilderWrapper className="query-builder-container">
          <div className="query-builder qb-lite">
            <Builder {...props} />
          </div>
        </BuilderWrapper>
      )}
    />
  );
}

DependsOn.propTypes = {
  // our dependsOn object (jsonLogic)

  steps: PropTypes.arrayOf(PropTypes.object),
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired
};

DependsOn.defaultProps = {
  value: {}
};

export default DependsOn;
