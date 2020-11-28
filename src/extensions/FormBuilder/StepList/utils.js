import { pickBy, identity } from 'lodash/fp';

export function extractValue(event) {
  return event.currentTarget.value;
}

export function hasValue(value) {
  if (value instanceof Object) {
    // Dealing with an event
    if (value.currentTarget) {
      return hasValue(extractValue(value));
    }

    return Object.keys(value).length > 0;
  }

  return Boolean(value);
}

export function safeParse(maybeJson) {
  let parsed;
  try {
    parsed = JSON.parse(maybeJson);

    // We don't need to save empty dependsOn
    if (Object.keys(parsed).length < 1) {
      return undefined;
    }

    return parsed;
  } catch (error) {
    // pass

    return undefined;
  }
}

const cleanup = pickBy(identity);

export function denormalizeValues({ dependsOn, dependsOnTest, ...field }) {
  return cleanup({
    ...field,
    dependsOn: safeParse(dependsOn),
    dependsOnTest: safeParse(dependsOnTest)
  });
}

export function normalizeValues({ dependsOnTest = {}, dependsOn = {}, ...field }) {
  return cleanup({
    ...field,
    dependsOn: JSON.stringify(dependsOn, null, 4),
    dependsOnTest: JSON.stringify(dependsOnTest, null, 4)
  });
}
