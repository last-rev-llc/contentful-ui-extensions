import React from 'react';
import PropTypes from 'prop-types';
import { FieldGroup, Checkbox, FormLabel } from '@contentful/forma-36-react-components';

import { Row } from './styles';

function Toggleable({ field, updateField }) {
  const id = `${field.id}-defaultValue`;

  return (
    <FieldGroup>
      <Row>
        <Checkbox value={field.defaultValue} onChange={(e) => updateField('defaultValue', e.currentTarget.checked)} />
        <FormLabel htmlFor={id}>Show by default?</FormLabel>
      </Row>
    </FieldGroup>
  );
}

Toggleable.propTypes = {
  updateField: PropTypes.func.isRequired,
  field: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
    defaultValue: PropTypes.bool
  }).isRequired
};

export default Toggleable;
