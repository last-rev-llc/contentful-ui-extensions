import React from 'react';
import PropTypes from 'prop-types';
import TimePicker from 'react-time-picker';

function TimeInput({ value, onChange, disabled }) {
  return (
    <TimePicker
      value={value}
      onChange={onChange}
      disableClock
      format="h:m a"
      disabled={disabled}
    />
  );
}

TimeInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

TimeInput.defaultProps = {
  value: '',
  disabled: false,
};

export default TimeInput;
