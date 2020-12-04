import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FieldGroup, CheckboxField } from '@contentful/forma-36-react-components';

import FieldEditor from './FieldEditor';

const SubfieldStyle = styled.div`
  padding-left: 16px;
  border-left: 2px solid lightgrey;
  margin-bottom: 16px;

  > h1 {
    margin-bottom: 8px;
  }
`;

function makeDefaultField() {
  return {
    id: uuidv4(),
    name: 'name',
    type: 'hidden'
  };
}

function Toggleable({ field, updateField }) {
  const { field: subfield = makeDefaultField() } = field;

  return (
    <FieldGroup>
      <SubfieldStyle>
        <FieldEditor
          title="Subfield Editor"
          field={subfield}
          updateField={(key, newValue) =>
            updateField('field', {
              ...subfield,
              [key]: newValue
            })
          }
        />
      </SubfieldStyle>
      <CheckboxField
        id="showByDefault"
        name="showByDefault"
        labelText="Show by default?"
        checked={field.defaultValue}
        onChange={(e) => updateField('defaultValue', e.currentTarget.checked)}
      />
    </FieldGroup>
  );
}

Toggleable.propTypes = {
  updateField: PropTypes.func.isRequired,
  field: PropTypes.shape({
    field: PropTypes.object,
    id: PropTypes.string,
    type: PropTypes.string,
    defaultValue: PropTypes.bool
  }).isRequired
};

export default Toggleable;
