import React from 'react';
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

function Toggleable({ field, updateField }) {
  return (
    <FieldGroup>
      <SubfieldStyle>
        <FieldEditor
          title="Subfield Editor"
          field={field.field}
          updateField={(newField) => updateField({ field: newField })}
        />
      </SubfieldStyle>
      <CheckboxField
        id="showByDefault"
        name="showByDefault"
        labelText="Show by default?"
        defaultChecked={field.defaultValue}
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
