const init = (fn) => {
  fn({
    field: {
      validations: [
        {
          in: [
            'FFFFFF',
            '000000',
            '333333'
          ]
        }
      ],
      getValue: () => {
        return 'FFFFFF';
      },
      setValue: () => {
        return null;
      }
    },
  })
}

export default init;