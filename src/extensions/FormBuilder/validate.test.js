import {
  errorTypes,
  errorLevels,
  getFieldNameCounts,
  idIndexer,
  validateFieldNames,
  validateField,
  validateFields,
  validateSteps,
  onlyErrors,
  onlyWarnings
} from './validate';

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

  it('validates an array of fields', () => {
    expect(validateFields([{}, {}, {}]).map(({ type }) => type)).toEqual(
      expect.arrayContaining([errorTypes.UNDEFINED_ID])
    );
  });

  it('counts names of fields', () => {
    expect(
      getFieldNameCounts([
        {
          fields: [
            { id: 'first-1', name: 'first' },
            { id: 'second-1', name: 'second' }
          ]
        },
        {
          fields: [
            { id: 'first-2', name: 'first' },
            { id: 'second-2', name: 'second' }
          ]
        }
      ])
    ).toMatchObject({
      first: { count: 2, ids: ['first-1', 'first-2'] },
      second: { count: 2, ids: ['second-1', 'second-2'] }
    });
  });

  it('validates field names', () => {
    expect(
      validateFieldNames([
        {
          fields: [
            { id: 'first-1', name: 'first' },
            { id: 'second-1', name: 'second' }
          ]
        },
        {
          fields: [
            { id: 'first-2', name: 'first' },
            { id: 'second-2', name: 'second' }
          ]
        }
      ]).length
    ).toEqual(4);
  });
});

describe('Validate steps', () => {
  it('finds errors in steps', () => {
    const result = validateSteps([
      {
        fields: [
          { id: 'first-1', name: 'first' },
          { id: 'second-1', name: 'second' }
        ]
      },
      {
        fields: [
          { id: 'first-2', name: 'first' },
          { id: 'second-2', name: 'second' }
        ]
      }
    ]);

    expect(result['first-1'].length).toEqual(2);
    expect(result['first-2'].length).toEqual(2);
    expect(result['second-1'].length).toEqual(2);
    expect(result['second-2'].length).toEqual(2);
  });
});

describe('Helper functionality', () => {
  const fields = [
    {
      fields: [
        { id: 'first-1', name: 'first' },
        { id: 'second-1', name: 'second' }
      ]
    },
    {
      fields: [
        { id: 'first-2', name: 'first' },
        { id: 'second-2', name: 'second' }
      ]
    }
  ];

  it('indexes by id', () => {
    expect(idIndexer(validateFieldNames(fields))).toHaveProperty('first-1', 'second-1', 'first-2', 'second-2');
  });

  it('only extracts errors', () => {
    Object.values(onlyErrors(validateSteps(fields))).forEach((errorSet) =>
      expect(errorSet.map(({ level }) => level)).toEqual(expect.not.arrayContaining([errorLevels.WARN]))
    );
  });

  it('only extracts warnings', () => {
    Object.values(onlyWarnings(validateSteps(fields))).forEach((errorSet) =>
      expect(errorSet.map(({ level }) => level)).toEqual(expect.not.arrayContaining([errorLevels.ERROR]))
    );
  });
});
