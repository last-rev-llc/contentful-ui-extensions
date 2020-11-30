import React, { useEffect, useState } from 'react';
import { curry, set, clone } from 'lodash/fp';
import styled from 'styled-components';
import { IconButton, Textarea } from '@contentful/forma-36-react-components';

import { useSDK } from '../../context';

import FormInfo from './FormInfo';
import StepList from './StepList';

import StepModal from './StepList/StepModal';
import FieldModal from './StepList/FieldModal';

import './FormBuilder.scss';
import { buildStep, safeParse } from './utils';
import { useProviderConfig, useFormSteps } from './hooks';

const ToggleJsonButton = styled(IconButton)`
  position: fixed;
  top: 0;
  right: 0;
`;

const JsonInput = styled(Textarea)`
  textarea {
    min-height: 512px;
  }
`;

function getModal(sdk) {
  const { modal } = sdk.parameters.invocation || {};
  return modal;
}

function FormBuilder() {
  const sdk = useSDK();
  const [jsonMode, setJsonMode] = useState(true);

  const handleFieldChange = curry((fieldName, newValue) => {
    const toSave = clone(sdk.field.getValue());
    set(toSave, fieldName, newValue);
    sdk.field.setValue(toSave);
  });

  const formConfig = useProviderConfig(handleFieldChange);
  const stepConfig = useFormSteps(handleFieldChange, [
    //
    buildStep('First step')
  ]);

  const loadState = ({ steps = [], provider = {} }) => {
    if (steps.length > 0) {
      stepConfig.update(steps);
    }
    if (Object.keys(provider).length > 0) {
      formConfig.update(provider);
    }
  };

  /**
   * Load the last saved state from contentful
   * We'll fill out our independant configurations from this state
   * (See above formConfig & stepConfig)
   * */
  useEffect(
    () => {
      if (sdk.field?.getValue instanceof Function) {
        loadState(sdk.field.getValue() || {});
      }
    },
    // I only actually want to update when the field changes
    // this is only initial configuration setup
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sdk.field]
  );

  switch (getModal(sdk)) {
    case 'field-modal':
      return <FieldModal />;

    case 'step-modal':
      return <StepModal />;

    default:
      break;
  }

  try {
    return (
      <div>
        <ToggleJsonButton iconProps={{ icon: 'Edit' }} onClick={() => setJsonMode(!jsonMode)} />
        {!jsonMode && (
          <>
            <FormInfo formConfig={formConfig} />
            <StepList stepConfig={stepConfig} />
          </>
        )}
        {jsonMode && (
          <JsonInput
            value={JSON.stringify(sdk.field.getValue(), null, 4)}
            onChange={(event) => {
              const newFormState = safeParse(event.currentTarget.value);
              if (newFormState) {
                sdk.field.setValue(newFormState);
                loadState(newFormState);
              }
            }}
          />
        )}
        {/* <ConfirmDeleteDialog item={removeStep} onClose={handleCancelRemoveStep} onSubmit={handleRemoveStep} /> */}
      </div>
    );
  } catch (error) {
    // Fallback to json entry on error
    // eslint-disable-next-line no-console
    console.error(error);
    setJsonMode(true);
  }
}

export default FormBuilder;
