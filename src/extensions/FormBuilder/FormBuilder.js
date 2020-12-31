import React, { useEffect, useState } from 'react';
import copy from 'copy-to-clipboard';
import { set } from 'lodash';
import { curry, clone } from 'lodash/fp';
import styled from 'styled-components';
import { Button, IconButton, Textarea } from '@contentful/forma-36-react-components';

import { useSDK } from '../../context';

import FormInfo from './FormInfo';
import StepList from './StepList';

import SectionWrapper from './SectionWrapper';
import StepModal from './StepList/StepModal';
import FieldModal from './StepList/FieldModal';
import EditorModal from './StepList/EditorModal';
import ConfirmModal from './StepList/ConfirmDeleteModal';

import './FormBuilder.scss';
import { validateSteps, onlyErrors } from './validate';
import { safeParse, showModal } from './utils';
import { useFormConfig, useFieldConfig } from './hooks';

const SectionHeaderWithButton = styled.div`
  display: flex;
  justify-content: space-between;
`;

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

function FormBuilder() {
  const sdk = useSDK();
  const [jsonMode, setJsonMode] = useState(false);

  const { formConfig, stepConfig, loadState } = useFormConfig(
    curry((fieldName, newValue) => {
      // Use lodash set to insert items at deep.key.level
      const newFieldValue = set(clone(sdk.field.getValue() || {}), fieldName, newValue);

      const { steps = [] } = newFieldValue;

      const errors = onlyErrors(validateSteps(steps));
      const hasErrors = Object.keys(errors).length > 0;

      // If we have some errors, disable publishing
      if (hasErrors) {
        // Save the result as single key in the JSON
        // We do this to present invalid JSON and prevent
        // contentful from allowing publishing of the field
        //
        // Check the content model validation in Contentful
        // we have specified at least 2 properties in the JSON
        sdk.field.setValue({ error: newFieldValue });
      }

      // We should be able to publish without issue
      else {
        sdk.field.setValue(newFieldValue);
      }
    })
  );

  const fieldConfig = useFieldConfig(stepConfig.stepEdit);

  /**
   * Load the last saved state from contentful
   * We'll fill out our independant configurations from this state
   * (See above formConfig & stepConfig)
   * */
  useEffect(
    () => {
      if (sdk.field?.getValue instanceof Function) {
        const value = sdk.field.getValue() || {};

        // Handle parsing of a blocked field
        // We do this to prevent contentful from publishing
        if (value.error) {
          return loadState(value.error);
        }

        return loadState(value);
      }

      // explicit for eslint
      return undefined;
    },
    // I only actually want to update when the field changes
    // this is only initial configuration setup
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sdk.field]
  );

  switch (getModal(sdk)) {
    case 'editor-modal':
      return <EditorModal />;

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

  /**
   * Since we have a separate header section where we input
   * the remote form ID and provider, we'll only allow direct editing
   * of the form steps section
   * */
  const getEditableValue = () => {
    const { provider, ...rest } = sdk.field.getValue() || {};
    return rest;
  };

  const onFieldClick = (field, step) => {
    console.log('Field click');
    showModal(sdk, { name: 'editor-modal' }, { steps: stepConfig.steps, field })
      // When the user clicks save in the modal we'll get the new field back
      // orr null if the user clicks cancel
      .then(({ field: newField } = {}) => newField && fieldConfig.fieldEdit(step.id, newField));
  };

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
          <SectionWrapper
            title={
              <SectionHeaderWithButton>
                Form Content
                <Button
                  onClick={() =>
                    showModal(sdk, { name: 'editor-modal' }, { steps: stepConfig.steps }).then(
                      ({ steps }) =>
                        // If new steps are returned from the modal
                        // the user clicked the confirm button, if null it's cancel
                        steps &&
                        stepConfig.stepsUpdate(
                          steps,
                          // & also save to contentful
                          true
                        )
                    )
                  }>
                  Edit Form
                </Button>
              </SectionHeaderWithButton>
            }>
            <StepList
              readOnly
              autoexpand={false}
              stepConfig={stepConfig}
              fieldConfig={fieldConfig}
              onFieldClick={onFieldClick}
            />
          </SectionWrapper>
        </>
      )}
      {jsonMode && (
        <JsonInput
          value={JSON.stringify(getEditableValue(), null, 2)}
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
}

export default FormBuilder;
