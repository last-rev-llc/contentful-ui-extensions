import React from "react";
import { Link } from "react-router-dom";

export default function ExtensionsList() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/address" className="">
            Address
          </Link>
        </li>
        <li>
          <Link to="/bynder" className="">
            Bynder
          </Link>
        </li>
        <li>
          <Link to="/bynder-image" className="">
            Bynder Image
          </Link>
        </li>
        <li>
          <Link to="/color-picker" className="">
            Color
          </Link>
        </li>
        <li>
          <Link to="/content-diff" className="">
            Content Diff
          </Link>
        </li>
        <li>
          <Link to="/coveo-search" className="">
            Coveo Search
          </Link>
        </li>
        <li>
          <Link to="/localization-lookup" className="">
            Localization Lookup
          </Link>
        </li>
        <li>
          <Link to="/locale-zooms" className="">
            Locale Zooms
          </Link>
        </li>
        <li>
          <Link to="/operating-hours" className="">
            Operating Hours
          </Link>
        </li>
        <li>
          <Link to="/person-name" className="">
            Person Name
          </Link>
        </li>
        <li>
          <Link to="/phone-number" className="">
            Phone Number
          </Link>
        </li>
        <li>
          <Link to="/recipe-ingredients" className="">
            Recipe Ingredients
          </Link>
        </li>
        <li>
          <Link to="/recipe-steps" className="">
            Recipe Steps
          </Link>
        </li>
        <li>
          <Link to="/seo" className="">
            Seo
          </Link>
        </li>
        <li>
          <Link to="/formstack" className="">
            FormStack
          </Link>
        </li>
      </ul>
    </div>
  );
}
