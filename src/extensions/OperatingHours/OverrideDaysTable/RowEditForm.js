import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, FieldGroup, Form, FormLabel, Note, Switch } from '@contentful/forma-36-react-components';
import DatePicker from '../../../shared/components/DatePicker';
import TimeRange from '../../../shared/components/TimeRange';
import TimezoneDropdown from '../../../shared/components/TimezoneDropdown';

const INITIAL_TIME_RANGE = ['12:00 AM', '12:00 AM'];
const INITIAL_NEW_ROW_STATE = { isClosed: false, timezone: 'America/Chicago', timeRange: INITIAL_TIME_RANGE };
const currentDate = new Date();

function RowEditForm({ value, onSubmit, onCancel, alreadySelectedDates }) {
  const [row, setRow] = useState(INITIAL_NEW_ROW_STATE);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (value) {
      setRow({ ...value });
    } else {
      setRow(INITIAL_NEW_ROW_STATE);
    }
  }, [value]);

  function onValueChanged(propertyName, propertyValue) {
    setRow({ ...row, [propertyName]: propertyValue });
  }

  function submit() {
    try {
      onSubmit(row);
      setErrorMessage(null);
      setRow(INITIAL_NEW_ROW_STATE);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <>
      {
        errorMessage && (
          <Note
            className="operatingHours__newRowError"
            noteType="negative">
            { errorMessage }
          </Note>
        )
      }
      <Card className="operatingHours__newRowCard">
        <Form
          onSubmit={submit}
          className="operatingHours__newRowForm">
          <div className="operatingHours__newRowFormFields">
            <FieldGroup>
              <FormLabel htmlFor="date">Date</FormLabel>
              <DatePicker
                name="date"
                placeholderText="Select a date"
                selected={row.date ? new Date(row.date) : null}
                onChange={(date) => onValueChanged('date', date.toString())}
                minDate={currentDate}
                excludeDates={alreadySelectedDates.map(date => new Date(date))}
                popperPlacement="bottom-start"
                className="operatingHours__datepicker" />
            </FieldGroup>
            <FieldGroup>
              <FormLabel htmlFor="timezone">Timezone</FormLabel>
              <TimezoneDropdown
                value={row.timezone}
                onChange={(e) => onValueChanged('timezone', e.currentTarget.value)}
                position="factory"
                className="operatingHours__timezone"
                name="timezone" />
            </FieldGroup>
            <Switch
              id="OperatingHours-OverrideDays-factory-isClosed-switch"
              labelText="Closed?"
              isChecked={row.isClosed}
              onToggle={isClosed => onValueChanged('isClosed', isClosed)}
              className="operatingHours__newRowFormFields__isClosed" />
            <div className="operatingHours__newRowFormFields__timeRange">
              <FormLabel htmlFor="">Open/Close Times</FormLabel>
              <TimeRange
                value={row.timeRange}
                onChange={timeRange => onValueChanged('timeRange', timeRange)}
                step={{ minutes: 30 }}
                disabled={row.isClosed} />
            </div>
          </div>
          {
            value ? (
              <>
                <Button
                  buttonType="primary"
                  type="submit">
                  Save Edit
                </Button>
                <Button
                  buttonType="muted"
                  type="button"
                  onClick={onCancel}
                  className="operatingHours__cancelButton">
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                buttonType="primary"
                type="submit">
                Add Special Date
              </Button>
            )
          }
        </Form>
      </Card>
    </>
  );
}

RowEditForm.propTypes = {
  alreadySelectedDates: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.shape({
    date: PropTypes.string,
    isClosed: PropTypes.bool.isRequired,
    timezone: PropTypes.string,
    timeRange: PropTypes.arrayOf(PropTypes.string)
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

RowEditForm.defaultProps = {
  alreadySelectedDates: [],
  value: null
};

export default RowEditForm;
