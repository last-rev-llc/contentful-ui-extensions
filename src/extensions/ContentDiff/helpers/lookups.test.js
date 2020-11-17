import { configure } from '@testing-library/react';
import { getEntryByDate, resetLookups } from './lookups';
import sdk, { entryOne, snapshotOne, snapshotTwo } from '../mockSdk';

configure({
  testIdAttribute: 'data-test-id'
});

sdk.space.getEntry = jest.fn(async () => entryOne);
sdk.space.getEntrySnapshots = jest.fn(async () => ({ items: [snapshotOne, snapshotTwo] }));

afterEach(() => {
  jest.clearAllMocks();
  resetLookups();
});

describe('getEntryByDate(space, entryId, snapshotDate)', () => {
  test('returns entry object if a date is not passed in', async () => {
    const withoutDate = await getEntryByDate(sdk.space, entryOne.sys.id);
    expect(sdk.space.getEntry).toHaveBeenCalledTimes(1);
    expect(sdk.space.getEntry).toHaveBeenCalledWith(entryOne.sys.id);
    expect(sdk.space.getEntrySnapshots).not.toHaveBeenCalled();
    expect(JSON.stringify(withoutDate)).toBe(JSON.stringify(entryOne));
  });

  test('returns snapshot object if a date is passed in', async () => {
    const withDate = await getEntryByDate(sdk.space, entryOne.sys.id, new Date(snapshotOne.sys.updatedAt));
    expect(sdk.space.getEntry).not.toHaveBeenCalled();
    expect(sdk.space.getEntrySnapshots).toHaveBeenCalledTimes(1);
    expect(sdk.space.getEntrySnapshots).toHaveBeenCalledWith(entryOne.sys.id);
    expect(JSON.stringify(withDate)).toBe(JSON.stringify(snapshotOne));
  });
});
