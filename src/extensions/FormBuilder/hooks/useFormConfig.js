import useFormSteps from './useFormSteps';
import useProviderConfig from './useProviderConfig';

import { ensureIds } from './utils';

/**
 * Wrapper over other hooks which provide most of our form builder functionality
 * These functionalities include adding, editing, deleting and reordering steps & fields.
 *
 * the useProviderConfig is our main form configuration
 * */
export default function useFormConfig(handleFieldChange, initialState = {}) {
  const stepConfig = useFormSteps(handleFieldChange, initialState);
  const formConfig = useProviderConfig(handleFieldChange, initialState);

  const loadState = ({ steps = [], provider = {} }) => {
    if (steps && steps.length > 0) {
      stepConfig.stepsUpdate(ensureIds(steps));
    }

    if (provider && Object.keys(provider).length > 0) {
      formConfig.update(provider);
    }
  };

  return { formConfig, stepConfig, loadState };
}
