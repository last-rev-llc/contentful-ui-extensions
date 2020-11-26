import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { merge } from 'lodash/fp';
import { Card, Button, IconButton, SectionHeading } from '@contentful/forma-36-react-components';
import SectionWrapper from '../SectionWrapper';
import SortableList from '../SortableList';
import { buildField } from '../utils';

const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

const LeftIconButton = styled(IconButton)`
  margin-top: 8px;
  span {
    justify-content: flex-start;
  }
`;

const FieldCard = styled(Card)``;

function SetupForm({ steps, stepAdd, stepRemove, stepEdit, onSortEnd }) {
  const handleFieldEdit = (field) => {};
  const handleFieldRemove = (field) => {};

  return (
    <SectionWrapper title="Setup Form">
      <div className="setup-form">
        <SectionHeading className="title">Steps</SectionHeading>
        <SortableList items={steps} onSortEnd={onSortEnd} onRemoveItem={stepRemove} onEditItem={stepEdit}>
          {(step) => {
            const { fields } = step;
            return (
              <Col>
                <SortableList items={fields} onRemoveItem={handleFieldRemove} onEditItem={handleFieldEdit} />
                <LeftIconButton
                  onClick={() =>
                    stepEdit(
                      merge(step)({
                        fields: fields.concat(buildField())
                      })
                    )
                  }
                  size="small"
                  buttonType="primary"
                  iconProps={{ icon: 'PlusCircle' }}>
                  Add field
                </LeftIconButton>
              </Col>
            );
          }}
        </SortableList>
        <div className="actions">
          <Button onClick={stepAdd} size="small">
            Add Step
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}

SetupForm.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ).isRequired,
  stepAdd: PropTypes.func.isRequired,
  stepRemove: PropTypes.func.isRequired,
  stepEdit: PropTypes.func.isRequired,
  onSortEnd: PropTypes.func.isRequired
};

SetupForm.defaultProps = {};

export default SetupForm;
