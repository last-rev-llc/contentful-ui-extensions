import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { curry } from 'lodash';
import { Button, Heading } from '@contentful/forma-36-react-components';

import { useFormSteps, useFieldConfig } from '../../hooks';
import { useSDK } from '../../../../context';

import StepList from '../StepList';
import StepEditor from '../StepModal/StepEditor';
import FieldEditor from '../FieldModal/FieldEditor';

import { validateSteps } from '../../validate';
import { EditorStyle, SectionWrapper, NothingHere, LeftSection, RightSection, ActionSection } from './styles';

function getSelectedItem(array, idToFind) {
  return array.find(({ id }) => id === idToFind);
}

function getSelectedStep(steps, { step }) {
  return getSelectedItem(steps, step);
}

function getSelectedField(steps, { step, field }) {
  const selectedStep = getSelectedStep(steps, step) || {};
  const { fields = [] } = selectedStep;
  return getSelectedItem(fields, field);
}

function RightContent({ steps, selected, updateStep, updateField }) {
  const errors = validateSteps(steps);

  switch (selected.type) {
    case 'step': {
      const currentStep = getSelectedStep(steps, selected);
      return (
        <RightSection key={selected.step}>
          <Heading>Step editor</Heading>
          <StepEditor errors={errors} step={currentStep} updateStep={updateStep} />
        </RightSection>
      );
    }

    case 'field': {
      const currentField = getSelectedField(steps, selected);
      return (
        <RightSection key={selected.field}>
          <Heading>Field editor</Heading>
          <FieldEditor errors={errors} field={currentField} updateField={updateField} />
        </RightSection>
      );
    }

    default:
      return (
        <RightSection key="nothing-here">
          <NothingHere>Nothing selected</NothingHere>
        </RightSection>
      );
  }
}

RightContent.propTypes = {
  updateStep: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  selected: PropTypes.shape({
    step: PropTypes.string,
    field: PropTypes.string,
    type: PropTypes.oneOf(['step', 'field', null])
  }).isRequired,

  steps: PropTypes.arrayOf(PropTypes.object)
};

RightContent.defaultProps = {
  steps: []
};

function getInitiallySelectedType({ step, field }) {
  if (field) return 'field';
  if (step) return 'step';

  return null;
}

function getActiveId({ step, field }) {
  if (field) return field.id;
  if (step) return step.id;

  return null;
}

function EditorModal() {
  const sdk = useSDK();

  // We can't pass in functionality from the SDK parameters
  // so here we receive the steps as JSON from the parent window frame.
  //
  // We can then build out our state management system as normal.
  // When we close the modal window the parent will handle updating the steps there
  // The parent will also handle updating the state in contentful
  const stepConfig = useFormSteps(sdk.parameters.invocation.steps);
  const fieldConfig = useFieldConfig(stepConfig.stepEdit);

  const { step = null, field = null } = sdk.parameters.invocation;
  const [selected, setSelection] = useState({
    step: step && step.id,
    field: field && field.id,
    type: getInitiallySelectedType({ step, field })
  });

  const updateStep = curry((key, value) => {
    const currentStep = getSelectedStep(stepConfig.steps, selected);
    stepConfig.stepEdit(selected.step, {
      ...currentStep,
      [key]: value
    });
  });

  const updateField = curry((key, value) => {
    const currentField = getSelectedField(stepConfig.steps, selected);
    fieldConfig.fieldEdit(selected.step, {
      ...currentField,
      [key]: value
    });
  });

  const handleCancel = () => sdk.close({ steps: null });
  const handleConfirm = () => sdk.close({ steps: stepConfig.steps });

  return (
    <EditorStyle>
      <Heading>Edit Form</Heading>
      <SectionWrapper>
        <LeftSection>
          <Heading>Steps</Heading>
          <StepList
            activeId={getActiveId(selected)}
            stepConfig={stepConfig}
            fieldConfig={fieldConfig}
            onStepClick={(currentStep) =>
              setSelection({
                type: 'step',
                field: null,
                step: currentStep
              })
            }
            onFieldClick={(currentField, currentStep) =>
              setSelection({
                type: 'field',
                step: currentStep,
                field: currentField
              })
            }
          />
        </LeftSection>
        <RightContent steps={stepConfig.steps} selected={selected} updateStep={updateStep} updateField={updateField} />
      </SectionWrapper>
      <ActionSection>
        <Button buttonType="negative" onClick={handleCancel}>
          Cancel
        </Button>
        <Button buttonType="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </ActionSection>
    </EditorStyle>
  );
}

export default EditorModal;
