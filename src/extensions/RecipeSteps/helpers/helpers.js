import { orderBy, flow } from 'lodash/fp';

export const alphabetical = orderBy([(item) => item.toLowerCase()], ['asc']);
export const alphabeticalKeys = flow(Object.keys, alphabetical);

export function sortedKeys(step) {
  const toReturn = ['step', 'title'];

  alphabeticalKeys(step)
    .filter((key) => toReturn.includes(key) === false)
    .map((key) => toReturn.push(key));

  return toReturn;
}
