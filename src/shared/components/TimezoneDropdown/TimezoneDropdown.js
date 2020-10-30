import React from 'react';
import PropTypes from 'prop-types';
import { getSelect } from '../../helpers';

const TIMEZONES = {
  'America/New_York': 'New York',
  'America/Chicago': 'Chicago',
  'America/Denver': 'Denver',
  'America/Phoenix': 'Phoenix',
  'America/Los_Angeles': 'Los Angeles'
};

function TimezoneDropdown({ id, value, onChange, disabled, position, name, className }) {
  return (
    <>
      {
        getSelect(
          Object.keys(TIMEZONES),
          onChange,
          { id, name, disabled, optionObject: TIMEZONES },
          value,
          position,
          className
        )
      }
    </>
  );
}

TimezoneDropdown.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  position: PropTypes.string.isRequired,
  name: PropTypes.string,
  className: PropTypes.string,
};

TimezoneDropdown.defaultProps = {
  id: '',
  className: '',
  disabled: false,
  name: '',
  onChange: () => {},
  value: '',
};

export default TimezoneDropdown;
