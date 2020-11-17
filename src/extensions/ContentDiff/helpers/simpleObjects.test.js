import { omit } from 'lodash';
import sdk, {
  arraySimpleObject,
  assetFieldOne,
  contentTypeSymbolFieldOne,
  contentTypeSymbolFieldTwo,
  entryOne
} from '../mockSdk';
import { getValue } from './getters';
import { resetLookups } from './lookups';
import { addRemovedOldFields, createContentSimpleObjects, createSimpleObjects } from './simpleObjects';
import {
  arraySnapshotObject,
  assetLinkSimpleObject,
  assetLinkSnapshotObject,
  richTextSimpleObject,
  richTextSnapshotObject,
  symbolSimpleObject,
  symbolSnapshotObject,
  testContentType,
  testControls,
  testEditorInterface,
  testEntry,
  testSnapshot,
  testSnapshotControls,
  textMultiLineSimpleObject,
  textMultiLineSnapshotObject
} from './testHelpers';

arraySimpleObject.getValue = jest.fn(() => arraySimpleObject.value);
sdk.space.getContentType = jest.fn(async () => testContentType);
sdk.space.getEditorInterface = jest.fn(async () => testEditorInterface);
sdk.space.getAsset = jest.fn(async () => assetFieldOne);

afterEach(() => {
  jest.clearAllMocks();
  resetLookups();
});

describe('helpers/simpleObjects.js', () => {
  describe('createSimpleObjects(space, controls, entry, locale)', () => {
    describe('returns array of objects in this structure { id, type, value, arrayType, label, linkType, asset }', () => {
      test('without a locale passed in', async () => {
        const testRichText = omit(richTextSimpleObject, [getValue]);
        const testSymbol = omit(symbolSimpleObject, [getValue]);
        const testArray = omit(arraySimpleObject, [getValue, 'items']);
        const testLink = omit(assetLinkSimpleObject, [getValue, '_fieldLocales']);
        const testText = omit(textMultiLineSimpleObject, [getValue]);
        const testEntrySimpleObjects = [testRichText, testSymbol, testArray, testLink, testText];

        const testObjects = await createSimpleObjects(sdk.space, testControls, testEntry);
        expect(sdk.space.getAsset).toHaveBeenCalledTimes(1);
        expect(sdk.space.getAsset).toHaveBeenCalledWith(assetLinkSimpleObject._fieldLocales['en-US']._value.sys.id);
        expect(JSON.stringify(testObjects)).toBe(JSON.stringify(testEntrySimpleObjects));
      });

      test('with a locale passed in', async () => {
        const testRichText = omit(richTextSnapshotObject, ['en-US']);
        const testSymbol = omit(symbolSnapshotObject, ['en-US']);
        const testArray = omit(arraySnapshotObject, ['en-US', 'items']);
        const testLink = omit(assetLinkSnapshotObject, ['en-US']);
        const testText = omit(textMultiLineSnapshotObject, ['en-US']);
        const testEntrySimpleObjects = [testRichText, testSymbol, testArray, testLink, testText];

        const testObjects = await createSimpleObjects(sdk.space, testSnapshotControls, testSnapshot, 'en-US');
        expect(sdk.space.getAsset).toHaveBeenCalledTimes(1);
        expect(sdk.space.getAsset).toHaveBeenCalledWith(assetLinkSnapshotObject['en-US'].sys.id);
        expect(JSON.stringify(testObjects)).toBe(JSON.stringify(testEntrySimpleObjects));
      });
    });
  });

  describe('addRemovedOldFields(fields, snapshots)', () => {
    test('adds old fields that have been removed', () => {
      const fields = addRemovedOldFields([richTextSimpleObject], [symbolSimpleObject]);
      expect(fields[1]).toBeTruthy();
      expect(fields[1].id).toBe(symbolSimpleObject.id);
      expect(fields[1].type).toBe(symbolSimpleObject.type);
      expect(fields[1].label).toBe(symbolSimpleObject.label);
      expect(fields[1].content).toBeFalsy();
      expect(fields[1].currentValue).toBeFalsy();
      expect(fields[1].oldValue).toBeTruthy();
      expect(fields[1].arrayType).toBeFalsy();
    });
  });

  describe('createContentSimpleObjects(space, entry)', () => {
    test('returns array of objects with content info', async () => {
      const returnedObjects = [
        {
          id: contentTypeSymbolFieldOne.id,
          contentId: entryOne.sys.id,
          type: contentTypeSymbolFieldOne.type,
          textType: false,
          value: contentTypeSymbolFieldOne['en-US'],
          arrayType: contentTypeSymbolFieldOne.items && contentTypeSymbolFieldOne.items.type,
          label: contentTypeSymbolFieldOne.name
        },
        {
          id: contentTypeSymbolFieldTwo.id,
          contentId: entryOne.sys.id,
          type: contentTypeSymbolFieldTwo.type,
          textType: false,
          value: contentTypeSymbolFieldTwo['en-US'],
          arrayType: contentTypeSymbolFieldTwo.items && contentTypeSymbolFieldTwo.items.type,
          label: contentTypeSymbolFieldTwo.name
        }
      ];
      const contentObjects = await createContentSimpleObjects(sdk.space, entryOne);
      expect(sdk.space.getEditorInterface).toHaveBeenCalledTimes(1);
      expect(sdk.space.getEditorInterface).toHaveBeenCalledWith(entryOne.sys.contentType.sys.id);
      expect(sdk.space.getContentType).toHaveBeenCalledTimes(1);
      expect(sdk.space.getContentType).toHaveBeenCalledWith(entryOne.sys.contentType.sys.id);
      expect(JSON.stringify(contentObjects)).toBe(JSON.stringify(returnedObjects));
    });
  });
});
