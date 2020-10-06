import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, TabPanel } from '@contentful/forma-36-react-components';
import DaysOfWeekTable from './DaysOfWeekTable';
import OverrideDaysTable from './OverrideDaysTable';
import FriendlyLabelsTable from './FriendlyLabelsTable/FriendlyLabelsTable';
import './OperatingHours.scss';

const INITIAL_TIME_RANGE = ['12:00 AM', '12:00 AM'];

const INITIAL_STATE = {
  daysOfWeek: [
    { dayOfWeek: 'Monday', isClosed: false, timezone: 'America/Chicago', timeRange: INITIAL_TIME_RANGE },
    { dayOfWeek: 'Tuesday', isClosed: false, timezone: 'America/Chicago', timeRange: INITIAL_TIME_RANGE },
    { dayOfWeek: 'Wednesday', isClosed: false, timezone: 'America/Chicago', timeRange: INITIAL_TIME_RANGE },
    { dayOfWeek: 'Thursday', isClosed: false, timezone: 'America/Chicago', timeRange: INITIAL_TIME_RANGE },
    { dayOfWeek: 'Friday', isClosed: false, timezone: 'America/Chicago', timeRange: INITIAL_TIME_RANGE },
    { dayOfWeek: 'Saturday', isClosed: false, timezone: 'America/Chicago', timeRange: INITIAL_TIME_RANGE },
    { dayOfWeek: 'Sunday', isClosed: false, timezone: 'America/Chicago', timeRange: INITIAL_TIME_RANGE },
  ],
  overrideDays: [],
  friendlyLabels: []
};

export default function OperatingHours({ sdk }) {
  const [selectedTab, setSelectedTab] = useState('regularHours');
  const [daysOfWeek, setDaysOfWeek] = useState(INITIAL_STATE.daysOfWeek);
  const [overrideDays, setOverrideDays] = useState(INITIAL_STATE.overrideDays);
  const [friendlyLabels, setFriendlyLabels] = useState(INITIAL_STATE.friendlyLabels);

  useEffect(() => {
    if (sdk.field.getValue()) {
      const value = sdk.field.getValue();
      setDaysOfWeek(value.daysOfWeek);
      setOverrideDays(value.overrideDays);
      setFriendlyLabels(value.friendlyLabels);
    } else {
      setDaysOfWeek(INITIAL_STATE.daysOfWeek);
      setOverrideDays(INITIAL_STATE.overrideDays);
      setFriendlyLabels(INITIAL_STATE.friendlyLabels);
    };
  }, [sdk.field]);

  useEffect(() => {
    const value = {
      daysOfWeek,
      overrideDays,
      friendlyLabels,
    };

    sdk.field.setValue(value);
  }, [sdk.field, daysOfWeek, overrideDays, friendlyLabels]);

  function changeDaysOfWeek(dayIndex, value) {
    const daysOfWeekCopy = [...daysOfWeek];

    daysOfWeekCopy[dayIndex] = {
      ...daysOfWeekCopy[dayIndex],
      ...value
    };

    setDaysOfWeek(daysOfWeekCopy);
  }

  function addOverrideDay(overrideDay) {
    setOverrideDays([...overrideDays, overrideDay]);
  }

  function editOverrideDay(index, value) {
    const overrideDaysCopy = [...overrideDays];

    overrideDaysCopy[index] = {
      ...overrideDaysCopy[index],
      ...value
    };

    setOverrideDays(overrideDaysCopy);
  }

  function deleteOverrideDay(index) {
    const newOverrideDays = overrideDays.filter((od, i) => i !== index);
    setOverrideDays(newOverrideDays);
  }

  function addFriendlyLabel(friendlyLabel) {
    setFriendlyLabels([...friendlyLabels, friendlyLabel]);
  }

  function editFriendlyLabel(index, value) {
    const friendlyLabelsCopy = [...friendlyLabels];

    friendlyLabelsCopy[index] = {
      ...friendlyLabelsCopy[index],
      ...value
    };

    setFriendlyLabels(friendlyLabelsCopy);
  }

  function deleteFriendlyLabel(index) {
    const newFriendlyLabels = friendlyLabels.filter((od, i) => i !== index);
    setFriendlyLabels(newFriendlyLabels);
  }

  return (
    <div className="operatingHours">
      <Tabs
        role="tablist"
        withDivider>
        <Tab
          id="regularHours"
          selected={selectedTab === 'regularHours'}
          onSelect={() => setSelectedTab('regularHours')}>
          Regular Hours
        </Tab>
        <Tab
          id="overrideDays"
          selected={selectedTab === 'overrideDays'}
          onSelect={() => setSelectedTab('overrideDays')}>
          Special Dates
        </Tab>
        <Tab
          id="friendlyLabels"
          selected={selectedTab === 'friendlyLabels'}
          onSelect={() => setSelectedTab('friendlyLabels')}>
          Friendly Labels
        </Tab>
      </Tabs>
      {
        selectedTab === 'regularHours' && (
          <TabPanel id="regularHours-tabPanel">
            <DaysOfWeekTable
              daysOfWeek={daysOfWeek}
              onChange={changeDaysOfWeek} />
          </TabPanel>
        )
      }
      {
        selectedTab === 'overrideDays' && (
          <TabPanel id="overrideDays-tabPanel">
            <OverrideDaysTable
              overrideDays={overrideDays}
              addOverrideDay={addOverrideDay}
              editOverrideDay={editOverrideDay}
              deleteOverrideDay={deleteOverrideDay} />
          </TabPanel>
        )
      }
      {
        selectedTab === 'friendlyLabels' && (
          <TabPanel id="friendlyLabels-tabPanel">
            <FriendlyLabelsTable
              friendlyLabels={friendlyLabels}
              addRow={addFriendlyLabel}
              editRow={editFriendlyLabel}
              deleteRow={deleteFriendlyLabel} />
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
