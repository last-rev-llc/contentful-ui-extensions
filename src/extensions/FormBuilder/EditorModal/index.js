import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { clone, curry, set } from 'lodash';
import { Button, Heading } from '@contentful/forma-36-react-components';

import { useFormSteps, useFieldConfig } from '../hooks';
import { useSDK } from '../../../context';

import StepList from '../StepList';
import StepEditor from '../StepModal/StepEditor';
import FieldEditor from '../FieldModal/FieldEditor';

import { validateSteps } from '../validate';
import { EditorStyle, SectionWrapper, NothingHere, LeftSection, RightSection, ActionSection } from './styles';

function getSelectedItem(array, idToFind) {
  return array.find(({ id }) => id === idToFind);
}

function getSelectedStep(steps, { step }) {
  return getSelectedItem(steps, step);
}

function getSelectedField(steps, selected) {
  const selectedStep = getSelectedStep(steps, selected) || {};
  const { fields = [] } = selectedStep;
  return getSelectedItem(fields, selected.field);
}

function RightContent({ steps, selected, updateStep, updateField }) {
  const errors = validateSteps(steps);

  switch (selected.type) {
    case 'step':
      return (
        <RightSection key={selected.step}>
          <Heading>Step editor</Heading>
          <StepEditor errors={errors} step={getSelectedStep(steps, selected)} updateStep={updateStep} />
        </RightSection>
      );

    case 'field':
      return (
        <RightSection key={selected.field}>
          <Heading>Field editor</Heading>
          <FieldEditor errors={errors} field={getSelectedField(steps, selected)} updateField={updateField} />
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

  const { invocation } = sdk.parameters;
  const [value, setValue] = useState({ steps: invocation.steps || [] });

  // We can't pass in functionality from the SDK parameters
  // so here we receive the steps as JSON from the parent window frame.
  //
  // We can then build out our state management system as normal.
  // When we close the modal window the parent will handle updating the steps there
  // The parent will also handle updating the state in contentful
  const tempValue = (key, newValue) => {
    console.log('tempValue => ', key, newValue);
    const newValue2 = set(clone(value), key, newValue);
    const newValue3 = { ...value, [key]: newValue };
    console.log('tempValue2', newValue2);
    console.log('tempValue3', newValue3);
    return setValue(set(clone(value), key, newValue));
  };
  const stepConfig = useFormSteps(tempValue, value);
  const fieldConfig = useFieldConfig(stepConfig.stepEdit);

  const { step = null, field = null } = sdk.parameters.invocation;
  const [selected, setSelection] = useState({
    step: step && step.id,
    field: field && field.id,
    type: getInitiallySelectedType({ step, field })
  });

  const updateStep = curry((key, newValue) =>
    stepConfig.stepEdit(selected.step, {
      ...getSelectedStep(stepConfig.steps, selected),
      [key]: newValue
    })
  );

  const updateField = (maybeKeyMaybeObject, newValue = null) => {
    // Allow full object replacement (multiple keys)
    if (maybeKeyMaybeObject instanceof Object) {
      fieldConfig.fieldEdit(selected.step, {
        ...getSelectedField(stepConfig.steps, selected),
        ...maybeKeyMaybeObject
      });
      return;
    }

    console.log('updateField => ', maybeKeyMaybeObject, newValue);
    console.log({
      ...getSelectedField(stepConfig.steps, selected),
      [maybeKeyMaybeObject]: newValue
    });
    fieldConfig.fieldEdit(selected.step, {
      ...getSelectedField(stepConfig.steps, selected),
      [maybeKeyMaybeObject]: newValue
    });
  };

  const handleCancel = () => sdk.close({ steps: null });
  const handleConfirm = () => {
    console.log('step on confirm => ', value.steps);
    return sdk.close({ steps: value.steps });
  };

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
                step: currentStep.id
              })
            }
            onFieldClick={(currentField, currentStep) =>
              setSelection({
                type: 'field',
                step: currentStep.id,
                field: currentField.id
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
