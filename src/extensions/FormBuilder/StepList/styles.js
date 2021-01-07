import styled from 'styled-components';
import { ValidationMessage } from '@contentful/forma-36-react-components';

export const WarningStyle = styled(ValidationMessage)`
  svg {
    fill: #ff8c00;
  }

  p {
    color: #ff8c00;
  }
`;

export const ErrorStyle = styled(ValidationMessage)``;
