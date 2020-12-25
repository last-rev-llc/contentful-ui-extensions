import React, { useState } from 'react';
import { curry, omit } from 'lodash/fp';

import { useSDK } from '../../../../context';

import { ModalStyle } from '../styles';
import { normalizeValues } from '../utils';
import StepEditor from './StepEditor';

function StepModal() {
  const sdk = useSDK();
  const { invocation } = sdk.parameters;
  const [step, setStep] = useState(omit(['modal'], normalizeValues(invocation.step)));

  const updateStep = curry((key, value) => {
    setStep((prev) => ({
      ...prev,
      [key]: value
    }));
  });

  return (
    <ModalStyle>
      <StepEditor step={step} updateStep={updateStep} />
    </ModalStyle>
  );
}

export default StepModal;
