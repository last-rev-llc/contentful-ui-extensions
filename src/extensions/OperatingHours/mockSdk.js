const sdk = {
  field: {
    getValue: () => ({
      daysOfWeek: [
        { dayOfWeek: 'Monday', isClosed: false, },
        { dayOfWeek: 'Tuesday', isClosed: false, },
        { dayOfWeek: 'Wednesday', isClosed: false, },
        { dayOfWeek: 'Thursday', isClosed: false, },
        { dayOfWeek: 'Friday', isClosed: false, },
        { dayOfWeek: 'Saturday', isClosed: false, },
        { dayOfWeek: 'Sunday', isClosed: false, },
      ],
      overrideDays: []
    }),
    setValue: val => val,
  },
};

export default sdk;
