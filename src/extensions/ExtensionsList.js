import React from 'react';
import {Link} from 'react-router-dom';

export default function ExtensionsList() {
  return (
    <div>
      <Link to="/color-picker"
        className="">Color</Link>
      <Link to="/seo"
        className="">Seo</Link>
    </div>
  );
}
