import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Button } from '@contentful/forma-36-react-components';

import { branch } from '../../../../utils';

import EntryCard from './EntryCard';
import SelectorModal from './Modal';
import ContentSection from '../ContentSection';

function LinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
    </svg>
  );
}

function EntrySelector({ about, name, title, onChange, values }) {
  const [isShown, setShown] = useState(false);

  return (
    <ContentSection title={title} about={about}>
      <Button onClick={() => setShown(true)}>
        <LinkIcon />
        <span> Link existing asset</span>
      </Button>
      <SelectorModal isShown={isShown} setShown={setShown} onChange={onChange} />
    </ContentSection>
  );
}

function EntryItem({ about, name, onChange, values }) {
  const item = values[name];

  return (
    <ContentSection about={about}>
      <EntryCard canRemove item={item} onChange={onChange} />
    </ContentSection>
  );
}

const sharedPropTypes = {
  about: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired
};

const sharedDefaultProps = {
  about: ''
};

EntryItem.propTypes = sharedPropTypes;
EntrySelector.propTypes = sharedPropTypes;

EntryItem.defaultProps = sharedDefaultProps;
EntrySelector.defaultProps = sharedDefaultProps;

export default branch(({ values = {}, name }) => Boolean(values[name]), EntryItem, EntrySelector);
