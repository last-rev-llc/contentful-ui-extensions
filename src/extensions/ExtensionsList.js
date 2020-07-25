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
        <li><Link to="/localization-lookup"
          className="">Localization Lookup</Link></li>
        <li><Link to="/recipe-ingredients"
          className="">Recipe Ingredients</Link></li>
        <li><Link to="/recipe-steps"
          className="">Recipe Steps</Link></li>
        <li><Link to="/content-diff"
          className="">Content Diff</Link></li>
      </ul>
    </div>
  );
}
