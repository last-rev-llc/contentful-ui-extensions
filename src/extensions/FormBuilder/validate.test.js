import { errorTypes, validateField } from './validate';

describe('Validate fields', () => {
  it('catches missing field properties', () => {
    expect(validateField({})).toBeInstanceOf(Array);
    expect(validateField({}).map(({ type }) => type)).toEqual(
      expect.arrayContaining([
        errorTypes.UNDEFINED_ID,
        errorTypes.UNDEFINED_NAME,
        errorTypes.UNDEFINED_TYPE,
        errorTypes.UNDEFINED_ID
      ])
    );
  });

  it('catches a missing hidden value', () => {
    expect(validateField({ type: 'hidden' }).map(({ type }) => type)).toEqual(
      expect.arrayContaining([errorTypes.INVALID_VALUE])
    );
  });

  it('catches missing select values', () => {
    expect(validateField({ type: 'select' }).map(({ type }) => type)).toEqual(
      expect.arrayContaining([errorTypes.INVALID_VALUE])
    );
  });
});
