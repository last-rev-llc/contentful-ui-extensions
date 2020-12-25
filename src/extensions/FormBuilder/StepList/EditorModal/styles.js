import { Card } from '@contentful/forma-36-react-components';
import styled from 'styled-components';
import { ModalStyle } from '../styles';

export const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

export const ActionSection = styled(Row)`
  padding: 0.5rem;
  justify-content: flex-end;
  border-top: 5px solid whitesmoke;
  position: relative;
  z-index: 100;

  button {
    margin-left: 1rem;
  }
`;

export const EditorStyle = styled(ModalStyle)`
  padding-bottom: 0;
  overflow: hidden;

  h1 {
    margin-bottom: 1rem;
  }
`;

export const SectionWrapper = styled(Row)`
  padding: 0;
`;

export const NothingHere = styled(Card)`
  margin-top: 3rem;
  min-height: 8rem;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const maxModalHeight = '75vh';

export const LeftSection = styled(Col)`
  overflow-y: scroll;
  width: 50%;
  max-height: ${maxModalHeight};
  overflow-y: scroll;

  padding-left: 1rem;
  padding-right: 0.5rem;
`;

export const RightSection = styled(Col)`
  width: 50%;
  bottom: 0;

  max-height: ${maxModalHeight};
  overflow-y: scroll;
  align-items: center;

  padding-left: 0.5rem;
  padding-right: 1rem;

  > div {
    width: 100%;
  }
`;
