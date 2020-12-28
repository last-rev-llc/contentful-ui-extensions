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

function RightContent({ steps, selected, updateStep, updateField }) {
  const errors = validateSteps(steps);

  switch (selected.type) {
    case 'step':
      return (
        <RightSection key={selected.step.id}>
          <Heading>Step editor</Heading>
          <StepEditor errors={errors} step={selected.step} updateStep={updateStep} />
        </RightSection>
      );

    case 'field':
      return (
        <RightSection key={selected.field.id}>
          <Heading>Field editor</Heading>
          <FieldEditor errors={errors} field={selected.field} updateField={updateField} />
        </RightSection>
      );

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
    step: PropTypes.object,
    field: PropTypes.object,
    type: PropTypes.oneOf(['step', 'field', null])
  }).isRequired,
  steps: PropTypes.arrayOf(PropTypes.object)
};

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

  const [selected, setSelection] = useState({ type: null, step: null, field: null });

  const updateStep = curry((key, value) =>
    stepConfig.stepEdit(selected.step.id, {
      ...selected.step,
      [key]: value
    })
  );
  const updateField = curry((key, value) =>
    fieldConfig.fieldEdit(selected.step.id, {
      ...selected.field,
      [key]: value
    })
  );

  const handleCancel = () => sdk.close({ steps: null });
  const handleConfirm = () => sdk.close({ steps: stepConfig.steps });

  return (
    <EditorStyle>
      <Heading>Edit Form</Heading>
      <SectionWrapper>
        <LeftSection>
          <Heading>Steps</Heading>
          <StepList
            stepConfig={stepConfig}
            fieldConfig={fieldConfig}
            onStepClick={(step) => setSelection({ type: 'step', step, field: null })}
            onFieldClick={(field, step) => setSelection({ type: 'field', step, field })}
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
