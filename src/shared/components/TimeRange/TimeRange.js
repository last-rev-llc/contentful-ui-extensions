import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { startOfDay, endOfDay, add, format } from 'date-fns';
import { Slider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const TIME_FORMAT = 'h:mm a';

const useStyles = makeStyles({
  marked: {
    marginBottom: 0,
    marginTop: '0.5rem',
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
  const [marks, setMarks] = useState([]);
  const [dayTimes, setDayTimes] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    const [start, end] = value;

    const val = [dayTimes.indexOf(start), dayTimes.indexOf(end)];
    setSelectedValue(val);
  }, [dayTimes]);

  useEffect(() => {
    const start = startOfDay(new Date());
    const end = endOfDay(new Date());

    const newDayTimes = [];
    
    let tempDate;
    for (tempDate = start; tempDate <= end; tempDate = add(tempDate, step)) {
      const formattedDate = format(tempDate, TIME_FORMAT);
      newDayTimes.push(formattedDate);
    }

    // First and last times on slider are always visible
    const newMarks = [
      { label: newDayTimes[0], value: 0 },
      { label: newDayTimes[newDayTimes.length - 1], value: newDayTimes.length - 1 },
    ];

    setMarks(newMarks);
    setDayTimes(newDayTimes);
  }, [step.minutes]);

  function handleChange(e, val) {
    const [start, end] = val;
    setSelectedValue(val);
    onChange([dayTimes[start], dayTimes[end]]);
  }

  function valueLabelFormat(val) {
    return dayTimes[val];
  }

  return (
    <Slider
      value={selectedValue}
      onChange={handleChange}
      marks={marks}
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
  onChange: PropTypes.func.isRequired,
  step: PropTypes.shape({
    minutes: PropTypes.number,
  }).isRequired,
  disabled: PropTypes.bool,
};

TimeRange.defaultProps = {
  value: '',
  disabled: false,
};

export default TimeRange;
