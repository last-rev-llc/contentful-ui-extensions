import React from 'react';
import { render, configure } from '@testing-library/react';
import { arraySimpleObject } from '../mockSdk';
import { getArrayValue, arrayListTestId, arrayListItemTestId } from './index';

configure({
  testIdAttribute: 'data-test-id',
});

describe('getArrayValue(arrayField = { id, type, value, arrayType, label, asset })', () => {
  test('returns html for array and all of its values in a list', () => {
    const { getAllByTestId, queryByTestId } = render(<div dangerouslySetInnerHTML={{__html: getArrayValue(arraySimpleObject)}} />);
    expect(queryByTestId(arrayListTestId)).toBeTruthy();
    expect(getAllByTestId(arrayListItemTestId).length).toBe(arraySimpleObject.value.length);
    expect(getAllByTestId(arrayListItemTestId).every((item, i) => item.textContent === arraySimpleObject.value[i])).toBeTruthy();
  });
});
