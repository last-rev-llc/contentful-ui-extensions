import { renderHook, act } from '@testing-library/react-hooks';
import useFormSteps from './useFormSteps';
import useFieldConfig from './useFieldConfig';

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

  function getFields({ current }) {
    return current.steps.reduce((acc, i) => acc.concat(i.fields), []);
  }

  it('can remove a field', () => {
    const { result: steps } = renderHook(() => useFormSteps(defaultSteps));
    const { result: fields } = renderHook(() => useFieldConfig(steps.current.stepEdit));

    act(() => fields.current.fieldRemove('step-id', { id: 'first-id' }));

    expect(getFields(steps).length).toEqual(1);
  });

  it('can edit a field', () => {
    const { result: steps } = renderHook(() => useFormSteps(defaultSteps));
    const { result: fields } = renderHook(() => useFieldConfig(steps.current.stepEdit));

    act(() => fields.current.fieldEdit('step-id', { id: 'first-id', title: 'test' }));

    expect(getFields(steps)[0]).toMatchObject({ title: 'test' });
  });

  it('can add a field', () => {
    const { result: steps } = renderHook(() => useFormSteps(defaultSteps));
    const { result: fields } = renderHook(() => useFieldConfig(steps.current.stepEdit));

    act(() => fields.current.fieldAdd('step-id'));

    expect(getFields(steps).length).toEqual(3);
  });

  it('can reorder fields', () => {
    const { result: steps } = renderHook(() => useFormSteps(defaultSteps));
    const { result: fields } = renderHook(() => useFieldConfig(steps.current.stepEdit));

    act(() => fields.current.fieldReorder('step-id', { oldIndex: 0, newIndex: 1 }));

    expect(getFields(steps)[0].id).toEqual('second-id');
  });
});
