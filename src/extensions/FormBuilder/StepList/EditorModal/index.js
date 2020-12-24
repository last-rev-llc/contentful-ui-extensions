import React, { useState } from 'react';
import styled from 'styled-components';
import { curry, omit } from 'lodash/fp';
import { Heading, Button, FieldGroup, FormLabel, TextInput } from '@contentful/forma-36-react-components';

import { useSDK } from '../../../../context';

import { ModalStyle } from '../styles';

const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

function EditorModal() {
  const sdk = useSDK();
  const { steps } = sdk.parameters.invocation;
  console.log(sdk.parameters.invocation);

  return (
    <ModalStyle>
      <Heading>Edit Form</Heading>
      <Row>
        <Col>{steps.map((step) => step.id)}</Col>
        <Col></Col>
      </Row>
    </ModalStyle>
  );
}

export default EditorModal;
