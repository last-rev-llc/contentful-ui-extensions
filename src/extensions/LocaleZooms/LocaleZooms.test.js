import React from 'react';
import _ from 'lodash';
import { render, cleanup, configure, fireEvent, waitForElement } from '@testing-library/react';
import LocaleZooms, { 
  withBlankOption, 
  isToLength,
  blankOptionValue,
  blankOptionName,
  uniqueErrorMessage,
  localeRequiredErrorMessage,
  zoomIdRequiredErrorMessage,
  zoomIdLengthErrorMessage,
  zoomIdLengthMin,
  zoomIdLengthMax 
} from './LocaleZooms';

import sdk from './mockSdk';

configure({
  testIdAttribute: 'data-test-id',
});

afterEach(() => {
  cleanup();
});

describe('LocaleZooms helper methods', () => {
  describe('withBlankOption(options)', () => {
  
  });

  describe('isToLength(id)', () => {
  
  });
});

describe('<LocaleZooms />', () => {
  const inputTestId = 'cf-ui-text-input-';
  const selectTestId = 'cf-ui-select-';
  const buttonTestId = 'cf-ui-button-';
  const factoryLocaleTestId = `${selectTestId}locales-factory`;
  const factoryZoomIdTestId = `${inputTestId}zoom-id-factory`;
  const addButtonTestId = `${buttonTestId}Click to add a new row-factory`;

  describe('initialize with useEffect()', () => {
    test('field factory is rendered with blank values', () => {
      const { getByTestId } = render(<LocaleZooms sdk={sdk} />);
      const localeField = getByTestId(factoryLocaleTestId);
      const zoomIdField = getByTestId(factoryZoomIdTestId);
      
      expect(localeField).toBeTruthy();
      expect(zoomIdField).toBeTruthy();
      expect(getByTestId(addButtonTestId)).toBeTruthy();
      expect(localeField.value).toBe('blank');
      expect(zoomIdField.value).toBe('');
    });

    test('correct number of fieldItems are rendered', () => {
      const { getAllByTestId } = render(<LocaleZooms sdk={sdk} />);
      expect(getAllByTestId('field-item').length).toBe(_.keys(sdk.field.getValue()).length);
    });
  });

  describe('sortedOptions(options)', () => {
    test.todo('test sortedOptions');
  });

  describe('prepareOptions(options)', () => {
    test.todo('test prepareOptions');
  });

  describe('adjustLocales(locales)', () => {
    test.todo('test adjustLocales');
  });

  describe('getListErrors(position)', () => {
    test.todo('test getListErrors');
  });

  describe('getFactoryErrors(position)', () => {
    test.todo('test getFactoryErrors');
  });

  describe('getFieldFactory()', () => {
    const changedLocale = 'fr';
    const blank = '';

    test('shows a locale and zoom id with blank values, and an add button', () => {
      const { getByTestId } = render(<LocaleZooms sdk={sdk} />);
      const localeField = getByTestId(factoryLocaleTestId);
      const zoomIdField = getByTestId(factoryZoomIdTestId);
      const addButton = getByTestId(addButtonTestId);

      expect(localeField).toBeTruthy();
      expect(zoomIdField).toBeTruthy();
      expect(addButton).toBeTruthy();
      expect(localeField.value).toBe('blank');
      expect(zoomIdField.value).toBe(blank);
    });

    describe('when add button is pressed', () => {
      describe('blank locale error should show if', () => {
        test('locale is blank and zoom id is blank', () => {
          const { getByTestId } = render(<LocaleZooms sdk={sdk} />);
          const localeField = getByTestId(factoryLocaleTestId);
          const zoomIdField = getByTestId(factoryZoomIdTestId);

          expect(localeField.value).toBe('blank');
          expect(zoomIdField.value).toBe(blank);

          fireEvent.click(getByTestId(addButtonTestId));
          const factoryError = getByTestId('error-factory');

          expect(factoryError).toBeTruthy();
          expect(factoryError.textContent).toBe(localeRequiredErrorMessage);
        });

        test('locale is blank and zoom id is not blank', () => {
          const { getByTestId } = render(<LocaleZooms sdk={sdk} />);
          const localeField = getByTestId(factoryLocaleTestId);
          const zoomIdField = getByTestId(factoryZoomIdTestId);

          fireEvent.change(zoomIdField, { target: { value: changedLocale } });
          expect(localeField.value).toBe('blank');
          expect(zoomIdField.value).toBe(changedLocale);

          fireEvent.click(getByTestId(addButtonTestId));
          const factoryError = getByTestId('error-factory');

          expect(factoryError).toBeTruthy();
          expect(factoryError.textContent).toBe(localeRequiredErrorMessage);
        });
      });

      describe('no errors should show and field item is added to list if', () => {
        const newPosition = 1;
        const zoomId = '0123456789';

        test('locale is not blank, and zoom id is not blank and has 10 or 11 digits', () => {
          const { getByTestId, queryByTestId, getAllByTestId } = render(<LocaleZooms sdk={sdk} />);
          const localeField = getByTestId(factoryLocaleTestId);
          const zoomIdField = getByTestId(factoryZoomIdTestId);
          const fieldListLength = getAllByTestId('field-item').length;

          fireEvent.change(zoomIdField, { target: { value: zoomId } });
          fireEvent.change(localeField, { target: { value: changedLocale } });
          fireEvent.click(getByTestId('cf-ui-select-option-fr-factory'));
          expect(localeField.value).toBe(changedLocale);
          expect(zoomIdField.value).toBe(zoomId);
  
          fireEvent.click(getByTestId(addButtonTestId));
          expect(queryByTestId('error-factory')).toBeNull();
          expect(getAllByTestId('field-item').length).toBe(fieldListLength + 1);
          expect(getByTestId(`${selectTestId}locales-${newPosition}`).value).toBe(changedLocale);
          expect(getByTestId(`${inputTestId}zoom-id-${newPosition}`).value).toBe(zoomId);
          expect(localeField.value).toBe('blank');
          expect(zoomIdField.value).toBe(blank);
        });
      });
    });
  });

  describe('getFieldItem(localeInput, zoomIdInput, position)', () => {
    const localeInput = 'en-US';
    const zoomIdInput = '9876543210';
    const newZoomIdInput = '0987654321';
    const position = 0;
    const newInput = 'es-MX';
    const localeTestId = `${selectTestId}locales-`;
    const zoomIdTestId = `${inputTestId}zoom-id-`;
    const localeTestIdFirst = `${localeTestId}${position}`;
    const zoomIdTestIdFirst = `${zoomIdTestId}${position}`;
    const editButton = `cf-ui-button-Click to edit this row-${position}`;
    const deleteButton = `cf-ui-button-Click to remove this row-${position}`;
    const saveButton = `cf-ui-button-Save-${position}`;
    const cancelButton = `cf-ui-button-Cancel-${position}`;
    const errorMessage = `error-${position}`;

    test('shows nameField with value equal to nameInput and is disabled', () => {
      const { getByTestId } = render(<LocaleZooms sdk={sdk} />);
      const localeField = getByTestId(localeTestIdFirst);

      expect(localeField).toBeTruthy();
      expect(localeField.value).toBe(localeInput);
      expect(localeField.disabled).toEqual(true);
    });

    test('shows valueField with value equal to valueInput', () => {
      const { getByTestId } = render(<LocaleZooms sdk={sdk} />);
      const zoomIdField = getByTestId(zoomIdTestIdFirst);

      expect(zoomIdField).toBeTruthy();
      expect(zoomIdField.value).toBe(zoomIdInput);
    });

    test('shows an edit button and a delete button', () => {
      const { getByTestId } = render(<LocaleZooms sdk={sdk} />);
      expect(getByTestId(editButton)).toBeTruthy();
      expect(getByTestId(deleteButton)).toBeTruthy();
    });

    test('removes FieldItem from list when delete button is pressed', async () => {
      const { getByTestId, getAllByTestId, queryByTestId } = render(<LocaleZooms sdk={sdk} />);
      const fieldListLength = getAllByTestId('field-item').length;

      fireEvent.click(getByTestId(deleteButton));
      await waitForElement(() => getAllByTestId('field-item'));

      expect(getAllByTestId('field-item').length).toBe(fieldListLength - 1);
      expect(getByTestId(localeTestIdFirst).value).not.toBe(localeInput);
      expect(queryByTestId(`${localeTestId}1`)).toBeNull();
    });

    describe('when edit button is pressed', () => {
      test('shows save button and cancel button', () => {
        const { getByTestId } = render(<LocaleZooms sdk={sdk} />);
  
        fireEvent.click(getByTestId(editButton));
        expect(getByTestId(saveButton)).toBeTruthy();
        expect(getByTestId(cancelButton)).toBeTruthy();
      });
  
      test('locale and zoom id are editable', () => {
        const { getByTestId } = render(<LocaleZooms sdk={sdk} />);
  
        fireEvent.click(getByTestId(editButton));
        expect(getByTestId(localeTestIdFirst).disabled).toEqual(false);
        expect(getByTestId(zoomIdTestIdFirst).disabled).toEqual(false);
      });

      describe('when save button is pressed', () => {
        describe('new fieldItem is added and old one is removed if', () => {
          describe('locale is changed and', () => {
            test('zoom id is not changed', () => {
              const { getByTestId } = render(<LocaleZooms sdk={sdk} />);
          
              fireEvent.click(getByTestId(editButton));
              fireEvent.change(getByTestId(localeTestIdFirst), { target: { value: newInput } });
              fireEvent.click(getByTestId(saveButton));

              expect(getByTestId(localeTestIdFirst).value).not.toBe(localeInput);
              expect(getByTestId(`${localeTestId}1`).value).not.toBe(localeInput);

              expect(getByTestId(`${localeTestId}1`).value).toBe(newInput);
              expect(getByTestId(`${localeTestId}1`).disabled).toEqual(true);
              expect(getByTestId(`${zoomIdTestId}1`).value).toBe(zoomIdInput);
              expect(getByTestId(`${zoomIdTestId}1`).disabled).toEqual(true);
            });

            test('zoom id is changed', () => {
              const { getByTestId } = render(<LocaleZooms sdk={sdk} />);
          
              fireEvent.click(getByTestId(editButton));
              fireEvent.change(getByTestId(localeTestIdFirst), { target: { value: newInput } });
              fireEvent.change(getByTestId(zoomIdTestIdFirst), { target: { value: newZoomIdInput } });
              fireEvent.click(getByTestId(saveButton));

              expect(getByTestId(localeTestIdFirst).value).not.toBe(localeInput);
              expect(getByTestId(`${localeTestId}1`).value).not.toBe(localeInput);

              expect(getByTestId(`${localeTestId}1`).value).toBe(newInput);
              expect(getByTestId(`${localeTestId}1`).disabled).toEqual(true);
              expect(getByTestId(`${zoomIdTestId}1`).value).toBe(newZoomIdInput);
              expect(getByTestId(`${zoomIdTestId}1`).disabled).toEqual(true);
            });
          });
        });

        describe('blank locale error shows if locale is blank and zoom id is', () => {
          test('changed', () => {
            const { getByTestId } = render(<LocaleZooms sdk={sdk} />);

            fireEvent.click(getByTestId(editButton));
            fireEvent.change(getByTestId(localeTestIdFirst), { target: { value: 'blank' } });
            fireEvent.change(getByTestId(zoomIdTestIdFirst), { target: { value: newZoomIdInput } });
            fireEvent.click(getByTestId(saveButton));

            expect(getByTestId(errorMessage)).toBeTruthy();
            expect(getByTestId(errorMessage).textContent).toBe(localeRequiredErrorMessage);
          });

          test('not changed', () => {
            const { getByTestId } = render(<LocaleZooms sdk={sdk} />);

            fireEvent.click(getByTestId(editButton));
            fireEvent.change(getByTestId(localeTestIdFirst), { target: { value: 'blank' } });
            fireEvent.click(getByTestId(saveButton));

            expect(getByTestId(errorMessage)).toBeTruthy();
            expect(getByTestId(errorMessage).textContent).toBe(localeRequiredErrorMessage);
          });
        });

        describe('locale and zoom id is disabled if', () => {
          test('locale is not changed and zoom id is changed', async () => {
            const { getByTestId } = render(<LocaleZooms sdk={sdk} />);

            fireEvent.click(getByTestId(editButton));
            fireEvent.change(getByTestId(zoomIdTestIdFirst), { target: { value: newZoomIdInput } });
            fireEvent.click(getByTestId(saveButton));

            expect(getByTestId(localeTestIdFirst).value).toBe(localeInput);
            expect(getByTestId(zoomIdTestIdFirst).value).toBe(newZoomIdInput);
            expect(getByTestId(localeTestIdFirst).disabled).toEqual(true);
            expect(getByTestId(zoomIdTestIdFirst).disabled).toEqual(true);
          });

          test('locale is not changed and zoom id is not changed', () => {
            const { getByTestId } = render(<LocaleZooms sdk={sdk} />);

            fireEvent.click(getByTestId(editButton));
            fireEvent.click(getByTestId(saveButton));

            expect(getByTestId(localeTestIdFirst).value).toBe(localeInput);
            expect(getByTestId(zoomIdTestIdFirst).value).toBe(zoomIdInput);
            expect(getByTestId(localeTestIdFirst).disabled).toEqual(true);
            expect(getByTestId(zoomIdTestIdFirst).disabled).toEqual(true);
          });
        });
      });

      describe('when cancel button is pressed', () => {
        describe('locale and zoom id are disabled if', () => {
          test('locale and zoom id are not changed', () => {
            const { getByTestId } = render(<LocaleZooms sdk={sdk} />);

            fireEvent.click(getByTestId(editButton));
            fireEvent.click(getByTestId(cancelButton));

            expect(getByTestId(localeTestIdFirst).value).toBe(localeInput);
            expect(getByTestId(zoomIdTestIdFirst).value).toBe(zoomIdInput);
            expect(getByTestId(localeTestIdFirst).disabled).toEqual(true);
            expect(getByTestId(zoomIdTestIdFirst).disabled).toEqual(true);
          });

          test('locale and zoom id are changed', () => {
            const { getByTestId } = render(<LocaleZooms sdk={sdk} />);

            fireEvent.click(getByTestId(editButton));
            fireEvent.change(getByTestId(localeTestIdFirst), { target: { value: newInput } });
            fireEvent.change(getByTestId(zoomIdTestIdFirst), { target: { value: newZoomIdInput } });
            fireEvent.click(getByTestId(cancelButton));

            expect(getByTestId(localeTestIdFirst).value).toBe(localeInput);
            expect(getByTestId(zoomIdTestIdFirst).value).toBe(zoomIdInput);
            expect(getByTestId(localeTestIdFirst).disabled).toEqual(true);
            expect(getByTestId(zoomIdTestIdFirst).disabled).toEqual(true);
          });

          test('only nameField is changed', () => {
            const { getByTestId } = render(<LocaleZooms sdk={sdk} />);

            fireEvent.click(getByTestId(editButton));
            fireEvent.change(getByTestId(localeTestIdFirst), { target: { value: newInput } });
            fireEvent.click(getByTestId(cancelButton));

            expect(getByTestId(localeTestIdFirst).value).toBe(localeInput);
            expect(getByTestId(zoomIdTestIdFirst).value).toBe(zoomIdInput);
            expect(getByTestId(localeTestIdFirst).disabled).toEqual(true);
            expect(getByTestId(zoomIdTestIdFirst).disabled).toEqual(true);
          });

          test('only zoom id is changed', () => {
            const { getByTestId } = render(<LocaleZooms sdk={sdk} />);

            fireEvent.click(getByTestId(editButton));
            fireEvent.change(getByTestId(zoomIdTestIdFirst), { target: { value: newZoomIdInput } });
            fireEvent.click(getByTestId(cancelButton));

            expect(getByTestId(localeTestIdFirst).value).toBe(localeInput);
            expect(getByTestId(zoomIdTestIdFirst).value).toBe(zoomIdInput);
            expect(getByTestId(localeTestIdFirst).disabled).toEqual(true);
            expect(getByTestId(zoomIdTestIdFirst).disabled).toEqual(true);
          });
        });
      });
    });
  });
});