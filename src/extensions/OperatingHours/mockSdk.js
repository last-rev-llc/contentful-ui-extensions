const INITIAL_TIME_RANGE = ['12:00 AM', '12:00 AM'];

const sdk = {
  field: {
    getValue: () => ({
      daysOfWeek: [
        { dayOfWeek: 'Monday', isClosed: false, timezone: 'America/Chicago', timeRange: INITIAL_TIME_RANGE },
        { dayOfWeek: 'Tuesday', isClosed: false, timezone: 'America/Chicago', timeRange: INITIAL_TIME_RANGE },
        { dayOfWeek: 'Wednesday', isClosed: false, timezone: 'America/Chicago', timeRange: INITIAL_TIME_RANGE },
        { dayOfWeek: 'Thursday', isClosed: false, timezone: 'America/Chicago', timeRange: INITIAL_TIME_RANGE },
        { dayOfWeek: 'Friday', isClosed: false, timezone: 'America/Chicago', timeRange: INITIAL_TIME_RANGE },
        { dayOfWeek: 'Saturday', isClosed: false, timezone: 'America/Chicago', timeRange: INITIAL_TIME_RANGE },
        { dayOfWeek: 'Sunday', isClosed: false, timezone: 'America/Chicago', timeRange: INITIAL_TIME_RANGE },
      ],
      overrideDays: []
    }),
    setValue: val => val,
  },
};

export default sdk;
