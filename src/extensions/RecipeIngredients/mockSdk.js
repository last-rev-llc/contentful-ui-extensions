const mockSdk = {
  field: {
    getValue: () => {
      return {
        ingredients: [
          {
            imperialQuantity: 1,
            imperialMeasure: 'Cup',
            metricQuantity: 236,
            metricMeasure: 'Millimeter',
            ingredient: 'flour',
            step: 1
          },
          {
            imperialQuantity: 1,
            imperialMeasure: 'Wedge',
            metricQuantity: 1,
            metricMeasure: 'Wedge',
            ingredient: 'lemon',
            step: 2
          }
        ]
      };
    },
    setValue: (value) => {
      return value;
    }
  },
  location: {
    is: () => true
  },
  close: (value) => value,
  parameters: {
    invocation: {
      ingredient: {
        imperialQuantity: '1',
        imperialMeasure: 'Cup',
        metricQuantity: '236',
        metricMeasure: 'Millimeter',
        ingredient: 'flour',
        step: '1'
      }
    }
  }
};

export const mockSdkList = {
  ...mockSdk,
  location: {
    is: () => false
  }
};

export default mockSdk;
