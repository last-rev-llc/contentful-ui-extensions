import React from 'react';
// import _ from 'lodash';
import PropTypes from 'prop-types';
import diff from 'node-htmldiff';

const ContentDiff = () => {
  const string1 = "Adam Was Here";
  const string2 = "Adam and Justin were here";
  const diffContent = diff(string1, string2);

  return (
    <>
      <table>
        <tr><td>{string1}</td>
          <td><div dangerouslySetInnerHTML={{__html: diffContent}} /></td>
          <td>{string2}</td></tr>
      </table>
    </>
  );

};

ContentDiff.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired
    }),
  }).isRequired
};

export default ContentDiff;