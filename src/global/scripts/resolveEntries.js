const resolveEntries = async (entries, api) => {
  const ids = entries.map((entry) => entry.sys.id);
  const promises = [];
  ids.map((id) => promises.push(api.space.getEntry(id)));
  return Promise.all(promises);
};

export default resolveEntries;
