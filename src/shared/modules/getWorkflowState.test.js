import _ from 'lodash';
import { isDraft, isChanged, isPublished, isArchived, getWorkflowState } from './getWorkflowState';

describe('getWorkflowState()', () => {
  describe('isDraft()', () => {
    test('publishedVersion does not exist', () => {
      expect(
        isDraft({
          sys: {}
        })
      ).toBeTruthy();
    });
    test('publishedVersion exists', () => {
      expect(
        isDraft({
          sys: {
            publishedVersion: 1
          }
        })
      ).toBeFalsy();
    });
  });

  describe('isChanged()', () => {
    test('publishedVersion exists AND version >= publishedVersion + 2', () => {
      expect(
        isChanged({
          sys: {
            version: 20,
            publishedVersion: 8
          }
        })
      ).toBeTruthy();

      expect(
        isChanged({
          sys: {
            version: 10,
            publishedVersion: 8
          }
        })
      ).toBeTruthy();

      expect(
        isChanged({
          sys: {
            version: 7,
            publishedVersion: 8
          }
        })
      ).toBeFalsy();
    });
  });

  describe('isPublished()', () => {
    test('publishedVersion exists AND version === publishedVersion + 1', () => {
      expect(
        isPublished({
          sys: {
            version: 1,
            publishedVersion: 1
          }
        })
      ).toBeFalsy();

      expect(
        isPublished({
          sys: {
            version: 2,
            publishedVersion: 1
          }
        })
      ).toBeTruthy();

      expect(
        isPublished({
          sys: {
            version: 1,
            publishedVersion: 3
          }
        })
      ).toBeFalsy();
    });
  });

  describe('isArchived()', () => {
    test('archivedVersion exits', () => {
      expect(
        isArchived({
          sys: {
            version: 1,
            publishedVersion: 1
          }
        })
      ).toBeFalsy();

      expect(
        isArchived({
          sys: {
            version: 2,
            publishedVersion: 1,
            archivedVersion: 2
          }
        })
      ).toBeTruthy();
    });
  });

  describe('getWorkflowState()', () => {
    test('archived', () => {
      expect(
        getWorkflowState({
          sys: {
            version: 1,
            publishedVersion: 1
          }
        })
      ).not.toBe('archived');
      expect(
        getWorkflowState({
          sys: {
            archivedVersion: 2
          }
        })
      ).toBe('archived');
    });

    test('draft', () => {
      expect(
        getWorkflowState({
          sys: {
            version: 1,
            publishedVersion: 2
          }
        })
      ).not.toBe('draft');

      expect(
        getWorkflowState({
          sys: {
            version: 1,
            publishedVersion: 3
          }
        })
      ).not.toBe('draft');

      expect(
        getWorkflowState({
          sys: {
            version: 1
          }
        })
      ).toBe('draft');
    });

    test('changed', () => {
      expect(
        getWorkflowState({
          sys: {
            version: 1,
            publishedVersion: 2
          }
        })
      ).not.toBe('changed');

      expect(
        getWorkflowState({
          sys: {
            version: 3,
            publishedVersion: 1
          }
        })
      ).toBe('changed');

      expect(
        getWorkflowState({
          sys: {
            version: 10,
            publishedVersion: 1
          }
        })
      ).toBe('changed');

      expect(
        getWorkflowState({
          sys: {
            version: 1,
            publishedVersion: 1
          }
        })
      ).not.toBe('changed');
    });
    test('published', () => {
      expect(
        getWorkflowState({
          sys: {
            version: 1
          }
        })
      ).not.toBe('published');

      expect(
        getWorkflowState({
          sys: {
            version: 3,
            publishedVersion: 1
          }
        })
      ).not.toBe('published');

      expect(
        getWorkflowState({
          sys: {
            version: 2,
            publishedVersion: 1
          }
        })
      ).toBe('published');
    });
  });
});
