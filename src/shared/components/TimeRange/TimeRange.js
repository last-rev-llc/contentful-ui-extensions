import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { startOfDay, endOfDay, add, format } from 'date-fns';
import { Slider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const TIME_FORMAT = 'h:mm a';

const useStyles = makeStyles({
  marked: {
    marginBottom: 0,
    marginTop: '1rem',
  },
  valueLabel: {
    textAlign: 'center',
    top: -22,
    '& *': {
      background: 'transparent',
      color: '#000',
    },
  }
});

function TimeRange({ value, onChange, step, disabled }) {
  const [dayTimes, setDayTimes] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    if (!value || value.length === 0) {
      onChange([dayTimes[0], dayTimes[dayTimes.length - 1]]);
      return;
    }

    const [start, end] = value;

    const startIndex = dayTimes.indexOf(start);
    const endIndex = dayTimes.indexOf(end);

    const val = [startIndex, endIndex === startIndex && endIndex === 0 ? dayTimes.length - 1 : endIndex];
    setSelectedValue(val);
  }, [value, dayTimes]);

  useEffect(() => {
    const start = startOfDay(new Date());
    const end = startOfDay(add(start, { days: 1 }));

    const newDayTimes = [];
    
    let tempDate;
    for (tempDate = start; tempDate <= end; tempDate = add(tempDate, step)) {
      const formattedDate = format(tempDate, TIME_FORMAT);
      newDayTimes.push(formattedDate);
    }

    setDayTimes(newDayTimes);
  }, [step.minutes]);

  function handleChange(e, val) {
    const [start, end] = val;
    onChange([dayTimes[start], dayTimes[end]]);
  }

  function valueLabelFormat(val) {
    return dayTimes[val];
  }

  return (
    <Slider
      value={selectedValue}
      onChange={handleChange}
      min={0}
      max={dayTimes.length - 1}
      valueLabelDisplay="on"
      valueLabelFormat={valueLabelFormat}
      classes={{
        marked: classes.marked,
        valueLabel: classes.valueLabel,
      }}
      disabled={disabled}
    />
  );
}

TimeRange.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  step: PropTypes.shape({
    minutes: PropTypes.number,
  }).isRequired,
  disabled: PropTypes.bool,
};

TimeRange.defaultProps = {
  disabled: false,
  onChange: () => {},
  value: '',
};

export default TimeRange;
