import { get, has } from 'lodash';
import { fieldTypes, firstIndex, linkTypes } from '../constants';
import { getArrayType, getId, getLabel, getType, getValue } from './getters';
import { getAsset, getContentType, getEditorInterface, getEntry } from './lookups';

export const createContentSimpleObjects = async (space, entry) => {
  let objects;
  let control;
  if (!entry) return objects;
  const contentType = await getContentType(entry.sys.contentType.sys.id, space);
  const editorInterface = await getEditorInterface(entry.sys.contentType.sys.id, space);
  if (!contentType) return objects;
  const controls = (editorInterface && editorInterface.controls) || [];
  const noValueEntered = {
    nodeType: 'document',
    marks: [],
    content: [
      {
        nodeType: 'paragraph',
        marks: [],
        content: [
          {
            nodeType: 'text',
            marks: [],
            value: '<i>No value entered</i>'
          }
        ]
      }
    ]
  };
  objects = contentType.fields.map((field) => {
    control = field.type === fieldTypes.text && controls.filter((c) => c.fieldId === field.id)[firstIndex];
    return {
      id: field.id,
      contentId: entry.sys.id,
      type: field.type,
      textType: control && control.widgetId,
      value: get(entry, `fields[${field.id}]['en-US']`, noValueEntered),
      arrayType: field.items && field.items.type,
      label: field.name
    };
  });
  return objects;
};

export const createSimpleObject = async (field, control, space, locale) => {
  let asset;
  let entryObject;
  let entryContentType;
  let textType;
  let id = '';

  switch (control.field.type) {
    case fieldTypes.link:
      id = locale ? get(field, `['${locale}'].sys.id`) : get(field, `_fieldLocales['en-US']._value.sys.id`);
      if (!id) break;
      if (control.field.linkType === linkTypes.entry) {
        entryObject = await getEntry(id, space);
        entryContentType = await getContentType(get(entryObject, 'sys.contentType.sys.id'), space);
      } else {
        asset = await getAsset(id, space);
      }
      break;

    case fieldTypes.text:
      textType = control.widgetId;
      break;

    default:
      break;
  }

  let value = '';

  if (field) {
    value = has(field, locale) ? get(field, locale) : field.getValue();
  }

  return {
    id: control.fieldId,
    type: control.field.type,
    textType,
    value,
    arrayType: get(field, 'items.type'),
    label: control.field.name,
    linkType: control.field.linkType,
    asset,
    entry: entryObject,
    entryContentType
  };
};

export const createSimpleObjects = async (space, controls, fields, locale) => {
  return Promise.all(
    controls.map((control) => createSimpleObject(get(fields, control.fieldId), control, space, locale))
  );
};

export const addRemovedOldFields = (fields, snapshots) => {
  snapshots.forEach((shot) => {
    if (fields.every((field) => field.id !== shot.id)) {
      fields.push({
        id: getId(shot),
        type: getType(shot),
        label: getLabel(shot),
        currentValue: false,
        oldValue: getValue(shot),
        arrayType: getArrayType(shot)
      });
    }
  });
  return fields;
};
