/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

import { darken } from 'polished';
import { Button as ContentfulButton, EntryCard as ContentfulCard } from '@contentful/forma-36-react-components';

export const ModalStyle = styled.div`
  min-height: 400px;
  min-width: 300px;

  transition: all 0.2s ease;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  // Error text
  > p {
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

  > button {
    margin: 20px;
  }
`;

export const TemplateCard = styled(ContentfulCard)`
  margin-top: 20px;
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

export const cardHeight = '100px';
export const colors = { default: '#2d64b3', hover: darken(0.2, '#2d64b3') };

export const AddContentStyle = styled.div`
  margin-top: 20px;
  border: 1px dashed rgb(211, 220, 224);

  display: flex;
  align-items: center;
  justify-content: center;

  min-height: ${cardHeight};
`;

export const ContentButton = styled.span`
  margin-right: 20px;
  color: ${colors.default};
  font-weight: bold;

  &:hover {
    color: ${colors.hover};
  }

  // icon button
  svg {
    fill: ${colors.default};
    margin-right: 4px;

    &:hover {
      fill: ${colors.hover} !important; // override the default contentful color
    }
  }

  cursor: pointer;
  user-select: none;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CardStyle = styled(ContentfulCard)`
  margin-top: 20px;
  transition: all 0.2s ease;

  &:hover {
    border: 1px solid lightblue;
  }

  width: 100%;
`;
