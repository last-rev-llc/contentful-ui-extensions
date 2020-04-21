import React from 'react';
import {Link} from 'react-router-dom';

export default function ExtensionsList() {
  return (
    <div>
      <ul>
        <li><Link to="/color-picker"
          className="">Color</Link></li>
        <li><Link to="/seo"
          className="">Seo</Link></li>
        <li><Link to="/ui-extensions"
          className="">UI Extensions</Link></li>
      </ul>
    </div>
  );
}
