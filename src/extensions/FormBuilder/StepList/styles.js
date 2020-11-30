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

export default { ModalStyle };
