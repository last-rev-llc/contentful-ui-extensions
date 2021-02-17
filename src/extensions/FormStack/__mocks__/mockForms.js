import mockForm from './mockForm';

export default (numberOfForms = 3) => {
  const forms = [];
  for (let i = 0; i < numberOfForms; i++) {
    forms.push(mockForm(i));
  }
  return forms;
};
