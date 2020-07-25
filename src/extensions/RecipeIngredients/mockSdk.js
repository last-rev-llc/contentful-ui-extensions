const mockSdk = {
  field: {
    getValue: () => {
      return { 
        ingredients: [
          {
            'imperialQuantity': 1,
            'imperialMeasure': 'Cup',
            'metricQuantity': 236,
            'metricMeasure': 'Millimeter',
            'ingredient': 'flour',
            'step': 1,
          }, {
            'imperialQuantity': 1,
            'imperialMeasure': 'Wedge',
            'metricQuantity': 1,
            'metricMeasure': 'Wedge',
            'ingredient': 'lemon',
            'step': 2,
          }
        ]
      };
    },
    setValue: value => {
      return value;
    }
  },
};

export default mockSdk;