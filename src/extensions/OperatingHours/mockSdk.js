const sdk = {
  field: {
    getValue: () => ({
      daysOfWeek: [
        { dayOfWeek: 'Monday', isClosed: false, timezone: 'America/Chicago' },
        { dayOfWeek: 'Tuesday', isClosed: false, timezone: 'America/Chicago' },
        { dayOfWeek: 'Wednesday', isClosed: false, timezone: 'America/Chicago' },
        { dayOfWeek: 'Thursday', isClosed: false, timezone: 'America/Chicago' },
        { dayOfWeek: 'Friday', isClosed: false, timezone: 'America/Chicago' },
        { dayOfWeek: 'Saturday', isClosed: false, timezone: 'America/Chicago' },
        { dayOfWeek: 'Sunday', isClosed: false, timezone: 'America/Chicago' },
      ],
      overrideDays: [],
      friendlyLabels: [],
    }),
    setValue: val => val,
  },
};

export default sdk;
