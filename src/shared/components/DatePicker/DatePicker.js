import React from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '@contentful/forma-36-react-components';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function DatePicker({ name, placeholderText, selected, onChange, minDate,
  excludeDates, className }) {

  function CustomInput({ value, onClick, onChange }) {
    return (
      <TextInput
        value={value}
        onClick={onClick}
        onChange={onChange}
        placeholder={placeholderText}
        width="small" />
    );
  }

  return (
    <ReactDatePicker
      name={name}
      selected={selected}
      onChange={onChange}
      minDate={minDate}
      excludeDates={excludeDates}
      popperPlacement="bottom-start"
      className={className}
      customInput={<CustomInput />} />
  );
}

DatePicker.propTypes = {
  name: PropTypes.string.isRequired,
  placeholderText: PropTypes.string,
  selected: PropTypes.shape(), // Date
  onChange: PropTypes.func,
  minDate: PropTypes.shape(), // Date
  excludeDates: PropTypes.arrayOf(PropTypes.shape()),
  className: PropTypes.string,
};

DatePicker.defaultProps = {
  placeholderText: null,
  selected: null,
  onChange: null,
  minDate: null,
  excludeDates: null,
  className: null,
};

export default DatePicker;
