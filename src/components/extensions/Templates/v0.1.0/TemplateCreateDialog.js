import React from 'react';
import PropTypes from 'prop-types';

function TemplateCreateDialog({ entries, api }) {
  return (
    <div className="create-new">
      <h1>Create new template</h1>
      <table>
        <thead>

          <tr>
            <td>ByRef</td>
            <td>New</td>
            <td>Module Name</td>
          </tr>
        </thead>
        <tbody>
          {entries.map(() => (
            <tr>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
              <td>Some Cards</td>
            </tr>
          ),
          )}
        </tbody>
      </table>
    </div>
  );
}

TemplateCreateDialog.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TemplateCreateDialog;
