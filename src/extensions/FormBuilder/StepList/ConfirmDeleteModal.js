import React from 'react';
import styled from 'styled-components';
import { Heading, Button, FormLabel } from '@contentful/forma-36-react-components';

import { useSDK } from '../../../context';

import { ModalStyle } from './styles';

const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
`;

const Tag = styled(FormLabel)`
  color: #080808;
  min-width: 80px;
  background-color: whitesmoke;

  padding: 8px;
  margin-right: 8px;

  display: flex;
  text-align: right;
  align-items: center;
  justify-content: flex-end;
`;

function ConfirmModal() {
  const sdk = useSDK();
  const { type = 'field' } = sdk.parameters.invocation;

  const data = sdk.parameters.invocation[type];

  const handleCancel = () => sdk.close({ confirmation: null });
  const handleSubmit = () => sdk.close({ confirmation: true });

  return (
    <ModalStyle>
      <Heading>Confirm delete {type}</Heading>
      {data && (
        <Col>
          <Row>
            <Tag>Id: </Tag>
            <FormLabel htmlFor="delete-id">{data.id}</FormLabel>
          </Row>
          <Row>
            <Tag>Label: </Tag>
            <FormLabel htmlFor="delete-title">{data.title || data.label || data.name}</FormLabel>
          </Row>
        </Col>
      )}
      <footer>
        <div className="confirm-delete-dialog-actions">
          <Button type="submit" buttonType="negative" size="small" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="small" type="submit" className="confirm-delete-dialog-button" onClick={handleSubmit}>
            Confirm
          </Button>
        </div>
      </footer>
    </ModalStyle>
  );
}

export default ConfirmModal;
