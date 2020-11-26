import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { CardDragHandle, Heading, List, Card, Button, Paragraph } from '@contentful/forma-36-react-components';

import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';

const DragHandle = sortableHandle(() => <CardDragHandle>Reorder card</CardDragHandle>);

const ItemStyle = styled(Card)`
  padding: 0;
  height: 50px;
  display: flex;
  align-items: center;

  button {
    margin: 0;
    height: 100%;
    margin-right: 8px;

    &:last-of-type {
      margin-right: none;
    }
  }

  z-index: 100;
`;

const ChildrenStyle = styled(Card)`
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;

  display: ${({ shown }) => (shown ? 'block' : 'none')};
`;

function hasSomeChildren(children) {
  if (children instanceof Array) return children.length > 0;

  return !!children;
}

const SortableItem = sortableElement(({ title, onRemoveItem, onEditItem, children }) => {
  const [childrenShown, setChildrenShown] = useState(false);

  const toggleChildren = () => setChildrenShown((prev) => !prev);

  return (
    <>
      <ItemStyle onClick={toggleChildren}>
        <DragHandle />
        <div className="card-item-content">
          <div className="card-item-title">
            <Paragraph element="p">{title}</Paragraph>
          </div>
          <Button size="small" className="card-item-button" onClick={onEditItem}>
            Edit
          </Button>
          <Button buttonType="negative" size="small" className="card-item-button" onClick={onRemoveItem}>
            Delete
          </Button>
        </div>
      </ItemStyle>

      <ChildrenStyle shown={childrenShown && hasSomeChildren(children)}>{children}</ChildrenStyle>
    </>
  );
});

const SortableContainer = sortableContainer(({ children }) => (
  //
  <List className="sortable-list">{children}</List>
));

function SortableList({ items, onSortEnd, onRemoveItem, onEditItem, children }) {
  return (
    <div className="sortable-list">
      <SortableContainer onSortEnd={onSortEnd} useDragHandle>
        {items.map((item, index) => (
          <SortableItem
            key={`item-${item.id}`}
            index={index}
            title={item.title}
            onEditItem={() => onEditItem(item)}
            onRemoveItem={() => onRemoveItem(item)}>
            {children instanceof Function && children(item)}
          </SortableItem>
        ))}
      </SortableContainer>
    </div>
  );
}

SortableList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ).isRequired,
  onSortEnd: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onEditItem: PropTypes.func.isRequired,
  children: PropTypes.func
};

SortableList.defaultProps = {
  children: null
};

export default SortableList;
