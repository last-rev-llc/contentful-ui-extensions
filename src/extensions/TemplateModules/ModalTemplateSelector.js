import React, { useContext } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Heading, Spinner } from '@contentful/forma-36-react-components';

import { SDKContext } from '../../context';
import { useAsync } from '../../utils/hooks';
import EntryCard, { getId } from './EntryCard';

import { ModalStyle } from './styles';
import { GLOBALSETTINGS_ID } from './utils';

function ModalTemplateSelector() {
  const sdk = useContext(SDKContext);

  const { error, response, loading } = useAsync(() => sdk.space.getEntry(GLOBALSETTINGS_ID));

  if (loading) {
    return (
      <ModalStyle title="Loading" className="loader">
        <Heading>Loading your templates</Heading>
        <div>
          <Spinner className="" color="default" customSize={42} size="default" testId="cf-ui-spinner" />
        </div>
      </ModalStyle>
    );
  }

  if (error) {
    return (
      <ModalStyle title="Error fetching entries">
        <Heading>Error fetching entries</Heading>
        <div>
          <p>Unfortunately there was an error fetching your space entries. Please try to reload the page</p>
        </div>
      </ModalStyle>
    );
  }

  console.log(response, error);
  const templates = response || [];
  const handleItemSelect = (item) => () => sdk.close({});

  return (
    <ModalStyle>
      <Heading>Insert existing entry</Heading>
      {templates.map((item) => {
        console.log(item);
        return null;
      })}
    </ModalStyle>
  );
}

ModalTemplateSelector.propTypes = {};

ModalTemplateSelector.defaultProps = {};

export default ModalTemplateSelector;
