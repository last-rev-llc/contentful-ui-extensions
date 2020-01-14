import React, {useState, useEffect} from 'react';
// import { each, has, isArray, get } from 'lodash';
import './Seo.scss';
import PropTypes from 'prop-types';
// import options from './options';

const Seo = ({ sdk }) => {
  // eslint-disable-next-line no-unused-vars
  const [fieldValue, setFieldValue] = useState('');

  useEffect(() => {
    setFieldValue(sdk.field.getValue());
  }, [sdk.field]);

  return (
    <div>
      Hello SEO
    </div>
  );
};

Seo.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired,
    })
  }).isRequired
};

export default Seo;
