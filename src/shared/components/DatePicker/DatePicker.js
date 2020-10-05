import React from 'react';
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
        width="small"
      />
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
      customInput={<CustomInput />}
    />
  );
}

export default DatePicker;
