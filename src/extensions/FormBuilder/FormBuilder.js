import React, { useEffect, useState } from 'react';
import copy from 'copy-to-clipboard';
import { v4 as uuidv4 } from 'uuid';
import { set } from 'lodash';
import { curry, clone } from 'lodash/fp';
import styled from 'styled-components';
import { IconButton, Textarea } from '@contentful/forma-36-react-components';

import { useSDK } from '../../context';

import FormInfo from './FormInfo';
import StepList from './StepList';

import StepModal from './StepList/StepModal';
import FieldModal from './StepList/FieldModal';
import ConfirmModal from './StepList/ConfirmDeleteModal';

import './FormBuilder.scss';
import { buildStep, safeParse } from './utils';
import { useProviderConfig, useFormSteps } from './hooks';

const QuickIcons = styled.div`
  position: fixed;

  margin: 1rem;
  top: 12px;
  right: 12px;

  background: white;
  padding: 4px;
  border-radius: 4px;

  min-width: 50px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const JsonInput = styled(Textarea)`
  textarea {
    min-height: 512px;
    margin: 16px;
  }
`;

function getModal(sdk) {
  const { modal } = sdk.parameters.invocation || {};
  return modal;
}

function ensureIds(steps) {
  return steps.map((step) => ({
    id: uuidv4(),
    ...step,
    fields: step.fields.map((field) => ({ id: uuidv4(), ...field }))
  }));
}

function FormBuilder() {
  const sdk = useSDK();
  const [jsonMode, setJsonMode] = useState(false);

  const handleFieldChange = curry((fieldName, newValue) => {
    sdk.field.setValue(
      // Use lodash set to insert items at deep.key.level
      set(clone(sdk.field.getValue()), fieldName, newValue)
    );
  });

  const formConfig = useProviderConfig(handleFieldChange);
  const stepConfig = useFormSteps(handleFieldChange, [
    //
    buildStep('First step')
  ]);

  const loadState = ({ steps = [], provider = {} }) => {
    if (steps.length > 0) {
      stepConfig.update(ensureIds(steps));
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

    case 'step-remove':
      return <ConfirmModal />;

    case 'field-remove':
      return <ConfirmModal />;

    default:
      break;
  }

  try {
    return (
      <div>
        <QuickIcons>
          <IconButton
            label="Copy JSON"
            iconProps={{ icon: 'Copy' }}
            onClick={() => copy(JSON.stringify(sdk.field.getValue(), null, 2))}
          />
          <IconButton label="Toggle JSON mode" iconProps={{ icon: 'Edit' }} onClick={() => setJsonMode(!jsonMode)} />
        </QuickIcons>
        {!jsonMode && (
          <>
            <FormInfo formConfig={formConfig} />
            <StepList stepConfig={stepConfig} />
          </>
        )}
        {jsonMode && (
          <JsonInput
            value={JSON.stringify(sdk.field.getValue(), null, 2)}
            onChange={(event) => {
              const newFormState = safeParse(event.currentTarget.value);
              if (newFormState) {
                sdk.field.setValue(newFormState);
                loadState(newFormState);
              }
            }}
          />
        )}
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
