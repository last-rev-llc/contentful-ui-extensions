import { render, cleanup, configure } from '@testing-library/react';
import { updateJson, getError, hasDuplicate } from './utility';

configure({
  testIdAttribute: 'data-test-id',
});

afterEach(() => {
  cleanup();
});

describe('utility helpers methods', () => {
  describe('updateJson(object, property, propertyValue)', () => {
    test('adds property to object with a value equal to propertyValue', () => {
      const name = 'key3';
      const value = 'value3';
      const jsonBefore = {
        'key1': 'value1',
        'key2': 'value2'
      };
      const jsonAfter = {
        'key1': 'value1',
        'key2': 'value2',
        'key3': 'value3'
      };
      
      expect(JSON.stringify(updateJson(jsonBefore, name, value)))
        .toBe(JSON.stringify(jsonAfter));
    });
  });

  describe('getError(hasError, message)', () => {
    const message = 'message';
    const testId = 'error';

    test('doesn\'t show message when hasError is false', () => {
      const { queryByTestId } = render(getError(false, message));
      expect(queryByTestId(testId)).toBeNull();
    });
    test('shows message when hasError is true ', () => {
      const errorDiv = render(getError(true, message));
      expect(errorDiv.queryByTestId(testId)).toBeTruthy();
      expect(errorDiv.queryByTestId(testId).textContent).toBe(message);
    });
  });

  describe('hasDuplicate() checks to see if there are any duplicate keys in object', () => {
    const one = 'key1';
    const two = 'key2';
    const three = 'key3';
    const jsonObject = {
      [one]: 'value1',
      [two]: 'value2'
    };
  
    describe('hasDuplicate(object, keyA, keyB) should be false if', () => {
      test('keyA and keyB are empty', () => {
        expect(hasDuplicate(jsonObject, '', '')).toEqual(false);
      });
      test('keyA and keyB are new to object and have different values', () => {
        expect(hasDuplicate(jsonObject, three, 'key4')).toEqual(false);
      });    
      test('keyA and keyB are new to object and have equal values', () => {
        expect(hasDuplicate(jsonObject, three, three)).toEqual(false);
      });
      test('keyA is new to object and keyB is empty', () => {
        expect(hasDuplicate(jsonObject, three, '')).toEqual(false);
      });
      test('keyA is new to object and keyB is already in object', () => {
        expect(hasDuplicate(jsonObject, three, two)).toEqual(false);
      });
      test('keyA and keyB are already in object and have equal values', () => {
        expect(hasDuplicate(jsonObject, one, one)).toEqual(false);
      });
    });
  
    describe('hasDuplicate(object, keyA, keyB) should be true if', () => {
      test('keyA is already in object and keyB is empty', () => {
        expect(hasDuplicate(jsonObject, one, '')).toEqual(true);
      });
      test('keyA and keyB are already in object and have different values)', () => {
        expect(hasDuplicate(jsonObject, one, two)).toEqual(true);
      });
    });
  });
});