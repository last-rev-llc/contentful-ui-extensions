import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, TabPanel } from '@contentful/forma-36-react-components';
import DaysOfWeekTable from './DaysOfWeekTable';
import OverrideDaysTable from './OverrideDaysTable';
import './OperatingHours.scss';

const INITIAL_TIME_RANGE = ['12:00 AM', '11:30 PM'];

const INITIAL_STATE = {
  daysOfWeek: [
    { dayOfWeek: 'Monday', isClosed: false, timezone: 'America/New_York', timeRange: INITIAL_TIME_RANGE },
    { dayOfWeek: 'Tuesday', isClosed: false, timezone: 'America/New_York', timeRange: INITIAL_TIME_RANGE },
    { dayOfWeek: 'Wednesday', isClosed: false, timezone: 'America/New_York', timeRange: INITIAL_TIME_RANGE },
    { dayOfWeek: 'Thursday', isClosed: false, timezone: 'America/New_York', timeRange: INITIAL_TIME_RANGE },
    { dayOfWeek: 'Friday', isClosed: false, timezone: 'America/New_York', timeRange: INITIAL_TIME_RANGE },
    { dayOfWeek: 'Saturday', isClosed: false, timezone: 'America/New_York', timeRange: INITIAL_TIME_RANGE },
    { dayOfWeek: 'Sunday', isClosed: false, timezone: 'America/New_York', timeRange: INITIAL_TIME_RANGE },
  ],
  overrideDays: []
};

export default function OperatingHours({ sdk }) {
  const [selectedTab, setSelectedTab] = useState('regularHours');
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

    if (value.isClosed) {
      // eslint-disable-next-line no-param-reassign
      value.timeRange = INITIAL_TIME_RANGE;
    }

    daysOfWeekCopy[dayIndex] = {
      ...daysOfWeekCopy[dayIndex],
      ...value
    };

    setDaysOfWeek(daysOfWeekCopy);
  }

  function addOverrideDay() {
    setOverrideDays([
      { isClosed: true, timezone: 'America/New_York', timeRange: INITIAL_TIME_RANGE },
      ...overrideDays]
    );
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
    <div className="operatingHours">
      <Tabs
        role="tablist"
        withDivider
      >
        <Tab
          id="regularHours"
          selected={selectedTab === 'regularHours'}
          onSelect={() => setSelectedTab('regularHours')}
        >
          Regular Hours
        </Tab>
        <Tab
          id="overrideDays"
          selected={selectedTab === 'overrideDays'}
          onSelect={() => setSelectedTab('overrideDays')}
        >
          Special Dates
        </Tab>
      </Tabs>
      {
        selectedTab === 'regularHours' && (
          <TabPanel id="regularHours-tabPanel">
            <DaysOfWeekTable
              daysOfWeek={daysOfWeek}
              onChange={changeDaysOfWeek}
            />
          </TabPanel>
        )
      }
      {
        selectedTab === 'overrideDays' && (
          <TabPanel id="regularHours-overrideDays">
            <OverrideDaysTable
              overrideDays={overrideDays}
              addOverrideDay={addOverrideDay}
              editOverrideDay={editOverrideDay}
            />
          </TabPanel>
        )
      }
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
