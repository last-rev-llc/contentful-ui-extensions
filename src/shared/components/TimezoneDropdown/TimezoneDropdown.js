import React from 'react';
import PropTypes from 'prop-types';
import { getSelect } from '../../helpers';

const TIMEZONES = {
  'America/New_York': 'ET',
  'America/Chicago': 'CT',
  'America/Denver': 'MT',
  'America/Los_Angeles': 'PT'
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
