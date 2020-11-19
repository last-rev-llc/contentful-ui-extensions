import React, { useContext } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { DropdownList, DropdownListItem, Heading, Spinner } from '@contentful/forma-36-react-components';

import { SDKContext } from '../../context';
import { useAsync } from '../../utils/hooks';

import { ModalStyle, TemplateCard } from './styles';
import { getGlobalTemplates } from './utils';

function ModalTemplateSelector() {
  const sdk = useContext(SDKContext);

  const { error, response = [], loading } = useAsync(() => getGlobalTemplates(sdk));

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

  const templates = response || [];
  const handleItemSelect = (item) => () => sdk.close({});

  console.log(templates);
  return (
    <ModalStyle>
      <Heading>Insert existing entry</Heading>
      <div>
        {templates.map(({ name, refs = [] }) => {
          return (
            <TemplateCard
              key={name}
              contentType="template"
              title={name}
              status="published"
              description={`${refs.length} content entries`}
              dropdownListElements={
                <>
                  <DropdownList>
                    <DropdownListItem isTitle>Actions</DropdownListItem>
                    <DropdownListItem>Remove</DropdownListItem>
                  </DropdownList>
                </>
              }
            />
          );
        })}
      </div>
    </ModalStyle>
  );
}

ModalTemplateSelector.propTypes = {};

ModalTemplateSelector.defaultProps = {};

export default ModalTemplateSelector;
