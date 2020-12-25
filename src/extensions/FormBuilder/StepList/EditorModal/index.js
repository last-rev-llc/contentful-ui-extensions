import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Card, Heading } from '@contentful/forma-36-react-components';

import { useFormSteps, useFieldConfig } from '../../hooks';
import { useSDK } from '../../../../context';

import StepList from '../StepList';
import StepEditor from '../StepModal/StepEditor';
import FieldEditor from '../FieldModal/FieldEditor';
import { ModalStyle } from '../styles';

const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const EditorStyle = styled(ModalStyle)`
  padding-bottom: 0;
  overflow: hidden;
`;

const SectionWrapper = styled(Row)`
  position: relative;
`;

const LeftSection = styled(Col)`
  overflow-y: scroll;
  width: 50%;
  max-height: 80vh;
  overflow-y: scroll;
`;

const RightSection = styled(Col)`
  width: 50%;
  bottom: 0;

  align-items: center;
`;

function EditorModal() {
  const sdk = useSDK();

  const stepConfig = useFormSteps(sdk.parameters.invocation.steps);
  const fieldConfig = useFieldConfig(stepConfig.stepEdit);

  const [selection, setSelection] = useState(null);

  const isSelected = (type) => selection && selection.type === type;

  return (
    <EditorStyle>
      <Heading>Edit Form</Heading>
      <SectionWrapper>
        <LeftSection>
          <StepList
            minimal
            stepConfig={stepConfig}
            fieldConfig={fieldConfig}
            onStepClick={(step) => setSelection({ type: 'step', step })}
            onFieldClick={(field, step) => setSelection({ type: 'field', step, field })}
          />
        </LeftSection>
        <RightSection>
          {!selection && <Card>Nothing selected</Card>}
          {isSelected('step') && <StepEditor step={selection.step} />}
          {isSelected('field') && <FieldEditor field={selection.field} />}
        </RightSection>
      </SectionWrapper>
    </EditorStyle>
  );
}

export default EditorModal;
