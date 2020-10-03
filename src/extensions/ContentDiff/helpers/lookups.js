let entryLookup = {};
let assetLookup = {};
let snapshotsLookup = {};
let controlsLookup = {};
let contentTypeLookup = {};

const addProperty = (json, name, value) => {
  return !json[name]
    ? {
        ...json,
        [name]: value,
      }
    : json;
};

const getLookupItem = async (lookupItem, getItem) => {
  let item = lookupItem;
  if (!item) {
    item = await getItem();
  }
  return item;
};

export const getContentType = async (id, space) => {
  const contentType = await getLookupItem(contentTypeLookup[id], () => space.getContentType(id));
  contentTypeLookup = addProperty(contentTypeLookup, id, contentType);
  return contentType;
};

export const getEntry = async (id, space) => {
  const entry = await getLookupItem(entryLookup[id], () => space.getEntry(id));
  entryLookup = addProperty(entryLookup, id, entry);
  return entry;
};

export const addEntry = (id, entry) => {
  addProperty(entryLookup, id, entry);
};

export const getAsset = async (id, space) => {
  const asset = await getLookupItem(assetLookup[id], () => space.getAsset(id));
  assetLookup = addProperty(assetLookup, id, asset);
  return asset;
};

export const getEntrySnapshots = async (id, space) => {
  const snapshots = await getLookupItem(snapshotsLookup[id], () => space.getEntrySnapshots(id));
  snapshotsLookup = addProperty(snapshotsLookup, id, snapshots);
  return snapshots;
};

export const addEntrySnapshots = async (id, snapshots) => {
  addProperty(snapshotsLookup, id, snapshots);
};

export const getEditorInterface = async (id, space) => {
  const editorInterface = await getLookupItem(controlsLookup[id], () => space.getEditorInterface(id));
  controlsLookup = addProperty(controlsLookup, id, editorInterface);
  return editorInterface;
};

export const addEditorInterface = (id, controls) => {
  addProperty(controlsLookup, id, controls);
};

export const resetLookups = () => {
  entryLookup = {};
  assetLookup = {};
  snapshotsLookup = {};
  controlsLookup = {};
  contentTypeLookup = {};
};
