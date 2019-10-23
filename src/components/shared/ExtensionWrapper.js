import React from 'react';
import '@contentful/forma-36-react-components/dist/styles.css';

function ExtensionWrapper({ children }) {
  return (
    <div>
      {children}
    </div>
  );
}
// ExtensionWrapper.propTypes = {
//   slug: PropTypes.string,
// };

export default ExtensionWrapper;
