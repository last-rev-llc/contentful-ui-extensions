import React from 'react';
import _ from 'lodash';
import { render, cleanup, configure, fireEvent } from '@testing-library/react';
import LocalizationLookup, { 
  renderError, 
  renderButton, 
  renderNameField,
  renderValueField,
  renderFieldProperty,
  uniqueErrorMessage,
  nameRequiredErrorMessage
} from './LocalizationLookup';

import sdk from './mockSdk';

configure({
  testIdAttribute: 'data-test-id',
});

afterEach(() => {
  cleanup();
});

const inputTestId = 'cf-ui-text-input-key-';
const inputPosition = 0;
const inputNameTestId = `${inputTestId}name-${inputPosition}`;
const inputValueTestId = `${inputTestId}value-${inputPosition}`;

describe('LocalizationLookup helper methods', () => {
  describe('renderError(hasError, message, position)', () => {
    const message = 'message';
    const position = 'test';
    const testId = 'error-test';

    test('doesn\'t show message when hasError is false', () => {
      const { queryByTestId } = render(renderError(false, message, position));
      expect(queryByTestId(testId)).toBeNull();
    });
    test('shows message when hasError is true ', () => {
      const errorDiv = render(renderError(true, message, position));
      expect(errorDiv.queryByTestId(testId)).toBeTruthy();
      expect(errorDiv.queryByTestId(testId).textContent).toBe(message);
    });
  });
  
  describe('renderButton(label, buttonType, onClick, position)', () => {
    const label = 'label';
    const buttonType = 'primary';
    const buttonTypeRegEx = new RegExp(`${buttonType}`);
    const onClick = jest.fn();
    const testId = `cf-ui-button-${label}-${inputPosition}`;

    test('shows a button with text equal to label', () => {
      const { getByTestId } = render(renderButton(label, buttonType, onClick, inputPosition));
      const button = getByTestId(testId);

      expect(button).toBeTruthy();
      expect(button.textContent).toBe(label);
    });
    test('has class equal to buttonType', () => {
      const { getByTestId } = render(renderButton(label, buttonType, onClick, inputPosition));
      expect(getByTestId(testId).getAttribute('class')).toMatch(buttonTypeRegEx);
    });
    test('fires onClick when clicked', () => {
      const { getByTestId } = render(renderButton(label, buttonType, onClick, inputPosition));
      fireEvent.click(getByTestId(testId));
      expect(onClick).toHaveBeenCalled();
    });
  });
  
  describe('renderNameField(name, onChange, disable, position)', () => {
    const name = 'name';
    const changedName = 'changed';
    const onChange = jest.fn();

    test('shows text input with value equal to name', () => {
      const nameField = render(renderNameField(name, onChange, false, inputPosition));
      const nameFieldTextInput = nameField.getByTestId(inputNameTestId);
    
      expect(nameFieldTextInput).toBeTruthy();
      expect(nameFieldTextInput.value).toBe(name);
    });
    test('is disabled if disable is true', () => {
      const { getByTestId } = render(renderNameField(name, onChange, true, inputPosition));
      expect(getByTestId(inputNameTestId).disabled).toEqual(true);
    });
    test('is editable if disable is false', () => {
      const { getByTestId } = render(renderNameField(name, onChange, false, inputPosition));
      expect(getByTestId(inputNameTestId).disabled).toEqual(false);
    });
    test('onChange to be called when value changes', () => {
      const nameField = render(renderNameField(name, onChange, false, inputPosition));
      const nameFieldTextInput = nameField.getByTestId(inputNameTestId);
      
      fireEvent.change(nameFieldTextInput, { target: { value: changedName } });
      expect(onChange).toHaveBeenCalled();
      expect(nameFieldTextInput.value).toBe(changedName);
    });
  });
  
  describe('renderValueField(inputValue, onChange, position)', () => {
    const value = 'value';
    const changedValue = 'changed';
    const onChange = jest.fn();

    test('shows text input with value equal to inputValue', () => {
      const valueField = render(renderValueField(value, onChange, inputPosition));
      const valueFieldTextInput = valueField.getByTestId(inputValueTestId);
    
      expect(valueFieldTextInput).toBeTruthy();
      expect(valueFieldTextInput.value).toBe(value);
    });
    test('onChange is called when value changes', () => {
      const valueField = render(renderValueField(value, onChange, inputPosition));
      const valueFieldTextInput = valueField.getByTestId(inputValueTestId);
    
      fireEvent.change(valueFieldTextInput, { target: { value: changedValue } });
      expect(onChange).toHaveBeenCalled();
      expect(valueFieldTextInput.value).toBe(changedValue);
    });
  });
  
  describe('renderFieldProperty(nameInput, valueInput, onNameChange, onValueChange, disable, position)', () => {
    const name = 'name';
    const value = 'value';
    const nameChanged = 'nameChanged';
    const valueChanged = 'valueChanged';
    const onNameChange = jest.fn();
    const onValueChange = jest.fn();

    test('shows nameField text input with value equal to nameInput', () => {
      const fieldProperty = render(renderFieldProperty(name, value, onNameChange, onValueChange, false, inputPosition));
      const nameField = fieldProperty.getByTestId(inputNameTestId);
    
      expect(nameField).toBeTruthy();
      expect(nameField.value).toBe(name);
    });
    test('shows valueField text input with value equal to valueInput', () => {
      const fieldProperty = render(renderFieldProperty(name, value, onNameChange, onValueChange, false, inputPosition));
      const valueField = fieldProperty.getByTestId(inputValueTestId);
    
      expect(valueField).toBeTruthy();
      expect(valueField.value).toBe(value);
    });
    test('nameField is disabled when disable is true', () => {
      const { getByTestId } = render(renderFieldProperty(name, value, onNameChange, onValueChange, true, inputPosition));
      expect(getByTestId(inputNameTestId).disabled).toEqual(true);
    });
    test('nameField is editable when disable is false', () => {
      const { getByTestId } = render(renderFieldProperty(name, value, onNameChange, onValueChange, false, inputPosition));
      expect(getByTestId(inputNameTestId).disabled).toEqual(false);
    });
    test('onNameChange to be called when nameField value changes', () => {
      const fieldProperty = render(renderFieldProperty(name, value, onNameChange, onValueChange, false, inputPosition));
      const nameField = fieldProperty.getByTestId(inputNameTestId);
    
      fireEvent.change(nameField, { target: { value: nameChanged } });
      expect(onNameChange).toHaveBeenCalled();
      expect(nameField.value).toBe(nameChanged);
    });
    test('onValueChange to be called when valueField value changes', () => {
      const fieldProperty = render(renderFieldProperty(name, value, onNameChange, onValueChange, false, inputPosition));
      const valueField = fieldProperty.getByTestId(inputValueTestId);
    
      fireEvent.change(valueField, { target: { value: valueChanged } });
      expect(onValueChange).toHaveBeenCalled();
      expect(valueField.value).toBe(valueChanged);
    });
  });
});

describe('<LocalizationLookup />', () => {
  describe('initialize with useEffect()', () => {
    test('field factory is rendered with blank values', () => {
      const { getByTestId } = render(<LocalizationLookup sdk={sdk} />);
      const factoryNameField = getByTestId(`${inputTestId}name-factory`);
      const factoryValueField = getByTestId(`${inputTestId}value-factory`);
      
      expect(factoryNameField).toBeTruthy();
      expect(factoryValueField).toBeTruthy();
      expect(getByTestId('cf-ui-button-+-factory')).toBeTruthy();
      expect(factoryNameField.value).toBe('');
      expect(factoryValueField.value).toBe('');
    });

    test('correct number of fieldItems are rendered', () => {
      const { getAllByTestId } = render(<LocalizationLookup sdk={sdk} />);
      expect(getAllByTestId('field-item').length).toBe(_.keys(sdk.field.getValue()).length);
    });
  });

  describe('renderFieldFactory()', () => {
    const existingKey = 'key1';
    const changedText = 'test';
    const blank = '';

    test('shows a nameField and valueField with blank values, and an add button', () => {
      const { getByTestId } = render(<LocalizationLookup sdk={sdk} />);
      const factoryNameField = getByTestId(`${inputTestId}name-factory`);
      const factoryValueField = getByTestId(`${inputTestId}value-factory`);
      const addButton = getByTestId('cf-ui-button-+-factory');

      expect(factoryNameField).toBeTruthy();
      expect(factoryValueField).toBeTruthy();
      expect(addButton).toBeTruthy();
      expect(factoryNameField.value).toBe(blank);
      expect(factoryValueField.value).toBe(blank);
    });

    describe('when add button is pressed', () => {
      describe('blank name error should show if', () => {
        test('nameField is blank and valueField is blank', () => {
          const { getByTestId } = render(<LocalizationLookup sdk={sdk} />);
          const factoryNameField = getByTestId(`${inputTestId}name-factory`);
          const factoryValueField = getByTestId(`${inputTestId}value-factory`);

          expect(factoryNameField.value).toBe(blank);
          expect(factoryValueField.value).toBe(blank);

          fireEvent.click(getByTestId('cf-ui-button-+-factory'));
          const factoryError = getByTestId('error-factory');

          expect(factoryError).toBeTruthy();
          expect(factoryError.textContent).toBe(nameRequiredErrorMessage);
        });

        test('nameField is blank and valueField is not blank', () => {
          const { getByTestId } = render(<LocalizationLookup sdk={sdk} />);
          const factoryNameField = getByTestId(`${inputTestId}name-factory`);
          const factoryValueField = getByTestId(`${inputTestId}value-factory`);

          fireEvent.change(factoryValueField, { target: { value: changedText } });
          expect(factoryNameField.value).toBe(blank);
          expect(factoryValueField.value).toBe(changedText);

          fireEvent.click(getByTestId('cf-ui-button-+-factory'));
          const factoryError = getByTestId('error-factory');

          expect(factoryError).toBeTruthy();
          expect(factoryError.textContent).toBe(nameRequiredErrorMessage);
        });
      });

      describe('unique name error should show if', () => {
        test('nameField is already an existing key and valueField is blank', () => {
          const { getByTestId } = render(<LocalizationLookup sdk={sdk} />);
          const factoryNameField = getByTestId(`${inputTestId}name-factory`);
          const factoryValueField = getByTestId(`${inputTestId}value-factory`);
  
          fireEvent.change(factoryNameField, { target: { value: existingKey } });
          expect(factoryNameField.value).toBe(existingKey);
          expect(factoryValueField.value).toBe(blank);
  
          fireEvent.click(getByTestId('cf-ui-button-+-factory'));
          const factoryError = getByTestId('error-factory');
  
          expect(factoryError).toBeTruthy();
          expect(factoryError.textContent).toBe(uniqueErrorMessage);
        });
  
        test('nameField is already an existing key and valueField is not blank', () => {
          const { getByTestId } = render(<LocalizationLookup sdk={sdk} />);
          const factoryNameField = getByTestId(`${inputTestId}name-factory`);
          const factoryValueField = getByTestId(`${inputTestId}value-factory`);
  
          fireEvent.change(factoryNameField, { target: { value: existingKey } });
          fireEvent.change(factoryValueField, { target: { value: changedText } });
          expect(factoryNameField.value).toBe(existingKey);
          expect(factoryValueField.value).toBe(changedText);
  
          fireEvent.click(getByTestId('cf-ui-button-+-factory'));
          const factoryError = getByTestId('error-factory');
  
          expect(factoryError).toBeTruthy();
          expect(factoryError.textContent).toBe(uniqueErrorMessage);
        });
      });

      describe('no errors should show and field item is added to list if', () => {
        const newPosition = 5;

        test('nameField is not blank and not an existing key, and valueField is blank', () => {
          const { getByTestId, queryByTestId, getAllByTestId } = render(<LocalizationLookup sdk={sdk} />);
          const factoryNameField = getByTestId(`${inputTestId}name-factory`);
          const factoryValueField = getByTestId(`${inputTestId}value-factory`);
          const fieldListLength = getAllByTestId('field-item').length;
  
          fireEvent.change(factoryNameField, { target: { value: changedText } });
          expect(factoryNameField.value).toBe(changedText);
          expect(factoryValueField.value).toBe(blank);
  
          fireEvent.click(getByTestId('cf-ui-button-+-factory'));
          expect(queryByTestId('error-factory')).toBeNull();
          expect(getAllByTestId('field-item').length).toBe(fieldListLength + 1);
          expect(getByTestId(`${inputTestId}name-${newPosition}`).value).toBe(changedText);
          expect(getByTestId(`${inputTestId}value-${newPosition}`).value).toBe(blank);
          expect(factoryNameField.value).toBe(blank);
          expect(factoryValueField.value).toBe(blank);
        });
  
        test('nameField is not blank and not an existing key, and valueField is not blank', () => {
          const { getByTestId, queryByTestId, getAllByTestId } = render(<LocalizationLookup sdk={sdk} />);
          const factoryNameField = getByTestId(`${inputTestId}name-factory`);
          const factoryValueField = getByTestId(`${inputTestId}value-factory`);
          const fieldListLength = getAllByTestId('field-item').length;
  
          fireEvent.change(factoryNameField, { target: { value: changedText } });
          fireEvent.change(factoryValueField, { target: { value: changedText } });
          expect(factoryNameField.value).toBe(changedText);
          expect(factoryValueField.value).toBe(changedText);
  
          fireEvent.click(getByTestId('cf-ui-button-+-factory'));
          expect(queryByTestId('error-factory')).toBeNull();
          expect(getAllByTestId('field-item').length).toBe(fieldListLength + 1);
          expect(getByTestId(`${inputTestId}name-${newPosition}`).value).toBe(changedText);
          expect(getByTestId(`${inputTestId}value-${newPosition}`).value).toBe(changedText);
          expect(factoryNameField.value).toBe(blank);
          expect(factoryValueField.value).toBe(blank);
        });
      });
    });
  });

  describe('renderFieldItem(nameInput, valueInput, position)', () => {
    const nameInput = 'key1';
    const valueInput = 'value1';
    const position = 0;
    const existingNameInput = 'key2';
    const newInput = 'test';
    const nameTestId = `${inputTestId}name-`;
    const valueTestId = `${inputTestId}value-`;
    const nameTestIdFirst = `${inputTestId}name-${position}`;
    const valueTestIdFirst = `${inputTestId}value-${position}`;
    const editButton = `cf-ui-button-Edit-${position}`;
    const deleteButton = `cf-ui-button---${position}`;
    const saveButton = `cf-ui-button-Save-${position}`;
    const cancelButton = `cf-ui-button-Cancel-${position}`;
    const errorMessage = `error-${position}`;

    test('shows nameField with value equal to nameInput and is disabled', () => {
      const { getByTestId } = render(<LocalizationLookup sdk={sdk} />);
      const nameField = getByTestId(nameTestIdFirst);

      expect(nameField).toBeTruthy();
      expect(nameField.value).toBe(nameInput);
      expect(nameField.disabled).toEqual(true);
    });

    test('shows valueField with value equal to valueInput', () => {
      const { getByTestId } = render(<LocalizationLookup sdk={sdk} />);
      const valueField = getByTestId(valueTestIdFirst);

      expect(valueField).toBeTruthy();
      expect(valueField.value).toBe(valueInput);
    });

    test('shows an edit button and a delete button', () => {
      const { getByTestId } = render(<LocalizationLookup sdk={sdk} />);
      expect(getByTestId(editButton)).toBeTruthy();
      expect(getByTestId(deleteButton)).toBeTruthy();
    });

    test('removes FieldItem from list when delete button is pressed', () => {
      const { getByTestId, getAllByTestId, queryByTestId } = render(<LocalizationLookup sdk={sdk} />);
      const fieldListLength = getAllByTestId('field-item').length;

      fireEvent.click(getByTestId(deleteButton));
      expect(getAllByTestId('field-item').length).toBe(fieldListLength - 1);
      expect(getByTestId(nameTestIdFirst).value).not.toBe(nameInput);
      expect(getByTestId(`${nameTestId}1`).value).not.toBe(nameInput);
      expect(getByTestId(`${nameTestId}2`).value).not.toBe(nameInput);
      expect(getByTestId(`${nameTestId}3`).value).not.toBe(nameInput);
      expect(queryByTestId(`${nameTestId}4`)).toBeNull();
    });

    describe('when edit button is pressed', () => {
      test('shows save button and cancel button', () => {
        const { getByTestId } = render(<LocalizationLookup sdk={sdk} />);
  
        fireEvent.click(getByTestId(editButton));
        expect(getByTestId(saveButton)).toBeTruthy();
        expect(getByTestId(cancelButton)).toBeTruthy();
      });
  
      test('nameField is editable', () => {
        const { getByTestId } = render(<LocalizationLookup sdk={sdk} />);
  
        fireEvent.click(getByTestId(editButton));
        expect(getByTestId(nameTestIdFirst).disabled).toEqual(false);
      });

      describe('when save button is pressed', () => {
        describe('new fieldItem is added and old one is removed if', () => {
          describe('nameField is changed to value not already in list and', () => {
            test('valueField is not changed', () => {
              const { getByTestId } = render(<LocalizationLookup sdk={sdk} />);
          
              fireEvent.click(getByTestId(editButton));
              fireEvent.change(getByTestId(nameTestIdFirst), { target: { value: newInput } });
              fireEvent.click(getByTestId(saveButton));

              expect(getByTestId(nameTestIdFirst).value).not.toBe(nameInput);
              expect(getByTestId(`${nameTestId}1`).value).not.toBe(nameInput);
              expect(getByTestId(`${nameTestId}2`).value).not.toBe(nameInput);
              expect(getByTestId(`${nameTestId}3`).value).not.toBe(nameInput);
              expect(getByTestId(`${nameTestId}4`).value).not.toBe(nameInput);

              expect(getByTestId(`${nameTestId}4`).value).toBe(newInput);
              expect(getByTestId(`${nameTestId}4`).disabled).toEqual(true);
              expect(getByTestId(`${valueTestId}4`).value).toBe(valueInput);
            });

            test('valueField is changed', () => {
              const { getByTestId } = render(<LocalizationLookup sdk={sdk} />);
          
              fireEvent.click(getByTestId(editButton));
              fireEvent.change(getByTestId(nameTestIdFirst), { target: { value: newInput } });
              fireEvent.change(getByTestId(valueTestIdFirst), { target: { value: newInput } });
              fireEvent.click(getByTestId(saveButton));

              expect(getByTestId(nameTestIdFirst).value).not.toBe(nameInput);
              expect(getByTestId(`${nameTestId}1`).value).not.toBe(nameInput);
              expect(getByTestId(`${nameTestId}2`).value).not.toBe(nameInput);
              expect(getByTestId(`${nameTestId}3`).value).not.toBe(nameInput);
              expect(getByTestId(`${nameTestId}4`).value).not.toBe(nameInput);

              expect(getByTestId(`${nameTestId}4`).value).toBe(newInput);
              expect(getByTestId(`${nameTestId}4`).disabled).toEqual(true);
              expect(getByTestId(`${valueTestId}4`).value).toBe(newInput);
            });
          });
        });

        describe('blank name error shows if nameField is blank and valueField is', () => {
          test('changed', () => {
            const { getByTestId } = render(<LocalizationLookup sdk={sdk} />);

            fireEvent.click(getByTestId(editButton));
            fireEvent.change(getByTestId(nameTestIdFirst), { target: { value: '' } });
            fireEvent.change(getByTestId(valueTestIdFirst), { target: { value: newInput } });
            fireEvent.click(getByTestId(saveButton));

            expect(getByTestId(errorMessage)).toBeTruthy();
            expect(getByTestId(errorMessage).textContent).toBe(nameRequiredErrorMessage);
          });

          test('not changed', () => {
            const { getByTestId } = render(<LocalizationLookup sdk={sdk} />);

            fireEvent.click(getByTestId(editButton));
            fireEvent.change(getByTestId(nameTestIdFirst), { target: { value: '' } });
            fireEvent.click(getByTestId(saveButton));

            expect(getByTestId(errorMessage)).toBeTruthy();
            expect(getByTestId(errorMessage).textContent).toBe(nameRequiredErrorMessage);
          });
        });

        describe('unique name error shows if nameField is changed to value already in list', () => {
          test('and valueField is changed', () => {
            const { getByTestId } = render(<LocalizationLookup sdk={sdk} />);

            fireEvent.click(getByTestId(editButton));
            fireEvent.change(getByTestId(nameTestIdFirst), { target: { value: existingNameInput } });
            fireEvent.change(getByTestId(valueTestIdFirst), { target: { value: newInput } });
            fireEvent.click(getByTestId(saveButton));

            expect(getByTestId(errorMessage)).toBeTruthy();
            expect(getByTestId(errorMessage).textContent).toBe(uniqueErrorMessage);
          });

          test('and valueField is not changed', () => {
            const { getByTestId } = render(<LocalizationLookup sdk={sdk} />);

            fireEvent.click(getByTestId(editButton));
            fireEvent.change(getByTestId(nameTestIdFirst), { target: { value: existingNameInput } });
            fireEvent.click(getByTestId(saveButton));

            expect(getByTestId(errorMessage)).toBeTruthy();
            expect(getByTestId(errorMessage).textContent).toBe(uniqueErrorMessage);
          });
        });

        describe('nameField is disabled if nameField is not changed', () => {
          test('nameField is not changed and valueField is changed', async () => {
            const { getByTestId } = render(<LocalizationLookup sdk={sdk} />);

            fireEvent.click(getByTestId(editButton));
            fireEvent.change(getByTestId(valueTestIdFirst), { target: { value: newInput } });
            fireEvent.click(getByTestId(saveButton));

            expect(getByTestId(nameTestIdFirst).value).toBe(nameInput);
            expect(getByTestId(valueTestIdFirst).value).toBe(newInput);
            expect(getByTestId(nameTestIdFirst).disabled).toEqual(true);
          });

          test('nameField is not changed and valueField is not changed', () => {
            const { getByTestId } = render(<LocalizationLookup sdk={sdk} />);

            fireEvent.click(getByTestId(editButton));
            fireEvent.click(getByTestId(saveButton));

            expect(getByTestId(nameTestIdFirst).value).toBe(nameInput);
            expect(getByTestId(valueTestIdFirst).value).toBe(valueInput);
            expect(getByTestId(nameTestIdFirst).disabled).toEqual(true);
          });
        });
      });

      describe('when cancel button is pressed', () => {
        describe('nameField is disabled if', () => {
          test('nameField and valueField are not changed', () => {
            const { getByTestId } = render(<LocalizationLookup sdk={sdk} />);

            fireEvent.click(getByTestId(editButton));
            fireEvent.click(getByTestId(cancelButton));

            expect(getByTestId(nameTestIdFirst).value).toBe(nameInput);
            expect(getByTestId(valueTestIdFirst).value).toBe(valueInput);
            expect(getByTestId(nameTestIdFirst).disabled).toEqual(true);
          });

          test('nameField and valueField are changed', () => {
            const { getByTestId } = render(<LocalizationLookup sdk={sdk} />);

            fireEvent.click(getByTestId(editButton));
            fireEvent.change(getByTestId(nameTestIdFirst), { target: { value: newInput } });
            fireEvent.change(getByTestId(valueTestIdFirst), { target: { value: newInput } });
            fireEvent.click(getByTestId(cancelButton));

            expect(getByTestId(nameTestIdFirst).value).toBe(nameInput);
            expect(getByTestId(valueTestIdFirst).value).toBe(newInput);
            expect(getByTestId(nameTestIdFirst).disabled).toEqual(true);
          });

          test('only nameField is changed', () => {
            const { getByTestId } = render(<LocalizationLookup sdk={sdk} />);

            fireEvent.click(getByTestId(editButton));
            fireEvent.change(getByTestId(nameTestIdFirst), { target: { value: newInput } });
            fireEvent.click(getByTestId(cancelButton));

            expect(getByTestId(nameTestIdFirst).value).toBe(nameInput);
            expect(getByTestId(valueTestIdFirst).value).toBe(valueInput);
            expect(getByTestId(nameTestIdFirst).disabled).toEqual(true);
          });

          test('only valueField is changed', () => {
            const { getByTestId } = render(<LocalizationLookup sdk={sdk} />);

            fireEvent.click(getByTestId(editButton));
            fireEvent.change(getByTestId(valueTestIdFirst), { target: { value: newInput } });
            fireEvent.click(getByTestId(cancelButton));

            expect(getByTestId(nameTestIdFirst).value).toBe(nameInput);
            expect(getByTestId(valueTestIdFirst).value).toBe(newInput);
            expect(getByTestId(nameTestIdFirst).disabled).toEqual(true);
          });
        });
      });
    });
  });
});