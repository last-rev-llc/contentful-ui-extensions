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

  display: ${({ $shown: isShown }) => (isShown ? 'block' : 'none')};
`;

function hasSomeChildren(children) {
  if (children instanceof Array) return children.length > 0;

  return !!children;
}

const SortableItem = sortableElement(
  ({ item, onClickEdit, onRemoveItem, onEditItem, children, renderItem, dragging }) => {
    const [childrenShown, setChildrenShown] = useState(true);
    const toggleChildren = () => setChildrenShown((prev) => !prev);

    const withoutPropagation = curry((func, event) => {
      event.stopPropagation();
      func(event);
    });

    const handleClick = (event) => (onClickEdit ? onEditItem(event) : toggleChildren());

    return (
      <>
        <ItemStyle onClick={handleClick}>
          <DragHandle />
          <div className="card-item-content">
            <div className="card-item-title">
              {renderItem && renderItem(item)}
              {!renderItem && <Paragraph element="p">{item.title || item.name}</Paragraph>}
            </div>
            {!onClickEdit && (
              <IconButton
                size="small"
                className="card-item-button"
                iconProps={{ icon: 'Edit' }}
                onClick={withoutPropagation(onEditItem)}
              />
            )}
            <IconButton
              buttonType="negative"
              size="small"
              className="card-item-button"
              iconProps={{ icon: 'Delete' }}
              onClick={withoutPropagation(onRemoveItem)}
            />
          </div>
        </ItemStyle>

        <ChildrenStyle $shown={!dragging && childrenShown && hasSomeChildren(children)}>{children}</ChildrenStyle>
      </>
    );
  }
);

const SortableContainer = sortableContainer(({ children }) => (
  //
  <List className="sortable-list">{children}</List>
));

function SortableList({ items, onSortEnd, onClickEdit, onRemoveItem, onEditItem, children, renderItem }) {
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
            key={`item-${item.id}`}
            item={item}
            index={index}
            dragging={dragging}
            renderItem={renderItem}
            onClickEdit={onClickEdit}
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
  onClickEdit: PropTypes.bool,
  onEditItem: PropTypes.func.isRequired,
  children: PropTypes.func,
  renderItem: PropTypes.func
};

SortableList.defaultProps = {
  children: null,
  renderItem: null,
  onClickEdit: false
};

export default SortableList;
