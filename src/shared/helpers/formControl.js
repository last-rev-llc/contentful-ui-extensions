import React from 'react';
import { Button, IconButton } from '@contentful/forma-36-react-components';

const getButton = (label, buttonType, onClick) => {
  return <Button
    buttonType={buttonType}
    isFullWidth={false}
    loading={false}
    onClick={onClick}
    testId={`cf-ui-button-${label}`}
    type="button">
    {label}
  </Button>;
};

const getIconButton = (label, buttonType, iconType, iconSize, onClick) => {
  return <IconButton
    buttonType={buttonType}
    iconProps={{ icon:iconType, size:iconSize }}
    label={label}
    onClick={onClick}
    testId={`cf-ui-button-${label}`}/>;
};

export {
  getButton,
  getIconButton
};