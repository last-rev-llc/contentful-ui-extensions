import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@contentful/forma-36-react-components';
import '@contentful/forma-36-react-components/dist/styles.css';

function Seo(props) {
  return (
    <Button
      buttonType="primary"
      onClick={() => {
        console.log('You clicked on Forma36 button');
      }}
    >
        SEO Button

    </Button>
  );
}
Seo.propTypes = {

};

export default Seo;
