import { act } from '@testing-library/react-hooks';

import { getStepsStateShim } from './test.helpers';

describe('useFormSteps', () => {
  const defaultSteps = [{ id: '9b33fea9', fields: [] }];

  it('loads the steps correctly', () => {
    const { result } = getStepsStateShim(defaultSteps);

    expect(result.current.state.steps).toMatchObject(defaultSteps);
  });

  it('updates a single step correctly', () => {
    const { result } = getStepsStateShim(defaultSteps);

    const firstStep = defaultSteps[0];
    act(() => result.current.formSteps.stepEdit('9b33fea9', { ...firstStep, title: 'Test' }));

    expect(result.current.state.steps[0]).toMatchObject({ ...firstStep, title: 'Test' });
  });

  it('updates a single step correctly (functional)', () => {
    const { result } = getStepsStateShim(defaultSteps);

    const firstStep = defaultSteps[0];
    act(() => result.current.formSteps.stepEdit('9b33fea9', (oldStep) => ({ ...oldStep, title: 'Test' })));

    expect(result.current.state.steps[0]).toMatchObject({ ...firstStep, title: 'Test' });
  });

  it('adds a new step', () => {
    const { result } = getStepsStateShim(defaultSteps);

    act(() => result.current.formSteps.stepAdd());

    expect(result.current.state.steps.length).toEqual(2);
  });

  it('removes a step', () => {
    const { result } = getStepsStateShim(defaultSteps);

    act(() => result.current.formSteps.stepAdd());
    act(() => result.current.formSteps.stepRemove(result.current.state.steps[1]));

    expect(result.current.state.steps.length).toEqual(1);
  });

  it('can reorder steps', () => {
    const { result } = getStepsStateShim(defaultSteps);

    act(() => result.current.formSteps.stepAdd());
    act(() => result.current.formSteps.stepReorder({ oldIndex: 0, newIndex: 1 }));

    expect(result.current.state.steps[0].id).not.toEqual('9b33fea9');
  });
});
