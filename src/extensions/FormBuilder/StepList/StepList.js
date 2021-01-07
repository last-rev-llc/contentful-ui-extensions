import React from 'react';
import styled from 'styled-components';
import arrayMove from 'array-move';
import PropTypes from 'prop-types';
import { curry } from 'lodash/fp';
import { Button, IconButton } from '@contentful/forma-36-react-components';

import SectionWrapper from '../SectionWrapper';
import SortableList from '../SortableList';
import { showModal } from '../utils';
import { useSDK } from '../../../context';

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

const FieldDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TypeText = styled.span`
  background-color: #fafafa;
  padding: 8px;
`;

function StepList({ autoexpand, stepConfig, fieldConfig, readOnly, onStepClick, onFieldClick }) {
  const sdk = useSDK();

  const { steps, stepAdd, stepRemove, stepReorder } = stepConfig;
  const { fieldAdd, fieldRemove, fieldReorder } = fieldConfig;

  return (
    <div className="setup-form">
      <SortableList
        items={steps}
        readOnly={readOnly}
        onSortEnd={stepReorder}
        onEditItem={onStepClick}
        autoexpand={autoexpand}
        onRemoveItem={(step) =>
          showModal(sdk, { name: 'step-remove' }, { steps, step, type: 'step' }, { steps }).then(
            ({ confirmation }) => confirmation && stepRemove(step)
          )
        }>
        {(step) => (
          <Col>
            <SortableList
              readOnly={readOnly}
              items={step.fields}
              onEditItem={(field) => onFieldClick(field, step)}
              onSortEnd={fieldReorder(step.id)}
              onRemoveItem={(field) =>
                showModal(sdk, { name: 'field-remove' }, { steps, field, type: 'field' }).then(
                  ({ confirmation }) => confirmation && fieldRemove(step.id, field)
                )
              }
              renderItem={(field) => (
                <FieldDisplay>
                  <span>{field.name}</span>
                  <TypeText>{field.type}</TypeText>
                </FieldDisplay>
              )}
            />
            {!readOnly && (
              <LeftIconButton
                size="small"
                buttonType="primary"
                label="Add new field"
                onClick={fieldAdd(step.id)}
                iconProps={{ icon: 'PlusCircle' }}
              />
            )}
          </Col>
        )}
      </SortableList>
      {!readOnly && (
        <div className="actions">
          <Button onClick={stepAdd} size="small">
            Add Step
          </Button>
        </div>
      )}
    </div>
  );
}

StepList.propTypes = {
  stepConfig: PropTypes.shape({
    steps: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string
      }).isRequired
    ),
    stepAdd: PropTypes.func,
    stepRemove: PropTypes.func,
    stepEdit: PropTypes.func,
    stepReorder: PropTypes.func
  }).isRequired,

  fieldConfig: PropTypes.shape({
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string
      })
    ),
    fieldAdd: PropTypes.func,
    fieldRemove: PropTypes.func,
    fieldReorder: PropTypes.func
  }).isRequired,

  onStepClick: PropTypes.func.isRequired,
  onFieldClick: PropTypes.func.isRequired,

  autoexpand: PropTypes.bool, // Show the fields by defult
  readOnly: PropTypes.bool // Don't allow editing of fields or steps
};

StepList.defaultProps = { autoexpand: true, readOnly: false };

export default StepList;
