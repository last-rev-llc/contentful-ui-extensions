/* eslint-disable react/no-danger */
import React from 'react';
import { render, cleanup, configure } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import diff from 'node-htmldiff';
import {
  getTextDiff,
  getFields,
  getFieldInfo,
  getFieldTables,
  getEmbeddedEntryValue,
  createHtmlForEmbeddedEntryLines,
  createRichTextLines,
  getContent,
  createDiffFields,
} from './ContentDiffDialog';
import {
  arrayLabelTestId,
  arrayListItemTestId,
  arrayListTestId,
  arrayWrapTestId,
  entryLabelTestId,
  entryValueTestId,
  entryWrapTestId,
} from './constants';

import {
  embeddedAssetLine,
  embeddedEntryInline,
  embeddedEntryLine,
  assetLinkSimpleObject,
  paragraphEmbeddedEntryInline,
  paragraphLine,
  richTextEntryField,
  richTextSimpleObject,
  symbolSimpleObject,
  testSimpleObjects,
  testContentType,
  testEditorInterface,
} from './helpers/testHelpers';

import sdk, { arraySimpleObject, assetFieldOne, entryOne, snapshotOne, snapshotTwo } from './mockSdk';
import { resetLookups } from './helpers';

configure({
  testIdAttribute: 'data-test-id',
});

arraySimpleObject.getValue = jest.fn(() => arraySimpleObject.value);
sdk.space.getEntry = jest.fn(async () => entryOne);
sdk.space.getEntrySnapshots = jest.fn(async () => ({ items: [snapshotOne, snapshotTwo] }));
sdk.space.getContentType = jest.fn(async () => testContentType);
sdk.space.getEditorInterface = jest.fn(async () => testEditorInterface);
sdk.space.getAsset = jest.fn(async () => assetFieldOne);

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
  resetLookups();
});

const diffFieldsTestId = 'cdd-diff-fields';
const oldTextTestId = 'cdd-old-text';
const newTextTestId = 'cdd-new-text';
const diffTextTestId = 'cdd-diff-text';
const fieldLabelTestId = 'cdd-field-label';

const richTextFieldInfo = {
  id: 'richTextFieldInfo',
  type: 'RichText',
  label: 'Rich Text Field',
  content: {
    currentValue: 'currentValue',
    oldValue: 'oldValue',
  },
  currentValue: null,
  oldValue: null,
  arrayType: null,
};

const linkFieldInfo = {
  id: 'linkFieldInfo',
  type: 'Link',
  label: 'Link Field',
  content: null,
  currentValue: 'current symbol value',
  oldValue: 'old symbol value',
  arrayType: null,
};

const symbolFieldInfo = {
  id: 'symbolFieldInfo',
  type: 'Symbol',
  label: 'Symbol Field',
  content: null,
  currentValue: 'current symbol value',
  oldValue: 'old symbol value',
  arrayType: null,
};

const arrayFieldInfo = {
  id: 'arrayFieldInfo',
  type: 'Array',
  label: 'Array Field',
  content: null,
  currentValue: ['current', 'array', 'value'],
  oldValue: ['old', 'array', 'value'],
  arrayType: 'Symbol',
};

const arrayFieldLength =
  arrayFieldInfo.currentValue.length >= arrayFieldInfo.oldValue.length
    ? arrayFieldInfo.currentValue.length
    : arrayFieldInfo.oldValue.length;

const testFields = [richTextFieldInfo, symbolFieldInfo, arrayFieldInfo, linkFieldInfo];

describe('<ContentDiffDialog sdk={sdk}', () => {
  describe('getTextDiff(textInfo = {id, oldText, newText})', () => {
    const textInfo = {
      id: 'textInfo',
      keyId: 0,
      oldText: 'old',
      newText: 'new',
    };
    test('shows a div with the value of oldText', () => {
      const { getByTestId } = render(getTextDiff(textInfo));
      const oldText = getByTestId(oldTextTestId);
      expect(oldText.textContent).toBe(textInfo.oldText);
    });

    test('shows a div with the value of newText', () => {
      const { getByTestId } = render(getTextDiff(textInfo));
      const newText = getByTestId(newTextTestId);
      expect(newText.textContent).toBe(textInfo.newText);
    });

    test('shows a div with the value of diff(oldText, newText)', () => {
      const { getByTestId } = render(getTextDiff(textInfo));
      const diffTextDiv = getByTestId(diffTextTestId);
      const diffSpan = render(
        <span data-test-id="test" dangerouslySetInnerHTML={{ __html: diff(textInfo.oldText, textInfo.newText) }} />
      );
      const diffHtmlText = diffSpan.getByTestId('test').textContent;

      expect(diffTextDiv.textContent).toBe(diffHtmlText);
    });
  });

  describe('getFields(field = { id, type, label, content: { currentValue, oldValue }, currentValue, oldValue, arrayType })', () => {
    test('shows rich text field info', () => {
      const { getByTestId } = render(getFields(richTextFieldInfo));
      expect(getByTestId(diffFieldsTestId).getAttribute('data-field-type')).toBe(richTextFieldInfo.type);
      expect(getByTestId(oldTextTestId).textContent).not.toBeNull();
      expect(getByTestId(diffTextTestId).textContent).not.toBeNull();
      expect(getByTestId(newTextTestId).textContent).not.toBeNull();
    });

    test('shows symbol field info', () => {
      const { getByTestId } = render(getFields(symbolFieldInfo));
      expect(getByTestId(diffFieldsTestId).getAttribute('data-field-type')).toBe(symbolFieldInfo.type);
      expect(getByTestId(oldTextTestId).textContent).not.toBeNull();
      expect(getByTestId(diffTextTestId).textContent).not.toBeNull();
      expect(getByTestId(newTextTestId).textContent).not.toBeNull();
    });

    test('shows array field info', () => {
      const { getByTestId, getAllByTestId } = render(getFields(arrayFieldInfo));
      expect(getByTestId(diffFieldsTestId).getAttribute('data-field-type')).toBe(arrayFieldInfo.type);
      expect(getAllByTestId(arrayListTestId).length).toBe(arrayFieldLength);
      expect(getAllByTestId(arrayListItemTestId).length).toBe(arrayFieldLength * 3);
    });

    test('shows link field info', () => {
      const { getByTestId } = render(getFields(linkFieldInfo));
      expect(getByTestId(diffFieldsTestId).getAttribute('data-field-type')).toBe(linkFieldInfo.type);
      expect(getByTestId(oldTextTestId).textContent).not.toBeNull();
      expect(getByTestId(diffTextTestId).textContent).not.toBeNull();
      expect(getByTestId(newTextTestId).textContent).not.toBeNull();
    });
  });

  describe('getFieldInfo(id, field)', () => {
    test('shows rich text fields with label', () => {
      const { getByTestId } = render(getFieldInfo(0, richTextFieldInfo));
      expect(getByTestId(fieldLabelTestId).textContent).toBe(richTextFieldInfo.label);
      expect(getByTestId(diffFieldsTestId).textContent).not.toBeNull();
      expect(getByTestId(oldTextTestId).textContent).not.toBeNull();
      expect(getByTestId(diffTextTestId).textContent).not.toBeNull();
      expect(getByTestId(newTextTestId).textContent).not.toBeNull();
    });

    test('shows symbol fields with label', () => {
      const { getByTestId } = render(getFieldInfo(0, symbolFieldInfo));
      expect(getByTestId(fieldLabelTestId).textContent).toBe(symbolFieldInfo.label);
      expect(getByTestId(diffFieldsTestId).textContent).not.toBeNull();
      expect(getByTestId(oldTextTestId).textContent).not.toBeNull();
      expect(getByTestId(diffTextTestId).textContent).not.toBeNull();
      expect(getByTestId(newTextTestId).textContent).not.toBeNull();
    });

    test('shows array fields with label', () => {
      const { getByTestId, getAllByTestId } = render(getFieldInfo(0, arrayFieldInfo));
      expect(getByTestId(fieldLabelTestId).textContent).toBe(arrayFieldInfo.label);
      expect(getAllByTestId(arrayListTestId).length).toBe(arrayFieldLength);
      expect(getAllByTestId(arrayListItemTestId).length).toBe(arrayFieldLength * 3);
    });

    test('shows link fields with label', () => {
      const { getByTestId } = render(getFieldInfo(0, linkFieldInfo));
      expect(getByTestId(fieldLabelTestId).textContent).toBe(linkFieldInfo.label);
      expect(getByTestId(diffFieldsTestId).textContent).not.toBeNull();
      expect(getByTestId(oldTextTestId).textContent).not.toBeNull();
      expect(getByTestId(diffTextTestId).textContent).not.toBeNull();
      expect(getByTestId(newTextTestId).textContent).not.toBeNull();
    });
  });

  describe('getFieldTables(fields = [{ id, type, label, content: { currentValue, oldValue }, currentValue, oldValue, arrayType }])', () => {
    test('shows all enabled fields and contents', () => {
      const { getAllByTestId } = render(getFieldTables(testFields));
      expect(getAllByTestId(fieldLabelTestId).length).toBe(testFields.length);
      expect(getAllByTestId(arrayListTestId).length).toBe(arrayFieldLength);
      expect(getAllByTestId(arrayListItemTestId).length).toBe(arrayFieldLength * 3);
    });
  });

  describe('getEmbeddedEntryValue(field = { id, type, value, arrayType, label, asset })', () => {
    test("returns html for entry label and values if the field's type is symbol", async () => {
      const { getByTestId } = render(
        <div dangerouslySetInnerHTML={{ __html: await getEmbeddedEntryValue(symbolSimpleObject, sdk.space) }} />
      );
      await waitFor(() => getByTestId(entryWrapTestId));
      await waitFor(() => getByTestId(entryLabelTestId));
      await waitFor(() => getByTestId(entryValueTestId));
      expect(getByTestId(entryWrapTestId).getAttribute('class')).toMatch(new RegExp(symbolSimpleObject.type));
      expect(getByTestId(entryLabelTestId).textContent).toBe(symbolSimpleObject.label);
      expect(getByTestId(entryValueTestId).textContent).toBe(symbolSimpleObject.value);
    });

    test("returns html for array label and all of its values in a list if the field's type is array", async () => {
      const { getByTestId, getAllByTestId, queryByTestId } = render(
        <div dangerouslySetInnerHTML={{ __html: await getEmbeddedEntryValue(arraySimpleObject) }} />
      );
      await waitFor(() => getByTestId(arrayWrapTestId));
      await waitFor(() => getByTestId(arrayLabelTestId));
      await waitFor(() => getByTestId(arrayListTestId));
      await waitFor(() => getAllByTestId(arrayListItemTestId));
      expect(getByTestId(arrayWrapTestId).getAttribute('class')).toMatch(new RegExp(arraySimpleObject.type));
      expect(getByTestId(arrayLabelTestId).textContent).toBe(arraySimpleObject.label);
      expect(queryByTestId(arrayListTestId)).toBeTruthy();
      expect(getAllByTestId(arrayListItemTestId).length).toBe(arraySimpleObject.value.length);
      expect(
        getAllByTestId(arrayListItemTestId).every((item, i) => item.textContent === arraySimpleObject.value[i])
      ).toBeTruthy();
    });
  });

  describe('createHtmlForEmbeddedEntryLines(fields = [{ id, type, value, arrayType, label, asset }])', () => {
    test('returns html for all field labels and values in fields array', async () => {
      const { getByTestId, getAllByTestId, queryByTestId } = render(
        <div
          dangerouslySetInnerHTML={{ __html: await createHtmlForEmbeddedEntryLines(testSimpleObjects, sdk.space) }}
        />
      );
      await waitFor(() => getByTestId(entryWrapTestId));
      await waitFor(() => getByTestId(entryLabelTestId));
      await waitFor(() => getByTestId(entryValueTestId));
      await waitFor(() => getByTestId(arrayWrapTestId));
      await waitFor(() => getByTestId(arrayLabelTestId));
      await waitFor(() => getByTestId(arrayListTestId));
      await waitFor(() => getAllByTestId(arrayListItemTestId));
      expect(getByTestId(entryWrapTestId).getAttribute('class')).toMatch(new RegExp(symbolSimpleObject.type));
      expect(getByTestId(entryLabelTestId).textContent).toBe(symbolSimpleObject.label);
      expect(getByTestId(entryValueTestId).textContent).toBe(symbolSimpleObject.value);
      expect(getByTestId(arrayWrapTestId).getAttribute('class')).toMatch(new RegExp(arraySimpleObject.type));
      expect(getByTestId(arrayLabelTestId).textContent).toBe(arraySimpleObject.label);
      expect(queryByTestId(arrayListTestId)).toBeTruthy();
      expect(getAllByTestId(arrayListItemTestId).length).toBe(arraySimpleObject.value.length);
      expect(
        getAllByTestId(arrayListItemTestId).every((item, i) => item.textContent === arraySimpleObject.value[i])
      ).toBeTruthy();
    });
  });

  describe('createRichTextLines(lines = [{ nodeType, content, data: { target: { sys: { id } } } }], space, environment, snapshotDate)', () => {
    describe('returns html for all rich text field lines of all types', () => {
      const embeddedAssetBlockTestId = 'cdd-embedded-asset-block';
      const embeddedEntryNameTestId = 'cdd-embedded-entry-name';
      const embeddedEntryWrapTestId = 'cdd-embedded-entry-wrap';
      test('if line is of type embedded-asset-block without snapshot date', async () => {
        const lines = await createRichTextLines([embeddedAssetLine], sdk.space);
        expect(sdk.space.getAsset).toHaveBeenCalledTimes(1);
        expect(sdk.space.getAsset).toHaveBeenCalledWith(embeddedAssetLine.data.target.sys.id);
        const { getByTestId } = render(<div dangerouslySetInnerHTML={{ __html: lines[0].formatted }} />);
        await waitFor(() => getByTestId(embeddedAssetBlockTestId));
        expect(JSON.stringify(lines)).toBe(JSON.stringify([embeddedAssetLine]));
        expect(getByTestId(embeddedAssetBlockTestId).getAttribute('class')).toBe(embeddedAssetLine.nodeType);
      });

      test('if line is of type embedded-asset-block with snapshot date', async () => {
        const lines = await createRichTextLines([embeddedAssetLine], sdk.space, new Date());
        expect(sdk.space.getAsset).toHaveBeenCalledTimes(1);
        expect(sdk.space.getAsset).toHaveBeenCalledWith(embeddedAssetLine.data.target.sys.id);
        const { getByTestId } = render(<div dangerouslySetInnerHTML={{ __html: lines[0].formatted }} />);
        await waitFor(() => getByTestId(embeddedAssetBlockTestId));
        expect(JSON.stringify(lines)).toBe(JSON.stringify([embeddedAssetLine]));
        expect(getByTestId(embeddedAssetBlockTestId).getAttribute('class')).toBe(embeddedAssetLine.nodeType);
      });

      test('if line is of type embedded-entry-block without snapshot date', async () => {
        const lines = await createRichTextLines([embeddedEntryLine], sdk.space);
        const { getByTestId } = render(<div dangerouslySetInnerHTML={{ __html: lines[0].formatted }} />);
        await waitFor(() => getByTestId(embeddedEntryWrapTestId));
        await waitFor(() => getByTestId(embeddedEntryNameTestId));

        expect(JSON.stringify(lines)).toBe(JSON.stringify([embeddedEntryLine]));
        expect(sdk.space.getEntry).toHaveBeenCalledTimes(1);
        expect(sdk.space.getEntry).toHaveBeenCalledWith(embeddedEntryLine.data.target.sys.id);
        expect(sdk.space.getContentType).toHaveBeenCalledTimes(1);
        expect(sdk.space.getContentType).toHaveBeenCalledWith(entryOne.sys.contentType.sys.id);
        expect(getByTestId(embeddedEntryWrapTestId).getAttribute('class')).toBe(embeddedEntryLine.nodeType);
        expect(getByTestId(embeddedEntryNameTestId).textContent.trim()).toBe('Entry One');
      });

      test('if line is of type embedded-entry-block with snapshot date', async () => {
        const lines = await createRichTextLines([embeddedEntryLine], sdk.space, new Date(snapshotOne.sys.updatedAt));
        const { getByTestId } = render(<div dangerouslySetInnerHTML={{ __html: lines[0].formatted }} />);
        await waitFor(() => getByTestId(embeddedEntryWrapTestId));
        await waitFor(() => getByTestId(embeddedEntryNameTestId));

        expect(JSON.stringify(lines)).toBe(JSON.stringify([embeddedEntryLine]));
        expect(sdk.space.getEntrySnapshots).toHaveBeenCalledTimes(1);
        expect(sdk.space.getEntrySnapshots).toHaveBeenCalledWith(embeddedEntryLine.data.target.sys.id);
        expect(sdk.space.getContentType).toHaveBeenCalledTimes(1);
        expect(sdk.space.getContentType).toHaveBeenCalledWith(entryOne.sys.contentType.sys.id);
        expect(getByTestId(embeddedEntryWrapTestId).getAttribute('class')).toBe(embeddedEntryLine.nodeType);
        expect(getByTestId(embeddedEntryNameTestId).textContent.trim()).toBe('Entry One');
      });

      describe('if line is of type paragraph', () => {
        test('has no embedded entry inline and no snapshot date', async () => {
          const lines = await createRichTextLines([paragraphLine], sdk.space);

          expect(JSON.stringify(lines)).toBe(JSON.stringify([paragraphLine]));
          expect(sdk.space.getEntry).not.toHaveBeenCalled();
          expect(sdk.space.getContentType).not.toHaveBeenCalled();
        });

        test('has no embedded entry inline but has snapshot date', async () => {
          const lines = await createRichTextLines([paragraphLine], sdk.space, new Date(snapshotOne.sys.updatedAt));

          expect(JSON.stringify(lines)).toBe(JSON.stringify([paragraphLine]));
          expect(sdk.space.getEntry).not.toHaveBeenCalled();
          expect(sdk.space.getContentType).not.toHaveBeenCalled();
        });

        test('has embedded entry inline but no snapshot date', async () => {
          const lines = await createRichTextLines([paragraphEmbeddedEntryInline], sdk.space);
          const { getByTestId } = render(<div dangerouslySetInnerHTML={{ __html: lines[0].content[1].formatted }} />);
          await waitFor(() => getByTestId(embeddedEntryWrapTestId));
          await waitFor(() => getByTestId(embeddedEntryNameTestId));

          expect(JSON.stringify(lines)).toBe(JSON.stringify([paragraphEmbeddedEntryInline]));
          expect(sdk.space.getEntry).toHaveBeenCalledTimes(1);
          expect(sdk.space.getEntry).toHaveBeenCalledWith(embeddedEntryInline.data.target.sys.id);
          expect(sdk.space.getContentType).toHaveBeenCalledTimes(1);
          expect(sdk.space.getContentType).toHaveBeenCalledWith(entryOne.sys.contentType.sys.id);
          expect(getByTestId(embeddedEntryWrapTestId).getAttribute('class')).toBe(embeddedEntryInline.nodeType);
          expect(getByTestId(embeddedEntryNameTestId).textContent.trim()).toBe('Entry One');
        });

        test('has embedded entry inline and has snapshot date', async () => {
          const lines = await createRichTextLines(
            [paragraphEmbeddedEntryInline],
            sdk.space,
            new Date(snapshotOne.sys.updatedAt)
          );
          const { getByTestId } = render(<div dangerouslySetInnerHTML={{ __html: lines[0].content[1].formatted }} />);
          await waitFor(() => getByTestId(embeddedEntryWrapTestId));
          await waitFor(() => getByTestId(embeddedEntryNameTestId));

          expect(JSON.stringify(lines)).toBe(JSON.stringify([paragraphEmbeddedEntryInline]));
          expect(sdk.space.getEntrySnapshots).toHaveBeenCalledTimes(1);
          expect(sdk.space.getEntrySnapshots).toHaveBeenCalledWith(embeddedEntryInline.data.target.sys.id);
          expect(sdk.space.getContentType).toHaveBeenCalledTimes(1);
          expect(sdk.space.getContentType).toHaveBeenCalledWith(entryOne.sys.contentType.sys.id);
          expect(getByTestId(embeddedEntryWrapTestId).getAttribute('class')).toBe(embeddedEntryInline.nodeType);
          expect(getByTestId(embeddedEntryNameTestId).textContent.trim()).toBe('Entry One');
        });
      });
    });
  });

  describe('getContent(field = { id, type, value, arrayType, label }, environment, snapshotDate, snapshot)', () => {
    test('returns an object with current and old html values of rich text field', async () => {
      const content = await getContent(
        richTextEntryField,
        sdk.space,
        new Date(snapshotOne.sys.updatedAt),
        richTextEntryField
      );
      expect(content.currentValue).toBeTruthy();
      expect(content.oldValue).toBeTruthy();
      expect(content.currentValue === content.oldValue).toBeTruthy();
    });
  });

  describe('createDiffFields(fields, snapshots, environment, snapshotDate)', () => {
    describe('creates object with this structure { id, type, label, content: { currentValue, oldValue }, currentValue, oldValue, arrayType }', () => {
      test('when there is a rich text field', async () => {
        const fields = await createDiffFields(
          [richTextSimpleObject],
          [richTextSimpleObject],
          sdk.space,
          new Date(snapshotOne.sys.updatedAt)
        );
        expect(fields[0]).toBeTruthy();
        expect(fields[0].id).toBe(richTextSimpleObject.id);
        expect(fields[0].type).toBe(richTextSimpleObject.type);
        expect(fields[0].label).toBe(richTextSimpleObject.label);
        expect(fields[0].content).toBeTruthy();
        expect(fields[0].content.currentValue).toBeTruthy();
        expect(fields[0].content.oldValue).toBeTruthy();
        expect(fields[0].content.currentValue === fields[0].content.oldValue).toBeTruthy();
        expect(fields[0].currentValue).toBeFalsy();
        expect(fields[0].oldValue).toBeFalsy();
        expect(fields[0].arrayType).toBeFalsy();
      });

      test('when there is a symbol field', async () => {
        const fields = await createDiffFields(
          [symbolSimpleObject],
          [symbolSimpleObject],
          sdk.space,
          new Date(snapshotOne.sys.updatedAt)
        );
        expect(fields[0]).toBeTruthy();
        expect(fields[0].id).toBe(symbolSimpleObject.id);
        expect(fields[0].type).toBe(symbolSimpleObject.type);
        expect(fields[0].label).toBe(symbolSimpleObject.label);
        expect(fields[0].content).toBeFalsy();
        expect(fields[0].currentValue).toBeTruthy();
        expect(fields[0].oldValue).toBeTruthy();
        expect(fields[0].currentValue === fields[0].oldValue).toBeTruthy();
        expect(fields[0].arrayType).toBeFalsy();
      });

      test('when there is an array field', async () => {
        const fields = await createDiffFields(
          [arraySimpleObject],
          [arraySimpleObject],
          sdk.space,
          new Date(snapshotOne.sys.updatedAt)
        );
        expect(fields[0]).toBeTruthy();
        expect(fields[0].id).toBe(arraySimpleObject.id);
        expect(fields[0].type).toBe(arraySimpleObject.type);
        expect(fields[0].label).toBe(arraySimpleObject.label);
        expect(fields[0].content).toBeFalsy();
        expect(fields[0].currentValue).toBeTruthy();
        expect(fields[0].oldValue).toBeTruthy();
        expect(fields[0].currentValue === fields[0].oldValue).toBeTruthy();
        expect(fields[0].arrayType).toBe(arraySimpleObject.arrayType);
      });

      test('when there is a link field', async () => {
        const fields = await createDiffFields(
          [assetLinkSimpleObject],
          [assetLinkSimpleObject],
          sdk.space,
          new Date(snapshotOne.sys.updatedAt)
        );
        expect(fields[0]).toBeTruthy();
        expect(fields[0].id).toBe(assetLinkSimpleObject.id);
        expect(fields[0].type).toBe(assetLinkSimpleObject.type);
        expect(fields[0].label).toBe(assetLinkSimpleObject.label);
        expect(fields[0].content).toBeFalsy();
        expect(fields[0].currentValue).toBeTruthy();
        expect(fields[0].oldValue).toBeTruthy();
        expect(fields[0].currentValue === fields[0].oldValue).toBeTruthy();
        expect(fields[0].arrayType).toBeFalsy();
      });
    });
  });
});
