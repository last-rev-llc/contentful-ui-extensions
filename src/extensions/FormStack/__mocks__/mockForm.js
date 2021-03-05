import { random } from 'faker';

export default (formId) => ({
  id: formId || random.number(10000),
  name: random.word(),
  url: `http://www.${random.alphaNumeric(10)}.com`
});
