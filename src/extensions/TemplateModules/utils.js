import { set, get } from 'lodash';

// TODO: Make this an instance variable
export const GLOBALSETTINGS_ID = '6AODsEr22eGLqXlvSEyJb3';

export async function getGlobalSettings(sdk) {
  const result = await sdk.space.getEntries({ content_type: 'globalSettings' });

  if (result.items.length < 1) {
    throw new Error('Could not load global settings');
  }

  return result.items[0];
}

export async function getGlobalTemplates(sdk) {
  const globalSettings = await getGlobalSettings(sdk);
  return get(globalSettings, 'fields.templates.en-US', []);
}

export async function setGlobalTemplates(sdk, templates) {
  const globalSettings = await getGlobalSettings(sdk);
  console.log(templates);
  sdk.space.updateEntry(set(globalSettings, 'fields.templates.en-US', templates));

  return templates;
}
