import { pickBy, identity } from 'lodash/fp';
import { safeParse } from '../utils';

export function extractValue(maybeEvent) {
  // Dealing with event
  if (maybeEvent instanceof Object && maybeEvent.currentTarget) {
    return maybeEvent.currentTarget.value;
  }

  return maybeEvent;
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

const cleanup = pickBy(identity);

export function denormalizeValues({ dependsOn, dependsOnTests, ...field }) {
  return cleanup({
    ...field,
    dependsOn: safeParse(dependsOn),
    dependsOnTests: dependsOnTests.map((test) => safeParse(test))
  });
}

export function normalizeValues({ dependsOnTests = [], dependsOn = {}, ...field }) {
  return cleanup({
    ...field,
    dependsOn: JSON.stringify(dependsOn, null, 4),
    dependsOnTests: dependsOnTests.map((test) => JSON.stringify(test, null, 4))
  });
}
