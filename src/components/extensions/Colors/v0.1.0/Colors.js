import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@contentful/forma-36-react-components';
import ExtensionWrapper from '../../../shared/ExtensionWrapper';

function Colors() {
  return (
    <ExtensionWrapper>
      <Button
        buttonType="primary"
        onClick={() => {
          console.log('You clicked on Forma36 button');
        }}
      >
        Click on me 0.1.0

      </Button>
    </ExtensionWrapper>

  );
}
Colors.propTypes = {

};

export default Colors;
