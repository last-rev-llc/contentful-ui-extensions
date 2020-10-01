import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DaysOfWeekTable from './DaysOfWeekTable';
import OverrideDaysTable from './OverrideDaysTable';
import './OperatingHours.scss';

const INITIAL_STATE = {
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
};

export default function OperatingHours({ sdk }) {
  const [daysOfWeek, setDaysOfWeek] = useState(INITIAL_STATE.daysOfWeek);
  const [overrideDays, setOverrideDays] = useState(INITIAL_STATE.overrideDays);

  useEffect(() => {
    if (sdk.field.getValue()) {
      const value = sdk.field.getValue();
      setDaysOfWeek(value.daysOfWeek);
      setOverrideDays(value.overrideDays);
    } else {
      setDaysOfWeek(INITIAL_STATE.daysOfWeek);
      setOverrideDays(INITIAL_STATE.overrideDays);
    };
  }, [sdk.field]);

  function changeDaysOfWeek(dayIndex, value) {
    const daysOfWeekCopy = [...daysOfWeek];

    daysOfWeekCopy[dayIndex] = {
      ...daysOfWeekCopy[dayIndex],
      ...value
    };

    setDaysOfWeek(daysOfWeekCopy);
  }

  function addOverrideDay() {
    setOverrideDays([...overrideDays, {}]);
  }

  function editOverrideDay(index, value) {
    const overrideDaysCopy = [...overrideDays];

    overrideDaysCopy[index] = {
      ...overrideDaysCopy[index],
      ...value
    };

    setOverrideDays(overrideDaysCopy);
  }

  return (
    <div>
      <DaysOfWeekTable
        daysOfWeek={daysOfWeek}
        onChange={changeDaysOfWeek}
      />
      <OverrideDaysTable
        overrideDays={overrideDays}
        addOverrideDay={addOverrideDay}
        editOverrideDay={editOverrideDay}
      />
    </div>
  );
}

OperatingHours.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired,
    }),
  }).isRequired,
};
