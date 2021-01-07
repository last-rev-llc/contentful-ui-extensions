import { renderHook, act } from '@testing-library/react-hooks';
import useFormSteps from './useFormSteps';

describe('useFormSteps', () => {
  const defaultSteps = [{ id: '9b33fea9', fields: [] }];

  it('loads the steps correctly', () => {
    const { result } = renderHook(() => useFormSteps(defaultSteps));

    expect(result.current.steps).toMatchObject(defaultSteps);
  });

  it('updates a single step correctly', () => {
    const { result } = renderHook(() => useFormSteps(defaultSteps));

    const firstStep = defaultSteps[0];
    act(() => result.current.stepEdit('9b33fea9', { ...firstStep, title: 'Test' }));

    expect(result.current.steps[0]).toMatchObject({ ...firstStep, title: 'Test' });
  });

  it('updates a single step correctly (functional)', () => {
    const { result } = renderHook(() => useFormSteps(defaultSteps));

    const firstStep = defaultSteps[0];
    act(() => result.current.stepEdit('9b33fea9', (oldStep) => ({ ...oldStep, title: 'Test' })));

    expect(result.current.steps[0]).toMatchObject({ ...firstStep, title: 'Test' });
  });

  it('adds a new step', () => {
    const { result } = renderHook(() => useFormSteps(defaultSteps));

    act(() => result.current.stepAdd());

    expect(result.current.steps.length).toEqual(2);
  });

  it('removes a step', () => {
    const { result } = renderHook(() => useFormSteps(defaultSteps));

    act(() => result.current.stepAdd());
    act(() => result.current.stepRemove(defaultSteps[0]));

    expect(result.current.steps.length).toEqual(1);
  });

  it('can reorder steps', () => {
    const { result } = renderHook(() => useFormSteps(defaultSteps));

    act(() => result.current.stepAdd());
    act(() => result.current.stepReorder({ oldIndex: 0, newIndex: 1 }));

    expect(result.current.steps[0].id).not.toEqual('9b33fea9');
  });
});
