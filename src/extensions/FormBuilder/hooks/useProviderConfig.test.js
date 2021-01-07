import { useState } from 'react';
import { clone, set } from 'lodash';
import { renderHook, act } from '@testing-library/react-hooks';

import useProviderConfig from './useProviderConfig';

function getProviderHook(defaultProvider = {}) {
  return renderHook(() => {
    const [internalState, setInternalState] = useState({ provider: defaultProvider });

    const setState = (key, value) => setInternalState(set(clone(internalState), key, value));

    return useProviderConfig(setState, internalState);
  });
}

describe('useProviderConfig', () => {
  const type = 'test-type';
  const formId = 'test-formId';
  const portalId = 'test-portalId';

  const defaultProvider = { type, parameters: { formId, portalId } };
  const defaultResult = { type, formId, portalId };

  it('loads current provider', () => {
    const { result } = getProviderHook(defaultProvider);
    expect(result.current).toMatchObject(defaultResult);
  });

  it('can change formId', () => {
    const { result } = getProviderHook(defaultProvider);
    act(() => result.current.setFormId('test-change'));
    expect(result.current.formId).toEqual('test-change');
  });

  it('can change portalId', () => {
    const { result } = getProviderHook(defaultProvider);
    act(() => result.current.setPortalId('test-change'));
    expect(result.current.portalId).toEqual('test-change');
  });

  it('can change type', () => {
    const { result } = getProviderHook(defaultProvider);

    act(() => result.current.setFormId('custom'));
    act(() => result.current.setPortalId('custom'));

    expect(result.current.formId).toEqual('custom');
    expect(result.current.portalId).toEqual('custom');

    act(() => result.current.setType('custom'));

    expect(result.current.type).toEqual('custom');

    // These should be removed when changing the type
    expect(result.current.formId).toEqual(null);
    expect(result.current.portalId).toEqual(null);
  });

  it('preserves properties when changing to another url type', () => {
    const { result } = getProviderHook(defaultProvider);

    act(() => result.current.setFormId('custom'));
    act(() => result.current.setPortalId('custom'));

    act(() => result.current.setType('hubspot'));

    expect(result.current.type).toEqual('hubspot');

    // These should be removed when changing the type
    expect(result.current.formId).toEqual('custom');
    expect(result.current.portalId).toEqual('custom');
  });

  it('can update state', () => {
    const { result } = getProviderHook(defaultProvider);

    act(() => result.current.update({ parameters: { formId: 'test', portalId: 'test2' }, type: 'hubspot' }));

    expect(result.current).toMatchObject({ formId: 'test', portalId: 'test2', type: 'hubspot' });
  });
});
