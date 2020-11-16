import { curry } from "lodash";
import { branch as recomposeBranch, renderComponent } from "recompose";

const branch = curry((testFunction, ComponentIfTrue, ComponentIfFalse) =>
  recomposeBranch(
    // Will be called with component props
    testFunction,
    // Will render only if test function returns true
    renderComponent(ComponentIfTrue)

    // Will render only if test function returns false
  )(ComponentIfFalse)
);

export default branch;
