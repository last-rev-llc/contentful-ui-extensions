import React from 'react';
import { render, cleanup, act } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import 'react-select';
import axios from 'axios';
import FormStack from './FormStack';
import sdk from './mockSdk';
import mockForms from './__mocks__/mockForms';

let mockData;
let formLength;
jest.mock('axios');
jest.mock('react-select', () => ({ options, value, onChange }) => {
  function handleChange(event) {
    const option = options.find((opt) => opt.value === event.currentTarget.value);
    onChange(option);
  }
  return (
    // eslint-disable-next-line jsx-a11y/no-onchange
    <select id="formstack-select-id" data-testid="formstack-select" value={value} onChange={handleChange}>
      {options.map((opt, index) => {
        const key = index;
        return (
          <option data-testid="formstack-select-item" key={key} value={opt.value}>
            {opt.label}
          </option>
        );
      })}
    </select>
  );
});

beforeEach(() => {
  formLength = 5;
  mockData = mockForms(formLength);
  const response = { data: { forms: mockData } };
  axios.mockImplementation(() => Promise.resolve(response));
});

afterEach(() => {
  cleanup();
});

describe('<FormStack sdk={sdk} />', () => {
  describe('<FormStack /> renders', () => {
    test('renders correctly', async () => {
      await act(async () => {
        const { getByTestId } = render(<FormStack sdk={sdk} />);
        expect(getByTestId('formstack-select')).toBeTruthy();
      });
    });

    test('renders correct options', async () => {
      const mockedData = mockData;
      await act(async () => {
        const { getAllByTestId } = render(<FormStack sdk={sdk} />);
        await waitFor(() => expect(getAllByTestId('formstack-select-item').length).toBe(formLength));

        expect(
          getAllByTestId('formstack-select-item').every((item, index) => item.textContent === mockedData[index].name)
        ).toBeTruthy();
        expect(
          getAllByTestId('formstack-select-item').every((item, index) => item.value === mockedData[index].id.toString())
        ).toBeTruthy();
      });
    });
  });
});
