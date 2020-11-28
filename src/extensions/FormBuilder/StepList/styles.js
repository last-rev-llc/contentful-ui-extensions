import styled from 'styled-components';

export const ModalStyle = styled.div`
  h1 {
    padding: 24px;

    border-bottom: 1px solid lightgrey;
  }

  > div {
    &:first-of-type {
      padding-top: 12px;
    }

    padding-bottom: 12px;
    padding-left: 24px;
    padding-right: 24px;
  }
`;

export default { ModalStyle };
