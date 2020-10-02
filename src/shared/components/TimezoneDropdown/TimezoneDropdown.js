import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, DropdownList, DropdownListItem } from '@contentful/forma-36-react-components';

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Phoenix',
  'America/Los_Angeles',
  'America/Anchorage'
];

function TimezoneDropdown({ value, onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      toggleElement={
        <Button
          size="small"
          buttonType="muted"
          indicateDropdown
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
        >
          { value }
        </Button>
      }
    >
      <DropdownList>
        {
          TIMEZONES.map((tz) => (
            <DropdownListItem
              key={tz}
              onClick={() => {
                onChange(tz);
                setIsOpen(false);
              }}
            >
              { tz }
            </DropdownListItem>
          ))
        }
      </DropdownList>
    </Dropdown>
  );
}

TimezoneDropdown.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  increment: PropTypes.shape({
    minutes: PropTypes.number,
  }).isRequired,
  disabled: PropTypes.bool,
};

TimezoneDropdown.defaultProps = {
  value: '',
  disabled: false,
};

export default TimezoneDropdown;
