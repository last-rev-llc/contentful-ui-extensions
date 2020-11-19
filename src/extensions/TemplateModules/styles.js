/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

import { Button as ContentfulButton } from '@contentful/forma-36-react-components';

export const ModalStyle = styled.div`
  min-height: 400px;
  min-width: 300px;

  transition: all 0.2s ease;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  p {
    padding: 20px;
  }

  // contentful Heading
  > h1 {
    width: 100%;
    min-height: 80px;
    border-bottom: 1px solid lightgrey;

    display: flex;
    align-items: center;
    padding-left: 20px;
  }

  > div {
    width: 100%;
    padding: 20px;
    flex-grow: 1;
  }

  &.loader {
    div {
      display: flex;
      align-items: center;
      justify-content: center;

      height: 100%;
    }
  }

  button {
    margin: 20px;
  }
`;

export const Flex = styled.div`
  display: flex;
  width: 100%;
`;

export const Row = styled(Flex)`
  flex-direction: row;
`;

export const RowCenter = styled(Row)`
  align-items: center;
  justify-content: center;
`;

export const Col = styled(Flex)`
  flex-direction: column;
`;

export const ColCenter = styled(Col)`
  align-items: center;
  justify-content: center;
`;

export const Button = styled(ContentfulButton)`
  margin: 20px;
`;
