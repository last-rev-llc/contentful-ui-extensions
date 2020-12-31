import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { curry } from 'lodash/fp';
import { CardDragHandle, List, Card, IconButton, Paragraph } from '@contentful/forma-36-react-components';

import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';

const DragHandle = sortableHandle(() => <CardDragHandle>Reorder card</CardDragHandle>);

function addActiveStyle({ $active: active }) {
  if (!active) return '';

  return `
color: white;
background: #0074D9;

p {
  color: white;
}

button:first-of-type svg {
  fill: white;
}
`;
}

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

  ${addActiveStyle}
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

const SortableItem = sortableElement(
  ({ active, autoexpand, item, onRemoveItem, onClickItem, children, renderItem, dragging, readOnly }) => {
    const [childrenShown, setChildrenShown] = useState(autoexpand || false);
    const toggleChildren = () => setChildrenShown((prev) => !prev);

    const withoutPropagation = curry((func, event) => {
      event.stopPropagation();
      if (func instanceof Function) func(event);
    });

    return (
      <>
        <ItemStyle
          $active={active}
          onClick={(event) =>
            hasSomeChildren(children) && readOnly
              ? withoutPropagation(toggleChildren, event)
              : withoutPropagation(onClickItem, event)
          }>
          {!readOnly && <DragHandle />}
          <div className="card-item-content">
            <div className="card-item-title">
              {renderItem && renderItem({ ...item, active })}
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
            {!readOnly && (
              <IconButton
                buttonType="negative"
                size="small"
                label="Delete item"
                className="card-item-button"
                iconProps={{ icon: 'Delete' }}
                onClick={withoutPropagation(onRemoveItem)}>
                Delete item
              </IconButton>
            )}
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

function SortableList({
  activeId,
  autoexpand,
  items,
  onSortEnd,
  onRemoveItem,
  onClickItem,
  children,
  readOnly,
  renderItem
}) {
  const [dragging, setDragging] = useState(false);

  console.log(activeId);

  return (
    <div className="sortable-list">
      <SortableContainer
        onSortEnd={(sortingData) => {
          if (readOnly) return;
          setDragging(false);
          onSortEnd(sortingData);
        }}
        onSortStart={() => !readOnly && setDragging(true)}
        useDragHandle>
        {items.map((item, index) => (
          <SortableItem
            key={`item-${item.id || index}`}
            item={item}
            index={index}
            readOnly={readOnly}
            dragging={dragging}
            autoexpand={autoexpand}
            renderItem={renderItem}
            active={item.id === activeId}
            onClickItem={() => onClickItem(item)}
            onRemoveItem={() => !readOnly && onRemoveItem(item)}>
            {children instanceof Function && children(item)}
          </SortableItem>
        ))}
      </SortableContainer>
    </div>
  );
}

SortableList.propTypes = {
  activeId: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string, // either title or name
      name: PropTypes.string
    })
  ).isRequired,
  onSortEnd: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onClickItem: PropTypes.func.isRequired,
  children: PropTypes.func,
  renderItem: PropTypes.func,

  readOnly: PropTypes.bool,
  autoexpand: PropTypes.bool
};

SortableList.defaultProps = {
  readOnly: false,
  autoexpand: true,
  children: null,
  renderItem: null,
  activeId: undefined
};

export default SortableList;
