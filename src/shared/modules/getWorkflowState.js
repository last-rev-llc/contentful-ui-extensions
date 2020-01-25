const isDraft = (entity) => {
  return !entity.sys.publishedVersion;
};

const isChanged = (entity) => {
  return !!entity.sys.publishedVersion &&
    entity.sys.version >= entity.sys.publishedVersion + 2;
};

const isPublished = (entity) => {
  return !!entity.sys.publishedVersion &&
    entity.sys.version === entity.sys.publishedVersion + 1;
};

const isArchived = (entity) => {
  return !!entity.sys.archivedVersion;
};

const getWorkflowState = (entity) => {
  if(isArchived(entity)) return 'archived';
  if(isDraft(entity)) return 'draft';
  if(isChanged(entity)) return 'changed';
  if(isPublished(entity)) return 'published';
  return null;
};

export {
  isDraft,
  isChanged,
  isPublished,
  isArchived,
  getWorkflowState,
};


export default getWorkflowState;


