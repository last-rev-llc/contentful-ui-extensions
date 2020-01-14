import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { each, has, isArray, get } from 'lodash';
import './Colors.scss';

const Colors = ({ sdk }) => {
  const [fieldValue, setFieldValue] = useState('');

  useEffect(() => {
    setFieldValue(sdk.field.getValue());
  }, [sdk.field]);

  const getColorOptions = () => {
    const { validations } = sdk.field;
      const hexOptions = [];
      each(validations, (val) => {
        if (has(val, 'in') && isArray(get(val, 'in'))) {
          each(get(val, 'in'), (hex) => {
            hexOptions.push(hex);
          });
        }
      });
      return hexOptions;
  }

  const handleColorChange = (e) => {
    const hex = e.currentTarget.getAttribute('data-hex');
    sdk.field.setValue(hex);
    setFieldValue(hex);
  }

  return (
    <div>
      <ul className="color-choice-list">
        {getColorOptions().map((hex, index) => (
          <li
            className="color-choice-wrap"
            style={{ backgroundColor: hex }}
            key={hex}>
            <button
              type="button"
              className={`color-choice btn btn-lg ${fieldValue === hex ? 'active' : ''}`}
              title={hex}
              data-hex={hex}
              onClick={handleColorChange}
              onKeyDown={handleColorChange}
              tabIndex={index}/>
          </li>
        ))}
      </ul>
    </div>
  )
}

Colors.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired,
      validations: PropTypes.arrayOf(PropTypes.shape({
        in: PropTypes.array,
      }))
    })
  }).isRequired,
}

export default Colors;
