import { curry } from 'lodash';
import { branch as recomposeBranch, renderComponent } from 'recompose';

function noop() {
  return null;
}

const renderIf = curry((testFunction, ComponentIfTrue) =>
  recomposeBranch(
    // Will be called with component props
    testFunction,
    // Will render only if test function returns true
    renderComponent(ComponentIfTrue)

    // Will render only if test function returns false
  )(noop)
);

export default renderIf;
