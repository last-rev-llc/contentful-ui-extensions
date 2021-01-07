import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Button, IconButton } from '@contentful/forma-36-react-components';

import SortableList from '../SortableList';
import { showModal } from '../utils';
import { useSDK } from '../../../context';
import { validateSteps, onlyErrors, onlyWarnings } from '../validate';

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

  ${({ hasError }) => hasError && 'border-bottom: 2px solid red;'}
  ${({ hasWarning }) => hasWarning && 'border-bottom: 2px solid orange;'}
`;

const TypeText = styled.span`
  background-color: #fafafa;
  padding: 8px;

  ${({ active }) => active && `background: #7dafff; color: black;`}
`;

function StepList({ activeId, autoexpand, stepConfig, fieldConfig, readOnly, onStepClick, onFieldClick }) {
  const sdk = useSDK();

  const { steps, stepAdd, stepRemove, stepReorder } = stepConfig;
  const { fieldAdd, fieldRemove, fieldReorder } = fieldConfig;

  // Validate fields for errors such as missing or duplicate names
  const allErrors = validateSteps(steps);

  const errors = onlyErrors(allErrors);
  const warnings = onlyWarnings(allErrors);

  return (
    <div className="setup-form">
      <SortableList
        items={steps}
        activeId={activeId}
        readOnly={readOnly}
        onSortEnd={stepReorder}
        autoexpand={autoexpand}
        onClickItem={onStepClick}
        onRemoveItem={(step) =>
          showModal(sdk, { name: 'step-remove' }, { steps, step, type: 'step' }, { steps }).then(
            ({ confirmation }) => confirmation && stepRemove(step)
          )
        }>
        {/* Uses a functional child, we get passed the parent item and can render children */}
        {(step) => (
          <Col>
            <SortableList
              activeId={activeId}
              readOnly={readOnly}
              items={step.fields}
              onClickItem={(field) => onFieldClick(field, step)}
              onSortEnd={fieldReorder(step.id)}
              onRemoveItem={(field) =>
                showModal(sdk, { name: 'field-remove' }, { steps, field, type: 'field' }).then(
                  ({ confirmation }) => confirmation && fieldRemove(step.id, field)
                )
              }
              renderItem={(field) => (
                <FieldDisplay hasError={errors[field.id]} hasWarning={warnings[field.id]}>
                  <span>{field.name}</span>
                  <TypeText active={field.active}>{field.type}</TypeText>
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

  onStepClick: PropTypes.func,
  onFieldClick: PropTypes.func,

  activeId: PropTypes.string,
  autoexpand: PropTypes.bool, // Show the fields by defult
  readOnly: PropTypes.bool // Don't allow editing of fields or steps
};

StepList.defaultProps = {
  autoexpand: true,
  readOnly: false,
  activeId: undefined,
  onStepClick: undefined,
  onFieldClick: undefined
};

export default StepList;
