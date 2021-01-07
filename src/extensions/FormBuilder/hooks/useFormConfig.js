import useFormSteps from './useFormSteps';
import useProviderConfig from './useProviderConfig';

import { buildStep, ensureIds } from './utils';

export default function useFormConfig(handleFieldChange) {
  const formConfig = useProviderConfig({}, handleFieldChange);
  const stepConfig = useFormSteps([buildStep('First step')], handleFieldChange);

  const loadState = ({ steps = [], provider = {} }) => {
    if (steps && steps.length > 0) {
      stepConfig.stepsUpdate(ensureIds(steps), false);
    }
    if (provider && Object.keys(provider).length > 0) {
      formConfig.update(provider);
    }
  };

  return { formConfig, stepConfig, loadState };
}
