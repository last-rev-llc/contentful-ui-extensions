import { pickBy } from 'lodash/fp';

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

const cleanup = pickBy((item) => [null, undefined].includes(item) === false);

export function denormalizeValues(field) {
  return cleanup(field);
}

export function normalizeValues(field) {
  return cleanup(field);
}
