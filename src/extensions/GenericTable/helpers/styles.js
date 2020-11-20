import styled from 'styled-components';
import { TableCell, TableRow } from '@contentful/forma-36-react-components';

function addHoverEditEffect({ $canEdit: canEdit }) {
  if (!canEdit) return '';

  return `
  &:hover {
    svg {
      opacity: 1;
    }
  }
`;
}

export const HeaderRowStyle = styled(TableRow)`
  background-color: #f7f9fa;
  border-bottom: 1px solid #e5ebed;

  input {
    max-height: 21px;
    min-width: 100px;
    max-width: 100px;
  }
`;

export const HeaderCellStyle = styled(TableCell)`
  text-transform: capitalize;

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  svg {
    width: 20px;
    height: 20px;
    opacity: 0;
  }

  ${addHoverEditEffect}
`;

export const HeaderActionsStyle = styled(TableCell)`
  display: flex;
  flex-direction: row;
  border-bottom: none;
`;
