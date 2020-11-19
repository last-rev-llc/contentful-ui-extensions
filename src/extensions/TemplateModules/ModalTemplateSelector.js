import React, { useContext } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { DropdownList, DropdownListItem, Heading } from '@contentful/forma-36-react-components';

import { SDKContext } from '../../context';
import { useAsync } from '../../utils/hooks';

import ModalError from './ModalError';
import ModalLoading from './ModalLoading';
import CardNothing from './CardNothing';
import { ModalStyle, TemplateCard } from './styles';
import { getGlobalTemplates, setGlobalTemplates } from './utils';

function ModalTemplateSelector() {
  const sdk = useContext(SDKContext);

  const { error, response: templates = [], loading, set } = useAsync(() => getGlobalTemplates(sdk));

  if (error) return <ModalError />;
  if (loading) return <ModalLoading />;

  const handleItemSelect = (item) => () => sdk.close({});
  const handleItemRemove = (indexToRemove) => {
    const filteredTemplates = templates.filter((_, index) => index !== indexToRemove);

    setGlobalTemplates(sdk, filteredTemplates).then(() =>
      // Update our local state to match the remote state
      set({
        response: filteredTemplates,
        loading: false
      })
    );
  };

  return (
    <ModalStyle>
      <Heading>Load entries from template</Heading>
      <div>
        {isEmpty(templates) && <CardNothing type="template" />}
        {templates.map(({ name, refs = [] }, index) => {
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
                    <DropdownListItem onClick={() => handleItemRemove(index)}>Remove</DropdownListItem>
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
