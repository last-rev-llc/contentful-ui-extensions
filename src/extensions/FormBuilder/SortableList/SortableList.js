import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Accordion } from '@contentful/forma-36-react-components/dist/alpha';
import { CardDragHandle, List, Card, Button, Paragraph } from '@contentful/forma-36-react-components';

import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';

const DragHandle = sortableHandle(() => <CardDragHandle>Reorder card</CardDragHandle>);

const SortableItem = sortableElement(({ title, onRemoveItem, onEditItem, children }) => {
  const [isAccordionOpen, setAccordionOpen] = useState(false);

  return (
    <Card
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 0,
        height: 50,
        zIndex: 100
      }}>
      <DragHandle />
      <div className="card-item-content" onClick={() => setAccordionOpen((prev) => !prev)}>
        <div className="card-item-title">
          <Paragraph element="p">{title}</Paragraph>
        </div>
        <Button size="small" className="card-item-button" onClick={onEditItem}>
          Edit
        </Button>
        <Button buttonType="negative" size="small" className="card-item-button" onClick={onRemoveItem}>
          Delete
        </Button>
        {children && <Accordion>{children}</Accordion>}
      </div>
    </Card>
  );
});

const SortableContainer = sortableContainer(({ children }) => (
  //
  <List className="sortable-list">{children}</List>
));

const SortableListPropTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ).isRequired,
  onSortEnd: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onEditItem: PropTypes.func.isRequired
};

function SortableList({ items, onSortEnd, onRemoveItem, onEditItem }) {
  return (
    <div className="sortable-list">
      <SortableContainer onSortEnd={onSortEnd} useDragHandle>
        {items.map((item, index) => (
          <SortableItem
            key={`item-${item.id}`}
            index={index}
            title={item.title}
            onEditItem={() => onEditItem(item)}
            onRemoveItem={() => onRemoveItem(item)}
          />
        ))}
      </SortableContainer>
    </div>
  );
}

SortableList.propTypes = SortableListPropTypes;

SortableList.defaultProps = {};

export default SortableList;
