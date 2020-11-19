import React from 'react';
import PropTypes from 'prop-types';

import { CardStyle } from './styles';

function CardNothing({ type }) {
  return <CardStyle contentType="Not found" title={`No ${type} found`} />;
}

CardNothing.propTypes = { type: PropTypes.string };
CardNothing.defaultProps = { type: 'item' };

export default CardNothing;
