import styled from 'styled-components';

export const Row = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;

  > * {
    margin-right: 4px;
  }

  label {
    margin-bottom: 0;
  }
`;

export default { Row };
