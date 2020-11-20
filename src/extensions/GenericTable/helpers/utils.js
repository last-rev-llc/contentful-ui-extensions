import { orderBy, flow, omit } from 'lodash/fp';

export const alphabetical = orderBy([(item) => item.toLowerCase()], ['asc']);
export const alphabeticalKeys = flow(Object.keys, alphabetical);

export const withoutId = omit(['id']);

export function sortedKeys(step) {
  const toReturn = [];

  alphabeticalKeys(step)
    .filter((key) => toReturn.includes(key) === false)
    .map((key) => toReturn.push(key));

  return toReturn;
}
