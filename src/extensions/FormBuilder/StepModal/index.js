import React, { useState } from 'react';
import { curry, omit } from 'lodash/fp';

import { Heading } from '@contentful/forma-36-react-components';
import { useSDK } from '../../../context';

import { ModalStyle } from '../styles';
import StepEditor from './StepEditor';

function StepModal() {
  const sdk = useSDK();
  const { invocation } = sdk.parameters;
  const [step, setStep] = useState(omit(['modal'], invocation.step || {}));

  const updateStep = curry((key, value) => {
    setStep((prev) => ({
      ...prev,
      [key]: value
    }));
  });

  return (
    <ModalStyle>
      <Heading>Edit Step</Heading>
      <StepEditor step={step} updateStep={updateStep} />
    </ModalStyle>
  );
}

export default StepModal;
