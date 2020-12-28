import styled from 'styled-components';
import { ValidationMessage } from '@contentful/forma-36-react-components';

export const ModalStyle = styled.div`
  > h1 {
    padding: 24px;

    border-bottom: 1px solid lightgrey;
  }

  position: relative;
  padding-bottom: 80px;
  footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 12px;
    background: white;
    border-top: 1px solid lightgrey;
  }
`;

export const WarningStyle = styled(ValidationMessage)`
  svg {
    fill: #ff8c00;
  }

  p {
    color: #ff8c00;
  }
`;

export const ErrorStyle = styled(ValidationMessage)``;

export default { ModalStyle };
