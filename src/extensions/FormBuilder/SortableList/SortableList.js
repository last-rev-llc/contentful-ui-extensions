import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { curry } from 'lodash/fp';
import { CardDragHandle, List, Card, IconButton, Paragraph } from '@contentful/forma-36-react-components';

import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';

const DragHandle = sortableHandle(() => <CardDragHandle>Reorder card</CardDragHandle>);

const ItemStyle = styled(Card)`
  padding: 0;
  height: 50px;
  display: flex;
  align-items: center;
  user-select: none;

  button {
    margin: 0;
    height: 100%;
    margin-right: 8px;

    &:last-of-type {
      margin-right: none;
    }
  }

  z-index: 100;
  margin-bottom: 4px;
`;

const ChildrenStyle = styled(Card)`
  margin-bottom: 8px;
  display: flex;
  user-select: none;
  flex-direction: column;

  display: ${({ $shown: isShown }) => (isShown ? 'block' : 'none')};
`;

function hasSomeChildren(children) {
  if (children instanceof Array) return children.length > 0;

  return !!children;
}

const SortableItem = sortableElement(({ item, onRemoveItem, onEditItem, children, renderItem, dragging }) => {
  const [childrenShown, setChildrenShown] = useState(true);
  const toggleChildren = () => setChildrenShown((prev) => !prev);

  const withoutPropagation = curry((func, event) => {
    event.stopPropagation();
    func(event);
  });

  return (
    <>
      <ItemStyle onClick={withoutPropagation(onEditItem)}>
        <DragHandle />
        <div className="card-item-content">
          <div className="card-item-title">
            {renderItem && renderItem(item)}
            {!renderItem && <Paragraph element="p">{item.title || item.name || 'No Title'}</Paragraph>}
          </div>
          {hasSomeChildren(children) && (
            <IconButton
              buttonType="primary"
              size="small"
              label="Expand/Collapse children"
              className="card-item-button"
              iconProps={{ icon: 'EmbeddedEntryBlock' }}
              onClick={withoutPropagation(toggleChildren)}>
              Expand/Collapse children
            </IconButton>
          )}
          <IconButton
            buttonType="negative"
            size="small"
            label="Delete item"
            className="card-item-button"
            iconProps={{ icon: 'Delete' }}
            onClick={withoutPropagation(onRemoveItem)}>
            Delete item
          </IconButton>
        </div>
      </ItemStyle>

      <ChildrenStyle $shown={!dragging && childrenShown && hasSomeChildren(children)}>{children}</ChildrenStyle>
    </>
  );
});

const SortableContainer = sortableContainer(({ children }) => (
  //
  <List className="sortable-list">{children}</List>
));

function SortableList({ items, onSortEnd, onRemoveItem, onEditItem, children, renderItem }) {
  const [dragging, setDragging] = useState(false);

  return (
    <div className="sortable-list">
      <SortableContainer
        onSortEnd={(sortingData) => {
          setDragging(false);
          onSortEnd(sortingData);
        }}
        onSortStart={() => setDragging(true)}
        useDragHandle>
        {items.map((item, index) => (
          <SortableItem
            key={`item-${item.id || index}`}
            item={item}
            index={index}
            dragging={dragging}
            renderItem={renderItem}
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
      title: PropTypes.string, // either title or name
      name: PropTypes.string
    })
  ).isRequired,
  onSortEnd: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onEditItem: PropTypes.func.isRequired,
  children: PropTypes.func,
  renderItem: PropTypes.func
};

SortableList.defaultProps = {
  children: null,
  renderItem: null
};

export default SortableList;
