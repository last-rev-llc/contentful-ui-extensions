import { renderHook, act } from '@testing-library/react-hooks';
import useFieldConfig from './useFieldConfig';

import { getStepsStateShim } from './useFormSteps.test';

describe('useFieldConfig', () => {
  const defaultSteps = [
    {
      id: 'step-id',
      fields: [
        //
        { id: 'first-id' },
        { id: 'second-id' }
      ]
    }
  ];

  function getFields({ steps }) {
    return steps.reduce((acc, i) => acc.concat(i.fields), []);
  }

  it('can remove a field', () => {
    const { result } = getStepsStateShim(defaultSteps);
    const { result: fields } = renderHook(() => useFieldConfig(result.current.formSteps.stepEdit));

    act(() => fields.current.fieldRemove('step-id', { id: 'first-id' }));

    expect(getFields(result.current.state).length).toEqual(1);
  });

  it('can edit a field', () => {
    const { result } = getStepsStateShim(defaultSteps);
    const { result: fields } = renderHook(() => useFieldConfig(result.current.formSteps.stepEdit));

    act(() => fields.current.fieldEdit('step-id', { id: 'first-id', title: 'test' }));

    expect(getFields(result.current.state)[0]).toMatchObject({ title: 'test' });
  });

  it('can add a field', () => {
    const { result } = getStepsStateShim(defaultSteps);
    const { result: fields } = renderHook(() => useFieldConfig(result.current.formSteps.stepEdit));

    act(() => fields.current.fieldAdd('step-id'));

    expect(getFields(result.current.state).length).toEqual(3);
  });

  it('can reorder fields', () => {
    const { result } = getStepsStateShim(defaultSteps);
    const { result: fields } = renderHook(() => useFieldConfig(result.current.formSteps.stepEdit));

    act(() => fields.current.fieldReorder('step-id', { oldIndex: 0, newIndex: 1 }));

    expect(getFields(result.current.state)[0].id).toEqual('second-id');
  });
});
