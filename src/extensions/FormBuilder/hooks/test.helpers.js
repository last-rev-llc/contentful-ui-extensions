import { useState } from 'react';
import { clone, set } from 'lodash';
import { renderHook, act } from '@testing-library/react-hooks';
import useFormSteps from './useFormSteps';

/* eslint-disable import/prefer-default-export */
export function getStepsStateShim(defaultSteps = []) {
  // Now render our formSteps functionality
  return renderHook(() => {
    const [internalState, setInternalState] = useState({ steps: defaultSteps });

    // the functionality passed to useFormSteps should set a deep key in the state
    // we can use lodash set for this purpose
    const setStateWrapper = (key, value) => act(() => setInternalState(set(clone(internalState), key, value)));

    return { formSteps: useFormSteps(setStateWrapper, internalState), state: internalState };
  });
}
